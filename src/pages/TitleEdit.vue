<template>
  <view-box ref="viewBox" class="title_edit">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback"></p>
      <h2 class="header_title">编辑抬头</h2>
    </x-header>

    <ul class="commonList marginTop">
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>公司名称</p>
        <input type="text" class="rightInput" placeholder="请输入公司名称" v-model="titleData.gfname" ref="gfname" />
      </li>
      <li>
        <p class="leftCon">税号</p>
        <input type="text" class="rightInput" placeholder="请输入税号" v-model="titleData.gfsh" ref="gfsh" />
      </li>
      <li>
        <p class="leftCon">地址电话</p>
        <input type="text" class="rightInput" placeholder="请输入地址电话" v-model="titleData.gfdzdh" ref="gfdzdh">
      </li>
      <li>
        <p class="leftCon">开户行及账号</p>
        <input type="text" class="rightInput" placeholder="请输入开户行及账号" v-model="titleData.gfyhzh" ref="gfyhzh" />
      </li>
    </ul>
    <ul class="titleList commonList">
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>邮箱</p>
        <input type="text" class="rightInput" placeholder="请输入邮箱" v-model="titleData.email" ref="email" />
      </li>
      <li>
        <p class="leftCon">联系电话</p>
        <input type="number" class="rightInput" placeholder="请输入联系电话" v-model="titleData.phone" ref="phone" />
      </li>
    </ul>
    <button class="commonBtn" @click="save">保存</button>
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
    <toast v-model="showToast" type="text">提交成功</toast>
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
  name: 'TitleEdit',
  data() {
    return {
      titleData: [],
      itemData: this.$route.query.itemData,
      itemId: this.$route.query.id,
      isDone: false,
      popupsStatus: false,
      show: false,
      showLoading: false,
      showToast: false,
      text: '',
      showUpdate: false,
      showInvalid: false,
      timer: null,
      fromList: false
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
  beforeRouteEnter(to, from, next){
    if(from.name=='MyTitleList'){
      next(vm => {
        vm.fromList = true;
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
    //获取数据
    getData(){
      this.titleData = this.itemData;
    },
    //点击保存
    save(){
      var _this = this;
      this.submit();  //验证
      if(this.isDone){  //验证通过
        this.showLoading = true;  //loading
        var url = this.local + '/api/user/saveTitle';
        var data = {
          userid: localStorage.getItem("token"),
          id: this.itemId,
          gfname: this.$refs.gfname.value,
          gfsh: this.$refs.gfsh.value,
          gfdzdh: this.$refs.gfdzdh.value,
          gfyhzh: this.$refs.gfyhzh.value,
          email: this.$refs.email.value,
          /*receipt_address: this.$refs.receipt_address.value,
          receiver: this.$refs.receiver.value,*/
          phone: this.$refs.phone.value
        }
        this.$ajaxjp(url, data, true, (response) => {
          if(response.errcode == 0){
            this.showLoading = false;
            this.showToast = true;
            sessionStorage.setItem("titleInfor",JSON.stringify(data));
            this.timer = setTimeout(() => {
              if(this.fromList){
                this.$router.push({path:'/my_title_list?isMy=true'});
              }else{
                this.$router.push({path:'/title_infor',query:{'itemData': data}});
              }
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
        }, function(error){
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
      var gfnameVal = this.$refs.gfname.value.replace(/[^\x00-\xff]/g, "**").length;
      var gfdzdhVal = this.$refs.gfdzdh.value.replace(/[^\x00-\xff]/g, "**").length;
      var gfyhzhVal = this.$refs.gfyhzh.value.replace(/[^\x00-\xff]/g, "**").length;
      //公司名称
      if(!this.$refs.gfname.value){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '公司名称不能为空';
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
      if(this.emailFormat){  //密码格式弹窗
        this.popupsStatus = true;
        this.showPopups();
        this.text = this.emailText;
        this.isDone = false;
        return false
      }
      //手机号格式判断
      if(this.$refs.phone.value){
        this.isPhoneAvailable(this.$refs.phone.value);
        if(this.phoneFormat){
          this.popupsStatus = true;
          this.showPopups();
          this.title = '温馨提示';
          this.text = this.phoneText;
          this.isDone = false;
          return false
        }
      }
      //判断格式
      if(gfnameVal>100){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '输入名称超过最大限制';
        this.isDone = false;
        return false
      }
      //税号
      if(this.$refs.gfsh.value){
        this.isSh(this.$refs.gfsh.value);
        if(this.shFormat){
          this.popupsStatus = true;
          this.showPopups();
          this.title = '温馨提示';
          this.text = this.shText;
          this.isDone = false;
          return false
        }
      }
      //地址电话长度
      if(gfdzdhVal>100){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '输入地址电话超过最大限制';
        this.isDone = false;
        return false
      }
      //银行账号长度
      if(gfyhzhVal>100){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '输入开户行及账号超过最大限制';
        this.isDone = false;
        return false
      }
      return this.isDone = true;
    },
    goback(){
      if(this.fromList){
        this.$router.push({path:'/my_title_list?isMy=true'});
      }else{
        this.$router.push({path:'/title_infor',query:{'itemData': this.titleData}});
      }
    }
  },
  mounted () {
    this.locationData();  //local
    this.getData();
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  .title_edit .leftCon{
    width: 2rem;
  }
  .title_edit .rightInput{
    width: 4.8rem;
  }
  .title_edit .titleList{
    margin-top: 0.32rem;
  }
  .title_edit .commonList li{
    height: auto;
  }
  .title_edit .commonList .rightCon{
    height: auto;
  }
  /*back icon*/
  .header_left{
    position: absolute;
    width: 30px;
    height: 30px;
    top: -5px;
    left: -5px;
  }
  .header_left:before{
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid #fff;
    border-width: 1px 0 0 1px;
    -webkit-transform: rotate(315deg);
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
  }
</style>
