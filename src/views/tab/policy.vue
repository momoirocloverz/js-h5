<template>
    <div class="policy">
      <div  class="imgbox">
        <img v-if="1" :src="require('@/assets/working.png')" alt="">
        <span>正在建设中</span>
      </div>
      <div class="search" style="display:none;">
        <input
            type="text"
            v-model.trim="state.inputVal"
            placeholder="请输入关键字"
            class="searchSpan"
        />
        <van-icon name="search" />
        <span
            @click="onSearch"
            class="searchSpan"
        >搜索</span
        >
      </div>
      <div  style="display:none;" class="nav">
        <div class="navTab" @click="changeActive(0)">
          <span :class="activeIndex === 0?'active':null">竞争性财政支农项目</span>
          <div :class="activeIndex === 0?'line':null"></div>
        </div>
        <div class="navTab"  @click="changeActive(1)">
          <span :class="activeIndex === 1?'active':null">惠农补贴</span>
          <div :class="activeIndex === 1?'line':null"></div>
        </div>
      </div>
      <div  style="display:none;" class="Content">
        <div class="Item">
          <div class="left">
            <div class="top">
              普惠政策普惠政策普惠政策普惠政策普惠政策普惠政策普惠政策
            </div>
            <div class="bot">
              发布时间：2021-02-03 13:11
            </div>
          </div>
          <div class="right">
            <div>咨询</div>
            <div>在线申报</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
    setup () {
        const Router = useRouter()
        const Route = useRoute()
      const activeIndex=ref(0)
        const state = reactive({

        })
      const changeActive = (val) => {
        activeIndex.value = val
      }
        return {
            state,
          activeIndex,
          changeActive
        }
    }
}
</script>
<style lang="less" scoped>
.policy {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .imgbox{
    position: relative;
    width: 5.28rem;
    height: 4.42rem;
    margin: 2.92rem auto;
    img{
      width: 5.28rem;
      height: 4.42rem;
      position: absolute;
      left: 0;
      top:0;
      display: block;
    }
    span{
      position: absolute;
      bottom: .06rem;
      right: 0;
      left: 0;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      font-size: .26rem;
      color:rgba(153, 153, 153, 1) ;
    }
  }

  .nav{
    height: .4rem;
    padding-bottom: .3rem;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    .navTab{
      float: left;
      width: 50%;height: 100%;
      line-height: .4rem;
      font-size: .28rem;
      color: #999;
      text-align: center;
      position: relative;
    }
    .line{
      width: .8rem;
      height: .04rem;
      background-color: #1B82EC;
      position: absolute;
      bottom: -.3rem;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
    }
    .active{
      color:#1B82EC
    }
  }
  .Content{
    width: 100%;
    height: calc(100vh - 3.25rem);
    overflow: auto;
    padding: .3rem;
    box-sizing: border-box;
    background-color: #fff;
    margin-top: .15rem;
    .Item{
      width: 100%;
      padding-bottom: .3rem;
      border-bottom: .01rem solid rgba(112, 112, 112, .2);
      display: flex;
      justify-content: space-between;
      .right{
        width: 1.6rem;
        height: 1.49rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        div{
          border: .01rem solid #1B82EC;
          color: #1B82EC;
          border-radius: 0.25rem;
          box-sizing: border-box;
          text-align: center;
          line-height: .5rem;
          height: .5rem;
          width: 1.58rem;
        }
        div:nth-of-type(2){
          color: #fff;
          background-color: #1B82EC;
          margin-top: .3rem;
        }
      }
      .left{
        padding-right: .82rem;
        .top{
          font-size: .28rem;
          line-height: .4rem;
          color:rgba(51, 51, 51, 1)
        }
        .bot{
          height: .33rem;
          line-height: .33rem;
          font-size: .24rem;
          color:rgba(153, 153, 153, 1);
          padding-top: .3rem;
        }
      }
    }
  }
  .search {
    position: relative;
    display: flex;
    align-items: center;
    padding: .3rem;
    justify-content: space-between;
    background-color: #fff;
    .van-icon-search {
      position: absolute;
      font-size: 0.3rem;
      left: 0.5rem;
      color: #999;
    }
    span {
      font-size: 0.28rem;
      font-weight: 500;
      color: #666;
      margin-left: 0.2rem;
    }
    input {
      background-color: #F6F6F6;
      height: 0.6rem;
      flex: 1;
      border-radius: 0.3rem;
      font-size: 0.28rem;
      text-indent: 0.5rem;
    }
    .searchSpanOld {
      font-size: 0.35rem;
    }
  }
}
</style>
