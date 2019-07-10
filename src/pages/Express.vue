<template>
  <view-box ref="viewBox" class="express">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">物流状态</h2>
    </x-header>
    <div class="expressWrap marginTop">
      <div class="expressIcon">
        <img src="../assets/icon_my_wdfp.png" />
      </div>
      <div class="expressInfor">
        <p>快递公司：顺丰快递</p>
        <p>快递单号：27383630998993</p>
      </div>
    </div>
    <timeline class="timeline">
      <timeline-item>
        <p class="recent">【广东】 广州市 已发出</p>
        <span class="recent">2016-04-17 12:00:00</span>
      </timeline-item>
      <timeline-item>
        <p>申通快递员 广东广州 收件员 xxx 已揽件</p>
        <span>2016-04-16 10:23:00</span>
      </timeline-item>
      <timeline-item>
        <p>商家正在通知快递公司揽件商家正在通知快递公司揽件商家正在通知快递公司揽件商家正在通知快递公司揽件</p>
        <span>2016-04-15 9:00:00</span>
      </timeline-item>
    </timeline>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Timeline from 'vux/src/components/timeline/timeline'
import TimelineItem from 'vux/src/components/timeline/timeline-item'

export default {
  name: 'Express',
  components:{
    ViewBox,
    XHeader,
    Timeline,
    TimelineItem
  }
}
</script>

<style scoped>
  .express .timeline{
    font-size: 0.3rem;
    color: #333;
    line-height: 0.4rem;
    padding: 0.32rem 0 0 0.45rem;
    background: #fff;
    margin-top: 0.32rem;
  }
  .express .recent {
    color: #ff9900;
  }
  .express .timeline p{
    color: #999;
    padding-right: 0.38rem;
  }
  .express .timeline span{
    width: 100%;
    color: #ccc;
    font-size: 0.26rem;
    padding-top: 0.05rem;
    padding-bottom: 0.16rem;
    display: inline-block;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .express li:last-child span{
    border: none;
  }
  .expressWrap{
    background: #fff;
    padding: 0.32rem;
    display: flex;
    align-items: center;
  }
  .expressIcon{
    width: 1.2rem;
    height:1.2rem;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }
  .expressIcon img{
    width: 1.2rem;
  }
  .expressInfor{
    font-size: 0.3rem;
    color: #333;
    line-height: 0.45rem;
    padding-left: 0.32rem;
  }
</style>
