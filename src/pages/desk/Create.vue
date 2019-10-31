<template>
  <view-box ref="viewBox">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">创建登录账号</h2>
    </x-header>
    <ul class="passwordList marginTop">
      <li>
        <p class="leftCon">手机号</p>
        <input type="number" class="rightInput" placeholder="请输入手机号" ref="create_name"/>
      </li>
      <li>
        <p class="leftCon">密码</p>
        <input type="password" class="rightInput" placeholder="请输入密码" ref="create_password"/>
      </li>
      <li>
        <p class="leftCon">确认密码</p>
        <input type="password" class="rightInput" placeholder="请再次输入密码" ref="create_password_again"/>
      </li>
    </ul>
    <p class="passwordPrompt">密码必须至少8个字符，而且同时包含字母和数字。</p>
    <button class="commonBtn" @click="fromData">创建</button>
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
      @on-cancel="goIndex"
      @on-confirm="goLogin"
    >
      {{text}}
    </confirm>
    <toast v-model="showToast" type="text">创建成功</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Confirm from 'vux/src/components/confirm/index'
import Loading from 'vux/src/components/loading/index'
import Toast from 'vux/src/components/toast/index'

export default {
  name: 'Create',
  data(){
    return{
      invoice: this.$route.query.invoice,
      kpjh: this.$route.query.kpjh,
      popupsStatus: false,
      show: false,
      timer: null,
      text: '',
      showInvalid: false,
      showToast: false,
      create_name: '',
      create_password: '',
      create_password_again: '',
      isDone: false,
      showLoading: false
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
      if (this.popupsStatus) {
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
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
          //保存手机号
          localStorage.setItem("phone", this.create_name);
          //保存状态
          localStorage.setItem("loginStatus", 'desk');
          this.timer = setTimeout(() => {
            this.$router.push({path:'/desk_entrust'});
          }, 500)
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
      }, function (error) {
        _this.showLoading = false;
        _this.timeOut = true;
        _this.text = '网络异常';
        console.log(error);
      });
    },
    //验证操作
    fromData(){
      var _this = this;
      this.showLoading = true;
      this.create_name = this.$refs.create_name.value;
      this.create_password = this.$refs.create_password.value;
      this.create_password_again = this.$refs.create_password_again.value;
      this.submit();  //验证
      if(this.isDone){  //验证通过
        var url = this.local+'/api/desk/saveMobilePhone';
        var data = {
          invoice: this.invoice,
          kpjh: this.kpjh,
          mobilePhone: this.create_name,
          loginPassword: this.create_password
        }
        this.$ajaxjp(url, data, true, (response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;
            //创建账号后保存token
            localStorage.setItem("token", response.userid);
            //请求myInfo
            this.myInfo();
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
            return false
          }
          if(response.errcode==1016){   //登录用户失效
            this.showLoading = false;
            this.showInvalid = true;
            this.text = '您的账号已在其他设备登录，请重新登录';
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
    //取消回到首页
    goIndex(){
      this.$router.push({path:'/desk_entrust'});
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
      //密码为空弹窗
      if(!this.create_password){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '密码不能为空';
        this.isDone = false;
        return false
      }
      if(!this.create_password_again){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '确认密码不能为空';
        this.isDone = false;
        return false
      }
      //两次密码是否一致
      if(this.create_password!=this.create_password_again){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '两次密码不一致，请重新输入';
        this.isDone = false;
        return false
      }
      return this.isDone = true;
    },
    //手机号格式判断
    isPhone(){
      this.create_name = this.$refs.create_name.value;
      this.isPhoneAvailable(this.create_name);
      this.text = this.phoneText;
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
