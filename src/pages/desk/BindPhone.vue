<template>
  <view-box ref="viewBox" class="bind_phone">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">绑定手机号</h2>
    </x-header>
    <ul class="passwordList marginTop">
      <li>
        <p class="leftCon">手机号</p>
        <input type="number" class="rightInput" placeholder="请输入手机号" ref="phone"/>
      </li>
      <li class="itemCode">
        <p class="leftCon">验证码</p>
        <input type="number" class="rightInput" placeholder="请输入验证码" ref="code"/>
        <button class="codeBtn" @click="phonePassed">获取验证码</button>
      </li>
    </ul>
    <p class="passwordPrompt">手机号无法获取验证码，请联系客服010-82783415</p>
    <button class="commonBtn" @click="bindMobilePhone">完成</button>

    <confirm
      v-model="show"
      title="温馨提醒"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>
    <loading v-model="showLoading" text=""></loading>
    <toast v-model="showToast" type="text">{{toastText}}</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Confirm from 'vux/src/components/confirm/index'
import Loading from 'vux/src/components/loading/index'
import Toast from 'vux/src/components/toast/index'

export default {
  name: 'BindPhone',
  data(){
    return{
      popupsStatus: false,
      show: false,
      text: '',
      timer: null,
      showLoading: false,
      code: '',
      showToast: false,
      toastText: '发送完成'
    }
  },
  components:{
    ViewBox,
    XHeader,
    Confirm,
    Loading,
    Toast
  },
  methods:{
    //弹窗显示
    showPopups () {
      if(this.popupsStatus) {
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    //手机号验证通过
    phonePassed(){
      var phone = this.$refs.phone.value;
      this.isPhoneAvailable(phone);
      this.text = this.phoneText;
      if(this.phoneNull||this.phoneFormat){
        this.popupsStatus = true;
        this.showPopups();
      }else{
        this.getCode();
      }
    },
    //获取验证码
    getCode(){
      var _this = this;
      var url = this.local+'/api/desk/getCode';
      var data = {
        tel: this.$refs.phone.value,
        type: '2'  //2 绑定手机号
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          this.showToast = true;
          this.code = response.code;
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
    //解除绑定操作
    bindMobilePhone(){
      var _this = this;
      this.submit();  //验证
      if(this.isDone){
        this.showLoading = true;
        var url = this.local+'/api/desk/bindMobilePhone';
        var data = {
          userid: localStorage.getItem("token"),
          mobilePhone: this.$refs.phone.value,
          code: this.$refs.code.value
        }
        this.$ajaxjp(url, data, true, (response) =>{
          if(response.errcode==0){
            localStorage.setItem("phone", this.$refs.phone.value);
            this.showLoading = false;
            this.showToast = true;
            this.toastText = '操作完成';
            this.timer = setTimeout(() => {
              this.$router.push({path:'/desk_personal_infor'});
            }, 500)
            return false
          }
          if(response.errcode==1016){   //登录用户失效
            this.showLoading = false;
            this.$vux.confirm.show({
              title: '温馨提示',
              content: '您的账号已在其他设备登录，请重新登录',
              onCancel () {
                _this.goIndex();
              },
              onConfirm () {
                _this.goLogin();
              },
            })
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
        },function (error) {
          _this.showLoading = false;
          _this.timeOut = true;
          _this.text = '网络异常';
          console.log(error);
        });
      }
    },
    submit(){
      var phone = this.$refs.phone.value;
      var code = this.$refs.code.value;
      if(!phone){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '手机号不能为空';
        this.isDone = false;
        return false
      }
      if(!code){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '验证码不能为空';
        this.isDone = false;
        return false
      }
      if(code!=this.code){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '验证码错误';
        this.isDone = false;
        return false
      }
      return this.isDone = true;
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
  .codeBtn{
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
