// 注册监听
if (window.addEventListener) {
  //为window注册message事件并绑定监听函数
  window.addEventListener('message', receiveMsg, false)
} else {
  window.attachEvent('message', receiveMsg)
}

// 监听函数，接收一个参数--Event事件对象
function receiveMsg(e) {
  console.log('message js ', e)
  let obj = e.data
  // gisLayerMessage
  if (obj.type == 'gisLayerMessage') {
    switch (obj.data.key) {
      case 'address':
        if (obj.data.value) {
          closePopup()
          if (obj.data.value.layer == '1') {
            area_code = 'county'
            changeAreaByCode('county')
          }
          if (obj.data.value.layer == '2') {
            townName = obj.data.value.townName
            area_code = 'town'
            changeAreaByCode('town')
          }
          if (obj.data.value.layer == '3') {
            townName = obj.data.value.townName
            villageName = obj.data.value.villageName
            area_code = 'village'
            changeAreaByCode('village')
          }
        }
        break
      case 'area':
        if (obj.data.value) {
          closePopup()
          if (obj.data.value.select == '1') {
            areaRange = '1'
            changeAreaByCode(area_code)
          } else if (obj.data.value.select == '2') {
            areaRange = '2'
            changeAreaByCode(area_code)
          } else if (obj.data.value.select == '3') {
            areaRange = '3'
            changeAreaByCode(area_code)
          } else {
            areaRange = ''
            changeAreaByCode(area_code)
          }
        }
        break

      case 'target':
        if (obj.data.value) {
          closePopup()
          targetMark(JSON.parse(obj.data.value.obj))
        } else {
        }
        break
      case 'goBack':
        if (obj.data.value) {
          returnLastLevel()
        }
        break
      case 'showData':
        if (obj.data.value) {
          if (obj.data.value.obj) {
            showDataTag = obj.data.value.obj
            changeAreaByCode(area_code)
          }
        }
        break
      default:
        return
    }
  }
}

// 发送消息
function sendMessage(type, data) {
  // 向父页面传递消息
  if (window.parent != window) {
    window.parent.postMessage({ type: type, data: data }, '*')
  }
}
