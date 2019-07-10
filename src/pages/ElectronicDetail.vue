<template>
  <view-box ref="viewBox" class="electronic_detail">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">发票详情</h2>
    </x-header>
    <div class="detailStatus marginTop">
      <p class="detailStatusCon" v-if="data.sign==1">电子发票已开具<span>{{data.kprq}}</span></p>
      <span class="detailChakan" v-if="data.sign==1" @click="toView">查看<b class="icon_arrow"></b></span>

      <p class="detailStatusCon detailStatusNull" v-if="data.sign==0">发票未开具</p>
    </div>
    <div v-if="!data.qrcode_url">
      <p class="detailMag">接收信息</p>
      <ul class="commonList">
        <li>
          <p class="leftCon">电子邮箱</p>
          <p class="rightCon">{{data.email||'暂无'}}</p>
        </li>
      </ul>
    </div>
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
      <li v-if="!data.qrcode_url">
        <p class="leftCon">发票号码</p>
        <p class="rightCon" ref="fphm">{{data.fphm||'无'}}</p>
      </li>
      <li v-if="!data.qrcode_url">
        <p class="leftCon">发票代码</p>
        <p class="rightCon" ref="fpdm">{{data.fpdm||'无'}}</p>
      </li>
    </ul>
    <div v-if="data.qrcode_url">
      <p class="detailMag qrcodeCon">扫描二维码</p>
      <qrcode :value="data.qrcode_url" class="qrcode"></qrcode>
    </div>
    <button class="commonBtn" @click="againResend" v-if="data.sign==1">重新推送电子发票</button>

    <div class="maskBg" v-show="viewStatus"></div>
    <div class="maskImg" v-show="viewStatus">
      <img :src="data.url" />
      <span class="maskClose" @click="toClose">
        <img src="../assets/icon_close.png" />
      </span>
    </div>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Qrcode from 'vux/src/components/qrcode'

export default {
  name: 'ElectronicDetail',
  data(){
    return{
      modeType: '',
      viewStatus:false,
      data: [],
      email: '',
      qrcode: ''
    }
  },
  components:{
    ViewBox,
    XHeader,
    Qrcode
  },
  beforeRouteEnter(to, from, next){
    var fromparams_list_all = [];
    var fromparams_list_my = [];
    if(from.name=='OrderList'){
      if(to.query.itemData){
        fromparams_list_all = to.query.itemData;
      }
      next(vm => {
        vm.data = fromparams_list_all;
        vm.email = fromparams_list_all.email;
        vm.modeType = localStorage.getItem("modeType");
      });
    }else if(from.name=='MyList'){
      if(to.query.itemData){
        fromparams_list_my = to.query.itemData;
      }
      next(vm => {
        vm.data = fromparams_list_my;
        vm.email = fromparams_list_my.email;
      });
    }else{
      next();
    }
  },
  methods:{
    //获取数据
    getData(){

    },
    //重新发送按钮
    againResend(){
      var fphm = this.$refs.fphm.innerText;
      var fpdm = this.$refs.fpdm.innerText;
      this.$router.push({path:'/again',query:{fphm:fphm,fpdm:fpdm,email:this.email}})
    },
    //查看开具
    toView(){
      this.viewStatus = true;
    },
    //关闭开具弹窗
    toClose(){
      this.viewStatus = false;
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
    line-height: 1rem;
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
  .detailStatusNull{
    line-height:0.6rem;
  }
  .detailStatusCon span{
    display: block;
    font-size: 0.24rem;
    line-height: 0.4rem;
    color: #999;
  }
  .detailChakan{
    font-size: 0.28rem;
    line-height: 0.32rem;
  }
  .maskBg{
    background: rgba(0,0,0,0.6);
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index: 9;
  }
  .maskImg{
    width:86%;
    position: absolute;
    top:20%;
    left:7%;
    z-index: 10;
  }
  .maskImg img{
    width:100%;
    display: block;
  }
  .maskClose{
    display: flex;
    justify-content: center;
    align-items: center;
    width:1rem;
    height:1rem;
    margin: 0.2rem auto 0;
  }
  .maskClose img{
    width:0.65rem;
  }
  .qrcodeCon{
    text-align: center;
    padding-top: 0.32rem;
    padding-left: 0;
  }
  .qrcode{
    margin: 0 auto;
    text-align: center;
  }
</style>
