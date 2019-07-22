<template>
  <view-box ref="viewBox" class="my">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <h2 class="header_title">我的</h2>
    </x-header>

    <div class="personWrap marginTop" @click="jumpPerson">
      <div class="personPhoto">
        <img src="../assets/img_my.png" v-if="!img" />
        <img :src="img" v-if="img" />
      </div>
      <p class="personName" v-if="!token">未登录<b class="icon_arrow"></b></p>
      <p class="personName" v-if="token">{{name}}<b class="icon_arrow"></b></p>
    </div>
    <ul class="passwordList">
      <li @click="jumpMyList">
        <img src="../assets/icon_my_wdfp.png" />
        <p class="leftCon">我的发票<b class="icon_arrow"></b></p>
      </li>
      <li @click="jumpMyTitle">
        <img src="../assets/icon_my_ttxx.png" />
        <p class="leftCon">我的抬头信息<b class="icon_arrow"></b></p>
      </li>
    </ul>
    <ul class="passwordList">
      <li @click="jumpPrivacy">
        <img src="../assets/icon_my_yszc.png" />
        <p class="leftCon">隐私政策<b class="icon_arrow"></b></p>
      </li>
      <li class="versionItem" @click="jumpAbout">
        <img src="../assets/icon_my_gy.png" />
        <p class="leftCon">关于<span class="versionNum">版本&nbsp;{{this.version}}<b class="icon_arrow"></b></span></p>
      </li>
    </ul>

    <tabbar
      slot="bottom">
      <tabbar-item link="/">
        <img slot="icon" src="../assets/icon_tabbar_edit.png" v-if="!tabbarEdit">
        <img slot="icon" src="../assets/icon_tabbar_edit_active.png" v-if="tabbarEdit">
        <span slot="label" :class="tabbarEdit? 'activeCon':''">委托开票</span>
      </tabbar-item>
      <tabbar-item link="/list">
        <img slot="icon" src="../assets/icon_tabbar_list.png" v-if="!tabbarList">
        <img slot="icon" src="../assets/icon_tabbar_list_active.png" v-if="tabbarList">
        <span slot="label" :class="tabbarList? 'activeCon':''">发票列表</span>
      </tabbar-item>
      <tabbar-item selected>
        <img slot="icon" src="../assets/icon_tabbar_my.png" v-if="!tabbarMy">
        <img slot="icon" src="../assets/icon_tabbar_my_active.png" v-if="tabbarMy">
        <span slot="label" :class="tabbarMy? 'activeCon':''">我的</span>
      </tabbar-item>
    </tabbar>
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
import Alert from 'vux/src/components/alert/index'
import Confirm from 'vux/src/components/Confirm'

export default {
  name: 'My',
  data(){
    return {
      token: localStorage.getItem("token"),
      name: localStorage.getItem("name"),
      img: localStorage.getItem("img"),
      tabbarList: false,
      tabbarEdit: false,
      tabbarMy: true,
      show: false,
      showAlertLogin: false,
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
    getData(){
      if(this.name==''||this.name=='undefined'||this.name=='null'){
        this.name = '昵称';
      }
      this.img = localStorage.getItem("img");
    },
    jumpPerson(){  //个人信息
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/personal_infor'});
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    jumpMyList(){  //我的发票列表
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/my_list'});
    },
    jumpMyTitle(){  //我的抬头信息
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/my_title_list', query:{isMy:"true"}});
    },
    jumpPrivacy(){  //隐私政策
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/privacy'})
    },
    jumpAbout(){  //关于
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/about'})
    },

    /* ~~ */
    jumpMyService(){  //我的服务
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/my_service'});
    },
    jumpMyExpressList(){  //我的快递信息
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/express_list'});
    },
    jumpContactUs(){  //联系我们
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/contact'});
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
  .my .passwordList{
    background: #fff;
    margin-bottom: 0.32rem;
  }
  .my .passwordList li{
    padding: 0.24rem 0.32rem;
    line-height: 0.6rem;
    border-bottom: 0.01rem solid #f2f2f2;
    display: flex;
    align-items: center;
  }
  .my .passwordList li:last-child{
    border: none;
  }
  .my .passwordList.lxwmList li{
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .my .passwordList img{
    width:0.5rem;
  }
  .my .passwordList .leftCon{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0.18rem;
    box-sizing: border-box;
  }
  .my .personWrap{
    padding: 0.2rem 0.32rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.32rem;
  }
  .my .personPhoto{
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .my .personWrap img{
    width: 1rem;
  }
  .my .personName{
    font-size: 0.3rem;
    color: #333;
    line-height: 0.6rem;
    width: 78%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .versionItem .versionNum{
    line-height: 0.6rem;
    display: flex;
    align-items: center;
  }
</style>
