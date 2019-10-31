<template>
    <div id="login">
      <img class="loginBg" src="../../assets/img_login_bg.png"/>
      <img class="loginBgCon" src="../../assets/img_login_con.png"/>
      <div class="loginWrap">
        <h2 class="loginTitle">登录</h2>
        <ul class="loginList">
          <li class="itemPhoneNum">
            <img src="../../assets/icon_login_phonenum.png"/>
            <input class="rightInput" type="number" placeholder="请输入手机号码" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" ref="login_name" />
            <span class="loginPrompt" v-show="name_prompt">{{name_text}}</span>
          </li>
          <li>
            <img src="../../assets/icon_login_password.png"/>
            <input class="rightInput" type="password" placeholder="请输入密码" ref="login_password" />
            <span class="loginPrompt" v-show="password_prompt">{{password_text}}</span>
          </li>
        </ul>
        <p class="forgetBtn"><span @click="jumpForgetPassword">忘记密码？</span></p>
        <button class="loginBtn" @click="login">登&nbsp;录</button>
      </div>
      <span class="vux-close" @click="closePage"></span>
      <div class="divider">
        <divider>desk版登录方式</divider>
        <div class="scanImg" @click="startScan">
          <img src="../../assets/icon_login.png"/>
          <p>扫码登录</p>
        </div>
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
        v-model="timeOut"
        title="温馨提醒"
        confirm-text="重新登录"
        :show-cancel-button="false"
      >
        {{text}}
      </confirm>
      <confirm
        v-model="showInvalid"
        title="温馨提醒"
        confirm-text="重新登录"
        @on-cancel="goIndex"
        @on-confirm="goLogin"
      >
        {{text}}
      </confirm>
      <div class="scan" ref="scan">
        <div id="bcid"></div>
      </div>
      <loading v-model="showLoading" text=""></loading>
    </div>
</template>

<script>
import Alert from 'vux/src/components/alert/index'
import Confirm from 'vux/src/components/confirm/index'
import Divider from 'vux/src/components/divider/index'
import Loading from 'vux/src/components/loading/index'
let scan = null
export default {
  name: 'Login',
  data(){
    return{
      showLoading: false,
      login_name: '',
      login_password: '',
      name_prompt: false,
      password_prompt: false,
      name_text: '',  //手机号格式
      password_text: '', //密码
      popupsStatus: false,
      show: false,
      showInvalid: false,
      timeOut: false,
      text: '',
      timer: null,
      fpzl: [],
      isScan: false,
      mobilePhone: '',  //电话号码
      checkSign: '',  //标记 desk:0
      mode: ''  //标记登录
    }
  },
  components:{
    Alert,
    Confirm,
    Divider,
    Loading
  },
  beforeRouteLeave(to, from, next){
    if(this.isScan){
      this.closeScan();
      return false
    }
    next();
  },
  methods:{
    //弹窗显示
    showPopups(){
      if(this.popupsStatus){
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    //登录操作
    login(){
      this.login_name = this.$refs.login_name.value;
      this.login_password = this.$refs.login_password.value;
      //手机号格式判断
      this.isPhoneAvailable(this.login_name);
      this.name_text = this.phoneText;
      //显示红色提示
      if(this.phoneNull||this.phoneFormat){
        this.name_prompt = true;
        if(this.phoneFormat){
          this.password_prompt = false;
          return false
        }
      }else{
        this.name_prompt = false;
      }
      //密码判断
      if(!this.login_password){
        this.password_text = '密码不能为空';
        this.password_prompt = true;
      }else {
        this.password_prompt = false;
      }
      //验证成功后请求登录
      if(!this.name_prompt&&!this.password_prompt){
        this.loginData();
      }
    },
    //请求登录
    loginData(){
      this.showLoading = true;  //loading
      var _this = this;
      var url = this.local+'/api/desk/login';
      var data = {
        login_name: this.login_name,
        login_password: this.login_password,
        version: this.version
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          this.showLoading = false;
          var userinfo = response.userinfo[0];
          this.checkSign = userinfo.checkSign;  //标记desk:0
          //保存用户信息
          localStorage.setItem("token", userinfo.userid);
          localStorage.setItem("name", userinfo.name);
          localStorage.setItem("img", userinfo.img);
          //保存手机号 个人信息里展示
          localStorage.setItem("phone", this.login_name);
          //请求myInfo
          this.myInfo();
          if(this.checkSign=='0'){
            this.timer = setTimeout(() => {
              _this.$router.push({path:'/desk_entrust'});
            }, 500)
          }else{
            this.timer = setTimeout(() => {
              _this.$router.push({path:'/'});
            }, 500)
          }
          return false
        }
        //手机号或密码不正确弹窗
        if(response.errcode==1002){
          this.showLoading = false;
          this.popupsStatus = true;
          this.showPopups();
          this.text = '手机号或密码不正确，请重新输入';
        }else{
          this.showLoading = false;
          this.popupsStatus = true;
          this.showPopups();
          this.text = response.errmsg;
        }
      },function (error) {
        _this.showLoading = false;
        _this.timeOut = true;
        _this.text = '网络异常';
        console.log(error);
      });
    },
    //忘记密码
    jumpForgetPassword(){
      this.$router.push({path:'/desk_forget'});
    },
    //请求个人信息
    myInfo(){
      this.showLoading = true;
      var _this = this;
      var url = this.local + '/api/desk/myInfo';
      var data = {
        userid: localStorage.getItem("token")
      }
      this.$ajaxjp(url, data, true, (response) => {
        if(response.errcode == 0) {
          this.showLoading = false;
          var info = response.info[0];
          localStorage.setItem("fpzl_list", info.fpzl);  //发票种类
          localStorage.setItem("company", info.company);  //发票名称
          localStorage.setItem("invoice", info.invoice);  //税号
          localStorage.setItem("kpjh", info.kpjh);  //发票机号
          //判断入口页面
          if(this.checkSign=='0'){
            localStorage.setItem("loginStatus", 'desk');
          }else{
            localStorage.setItem("loginStatus", 'hub');
          }
          return false
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
        }else{
          this.showLoading = false;
          this.popupsStatus = true;
          this.showPopups();
          this.text = response.errmsg;
        }
      }, function (error){
        _this.showLoading = false;
        _this.timeOut = true;
        _this.text = '网络异常';
        console.log(error);
      });
    },
    //关闭登录 返回上一页
    closePage(){
      if(this.isScan){
        this.closeScan();
      }else{
        this.$router.push({path:'/desk_entrust'});
      }
    },
    //创建扫描控件
    startScan(){
      document.activeElement.blur();  //隐藏软键盘
      this.$refs.scan.style.display = 'block';
      let that = this;
      if(!window.plus) return
      this.isScan = true;
      this.timer = setTimeout(() => {
        scan = new plus.barcode.Barcode('bcid');
        scan.onmarked = onmarked;
        scan.start();
      }, 200)

      function onmarked(type, result, file){
        switch (type) {
          case plus.barcode.QR:
            type = 'QR'
            break
          case plus.barcode.EAN13:
            type = 'EAN13'
            break
          case plus.barcode.EAN8:
            type = 'EAN8'
            break
          default:
            type = '其它' + type
            break
        }
        try{
          var data = JSON.parse(result);
          if(data.invoice && data.kpjh){
            that.scanLogin(data);
          }
        }catch(e){
          that.closeScan();
          that.popupsStatus = true;
          that.showPopups();
          that.text = '登录失败';
          return false;
        }
      }
    },
    //关闭条码识别控件
    closeScan(){
      if(!window.plus) return
      this.$refs.scan.style.display = 'none';
      this.isScan = false;
      scan.cancel();  //关闭扫描
      scan.close();  //关闭控件
    },
    //扫码登录
    scanLogin(result){
      /*result.invoice = '500102000000159'
      result.kpjh = '1000192504000906EB00'*/
      var _this = this;
      var url = this.local+'/api/desk/scan_login';
      var data = {
        invoice: result.invoice,
        kpjh: result.kpjh
      }
      this.$ajaxjp(url, data, true,(response) =>{
        if(response.errcode==0){
          alert(0)
          var userinfo = response.userinfo[0];
          this.mobilePhone = userinfo.mobilePhone;  //电话号码
          this.checkSign = userinfo.checkSign;  //标记desk:0
          //保存手机号 个人信息显示
          alert('mobilePhone:'+this.mobilePhone)

          if(userinfo.mobilePhone){
            localStorage.setItem("token", userinfo.userid);
            localStorage.setItem("phone", userinfo.mobilePhone);
            //请求myInfo
            //this.myInfo();
            alert('tiaozhuan1')
            this.$router.push({
              name: 'DeskMy'
            })
          }else{
            alert('tiaozhuan2')
            this.$router.push({path:'/desk_create',query:{invoice:result.invoice,kpjh:result.kpjh}});
          }
          return false
        }else{
          alert(1)
          this.popupsStatus = true;
          this.showPopups();
          this.text = response.errmsg;
        }
      },function(error){
        alert(2)
        _this.popupsStatus = true;
        _this.showPopups();
        _this.text = '网络异常';
        console.log(error);
      });
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //取消回到首页
    goIndex(){
      this.$router.push({path:'/desk_entrust'});
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

<style lang="less">
  @import '../../../node_modules/vux/src/styles/close.less';
  #login{
    width:100%;
    position: relative;
    height: 3.3rem;
  }
  #login .rightInput{
    margin-left: 0.16rem;
  }
  .loginBg{
    width:100%;
    height: auto;
    display: block;
    position: absolute;
    top:0;
    left:0;
    z-index: 1;
  }
  .loginBgCon{
    width:55%;
    height: auto;
    display: block;
    position: absolute;
    bottom:0;
    left:1rem;
    z-index: 2;
  }
  .loginList img{
    width:0.35rem;
  }
  .loginWrap{
    width: 6.4rem;
    height: 5rem;
    background: #fff;
    border-radius: 0.12rem;
    position: absolute;
    top: 3.6rem;
    left: 50%;
    margin-left: -3.2rem;
    -moz-box-shadow:0px 1px 8px #ccc;/*firefox*/
    -webkit-box-shadow:0px 1px 8px #ccc;/*webkit*/
    box-shadow:0px 1px 8px #ccc;
    padding: 0.34rem;
    box-sizing: border-box;
    z-index: 9;
  }
  .loginTitle{
    font-size: 0.56rem;
    line-height: 1rem;
    color: #333;
    font-weight: normal;
    padding-left: 0.2rem;
  }
  .loginList{
    padding-top: 0.2rem;
  }
  .loginList li{
    height: 0.58rem;
    padding: 0.1rem 0.15rem;
    border-bottom: 0.01rem solid #f2f2f2;
    display: flex;
    align-items: center;
    position:relative;
  }
  .itemPhoneNum{
    margin-bottom: 0.42rem;
  }
  .loginPrompt{
    color: #EE3B3B;
    font-size: 0.26rem;
    position: absolute;
    top: 0.78rem;
    left: 0.7em;
    line-height: 0.46rem;
    height: 0.46rem;
  }
  .loginInput{
    height: 0.46rem;
    line-height: 0.46rem;
    margin-left: 0.16rem;
    width:80%;
    color: #333;
    font-size: 0.3rem;
  }
  .forgetBtn{
    font-size: 0.24rem;
    color: #76d8a7;
    text-align: right;
    line-height: 0.5rem;
  }
  .loginBtn{
    font-size: 0.36rem;
    color: #fff;
    background: #76d8a7;
    border: none;
    border-radius: 2rem;
    display: block;
    width: 76%;
    height: 0.85rem;
    line-height: 0.85rem;
    position: absolute;
    bottom: -0.4rem;
    left: 12%;
  }
  #login .vux-close{
    color: #fff;
    position: absolute;
    right: 0.32rem;
    top: 0.3rem;
    z-index: 9999;
    width:20px;
  }
  #login .vux-close:before,#login .vux-close:after{
    width:20px;
  }
  .divider{
    position: absolute;
    top: 10.2rem;
    left:0;
    width:100%;
    text-align: center;
  }
  .scanImg{
    margin: 0 auto;
    width: 1.5rem;
  }
  .divider img{
    margin: 0 auto;
    width: 0.85rem;
    display: block;
  }
  .divider p{
    font-size: 0.28rem;
    color: #999;
    line-height: 0.68rem;
  }
  #login .vux-divider{
    color: #ccc;
  }
  #login .vux-divider:before {
    background-position: right 0.5em top 50%;
  }
  #login .vux-divider:after {
    background-position: left 0.5em top 50%;
  }
  #login .scan{
    position: fixed;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: none;
  }
  #login #bcid{
    position: absolute;
    top: 46px;
    left: 0;
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: 0.34rem;
    color: #333;
  }
</style>
