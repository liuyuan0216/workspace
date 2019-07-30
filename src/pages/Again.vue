<template>
  <view-box ref="viewBox" class="again">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">重新推送</h2>
    </x-header>
    <ul class="passwordList marginTop">
      <li>
        <p class="leftCon">电子邮箱</p>
        <input class="rightInput" placeholder="请输入邮箱" v-model="email" ref="email" />
      </li>
    </ul>
    <p class="passwordPrompt">说明：您可以填写新的邮箱地址，点击提交后，系统会给您重新发送电子发票。</p>
    <button class="commonBtn" @click="send">提交</button>
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
import Alert from 'vux/src/components/alert'
import Confirm from 'vux/src/components/Confirm'
import Loading from 'vux/src/components/Loading'
import Toast from 'vux/src/components/toast'

export default {
  name: 'Again',
  data(){
    return{
      fphm: this.$route.query.fphm,
      fpdm: this.$route.query.fpdm,
      email: this.$route.query.email,
      pdf_id: this.$route.query.pdf_id,
      isDone: false,
      popupsStatus: false,
      show: false,
      showLoading: false,
      timer: null,
      text: '',
      showUpdate: false,
      showInvalid: false,
      showToast: false
    }
  },
  components:{
    ViewBox,
    XHeader,
    Alert,
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
    //重新发送请求
    send(){
      var _this = this;
      this.submit();
      if(this.isDone){  //验证通过
        this.showLoading = true;  //loading
        var url = this.local+'/api/user/sendpdf';
        var data = {
          userid: localStorage.getItem("token"),
          fphm: this.fphm,  //号码
          fpdm: this.fpdm,  //代码
          email: this.$refs.email.value,
          pdf_id: this.pdf_id
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
          }
          if(response.errcode==2015){   //pdf_id不能为空
            this.showLoading = false;
            this.popupsStatus = true;
            this.showPopups();
            this.text = '';
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
    //表单验证
    submit(){
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
      //pdf_id为空的话
      if(!this.pdf_id){
        this.popupsStatus = true;
        this.showPopups();
        this.text = 'PDF文件没有生成';
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
    padding: 0.24rem 0.32rem;
    line-height: 0.6rem;
    border-bottom: 0.01rem solid #f2f2f2;
    display: flex;
    align-items: center;
  }
  .passwordList li:last-child{
    border: none;
  }
  .again .passwordPrompt{
    font-size: 0.26rem;
    line-height: 0.34rem;
    color: #ccc;
    padding: 0 0.32rem;
  }
</style>
