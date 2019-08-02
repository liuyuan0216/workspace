<template>
  <view-box ref="viewBox" class="personal_infor">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">个人信息</h2>
    </x-header>

    <div class="personWrap marginTop">
      <p class="personHdCon">头像</p>
      <div class="personHdRight" @click="clickPhoto">
        <div class="personPhoto">
          <img src="../assets/img_my.png" v-if="!img" />
          <img :src="img" v-if="img" />
        </div>
        <b class="icon_arrow"></b>
      </div>
    </div>
    <ul class="passwordList">
      <li>
        <p class="leftCon">用户名<span class="personName">{{name}}</span></p>
      </li>
      <li>
        <p class="leftCon">公司名称<span class="personName">{{company}}</span></p>
      </li>
      <li>
        <p class="leftCon">税号<span class="personName">{{invoice}}</span></p>
      </li>
      <li>
        <p class="leftCon">发票类型<span class="personName">{{fplx}}</span></p>
      </li>
    </ul>
    <ul class="passwordList">
      <li @click="changePassword">
        <p class="leftCon">修改密码<b class="icon_arrow"></b></p>
      </li>
    </ul>
    <button class="commonBtn" @click="uploadImg">保存</button>
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
    <confirm
      v-model="showNoChange"
      title="温馨提醒"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      {{text}}
    </confirm>
    <loading v-model="showLoading" text=""></loading>
    <toast v-model="showToast" type="text">保存成功</toast>
    <form id="form" method="post" enctype="multipart/form-data">
      <input type="file" hidden accept="image/*" id="myImg" name="myImg" @change="getObjectURL">
    </form>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Alert from 'vux/src/components/alert/index'
import Confirm from 'vux/src/components/Confirm'
import Loading from 'vux/src/components/Loading'
import Toast from 'vux/src/components/toast'

export default {
  name: 'PersonalInfor',
  data(){
    return{
      token: localStorage.getItem("token"),
      name: localStorage.getItem("name"),
      img: localStorage.getItem("img"),
      company: localStorage.getItem("company"),
      invoice: localStorage.getItem("invoice"),
      show: false,
      showInvalid: false,
      popupsStatus: false,
      showLoading: false,
      showToast: false,
      showNoChange: false,
      text: '',
      fplx: ''
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
    //初始化显示
    getData(){
      if(this.token){
        this.fplx = '电子发票';
      }else{
        this.$router.push({path:'/my'});
      }
      if(this.name==''||this.name=='undefined'||this.name=='null'){
        this.name = '昵称';
      }
      this.img = localStorage.getItem("img");
    },
    //修改密码
    changePassword(){
      this.$router.push({path:'/change_password'});
    },
    //点击头像
    clickPhoto(){
      document.getElementById("myImg").click();
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //弹窗显示
    showPopups(){
      if(this.popupsStatus){
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
      //没有操作的提示框
      if(this.noChangeStatus){
        this.showNoChange = true;
        this.timer = setTimeout(() => {
          this.showNoChange = false;
        }, 1000)
      }
    },
    //获取图片路径
    getObjectURL() {
      let file = document.getElementById('myImg').files[0];
      let url = null ;
      var fileTypes = [".jpg", ".png", ".jpeg", ".bmp", ".gif", ".webp", ".tiff"];
      if(!file){
        return
      }
      //选择图片以后
      var isNext = false;
      var fileEnd = file.name.substring(file.name.lastIndexOf("."));
      for(var i = 0; i < fileTypes.length; i++){
        if(fileTypes[i] == fileEnd){
          isNext = true;
          break;
        }
      }
      if(!isNext){
        this.popupsStatus = true;
        this.showPopups();
        this.text = "暂不支持后缀名为"+fileEnd+"的图片";
        return false;
      }
      if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
      }else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
      }else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
      }
      this.img = url;
    },
    //上传修改后的头像
    uploadImg() {
      var _this = this;
      let file = document.getElementById('myImg').files[0];
      if(!file){
        this.noChangeStatus = true;
        this.showPopups();
        this.text = '还没做任何修改哦~';
        return false
      }else{
        this.showLoading = true;
      }
      var form = new FormData()
      var url = this.local + '/api/user/uploadImg';
      form.append("userid", localStorage.getItem("token"))
      form.append("myImg", file)
      this.$axios.post(url, form)
        .then(response => {
          if(response.data.errcode==0){
            _this.showLoading = false;
            _this.showToast = true;
            localStorage.setItem("img", response.data.imgUrl);
            this.timer = setTimeout(() => {
              this.$router.push({path:'/my'});
            }, 800)
            return false
          }
          if(response.data.errcode==1003){   //登录用户失效
            _this.showLoading = false;
            _this.showInvalid = true;
            _this.text = '登录用户失效，请重新登录';
            //登录失效 重置
            var local_storage = window.localStorage;
            var session_storage = window.sessionStorage;
            local_storage.clear();  //清除localStorage
            session_storage.clear();  //清除sessionStorage
          }else{
            this.showLoading = false;
            this.popupsStatus = true;
            this.showPopups();
            this.text = response.data.errmsg;
          }
        }).catch(error=>{
        _this.showLoading = false;
        _this.popupsStatus = true;
        _this.showPopups();
        _this.text = '网络异常';
        console.log(error);
      })
    }
  },
  mounted () {
    this.locationData();  //local
    this.getData();
  }
}
</script>

<style lang="less">
  @import "~vux/src/styles/reset.less";
  .personal_infor .passwordList{
    background: #fff;
    margin-bottom: 0.32rem;
  }
  .personal_infor .passwordList li{
    padding: 0.24rem 0.45rem;
    line-height: 0.6rem;
    border-bottom: 0.01rem solid #f2f2f2;
    display: flex;
    align-items: center;
  }
  .personal_infor .passwordList li:last-child{
    border: none;
  }
  .personal_infor .passwordList img{
    width:0.45rem;
  }
  .personal_infor .passwordList .leftCon{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .personal_infor .personWrap{
    padding: 0.2rem 0.45rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.32rem;
  }
  .personal_infor .personPhoto{
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding-left: 0.24rem;
    margin-right: 0.24rem;
  }
  .personal_infor .personWrap img{
    width: 1rem;
  }
  .personal_infor .personName{
    line-height: 0.6rem;
    padding-right: 0.32rem;
  }
  .personHdCon{
    font-size: 0.3rem;
    color: #333;
  }
  .personHdRight{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
