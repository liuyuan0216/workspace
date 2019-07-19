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

    <p class="detailMag">发票信息</p>
    <ul class="commonList">
      <li>
        <p class="leftCon">抬头信息</p>
        <input hidden ref="pdf_id" v-model="data.pdf_id" />
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
    <div v-if="!data.qrcode_url">
      <p class="detailMag">接收信息</p>
      <ul class="commonList">
        <li>
          <p class="leftCon">电子邮箱</p>
          <input type="text" class="rightInput" placeholder="请输入邮箱地址" v-model="data.email" ref="email" />
        </li>
      </ul>
    </div>
    <p class="passwordPrompt" v-if="data.sign==1">说明：您可以填写新的邮箱地址，点击提交后，系统会给您重新发送电子发票。</p>
    <button class="commonBtn" @click="send" v-if="data.sign==1">重新推送电子发票</button>

    <div class="maskBg" v-show="viewStatus"></div>
    <div class="maskImg" v-show="viewStatus">
      <img :src="data.url" />
      <span class="maskClose" @click="toClose">
        <img src="../assets/icon_close.png" />
      </span>
    </div>
    <confirm
      v-model="show"
      title="温馨提醒"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>
    <confirm
      v-model="showInvalid"
      title="温馨提醒"
      confirm-text="去重新登录"
      :show-cancel-button="false"
      @on-confirm="goLogin"
    >
      {{text}}
    </confirm>
    <loading v-model="showLoading" text=""></loading>
    <toast v-model="showToast" type="text">发送成功</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Qrcode from 'vux/src/components/qrcode'
import Confirm from 'vux/src/components/Confirm'
import Loading from 'vux/src/components/Loading'
import Toast from 'vux/src/components/toast'

export default {
  name: 'ElectronicDetail',
  data(){
    return{
      modeType: '',
      viewStatus:false,
      data: [],
      timer: null,
      isDone: false,
      popupsStatus: false,
      show: false,
      showLoading: false,
      text: '',
      showInvalid: false,
      showToast: false
    }
  },
  components:{
    ViewBox,
    XHeader,
    Qrcode,
    Confirm,
    Loading,
    Toast
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
    //弹窗显示
    showPopups () {
      if (this.popupsStatus) {
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    //查看开具
    toView(){
      this.viewStatus = true;
    },
    //关闭开具弹窗
    toClose(){
      this.viewStatus = false;
    },
    //重新发送请求
    send(){
      var _this = this;
      this.submit();
      if(this.isDone){  //验证通过
        this.showLoading = true;  //loading
        var url = this.local+'/api/user/sendpdf';
        var data = {
          userid: localStorage.getItem("token"),
          fphm: this.$refs.fphm.innerHTML,  //号码
          fpdm: this.$refs.fpdm.innerHTML,  //代码
          email: this.$refs.email.value,
          pdf_id: this.$refs.pdf_id.value
        }
        this.$ajaxjp(url, data, true, (response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;  //成功的提示
            this.timer = setTimeout(() => {
              this.$router.go(-1);
            }, 500)
            return;
          }
          if(response.errcode==1003){   //登录用户失效
            this.showLoading = false;
            this.showInvalid = true;
            this.text = '登录用户失效，请重新登录';
            //登录失效 重置
            var local_storage = window.localStorage;
            var session_storage = window.sessionStorage;
            local_storage.clear();  //清除localStorage
            session_storage.clear();  //清除sessionStorage
          }
          if(response.errcode==2006){   //交付数据不存在
            this.showLoading = false;
            this.popupsStatus = true;
            this.showPopups();
            this.text = '交付数据不存在';
          }else{
            this.showLoading = false;
            this.popupsStatus = true;
            this.showPopups();
            this.text = response.errmsg;
          }
        },function (error) {
          _this.showLoading = false;
          _this.popupsStatus = true;
          _this.showPopups();
          _this.text = '网络异常';
          console.log(error);
        });
      }
    },
    //表单验证
    submit(){
      //发票号码
      if(!this.$refs.fphm.innerHTML){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '发票号码不能为空';
        return false
      }
      //发票代码
      if(!this.$refs.fpdm.innerHTML){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '发票代码不能为空';
        this.isDone = false;
        return false
      }
      //邮箱
      if(!this.$refs.email.value){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '邮箱不能为空';
        this.isDone = false;
        return false
      }
      this.isEmail(this.$refs.email.value);
      if(this.emailFormat){  //邮箱格式弹窗
        this.popupsStatus = true;
        this.showPopups();
        this.text = this.emailText;
        this.isDone = false;
        return false
      }
      return this.isDone = true;
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    }
  },
  mounted () {
    this.locationData();  //local
  },
  beforeDestroy () {
    clearInterval(this.timer)
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
  .passwordPrompt{
    font-size: 0.26rem;
    line-height: 0.34rem;
    color: #ccc;
    padding: 0.12rem 0.32rem 0;
  }
</style>
