<template>
  <div class="compare">
    <div class="title">项目完成情况对比表</div>
    <div class="input_box">
      <div class="box" v-for="(item, index) in formData" :key="index">
        <div class="content">
          <div class="form_box" v-for="(input, idx) in item.form" :key="idx">
            <div class="name">
              <p>{{ item.name }}</p>
              <p @click="deleteForm(index, idx)">删除</p>
            </div>
            <div class="input_item" v-for="input_item in input">
              <p>{{ input_item.name }}</p>
              <van-field
                :readonly="isYs"
                v-model="input_item.value"
                rows="4"
                autosize
                :type="input_item.type || ''"
                :maxlength="input_item.maxLength"
                :placeholder="input_item.placeholder"
                show-word-limit
              />
            </div>
          </div>
          <div class="sub">
            <div class="name">
              <p>合计</p>
            </div>
            <p>
              投资金额计划数：<span>{{ item.sub1.toFixed(2) }}万元</span>
            </p>
            <p>
              投资金额完成数：<span>{{ item.sub2.toFixed(2) }}万元</span>
            </p>
          </div>
        </div>
        <div class="add" @click="pushForm(index)">
          <van-icon name="add" />
          {{ item.add }}
        </div>
      </div>
      <div class="box">
        <div class="sub content">
          <div class="name">
            <p>总计</p>
          </div>
          <p>
            投资金额计划数：<span>{{ subPlan.toFixed(2) }}万元</span>
          </p>
          <p>
            投资金额完成数：<span>{{ subFinish.toFixed(2) }}万元</span>
          </p>
        </div>
      </div>
    </div>
    <div class="btns fixPaddingBottom">
      <p @click="preview">查看对比表案例</p>
      <p v-if="!isYs" @click="submitForm('save')">保存</p>
      <p v-if="!isYs" @click="submitForm('submit')">完成</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import lodash from 'lodash'
import { Toast, ImagePreview } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'

export default defineComponent({
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const isYs = ref(false)
    const formItem = ref([
      {
        name: '分项名称',
        value: '',
        placeholder: '请输入分项名称',
        key: 'name'
      },
      {
        name: '建设地点',
        value: '',
        placeholder: '请输入建设地点',
        key: 'location'
      },
      {
        name: '建设内容计划数',
        value: '',
        placeholder: '建设内容计划数',
        key: 'plan_scale'
      },
      {
        name: '建设内容完成数',
        value: '',
        placeholder: '建设内容完成数',
        key: 'complete_scale'
      },
      {
        name: '投资金额计划数（万元）',
        value: '',
        type: 'number',
        placeholder: '1-1000数字',
        key: 'plan_invest_money'
      },
      {
        name: '投资金额完成数（万元）',
        value: '',
        type: 'number',
        placeholder: '1-1000数字',
        key: 'complete_invest_money'
      }
    ])
    const formData = ref([
      {
        name: '基础设施建设',
        form: [],
        add: '新增基础设施建设表单',
        sub1: 0,
        sub2: 0
      },
      {
        name: '机械设备',
        form: [],
        add: '新增机械设备表单',
        sub1: 0,
        sub2: 0
      },
      {
        name: '其他',
        form: [],
        add: '新增其他项目表单',
        sub1: 0,
        sub2: 0
      }
    ])
    const subPlan = ref(0)
    const subFinish = ref(0)
    const pushForm = (index) => {
      formData.value[index].form.push(lodash.cloneDeep(formItem.value))
    }
    const deleteForm = (index1, index2) => {
      formData.value[index1].form.splice(index2, 1)
    }
    const submitForm = (type) => {
      let form = {
        save_type: type,
        project_id: +Route.query.projectId,
        part_options: [
          {
            option_name: '基础设施建设',
            option_mark: 'infrastructure_construction',
            list: []
          },
          {
            option_name: '机械设备',
            option_mark: 'mechanical_equipment',
            list: []
          },
          {
            option_name: '其他',
            option_mark: 'other',
            list: []
          }
        ]
      }
      // 虽然代码是我写的 但是我也不知是啥意思
      const arr = { 0: [], 1: [], 2: [] }
      formData.value.map((item, index) => {
        arr[index] = item.form.map((list) => {
          // 三项分别遍历，添加到三个数组里 数组元素为object
          let obj = {}
          list.map((key) => {
            obj[key.key] = key.value
          })
          return obj
        })
      })
      form.part_options[0].list = arr[0]
      form.part_options[1].list = arr[1]
      form.part_options[2].list = arr[2]
      onSubmit(form)
    }
    const onSubmit = async (form) => {
      try {
        const result = await Request.editProjectYsCompare(form)
        if (result.code === 0) {
          Toast('保存成功')
          setTimeout(() => {
            Router.back()
          }, 1500)
        } else {
          Toast(result.msg)
        }
      } catch (err) {
        Toast('服务器错误')
      }
    }
    const getDetail = async (id) => {
      const result = await Request.getProjectYsCompare({ project_id: id })
      if (result.data && result.data.info && result.data.info.part_options) {
        result.data.info.part_options.map((item, index) => {
          item.list.map((list) => {
            let items = lodash.cloneDeep(formItem.value)
            items.map((key) => {
              Object.keys(list).forEach((keys) => {
                if (keys === key.key) key.value = list[keys]
              })
            })
            formData.value[index].form.push(items)
          })
        })
      }
    }
    const preview = () => {
      ImagePreview({
        images: ['https://img.hzanchu.com/acimg/f928a72e8273c66f3fa14b7f55e1e93d.png'],
        closeable: true
      })
    }
    onMounted(() => {
      getDetail(+Route.query.projectId)
      isYs.value = Route.query.isYs === 'true'
    })
    watch(
      () => [formData.value[0].form, formData.value[1].form, formData.value[2].form],
      () => {
        subPlan.value = 0
        subFinish.value = 0
        formData.value.map((item) => {
          item.sub1 = 0
          item.sub2 = 0
          item.form.map((items, index) => {
            item.sub1 = +item.sub1 + +items[4].value
            item.sub2 = +item.sub2 + +items[5].value
          })
          subPlan.value = +subPlan.value + +item.sub1
          subFinish.value = +subFinish.value + +item.sub2
        })
      },
      { deep: true }
    )
    return {
      formData,
      pushForm,
      deleteForm,
      subPlan,
      subFinish,
      submitForm,
      preview,
      isYs
    }
  }
})
</script>

<style scoped lang="less">
.compare {
  height: 100vh;
  font-size: 0.28rem;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 0.3rem;
    padding: 0.3rem;
    font-weight: 600;
  }
  .input_box {
    flex: 1;
    box-sizing: border-box;
    overflow: scroll;
    padding: 0 0.3rem;
    .box {
      .sub {
        padding: 0.1rem 0.2rem 0.2rem;
        background: #fff;
        p {
          line-height: 0.5rem;
          height: 0.5rem;
          span {
            font-weight: 600;
            font-size: 0.3rem;
          }
        }
      }
      .content {
        background: #fff;
        border-radius: 0.16rem;
        overflow: scroll;
        padding: 0 0.2rem;
        .sub {
          padding: 0.1rem 0 0.2rem;
        }
      }
      .name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.2rem 0;
        p {
          &:nth-of-type(1) {
            height: 0.3rem;
            line-height: 0.3rem;
            border-left: 0.05rem solid #1b82ec;
            text-indent: 0.1rem;
          }
          &:nth-of-type(2) {
            width: 1.3rem;
            height: 0.4rem;
            line-height: 0.4rem;
            background: #1b82ec;
            text-align: center;
            border-radius: 0.25rem;
            color: #fff;
          }
        }
      }
      .form_box {
        .input_item {
          background: #fff;
          margin-bottom: 0.3rem;
          overflow: hidden;
          p {
            margin: 0 0 0.3rem;
            font-size: 0.28rem;
          }
          :deep(.van-cell) {
            background: #f9f9f9;
            border: 0.02rem solid #ccc;
            font-size: 0.26rem;
            .van-field__control {
              max-height: 100px;
              overflow: scroll;
            }
          }
        }
      }
      .add {
        display: flex;
        color: #1b82ec;
        font-size: 0.24rem;
        padding: 0.2rem 0;
        i {
          margin-right: 0.1rem;
        }
      }
    }
  }
  .btns {
    display: flex;
    height: 0.88rem;
    line-height: 0.88rem;
    background-color: #fff;
    p {
      flex: 1;
      text-align: center;
      font-size: 0.28rem;
      box-sizing: border-box;
      border-top: 0.02rem solid #1b82ec;
      border-bottom: 0.02rem solid #1b82ec;
      &:nth-of-type(1),
      &:nth-of-type(3) {
        background: #1b82ec;
        color: #fff;
      }
      &:nth-of-type(2) {
        color: #1b82ec;
      }
    }
  }
}
</style>
