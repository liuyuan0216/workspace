<template>
  <view-box ref="viewBox">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">修改密码</h2>
    </x-header>
    <ul class="passwordList marginTop">
      <li>
        <p class="leftCon">旧密码</p>
        <input type="password" class="rightInput" placeholder="请输入旧密码" ref="login_password"/>
      </li>
      <li>
        <p class="leftCon">新密码</p>
        <input type="password" class="rightInput" placeholder="请输入新密码" ref="new_password"/>
      </li>
      <li>
        <p class="leftCon">确认密码</p>
        <input type="password" class="rightInput" placeholder="请再次输入新密码" ref="new_password_again"/>
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
      v-model="showUpdate"
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
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Alert from 'vux/src/components/alert'
import Confirm from 'vux/src/components/Confirm'
import Loading from 'vux/src/components/Loading'

export default {
  name: 'ChangePassword',
  data(){
    return{
      popupsStatus: false,
      show: false,
      showLoading: false,
      text: '',
      login_password: '',
      new_password: '',
      new_password_again: '',
      isDone: false,
      timer: null,
      showUpdate: false,
      showInvalid: false
    }
  },
  components:{
    ViewBox,
    XHeader,
    Alert,
    Confirm,
    Loading
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
    //验证操作
    fromData(){
      var _this = this;
      this.showLoading = true;
      this.login_password = this.$refs.login_password.value;
      this.new_password = this.$refs.new_password.value;
      this.new_password_again = this.$refs.new_password_again.value;
      this.submit();  //验证
      if(this.isDone){  //验证通过
        var url = this.local+'/api/user/updatePwd';  //修改密码
        var data = {
          userid: localStorage.getItem("token"),
          login_password: this.login_password,
          new_password: this.new_password
        }
        this.$ajaxjp(url, data, true, (response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            //sessionStorage.setItem("isDropOut",true);
            this.showUpdate = true;
            this.text = '修改密码成功！';
          }
          if(response.errcode==1003){   //登录用户失效
            this.showLoading = false;
            this.showInvalid = true;
            this.text = '登录用户失效，请重新登录';
          }
          if(response.errcode==1004){   //原密码不正确
            this.showLoading = false;
            this.popupsStatus = true;
            this.showPopups();
            this.text = '旧密码不正确，请重新输入';
          }
          if(response.errcode==1007){   //手机号不存在
            this.showLoading = false;
            this.popupsStatus = true;
            this.showPopups();
            this.text = '该手机号不存在，请重新输入';
          }
        },function (error) {
          _this.showLoading = false;
          _this.popupsStatus = true;
          _this.showPopups();
          _this.title = '温馨提示';
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
      //密码为空弹窗
      if(!this.login_password){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '旧密码不能为空';
        this.isDone = false;
        return false
      }
      if(!this.new_password){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '新密码不能为空';
        this.isDone = false;
        return false
      }
      if(!this.new_password_again){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '确认密码不能为空';
        this.isDone = false;
        return false
      }
      //两次密码是否一致
      if(this.login_password==this.new_password){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '新密码和旧密码不能一致';
        this.isDone = false;
        return false
      }
      //旧密码
      // this.isPssword(this.login_password);
      // if(this.passwordFormat){  //密码格式弹窗
      //   this.popupsStatus = true;
      //   this.showPopups();
      //   this.text = '请输入正确的旧密码';
      //   return false
      // }
      //新密码
      this.isPssword(this.new_password);
      if(this.passwordFormat){  //密码格式弹窗
        this.popupsStatus = true;
        this.showPopups();
        this.text = '请输入正确的新密码';
        this.isDone = false;
        return false
      }
      //两次密码是否一致
      if(this.new_password!=this.new_password_again){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '两次密码不一致，请重新输入';
        this.isDone = false;
        return false
      }
      return this.isDone = true;
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
    margin-bottom: 0.32rem;
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
