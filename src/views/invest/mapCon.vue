<template>
  <div class="mapMasterCon">
    <div id="map" v-if="state.showMap" style="margin: 0 auto; width: 100%; height: 100%; background-color: transparent; border: rgba(255, 255, 255, 0)"></div>
    <div class="pop padding" id="infoWindow"></div>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import Loading from '@/components/loading'
export default defineComponent({
  name: 'mapMasterCon',
  components: { Loading },
  props: {
    searchResData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showDataTag: {
      type: String,
      default: '0'
    },
    area: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    town: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      showMap: true,
      townName: '',
      villageName: '',
      areaRange: '',
      showDataTag: '1',
      area_code: 'county',
      acMap: new acol_map(),
      vector_back: null,
      vector_area: null,
      vector_hl: null,
      vector_data: null,
      overLayer: null,
      acolLayer: null,
      acolUtil: new acol_util(),
      acolSearch: new acol_search()
    })
    console.log('props', props)
    const geoJsonData_county = new acol_dea().decodeGeoJson({ data: firstStr })
    const geoJsonData_town = new acol_dea().decodeGeoJson({ data: secondStr })
    const geoJsonData_village = new acol_dea().decodeGeoJson({ data: thirdStr })
    const special = new acol_dea().decodeGeoJson({ data: realData })

    let bridge = special.features.filter((ele) => {
      return ele.properties.小地名
    })
    const globalData = {
      type: 'FeatureCollection',
      features: bridge
    }

    onMounted(() => {
      console.log('monted')
      nextTick(() => {
        init()
      })
    })

    onBeforeUnmount(() => {
      state.showMap = false
      //   var box = document.getElementById('map')
      //   console.log('box', box)
      //   box.remove()
      //   var sec = document.getElementById('infoWindow')
      //   if (sec) {
      //     sec.remove()
      //   }
      //   console.log('sec', sec)
    })
    const init = () => {
      state.acMap.initMap({ id: 'map', center: [121.108325569296, 30.7161906685102], zoom: 6, minZoom: 8, maxZoom: 18, constrainResolution: false })
      state.acolLayer = new acol_layer(state.acMap.map)
      console.log(' 地图')
      addAllLayers()
      changeAreaByCode(state.area_code)
      addPopupByElement(document.getElementById('infoWindow'))
      let mapSelect = new ol.interaction.Select()
      state.acMap.map.addInteraction(mapSelect)
      mapSelect.on('select', function (e) {
        this.getFeatures().clear()
        if (!e.selected.length) return
        // 获取参数
        state.vector_hl.getSource().clear()
        let hlFeature = e.selected[0].clone()
        state.vector_hl.getSource().addFeatures([hlFeature])
        // 获取参数
        let props = e.selected[0].getProperties()
        if (props['type'] && props['type'] == 'town') {
          state.area_code = props['type']
          state.townName = props.name
          changeAreaByCode(props['type'])
        }
        closePopup()
        if (props.OBJECTID) {
          state.townName = props.town
          openPopupByInfo(props)
        }
      })
    }
    const addAllLayers = () => {
      // 初始化图层组
      state.vector_back = state.acolLayer.vectorLayer({
        name: 'background',
        type: 'polygon',
        style: {
          fill: {},
          stroke: { color: 'rgba(0, 255, 255, 0.4)', width: 2 }
        },
        zIndex: 1
      })
      state.vector_area = state.acolLayer.vectorLayer({
        name: 'area',
        type: 'polygon',
        style: {
          fill: { color: 'rgba(0, 255, 255, 0.01)' },
          stroke: { color: 'rgba(135,206,250,0.6)', width: 2 },
          text: {
            field: 'name',
            fill: { color: 'rgba(255,255,255,1)' },
            stroke: {},
            font: '20px Calibri'
          }
        },
        zIndex: 2
      })
      state.vector_hl = state.acolLayer.vectorLayer({
        name: '高亮面图层',
        type: 'polygon',
        style: {
          fill: {},
          stroke: { color: 'rgba(255, 255, 0, 1)', width: 2 }
        },
        zIndex: 4
      })
      state.vector_data = state.acolLayer.vectorLayer({
        name: '地块',
        type: 'polygon',
        style: {
          fill: {
            color: 'rgba(0, 245, 161, 0.4)'
          },
          stroke: { color: 'rgba(0, 245, 161, 1)', width: 2 }
        },
        zIndex: 3
      })
      // 添加图层组
      state.acMap.addLayers([state.vector_back, state.vector_area, state.vector_hl, state.vector_data])
    }

    const getAreaLevelByCode = (areaCode) => {
      return areaCode
    }

    const addPopupByElement = (element) => {
      if (state.acolLayer.getOverlayById('infoWindow')) state.acolLayer.removeOverlayById('infoWindow')
      // 添加overLayer图层
      state.overLayer = state.acolLayer.overLayer({ id: 'infoWindow', element: element, offset: [-30, -100], positioning: 'top-left', autoPan: false })
      state.acMap.map.addOverlay(state.overLayer)
    }
    const closePopup = () => {
      // 弹窗气泡
      if (state.overLayer) state.overLayer.setPosition(undefined)
    }

    const moneyFormat = (value) => {
      if (value || value == 0) {
        if (value === 0) {
          return 0
        } else {
          let fix = (Math.round(+value + 'e' + 7) / Math.pow(10, 7)).toFixed(2)
          return fix
        }
      }
    }

    const tdtMaskByFeature = (maskFeature) => {
      // 移除图层
      state.acMap.removeLayerByName('tdtImg')
      // tdt底图图层加载
      let tdtLayer = state.acolLayer.tdtLayer({ name: 'tdtImg', sourceType: 'XYZ', type: 'img', isLabel: false, zIndex: 0 })
      // 天地图掩膜，掩膜最上层图层即可
      state.acolLayer.tdtLayerMaskByGeoJson({ layer: tdtLayer, data: maskFeature })
      // 添加图层
      state.acMap.addLayer(tdtLayer)
    }

    const clearLayers = ({ vector_back, vector_area, vector_hl }) => {
      // 清空图层
      if (vector_back) state.vector_back.getSource().clear()
      if (vector_area) state.vector_area.getSource().clear()
      if (vector_hl) state.vector_hl.getSource().clear()
    }

    const openPopupByInfo = (info, lonlat) => {
      let pHtml = ''
      if (info && info.mj) {
        info.mj = moneyFormat(info.mj)
      }
      pHtml +=
        '<div class="list">' +
        '<div class="vanHtmltopList">' +
        '<span class="vanHtmllistTitle" >地块名称:</span>' +
        '<span class="vanHtmllistContent">' +
        info.小地名 +
        '</span>' +
        '</div>' +
        '<div>' +
        '<span class="vanHtmllistTitle" >地块面积:</span>' +
        '<span class="vanHtmllistContent">' +
        info.mj +
        '亩</span>' +
        '</div>' +
        '</div>' +
        '<div class="vanHtmllisttriangle"></div>'
      // 偏移
      state.overLayer.setOffset([-90, -200])
      $('#infoWindow').empty()
      $('#infoWindow').append(pHtml)
      // 定位显示
      state.overLayer.setPosition([info.geometry.extent_[0], info.geometry.extent_[1]])
    }

    const rundata = () => {
      state.vector_data.getSource().clear()
      if (props.showDataTag == '1') {
        switch (state.area_code) {
          case 'county':
            let dataFeatures = new ol.format.GeoJSON().readFeatures(globalData, { featureProjection: 'EPSG:4326' })
            if (state.areaRange) {
              if (state.areaRange == '1') {
                dataFeatures = dataFeatures.filter((ele) => {
                  return ele.values_.mj < 100
                })
              }
              if (state.areaRange == '2') {
                dataFeatures = dataFeatures.filter((ele) => {
                  return ele.values_.mj >= 100 && ele.values_.mj <= 200
                })
              }
              if (state.areaRange == '3') {
                dataFeatures = dataFeatures.filter((ele) => {
                  return ele.values_.mj > 200
                })
              }
            }
            state.vector_data.getSource().addFeatures(dataFeatures)
            break
          case 'town':
            let track = globalData.features.filter((ele) => {
              return ele.properties.town == state.townName
            })
            let reMix = {
              type: 'FeatureCollection',
              features: track
            }
            let sec = new ol.format.GeoJSON().readFeatures(reMix, { featureProjection: 'EPSG:4326' })
            if (state.areaRange) {
              if (state.areaRange == '1') {
                sec = sec.filter((ele) => {
                  return ele.values_.mj < 100
                })
              }
              if (state.areaRange == '2') {
                sec = sec.filter((ele) => {
                  return ele.values_.mj >= 100 && ele.values_.mj <= 200
                })
              }
              if (state.areaRange == '3') {
                sec = sec.filter((ele) => {
                  return ele.values_.mj > 200
                })
              }
            }
            state.vector_data.getSource().addFeatures(sec)
            break
          case 'village':
            let track1 = globalData.features.filter((ele) => {
              return ele.properties.xzq.indexOf(state.villageName) > -1
            })
            let reMix1 = {
              type: 'FeatureCollection',
              features: track1
            }
            let third = new ol.format.GeoJSON().readFeatures(reMix1, { featureProjection: 'EPSG:4326' })
            state.vector_data.getSource().addFeatures(third)
            break
        }
      }
    }

    const changeAreaByCode = (code, panTo = true) => {
      // 背景要素、矢量面要素
      let geoJson_back = null,
        geoJson_area = null
      // 根据行政区划等级判断执行逻辑
      switch (getAreaLevelByCode(code)) {
        case 'county':
          geoJson_back = geoJsonData_county
          geoJson_area = geoJsonData_town
          rundata()
          break
        case 'town':
          geoJson_back = geoJsonData_town.features.find((ele) => {
            return ele.properties.name == state.townName
          })
          geoJson_area = state.acolSearch.getGeoJsonFeaturesByKV(geoJsonData_village, 'town', state.townName)
          rundata()
          break

        default:
          console.log('编码有误')
      }
      if (geoJson_back && geoJson_area) {
        // 清空图层
        clearLayers({ vector_back: state.vector_back, vector_area: state.vector_area, vector_hl: state.vector_hl })
        // 天地图掩膜
        tdtMaskByFeature(geoJson_back)
        // 矢量偏移、裁剪
        // let res_data = acolUtil.geoJsonTransformTranslate({ data: geoJson_back, distance: (getAreaLevelByCode(area_code) === 'county') ? 1 : 0.5, direction: 180 });
        let res_data = state.acolUtil.geoJsonTransformTranslate({ data: geoJson_back, distance: 1, direction: 180 })
        let diff_data = state.acolUtil.differenceByTurf(res_data, geoJson_back)
        // 添加geoJson格式数据
        let backFeatures = new ol.format.GeoJSON().readFeatures(diff_data, { featureProjection: 'EPSG:4326' })
        state.vector_back.getSource().addFeatures(backFeatures)
        let areaFeatures = new ol.format.GeoJSON().readFeatures(geoJson_area, { featureProjection: 'EPSG:4326' })
        state.vector_area.getSource().addFeatures(areaFeatures)
        // 根据extent定位
        if (panTo) {
          state.acolLayer.panToByExtent({
            extent: state.vector_area.getSource().getExtent(),
            duration: 1000
          })
        }
      }
    }
    const targetMark = (name) => {
      let track = state.acolSearch.getGeoJsonFeaturesByKV(globalData, '小地名', name.properties.小地名)
      let dataFeatures = new ol.format.GeoJSON().readFeatures(track, { featureProjection: 'EPSG:4326' })
      state.vector_hl.getSource().clear()
      state.vector_hl.getSource().addFeatures(dataFeatures)
      let value = state.vector_hl.getSource().getExtent()
      let offset = 0.01
      state.acolLayer.panToByExtent({
        extent: [value[0] - offset, value[1] - offset, value[2] + offset, value[3] + offset],
        duration: 1000
      })
      openPopupByInfo(dataFeatures[0].values_)
    }
    const returnLastLevel = () => {
      let feature = null
      closePopup()
      switch (getAreaLevelByCode(state.area_code)) {
        case 'county':
          console.log('暂无市级行政区划，县级为最大行政区划')
          return
        case 'town':
          feature = state.acolSearch.getGeoJsonFeaturesByKV(geoJsonData_town, 'town', state.townName)
          break
        case 'village':
          feature = state.acolSearch.getGeoJsonFeaturesByKV(geoJsonData_village, 'village', state.villageName)
          break
        default:
          console.log('编码有误')
      }
      if (feature && feature.features.length) {
        switch (state.area_code) {
          case 'town':
            state.area_code = 'county'
            changeAreaByCode('county')
            break
          case 'village':
            state.area_code = 'town'
            changeAreaByCode('town')
            break
        }
      }
    }
    watch(
      () => props.searchResData,
      (val) => {
        console.log('val', val)
        if (val) {
          if (val.type) {
            targetMark(val)
          }
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.showDataTag,
      (val) => {
        if (state.area_code) {
          setTimeout(() => {
            changeAreaByCode(state.area_code)
          }, 500)
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.area,
      (val) => {
        closePopup()
        if (state.area_code) {
          if (val) {
            setTimeout(() => {
              state.areaRange = val
              changeAreaByCode(state.area_code)
            }, 500)
          } else {
            setTimeout(() => {
              state.areaRange = ''
              changeAreaByCode(state.area_code)
            }, 500)
          }
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.address,
      (val) => {
        if (val) {
          closePopup()
          if (val == '1') {
            state.area_code = 'county'
            state.townName = ''
            setTimeout(() => {
              changeAreaByCode('county')
            }, 500)
          } else if (val == '2') {
            if (props.town) {
              state.townName = props.town
              state.area_code = 'town'
              setTimeout(() => {
                changeAreaByCode('town')
              }, 500)
            }
          }
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => props.town,
      (val) => {
        state.townName = val
      },
      { immediate: true, deep: true }
    )
    return {
      state
    }
  }
})
</script>

<style scoped lang="less">
.mapMasterCon {
  height: calc(100vh - 3rem);
}
.pop {
  background-color: #fff;
  width: 250px;
  padding: 16px;
  height: 100px;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  position: relative;
}
</style>
<style lang="less">
.vanHtmllistContent {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
.vanHtmltopList {
  height: 48px;
}

.vanHtmllistTitle {
  font-size: 16px;
  color: #666;
}
.vanHtmllisttriangle {
  position: absolute;
  width: 0;
  height: 0;
  bottom: -14px;
  left: 110px;
  border-top: 14px solid #fff;
  border-right: 14px solid transparent;
  border-left: 14px solid transparent;
}
</style>
