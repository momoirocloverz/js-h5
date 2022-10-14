<template>
  <!-- 审核流程组件 -->
  <div class="approval-steps">
    <van-steps direction="vertical" :active="statusTag" active-color="#0D73FF" inactive-color="#0d73ff4d" v-if="!unique">
      <van-step v-for="(item, key, index) of processData" :key="index">
        <div class="title">{{ item.title }}</div>
        <template v-if="index > 0 && statusTag > 0 && statusTag >= index">
          <div class="operation">
            {{ statusTag > index ? '通过' : approvalStatus[statusTail] }}
          </div>
          <div class="opinion" v-if="statusTag > index && statusTag != 1">意见：{{ approvalData[item.reason] || '-' }}</div>

          <div class="opinion" v-if="item.real_fund_amount">拨付金额：{{ approvalData[item.real_fund_amount] || '-' }}万元</div>
          <div class="opinion" v-if="item.ly_village_first_audit_area">初审面积：{{ approvalData[item.ly_village_first_audit_area] || '-' }}平方米</div>
          <div class="opinion" @click="showImages(approvalData[item.attachment])" v-if="statusTag > index">
            <span class="link">查看附件</span>
          </div>
          <div class="opinion" v-if="statusTag > index && approvalData[item.attachment_doc] && approvalData[item.attachment_doc].length">
            <span class="link doc" v-for="(doc, i) in approvalData[item.attachment_doc]" :key="i" @click="showDocs(doc)">{{ `文件附件${i + 1}` }}</span>
          </div>
        </template>
        <template v-else-if="finalStatus && statusTag < finalStatus"></template>
        <template v-else-if="!finalStatus && statusTag == 6">
          <div class="operation">通过</div>
        </template>
        <div class="time" v-if="statusTag > index && statusTag != 1">
          {{ approvalData[item.at] }}
        </div>
        <template #active-icon> <div class="dot done"></div> </template>
        <template #inactive-icon> <div class="dot"></div> </template>
        <template #finish-icon> <div class="dot done"></div> </template>
      </van-step>
    </van-steps>

    <van-steps direction="vertical" :active="statusTag - 2" active-color="#0D73FF" inactive-color="#0d73ff4d" v-else>
      <van-step v-for="(item, key, index) of processData" :key="index">
        <!-- 节点标题 -->
        <div class="title">{{ item.title }}</div>
        <!--
          节点状态 
          材料提交之后的节点 index > 0
          当前节点及之前的节点 statusTag - 2 >= index
          之前的节点都是已通过
        -->
        <div class="operation" v-if="index > 0 && statusTag - 2 >= index">
          {{ statusTag - 2 > index ? '审核通过' : approvalStatus[statusTail] }}
        </div>
        <!--
          审核意见 
          材料提交之后的节点 index > 0
          当前节点之前的节点 statusTag - 2 > index
        -->
        <div class="opinion" v-if="index > 0 && statusTag - 2 > index">意见：{{ approvalData[item.reason] || '-' }}</div>
        <!--
          操作时间
          当前节点之前的节点 statusTag - 2 > index
        -->
        <div class="time" v-if="statusTag - 2 > index">
          {{ approvalData[item.at] }}
        </div>
        <!--
          附件 同审核意见条件
          当前节点之前的节点 statusTag - 2 > index
        -->
        <div class="opinion" @click="showImages(approvalData[item.attachment])" v-if="index > 0 && statusTag - 2 > index">
          <span class="link">查看附件</span>
        </div>
        <div class="opinion" v-if="index == 2 && status == 42">拨付金额：{{ `${approvalData[item.real_fund_amount] || '-'}万元` }}</div>
        <template #active-icon> <div class="dot done"></div> </template>
        <template #inactive-icon> <div class="dot"></div> </template>
        <template #finish-icon> <div class="dot done"></div> </template>
      </van-step>
    </van-steps>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch, ref } from 'vue'
import { ImagePreview, Toast } from 'vant'

export default defineComponent({
  name: 'ApprovalSteps',
  components: { ImagePreview },
  props: {
    status: {
      type: Number,
      default: 0
    }, // 审核状态
    processData: {
      type: Object,
      default: {
        0: { title: '材料提交', at: 'submit_at' },
        1: {
          title: '乡镇经办人审核',
          at: 'village_handle_at',
          reason: 'village_handle_reason',
          attachment: 'village_handle_attachment'
        },
        2: {
          title: '公示（所在村）',
          at: 'village_publicity_at',
          reason: 'village_publicity_reason',
          attachment: 'village_publicity_attachment'
        },
        3: {
          title: '乡镇领导审核',
          at: 'village_leader_at',
          reason: 'village_leader_reason',
          attachment: 'village_leader_attachment',
          ly_village_first_audit_area: 'ly_village_first_audit_area'
        },
        4: {
          title: '农业农村局审核',
          at: 'rural_at',
          reason: 'rural_reason',
          attachment: 'rural_attachment'
        },
        5: {
          title: '公示（政府网）',
          at: 'rural_publicity_at',
          reason: 'rural_publicity_reason',
          attachment: 'rural_publicity_attachment'
        },
        6: {
          title: '资金拨付',
          at: 'amount_leader_at',
          reason: 'amount_leader_reason',
          real_fund_amount: 'real_fund_amount',
          attachment: 'amount_leader_attachment'
        }
      }
    }, // 审核流程项及对应字段
    approvalData: {
      type: Object,
      default: {}
    }, // 审核对象数据
    unique: {
      type: Boolean,
      default: false
    }, // 对无害化申请的流程特殊处理
    finalStatus: {
      type: Number,
      default: null
    } // 最终节点索引
  },
  setup(props) {
    const state = reactive({
      approvalStatus: {
        1: '审核中',
        2: '审核通过',
        9: '审核未通过'
      },
      statusTag: ref(0),
      statusTail: ref(0)
    })

    // 审核状态首字符 - 对应流程
    const generateTag = (status) => {
      const statusStr = status.toString()
      if (statusStr.length == 1) {
        return parseInt(statusStr)
      }
      let final = parseInt(status.toString().substr(0, 1))
      console.log('final', final)
      if (final == 3) {
        return 2
      } else if (final == 5) {
        return 4
      } else if (final == 7) {
        return 5
      } else if (final == 8) {
        return 6
      } else {
        return final
      }
    }

    // 审核状态末尾字符 - 对应该流程状态
    const generateTail = (status) => {
      const statusStr = status.toString()
      if (statusStr.length == 1) {
        return parseInt(statusStr)
      }
      let hi = parseInt(status.toString().substr(statusStr.length - 1, 1))
      return hi
    }

    // 展示附件图片
    const showImages = (data) => {
      try {
        let imgs = data
        if (typeof data == 'string') {
          imgs = JSON.parse(data)
        }

        if (imgs) {
          if (!imgs.length) {
            return Toast('审核人尚未添加附件')
          }
          ImagePreview({ images: imgs, closeable: true })
        } else {
          return Toast('审核人尚未添加附件')
        }
      } catch (error) {
        console.log(error)
        Toast('附件文件异常')
      }
    }

    const showDocs = (src) => {
      window.open(src, '_blank')
    }

    watch(
      () => props.status,
      (newVal) => {
        state.statusTag = generateTag(newVal)
        state.statusTail = generateTail(newVal)
      }
    )

    return {
      ...toRefs(state),
      showImages,
      showDocs
    }
  }
})
</script>
<style scoped lang="less"></style>
