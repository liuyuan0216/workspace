<template>
    <div id="login">
      <img class="loginBg" src="../assets/img_login_bg.png"/>
      <img class="loginBgCon" src="../assets/img_login_con.png"/>
      <div class="loginWrap">
        <h2 class="loginTitle">登录</h2>
        <ul class="loginList">
          <li class="itemPhoneNum">
            <img src="../assets/icon_login_phonenum.png"/>
            <input class="rightInput" type="number" placeholder="请输入手机号码" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" ref="login_name" />
            <span class="loginPrompt" v-show="name_prompt">{{name_text}}</span>
          </li>
          <li>
            <img src="../assets/icon_login_password.png"/>
            <input class="rightInput" type="password" placeholder="请输入密码" ref="login_password" />
            <span class="loginPrompt" v-show="password_prompt">{{password_text}}</span>
          </li>
        </ul>
        <p class="forgetBtn"><span @click="jumpForgetPassword">忘记密码？</span></p>
        <button class="loginBtn" @click="login">登&nbsp;录</button>
      </div>
      <span class="vux-close" @click="closePage"></span>
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
        confirm-text="去重新登录"
        :show-cancel-button="false"
      >
        {{text}}
      </confirm>
      <confirm
        v-model="showInvalid"
        title="温馨提醒"
        confirm-text="确定"
        :show-cancel-button="false"
      >
        {{text}}
      </confirm>
    </div>
</template>

<script>
import Alert from 'vux/src/components/alert'
import Confirm from 'vux/src/components/Confirm'

export default {
  name: 'Login',
  data(){
    return{
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
      fpzl: []
    }
  },
  components:{
    Alert,
    Confirm
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
      var _this = this;
      var url = this.local+'/api/user/login';
      var data = {
        login_name: this.login_name,
        login_password: this.login_password,
        version: this.version
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          var userinfo = response.userinfo[0];
          //保存用户信息
          localStorage.setItem("token", userinfo.userid);
          localStorage.setItem("name", userinfo.name);
          localStorage.setItem("img", userinfo.img);
          this.myInfo();  //请求myInfo
        }
        //手机号或密码不正确弹窗
        if(response.errcode==1002){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '手机号或密码不正确，请重新输入';
        }else{
          this.popupsStatus = true;
          this.showPopups();
          this.text = response.errmsg;
        }
      },function (error) {
        _this.timeOut = true;
        _this.text = '网络异常';
        console.log(error);
      });
    },
    //忘记密码
    jumpForgetPassword(){
      this.$router.push({path:'/forget'});
    },
    //请求个人信息
    myInfo(){
      var url = this.local + '/api/user/myInfo';
      var data = {
        userid: localStorage.getItem("token")
      }
      this.$ajaxjp(url, data, true, (response) => {
        if (response.errcode == 0) {
          var info = response.info[0];
          localStorage.setItem("fpzl_list", info.fpzl);  //发票种类
          localStorage.setItem("company", info.company);  //发票名称
          localStorage.setItem("invoice", info.invoice);  //税号
          //var isDropOut = sessionStorage.getItem("isDropOut");  //是否是退出登录状态/修改密码成功后
          this.$router.push({path:'/'});
        }
        if(response.errcode==1003){   //登录用户失效
          this.showInvalid = true;
          this.text = '登录用户失效，请重新登录';
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
        }
      }, function (error) {
        console.log(error);
      });
    },
    //关闭登录 返回上一页
    closePage(){
      this.$router.push({path:'/'});
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
  @import '~vux/src/styles/close.less';
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
    top: 3.8rem;
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
    right:.45rem;
    top:.45rem;
    z-index: 10;
    width:20px;
  }
  #login .vux-close:before,#login .vux-close:after{
    width:20px;
  }
</style>
