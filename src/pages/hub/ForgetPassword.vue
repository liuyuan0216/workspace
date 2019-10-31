<template>
  <view-box ref="viewBox" class="forgetPassword">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">忘记密码</h2>
    </x-header>
    <ul class="passwordList marginTop">
      <li>
        <p class="leftCon">手机号</p>
        <input type="number" class="rightInput" placeholder="请输入手机号码" ref="login_tel" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
      </li>
      <li class="itemCode">
        <p class="leftCon">验证码</p>
        <input type="number" class="rightInput" placeholder="请输入验证码" ref="login_code"/>
        <button class="codeBtn" @click="phonePassed">获取验证码</button>
      </li>
    </ul>
    <ul class="passwordList">
      <li>
        <p class="leftCon">新密码</p>
        <input type="password" class="rightInput" placeholder="请输入新密码" ref="login_password"/>
      </li>
      <li>
        <p class="leftCon">确认密码</p>
        <input type="password" class="rightInput" placeholder="请再次输入新密码" ref="login_password_again"/>
      </li>
    </ul>
    <p class="passwordPrompt">密码必须至少8个字符，而且同时包含字母和数字。</p>
    <button class="commonBtn" @click="fromData">完成</button>

    <confirm
      v-model="show"
      title="温馨提醒"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>
    <confirm
      v-model="showResetPwd"
      title="提示"
      confirm-text="请重新登录"
      :show-cancel-button="false"
      @on-confirm="goLogin"
    >
      {{text}}
    </confirm>
    <confirm
      v-model="showInvalid"
      title="温馨提醒"
      confirm-text="去重新登录"
      @on-confirm="goLogin"
    >
      {{text}}
    </confirm>
    <toast v-model="showToast" type="text">
      <!--<icon type="success-no-circle"></icon>-->
      发送成功
    </toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Alert from 'vux/src/components/alert/index'
import Confirm from 'vux/src/components/confirm/index'
import Toast from 'vux/src/components/toast/index'
import Icon from 'vux/src/components/icon/index'
import Loading from 'vux/src/components/loading/index'

export default {
  name: 'ForgetPassword',
  data(){
    return{
      popupsStatus: false,
      show: false,
      showResetPwd: false,
      showToast: false,
      showLoading: false,
      showInvalid: false,
      text: '',
      login_tel: '',
      login_code: '',
      login_password: '',
      login_password_again: '',
      isDone: false,
      timer: null
    }
  },
  components:{
    ViewBox,
    XHeader,
    Alert,
    Confirm,
    Toast,
    Icon,
    Loading
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
    //手机号格式判断
    isPhone(){
      this.login_tel = this.$refs.login_tel.value;
      this.isPhoneAvailable(this.login_tel);
      this.text = this.phoneText;
    },
    //手机号验证通过
    phonePassed(){
      this.isPhone();
      if(this.phoneNull||this.phoneFormat){
        this.popupsStatus = true;
        this.showPopups();
      }else{
        this.getCode();
      }
    },
    //验证操作
    fromData(){
      var _this = this;
      this.login_password = this.$refs.login_password.value;
      this.login_password_again = this.$refs.login_password_again.value;
      this.submit();  //验证
      if(this.isDone){  //验证通过
        this.showLoading = true;
        var url = this.local+'/api/user/resetPwd';  //重置/找回密码
        var data = {
          tel: this.login_tel,
          code: this.$refs.login_code.value,
          new_password: this.login_password
        }
        this.$ajaxjp(url, data, true, (response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showResetPwd = true;
            this.text = '密码修改成功！';
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
        },function (error) {
          _this.showLoading = false;
          _this.popupsStatus = true;
          _this.showPopups();
          _this.text = '网络异常';
          console.log(error);
        });
      }
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //表单验证
    submit(){
      this.isPhone();
      if(this.phoneNull||this.phoneFormat){  //手机号弹窗
        this.popupsStatus = true;
        this.showPopups();
        this.isDone = false;
        return false
      }
      if(!this.login_code){  //验证码弹窗
        this.popupsStatus = true;
        this.showPopups();
        this.text = '验证码不能为空';
        this.isDone = false;
        return false
      }
      //验证码不正确弹窗
      if(this.$refs.login_code.value!=this.login_code){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '验证码不正确，请重新输入';
        this.isDone = false;
        return false
      }
      if(!this.login_password){  //密码弹窗
        this.popupsStatus = true;
        this.showPopups();
        this.text = '新密码不能为空';
        this.isDone = false;
        return false
      }
      if(!this.login_password_again){  //密码弹窗
        this.popupsStatus = true;
        this.showPopups();
        this.text = '确认密码不能为空';
        this.isDone = false;
        return false
      }
      this.isPssword(this.login_password);
      if(this.passwordFormat){  //密码格式弹窗
        this.popupsStatus = true;
        this.showPopups();
        this.text = '请输入正确的新密码';
        this.isDone = false;
        return false
      }
      if(this.login_password!=this.login_password_again){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '两次密码不一致，请重新输入';
        this.isDone = false;
        return false
      }
      return this.isDone = true;
    },
    //获取验证码
    getCode(){
      var _this = this;
      var url = this.local+'/api/user/getCode';
      var data = {
        tel: this.login_tel
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          this.showToast = true;  //提示成功了
          this.login_code = response.code;
          return
        }
        //手机号不存在
        if(response.errcode==1007){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '该手机号不存在，请重新输入';
          return
        }
        //验证码过期
        if(response.errcode==1009){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '验证码已过期，请重新获取';
          return
        }
        //短信发送频率受限
        if(response.errcode==1011){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '短信发送频率受限，请稍后再试';
          return
        }
        //验证码获取失败
        if(response.errcode==1012){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '验证码获取失败，请重试';
          return
        }else{
          this.showLoading = false;
          this.popupsStatus = true;
          this.showPopups();
          this.text = response.errmsg;
        }
      },function (error) {
        _this.popupsStatus = true;
        _this.showPopups();
        _this.text = '网络异常';
        console.log(error);
      });
    },
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
  .passwordList{
    background: #fff;
    margin-bottom: 0.24rem;
  }
  .passwordList li{
    padding: 0.24rem 0.45rem;
    line-height: 0.6rem;
    border-bottom: 0.01rem solid #f2f2f2;
    display: flex;
    align-items: center;
  }
  .passwordList li:last-child{
    border: none;
  }
  .itemCode{
    border: none;
  }
  .itemCode .rightInput{
    width: 3.1rem;
  }
  .forgetPassword .codeBtn{
    border: 0.012rem solid #999;
    border-radius: 0.08rem;
    padding: 0 0.24rem;
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.26rem;
    display: block;
  }
  .passwordPrompt{
    font-size: 0.26rem;
    text-align: center;
    line-height: 0.3rem;
    color: #ccc;
  }
</style>
