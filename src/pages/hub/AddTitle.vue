<template>
  <view-box ref="viewBox" class="add_title">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">添加抬头</h2>
    </x-header>
    <ul class="commonList marginTop">
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>抬头类型</p>
        <div class="addBtns">
          <button
            class="addBtnItem"
            :class="title_type==2?'activeBtn':''"
            @click="checkedEnterprises"
          >企业</button>
          <button
            class="addBtnItem"
            :class="title_type==1?'activeBtn':''"
            @click="checkedPersonal"
          >个人</button>
        </div>
      </li>
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>名称</p>
        <input type="text" class="rightInput" ref="name" placeholder="请输入名称" />
      </li>
      <li v-show="type_personal_show">
        <p class="leftCon"><span class="leftLabel">*</span>税号</p>
        <input type="text" class="rightInput" ref="sh" placeholder="请输入税号" />
      </li>
      <li v-show="type_personal_show">
        <p class="leftCon">地址电话</p>
        <input type="text" class="rightInput" ref="dzdh" placeholder="请输入地址电话" />
      </li>
      <li v-show="type_personal_show">
        <p class="leftCon">开户行及账号</p>
        <input type="text" class="rightInput" ref="yhzh" placeholder="请输入开户行及账号" />
      </li>
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>邮箱</p>
        <input type="text" class="rightInput" ref="email" placeholder="请输入邮箱" />
      </li>
      <li>
        <p class="leftCon">联系电话</p>
        <input type="number" class="rightInput" ref="phone" placeholder="请输入联系电话" />
      </li>
    </ul>
    <button class="commonBtn" @click="conserve">保存</button>

    <confirm
      v-model="show"
      title="温馨提醒"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>
    <loading v-model="showLoading" text=""></loading>
    <toast v-model="showToast" type="text">保存成功</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Confirm from 'vux/src/components/confirm/index'
import Loading from 'vux/src/components/loading/index'
import Toast from 'vux/src/components/toast/index'

export default {
  name: 'AddTitle',
  data(){
    return{
      show: false,
      text: '',
      showLoading: false,
      showToast: false,
      popupsStatus: false,
      timer: null,
      title_type: 2,
      type_personal_show: true
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
    showPopups(){
      if(this.popupsStatus){
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    //切换类型
    checkedEnterprises(){
      this.title_type = 2;
      this.type_personal_show = true;
    },
    checkedPersonal(){
      this.title_type = 1;
      this.type_personal_show = false;
    },
    //保存
    conserve(){
      this.submit();
      var _this = this;
      if(this.isDone){ //通过了
        this.showLoading = true;  //loading
        var url = this.local+'/api/user/add_title';
        var data = {
          userid: localStorage.getItem("token"),
          titleType: this.title_type,
          gfmc: this.$refs.name.value,
          gfsh: this.$refs.sh.value,
          gfdzdh: this.$refs.dzdh.value,
          gfyhzh: this.$refs.yhzh.value,
          tel: this.$refs.phone.value,
          email: this.$refs.email.value
        }
        this.$ajaxjp(url, data, true,(response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;
            this.timer = setTimeout(() => {
              this.$router.go(-1);
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
      var sh = this.$refs.sh.value;
      var dzdhVal = this.$refs.dzdh.value.replace(/[^\x00-\xff]/g, "**").length;
      var yhzhVal = this.$refs.yhzh.value.replace(/[^\x00-\xff]/g, "**").length;
      var phone = this.$refs.phone.value;
      var email = this.$refs.email.value;
      //商品名称
      if(!this.$refs.name.value){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '名称不能为空';
        this.isDone = false;
        return false
      }
      //税率
      if(!sh){
        if(this.title_type==2){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '税号不能为空';
          this.isDone = false;
          return false
        }
      }
      //邮箱
      if(!email){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '邮箱不能为空';
        this.isDone = false;
        return false
      }
      //税号格式判断
      if(sh){
        if(this.title_type == 2){
          this.isSh(sh);
          if (this.shFormat) {
            this.popupsStatus = true;
            this.showPopups();
            this.text = this.shText;
            this.isDone = false;
            return false
          }
        }
      }
      //地址电话长度
      if(dzdhVal>100){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '输入地址电话超过最大限制';
        this.isDone = false;
        return false
      }
      //银行账号长度
      if(yhzhVal>100){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '输入开户行及账号超过最大限制';
        this.isDone = false;
        return false
      }
      //手机号格式判断
      if(phone){
        this.isPhoneAvailable(phone);
        if(this.phoneFormat){
          this.popupsStatus = true;
          this.showPopups();
          this.text = this.phoneText;
          this.isDone = false;
          return false
        }
      }
      //邮箱格式判断
      if(email){
        this.isEmail(email);
        if(this.emailFormat){
          this.popupsStatus = true;
          this.showPopups();
          this.text = this.emailText;
          this.isDone = false;
          return false
        }
      }
      return this.isDone = true;
    },
  },
  mounted(){
    this.locationData();  //local
  },
  beforeDestroy(){
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  .add_title .leftCon{
    width: 2rem;
  }
  .add_title .rightInput{
    width: 4.8rem;
  }
  .addBtns{
    display: flex;
  }
  .addBtnItem{
    margin-right: 0.32rem;
    width:1.9rem;
    line-height: 0.6rem;
    border: 0.015rem solid #ccc;
    border-radius: 0.12rem;
    display: block;
    color: #999;
    font-size: 0.28rem;
  }
  .activeBtn{
    color: #ff9900;
    border: 0.015rem solid #ff9900;
  }
</style>
