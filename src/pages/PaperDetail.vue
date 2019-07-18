<template>
  <view-box ref="viewBox" class="paper_detail">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">发票详情</h2>
    </x-header>
    <!--<div class="detailStatus marginTop" @click="jumpExpress">
      <p class="detailStatusCon" v-if="data.sign==1">快递状态<span>{{data.kprq}}</span></p>
      <span class="detailChakan" v-if="data.sign==1"><b></b></span>
    </div>-->
    <div class="detailStatus marginTop" v-if="data.sign==0">
      <p class="detailStatusCon detailStatusNull">发票未开具</p>
    </div>
    <p class="detailMag" :class="data.sign==1?'detailMagMt':''">接收信息</p>
    <ul class="commonList">
      <li>
        <p class="leftCon">详细地址</p>
        <p class="rightCon">{{data.receipt_address||'暂无'}}</p>
      <li>
        <p class="leftCon">联系人</p>
        <p class="rightCon">{{data.receiver||'暂无'}}</p>
      </li>
    </ul>
    <p class="detailMag">发票信息</p>
    <ul class="commonList">
      <li>
        <p class="leftCon">抬头信息</p>
        <p class="rightCon overflowCon">{{data.gfmc||'暂无'}}</p>
      </li>
      <li>
        <p class="leftCon">发票金额</p>
        <p class="rightCon">{{data.jshj||'暂无'}}</p>
      </li>
      <li>
        <p class="leftCon">商品</p>
        <p class="rightCon overflowCon">{{data.spmc||'暂无'}}</p>
      </li>
      <li>
        <p class="leftCon">发票号码</p>
        <p class="rightCon">{{data.fphm||'无'}}</p>
      </li>
      <li>
        <p class="leftCon">发票代码</p>
        <p class="rightCon">{{data.fpdm||'无'}}</p>
      </li>
    </ul>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'

export default {
  name: 'PagerDetail',
  data(){
    return{
      data: [],
      itemData: this.$route.query.itemData,
      itemIndex: this.$route.query.index
    }
  },
  components:{
    ViewBox,
    XHeader
  },
  methods:{
    //获取数据
    getData(){
      this.data = this.itemData;
    },
    //查看快递状态
    jumpExpress(){
      this.$router.push({path:'/express'});
    }
  },
  mounted () {
    this.getData();
  }
}
</script>

<style scoped>
  .detailMag{
    font-size: 0.3rem;
    color: #333;
    line-height: 0.85rem;
    padding-left: 0.32rem;
    font-weight: bold;
  }
  .detailStatus{
    padding: 0.24rem 0.32rem;
    border-top: 0.01rem solid #f2f2f2;
    border-bottom: 0.01rem solid #f2f2f2;
    background: #fff;
    font-size: 0.3rem;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .detailStatusCon{
    line-height: 0.42rem;
  }
  .detailStatusCon span{
    display: block;
    font-size: 0.24rem;
    line-height: 0.4rem;
    color: #999;
  }
  .detailChakan{
    font-size: 0.24rem;
    line-height: 0.26rem;
  }
  .detailChakan b{
    background: url(../assets/icon_view.png) no-repeat;
    background-size: contain;
    width: 0.24rem;
    height: 0.26rem;
    display: inline-block;
    vertical-align: top;
    margin-left: 0.1rem;
  }
  .paper_detail .commonList li{
    height: auto;
  }
  .paper_detail .commonList .rightCon{
    height: auto;
  }
  .detailStatusNull{
    height: 0.6rem;
    line-height: 0.6rem;
  }
  .detailMagMt{
    margin-top: 48px;
  }
</style>
