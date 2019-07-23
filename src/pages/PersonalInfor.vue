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
    <button class="commonBtn" @click="clickOut">退出登录</button>

    <confirm
      v-model="showAlert"
      title="提示"
      confirm-text="确定"
      cancel-text="取消"
      @on-confirm="logout"
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
      v-model="show"
      :title="title"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>

    <form id="form" method="post" enctype="multipart/form-data">
      <input type="file" hidden accept="image/*" id="myImg" name="myImg" @change="getObjectURL">
    </form>

    <!--<div class="actionSheet" :class="showActionsheet?'show_actionSheet':''">
      <div class="actionSheet_mark" v-show="showActionsheet" @click="hide_actionSheet"></div>
      <div class="actionSheet_content" :class="showActionsheet?'show_options':''">
        <div class="item_box">
          <div class="item">从手机相册选择</div>
          <div class="item">拍照</div>
        </div>
        <div class="cancel_action" @click="hide_actionSheet">取消</div>
      </div>
    </div>-->
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Alert from 'vux/src/components/alert/index'
import Confirm from 'vux/src/components/Confirm'

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
      showAlert: false,
      showActionsheet: false,
      showInvalid: false,
      popupsStatus: false,
      text: '',
      title: '提示',
      fplx: ''
    }
  },
  components:{
    ViewBox,
    XHeader,
    Alert,
    Confirm
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
    //取消
    hide_actionSheet() {
      this.showActionsheet = false;
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //点击退出
    clickOut(){
      this.showAlert = true;
      this.text = '确定要退出登录吗？';
    },
    //弹窗显示
    showPopups(){
      if(this.popupsStatus){
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    //退出登录
    logout(){
      var _this = this;
      var url = this.local+'/api/user/logout';
      var data = {
        userid: localStorage.getItem("token")
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
          //退出后跳转到登录页
          this.$router.push({path: '/login'});
        }
      },function (error) {
        _this.popupsStatus = true;
        _this.showPopups();
        _this.title = '温馨提示';
        _this.text = '网络异常';
      });
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
      localStorage.setItem("img", url);
      this.uploadImg();
    },
    //上传修改后的头像
    uploadImg() {
      var _this = this;
      let file = document.getElementById('myImg').files[0];
      var form = new FormData()
      var url = this.local + '/api/user/uploadImg';
      form.append("userid", localStorage.getItem("token"))
      form.append("myImg", file)
      this.$axios.post(url, form)
        .then(response => {
          if(response.data.errcode==0){
            localStorage.setItem("img", response.data.imgUrl);
            return false
          }
          if(response.data.errcode==1003){   //登录用户失效
            _this.showInvalid = true;
            _this.text = '登录用户失效，请重新登录';
            //登录失效 重置
            var local_storage = window.localStorage;
            var session_storage = window.sessionStorage;
            local_storage.clear();  //清除localStorage
            session_storage.clear();  //清除sessionStorage
          }else{
            this.popupsStatus = true;
            this.showPopups();
            this.text = response.data.errmsg;
          }
        }).catch(error=>{
        _this.popupsStatus = true;
        _this.showPopups();
        _this.title = '温馨提示';
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
  .actionSheet{
    visibility: hidden;
    transition-delay: 0.2s;
    text-align: center;
    transition: .3s ease;
  }
  .actionSheet_mark{
    background: rgba(0, 0, 0, 0.6);
    width:100%;
    height:100%;
    position: fixed;
    top: 0;
    z-index: 2000;
  }
  .show_actionSheet{
    visibility: visible;
  }
  .actionSheet_content{
    width:100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2001;
    background-color: #EFEFF4;
    visibility: hidden;
    transform: translate(0,100%);
    transition: .3s ease;
    font-size: 0.34rem;
    color: #333;
  }
  .show_options{
    visibility: visible;
    transform: translate(0,0%);
  }
  .actionSheet .item_box{
    margin-bottom: 5px;
  }
  .actionSheet .cancel_action{
    background: #fff;
    padding: 10px 0;
  }
  .actionSheet .item:active,.actionSheet .cancel_action:active{
    opacity: 0.7;
  }
  .actionSheet .item{
    border-bottom: 0.01rem solid #f2f2f2;
    padding: 10px 0;
    background: #fff;
  }
  .actionSheet .item:last-child{
    border: 0px;
  }
</style>
