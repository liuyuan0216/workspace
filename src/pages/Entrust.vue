<template>
  <view-box ref="viewBox">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <h2 class="header_title">委托开票</h2>
    </x-header>
    <ul class="entrustList marginTop">
      <li @click="wait">
        <img class="entrustIcon" src="../assets/icon_verb_camera.png" />
        <div class="entrustInfor">
          <h3 class="entrustType">拍照委托</h3>
          <p class="entrustTypeCon">直接拍照发给业务员开票</p>
        </div>
      </li>
      <li @click="jumpBilling">
        <img class="entrustIcon" src="../assets/icon_verb_edit.png" />
        <div class="entrustInfor">
          <h3 class="entrustType">开票委托</h3>
          <p class="entrustTypeCon">自己填写开票信息更精准</p>
        </div>
      </li>
    </ul>

    <tabbar
      slot="bottom">
      <tabbar-item link="/">
        <img slot="icon" src="../assets/icon_tabbar_list.png" v-if="!tabbarList">
        <img slot="icon" src="../assets/icon_tabbar_list_active.png" v-if="tabbarList">
        <span slot="label" :class="tabbarList? 'activeCon':''">发票列表</span>
      </tabbar-item>
      <tabbar-item selected>
        <img slot="icon" src="../assets/icon_tabbar_edit.png" v-if="!tabbarEdit">
        <img slot="icon" src="../assets/icon_tabbar_edit_active.png" v-if="tabbarEdit">
        <span slot="label" :class="tabbarEdit? 'activeCon':''">委托开票</span>
      </tabbar-item>
      <tabbar-item link="my">
        <img slot="icon" src="../assets/icon_tabbar_my.png" v-if="!tabbarMy">
        <img slot="icon" src="../assets/icon_tabbar_my_active.png" v-if="tabbarMy">
        <span slot="label" :class="tabbarMy? 'activeCon':''">我的</span>
      </tabbar-item>
    </tabbar>

    <div class="actionSheet" :class="showActionsheet?'show_actionSheet':''">
      <div class="actionSheet_mark" v-show="showActionsheet" @click="hide_actionSheet"></div>
      <div class="actionSheet_content" :class="showActionsheet?'show_options':''">
        <div class="item_box">
          <div class="item" @click="clickMenu1">从手机相册选择</div>
          <div class="item">拍照</div>
        </div>
        <div class="cancel_action" @click="hide_actionSheet">取消</div>
      </div>
    </div>
    <form id="form" method="post" enctype="multipart/form-data">
      <input type="file" hidden accept="image/*" id="myImg" name="myImg" @change="getObjectURL">
    </form>

    <confirm
      v-model="show"
      title="提示"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>
    <confirm
      v-model="showAlertLogin"
      title="温馨提示"
      confirm-text="确定"
      cancel-text="取消"
      @on-confirm="goLogin"
    >
      {{text}}
    </confirm>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Tabbar from 'vux/src/components/tabbar/tabbar'
import TabbarItem from 'vux/src/components/tabbar/tabbar-item'
import Alert from 'vux/src/components/alert'
import Confirm from 'vux/src/components/Confirm'

export default {
  name: 'Entrust',
  data(){
    return {
      token: localStorage.getItem("token"),
      tabbarList: false,
      tabbarEdit: true,
      tabbarMy: false,
      showActionsheet: false,
      showAlertLogin: false,
      show: false,
      text: ''
    }
  },
  components:{
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Alert,
    Confirm
  },
  methods:{
    //开发中！！
    wait(){
      //this.showActionsheet = true;
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }else{
        this.show = true;
        this.text = '开发中，敬请期待...';
      }
    },
    //点击委托拍照
    clickPhoto(){
      this.showActionsheet = true;
    },
    //选择相册
    clickMenu1(){
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
    //点击开票委托
    jumpBilling(){
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }else{
        this.$router.push({path:'/billing'});
      }
    },
    //获取图片路径
    getObjectURL() {
      this.showActionsheet = false;
      let file = document.getElementById('myImg').files[0];
      let url = null ;
      if(!file){
        return
      }
      if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
      }else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
      }else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
      }
      console.log(url)
    }
  }
}
</script>

<style lang="less">
  @import "~vux/src/styles/reset.less";
  .entrustList{
    padding: 0 0.32rem;
  }
  .entrustList li{
    background: #fff;
    padding: 0.42rem 0.32rem;
    border-radius: 0.12rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.32rem;
  }
  .entrustIcon{
    width:0.6rem;
    height:0.6rem;
  }
  .entrustInfor{
    padding-left: 0.42rem;
  }
  .entrustType{
    color: #333;
    font-size: 0.3rem;
  }
  .entrustTypeCon{
    font-size: 0.28rem;
    color: #999;
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
