<template>
  <view-box ref="viewBox" class="unbind_phone">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">验证</h2>
    </x-header>
    <ul class="passwordList marginTop">
      <li>
        <p class="leftCon">旧手机号</p>
        <p class="rightCon">{{phone}}</p>
      </li>
      <li class="itemCode">
        <p class="leftCon">验证码</p>
        <input type="number" class="rightInput" placeholder="请输入验证码" ref="code"/>
        <button class="codeBtn" @click="getCode">获取验证码</button>
      </li>
    </ul>
    <p class="passwordPrompt">旧手机号无法获取验证码，请联系客服010-82783415</p>
    <button class="commonBtn" @click="unbindMobilePhone">下一步</button>

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
  name: 'UnbindPhone',
  data(){
    return{
      phone: localStorage.getItem("phone"),
      popupsStatus: false,
      show: false,
      text: '',
      timer: null,
      showLoading: false,
      code: '',
      showToast: false,
      toastText: '发送成功',
      isDone: false
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
    //获取验证码
    getCode(){
      if(!this.phone){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '旧手机号不能为空';
        return false
      }
      var _this = this;
      var url = this.local+'/api/desk/getCode';
      var data = {
        tel: this.phone,
        type: '1'  //1 解绑手机号
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
    unbindMobilePhone(){
      var _this = this;
      this.submit();  //验证
      if(this.isDone){
        this.showLoading = true;
        var url = this.local+'/api/desk/unbindMobilePhone';
        var data = {
          userid: localStorage.getItem("token"),
          mobilePhone: this.phone,
          code: this.$refs.code.value
        }
        this.$ajaxjp(url, data, true, (response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;
            this.toastText = '操作完成';
            this.timer = setTimeout(() => {
              this.$router.push({path:'/desk_bind_phone'});
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
      var code = this.$refs.code.value;
      if(!this.phone){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '旧手机号不能为空';
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
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  .unbind_phone .rightCon{
    width: auto;
  }
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
