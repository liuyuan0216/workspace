<template>
  <view-box ref="viewBox" class="all_list">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="right" class="header_right" @click="tryAgain">刷新</p>
      <h2 class="header_title">发票列表</h2>
    </x-header>
    <div v-if="!empty">
      <v-loadmore
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        @bottom-status-change="handleBottomChange"
        @top-status-change="handleTopChange"
        :auto-fill="false"
        ref="loadmore"
        class="loadmore"
      >
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus!=='pull'"><inline-loading></inline-loading></span>
        </div>
        <ul class="orderList">
          <li
            @click="jumpDetail($event,item,index)"
            v-for="(item,index) in list"
            :data-type="item.fpzl"
          >
            <div class="orderListIcon" v-if="item.sign=='1'">
              <img src="../assets/img_list_yes.png" />
            </div>
            <div class="orderListIcon" v-if="item.sign=='0'&&!item.qrcode_url">
              <img src="../assets/img_list_no.png" />
            </div>
            <div class="orderListIcon" v-if="item.sign=='0'&&item.qrcode_url">
              <img src="../assets/img_list_nosm.png" />
            </div>
            <div class="orderListRight">
              <div class="orderListCon">
                <h2 class="orderListConTitle overflowCon" v-if="!item.qrcode_url">{{item.gfmc}}</h2>
                <h2 class="orderListConTitle overflowCon" v-if="item.qrcode_url">暂无（消费者未扫码）</h2>
                <p class="orderListConName overflowCon">{{item.spmc}}</p>
                <p v-if="item.fpzl=='t'">
                  <span class="orderListConType">电子发票<b>{{item.create_time}}</b></span>
                </p>
                <p v-if="item.fpzl=='c'">
                  <span class="orderListConType">普通发票<b>{{item.create_time}}</b></span>
                </p>
                <p v-if="item.fpzl=='s'">
                  <span class="orderListConType">专用发票<b>{{item.create_time}}</b></span>
                </p>
              </div>
              <p class="orderListNoun">{{item.jshj}}<span class="redMark" v-if="item.readFlag=='0'"></span></p>
            </div>
          </li>
        </ul>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomStatus!=='pull'" :class="{'rotate': bottomStatus === 'drop'}">加载更多...</span>
          <span v-show="bottomStatus==='loading'">Loading...</span>
          <divider v-show="allLoaded">我是有底线的</divider>
        </div>
      </v-loadmore>
    </div>
    <div class="orderListEmpty marginTop" v-if="empty">
      <img src="../assets/img_list_empty.png" />
      <p>还没有订单</p>
      <button class="emptyBtn" @click="setBilling">立即添加</button>
    </div>
    <!--<confirm
      v-model="showInvalid"
      title="温馨提醒"
      confirm-text="去重新登录"
      :show-cancel-button="false"
      @on-confirm="goLogin"
    >
      {{text}}
    </confirm>-->

    <confirm
      v-model="showAlertLogin"
      title="温馨提示"
      confirm-text="确定"
      cancel-text="取消"
      @on-confirm="goLogin"
    >
      {{text}}
    </confirm>
    <div class="orderListEmpty" v-if="showInvalid">
      <img src="../assets/img_list_empty.png" />
      <p>登录用户失效，请重新登录</p>
      <button class="emptyBtn" @click="goLogin">重新登录</button>
    </div>

    <div class="orderListEmpty" v-if="timeOut">
      <img src="../assets/img_list_empty.png" />
      <p>网络异常</p>
      <button class="emptyBtn" @click="tryAgain">请重试</button>
    </div>
    <loading v-model="showLoading" text=""></loading>
    <tabbar
      slot="bottom">
      <tabbar-item link="/">
        <img slot="icon" src="../assets/icon_tabbar_edit.png" v-if="!tabbarEdit">
        <img slot="icon" src="../assets/icon_tabbar_edit_active.png" v-if="tabbarEdit">
        <span slot="label" :class="tabbarEdit? 'activeCon':''">委托开票</span>
      </tabbar-item>
      <tabbar-item selected>
        <img slot="icon" src="../assets/icon_tabbar_list.png" v-if="!tabbarList">
        <img slot="icon" src="../assets/icon_tabbar_list_active.png" v-if="tabbarList">
        <span slot="label" :class="tabbarList? 'activeCon':''">发票列表</span>
      </tabbar-item>
      <tabbar-item link="my">
        <img slot="icon" src="../assets/icon_tabbar_my.png" v-if="!tabbarMy">
        <img slot="icon" src="../assets/icon_tabbar_my_active.png" v-if="tabbarMy">
        <span slot="label" :class="tabbarMy? 'activeCon':''">我的</span>
      </tabbar-item>
    </tabbar>
    <!--<ul class="mint-tab">
      <li class="mint-button" @click="activeTab1">tab1</li>
      <li class="mint-button" @click="activeTab2">tab2</li>
      <li class="mint-button" @click="activeTab3">tab3</li>
    </ul>
    <mt-tab-container v-model="active" swipeable>
      <mt-tab-container-item id="tab-container1">
        <ul title="tab-container 1">
          <li class="mint-cell" v-for="n in 10">这是第一条</li>
        </ul>
      </mt-tab-container-item>
      <mt-tab-container-item id="tab-container2">
        <ul title="tab-container 2">
          <li class="mint-cell" v-for="n in 4">这是第二条</li>
        </ul>
      </mt-tab-container-item>
      <mt-tab-container-item id="tab-container3">
        <ul title="tab-container 3">
          <li class="mint-cell" v-for="n in 7">这是第三条</li>
        </ul>
      </mt-tab-container-item>
    </mt-tab-container>-->
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Tabbar from 'vux/src/components/tabbar/tabbar'
import TabbarItem from 'vux/src/components/tabbar/tabbar-item'
import Alert from 'vux/src/components/alert'
import Confirm from 'vux/src/components/Confirm'
import Loading from 'vux/src/components/Loading'
import {Loadmore} from 'mint-ui'
import Divider from 'vux/src/components/divider'
import InlineLoading from 'vux/src/components/inline-loading'
import { TabContainer, TabContainerItem } from 'mint-ui';


export default {
  name: 'OrderList',
  data(){
    return {
      token: localStorage.getItem("token"),
      tabbarList: true,
      tabbarEdit: false,
      tabbarMy: false,
      empty: false,
      timeOut: false,
      list: [],
      showInvalid: false,
      showAlertLogin: false,
      showLoading: false,
      showPopstate: false,
      text: '',
      allLoaded: false,
      topStatus: '',
      bottomStatus: '',
      count: 0,
      page: 0,
      limit: 10,
      scrollTop: 0,
      came: false,
      readFlag: '',
      active: 'tab-container1'
    }
  },
  components:{
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Alert,
    Confirm,
    Loading,
    Divider,
    InlineLoading,
    'v-loadmore':Loadmore,
    'mt-tab-container':TabContainer,
    'mt-tab-container-item':TabContainerItem
  },
  inject: ['reload'],
  beforeRouteEnter(to, from, next){
    if(from.name=='Entrust'||from.name=='My'||from.name=='ElectronicDetail'||from.name=='PaperDetail'){
      next(vm => {
        vm.token = localStorage.getItem("token");
        if(vm.token){
          vm.came = sessionStorage.getItem("came");
          if(!vm.came){
            vm.empty = false;
            vm.list = [];
            vm.showLoading = true;
            vm.listData();
          }else{
            var listIndex = sessionStorage.getItem("listIndex");
            if(listIndex){
              if(vm.list[listIndex].sign=='1'){
                vm.list[listIndex].readFlag = '1';
              }
            }
          }
          return
        }else{
          vm.listData();
        }
      });
    }else{
      next(vm => {
        vm.token = localStorage.getItem("token");
        vm.empty = false;
        vm.showLoading = true;
        vm.listData();
      })
    }
  },
  beforeRouteLeave(to, from, next){
    this.scrollTop = this.$refs.viewBox.getScrollTop();
    this.$store.commit('changeRecruitScrollY', this.scrollTop);
    this.token = localStorage.getItem("token");
    if(this.token){
      sessionStorage.setItem("came", "true");
    }
    next();
  },
  watch:{
    $route(to, from){
      if(to.name==='OrderList'){
        if(from.name=='SwitchMode'||from.name=='Billing'||from.name=='CodeInfor'){
          return
        }else{
          this.$nextTick(() => {
            this.$refs.viewBox.scrollTo(this.$store.getters.recruitScrollY);
          })
        }
      }
    }
  },
  methods:{
    activeTab1(){
      this.active = 'tab-container1';
    },
    activeTab2(){
      this.active = 'tab-container2';
    },
    activeTab3(){
      this.active = 'tab-container3';
    },


    //发票列表
    listData(){
      if(!this.token){
        this.empty = true;
        this.timeOut = false;
        this.showInvalid = false;
        return
      }
      var _this = this;
      this.page = 0;
      var url = this.local+'/api/user/fp_list';
      this.data = {
        userid: this.token,
        page: this.page,
        limit: this.limit
      }
      this.$ajaxjp(url, this.data, true, (response) =>{
        if(response.errcode==0){
          _this.showLoading = false;
          _this.count = response.count;
          if(response.fp_list.length>0){
            _this.timeOut = false;
            _this.list = response.fp_list;
          }else{
            _this.empty = true;
          }
          return false
        }
        if(response.errcode==1003){   //登录用户失效
          this.showLoading = false;
          this.empty = false;
          this.timeOut = false;
          this.showInvalid = true;
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
          return
        }else{
          this.showLoading = false;
          this.empty = false;
          this.timeOut = true;
          return
        }
      },function (error) {
        _this.showLoading = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.list = [];
        console.log(error);
      });
    },
    //more
    moreList(){
      this.page++;
      var _this = this;
      var url = this.local+'/api/user/fp_list';
      var data = {
        userid: this.token,
        page: this.page,
        limit: this.limit
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          if(response.fp_list.length>0){
            this.list = this.list.concat(response.fp_list);
          }
        }
      },function (error) {
        _this.showLoading = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.list = [];
        console.log(error);
      });
    },
    //更新已读列表
    updateReadFlag(item,index){
      var _this = this;
      var url = this.local+'/api/user/updateReadFlag';
      var data = {
        userid: this.token,
        id: item.id,
        readFlag: '1'
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          this.$router.push({path:'/electronic_detail',query:{itemData:item,index:index}});
        }
      },function (error) {
        _this.showLoading = false;
        console.log(error);
      });
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //点击li查看详情
    jumpDetail(e,item,index){
      var type = e.currentTarget.getAttribute("data-type");
      sessionStorage.setItem("listIndex",index);
      if(type=="t"){
        this.updateReadFlag(item,index);
      }else{
        this.$router.push({path:'/paper_detail',query:{itemData:item,index:index}});
      }
    },
    //去开票
    setBilling(){
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/'});
    },
    //请重试
    tryAgain(){
      //this.reload();
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.showLoading = true;
      this.listData();
      this.$refs.viewBox.scrollTo(0);
    },
    //上拉加载更多
    loadBottom(){
      if(this.list.length < this.count){
        this.moreList();
      }else{
        this.allLoaded = true;
      }
      this.$refs.loadmore.onBottomLoaded();
    },
    handleBottomChange(status){
      this.bottomStatus = status;
    },
    //下拉刷新
    loadTop(){
      this.listData();
      this.$refs.loadmore.onTopLoaded();
    },
    handleTopChange(status){
      this.topStatus = status;
    }
  },
  mounted(){
    this.locationData();  //local
    this.listData();
  }
}
</script>

<style lang="less">
  @import "~vux/src/styles/reset.less";
  .all_list .orderList{
    background: #fff;
    position: relative;
    top: 0;
  }
  .all_list .orderList li{
    padding: 0.12rem 0.3rem 0.1rem 0.32rem;
    display: flex;
  }
  .all_list .orderList li:first-child{
    padding: 0.22rem 0.3rem 0.1rem 0.32rem;
  }
  .all_list .orderList li:last-child{
    margin-bottom: 0.32rem;
  }
  .orderListIcon{
    width: 0.6rem;
    height: 0.6rem;
    margin-top: 0.08rem;
  }
  .orderListIcon img{
    width: 0.6rem;
    display: block;
  }
  .orderListRight{
    display: flex;
    justify-content: space-between;
    color: #333;
    margin-left: 0.32rem;
    border-bottom: 0.01rem solid #f2f2f2;
    width: 5.8rem;
    padding-bottom: 0.16rem;
    position: relative;
  }
  .all_list .orderList li:last-child .orderListRight{
    border-bottom:none;
  }
  .orderListCon{
    width: 70%;
  }
  .orderListConTitle{
    font-size: 0.3rem;
    line-height: 0.6rem;
    font-weight: 500;
    color: #000;
  }
  .orderListConName{
    font-size: 0.26rem;
    line-height: 0.45rem;
    color: #333;
  }
  .orderListConType{
    display: block;
    font-size: 0.24rem;
    line-height: 0.28rem;
    color: #999;
    padding-top: 0.1rem;
    padding-bottom: 0.18rem;
  }
  .orderListConType b{
    font-weight: normal;
    padding-left: 0.1rem;
  }
  .orderListNoun{
    font-size: 0.38rem;
    line-height: 0.6rem;
    font-weight: 600;
    width:30%;
    text-align: right;
  }
  .orderListEmpty{
    font-size: 0.28rem;
    color: #999;
    text-align: center;
    line-height: 0.2rem;
    position: relative;
    z-index: 99;
  }
  .emptyBtn{
    font-size: 0.28rem;
    color: #fff;
    text-align: center;
    width: 2rem;
    height: 0.6rem;
    line-height: 0.6rem;
    background: #ff9900;
    border: none;
    border-radius: 0.08rem;
    margin-top: 0.6rem;
  }
  .loadmore{
    position: relative;
    top: 0;
  }
  .redMark{
    display: block;
    background: #ff0000;
    width: 0.145rem;
    height: 0.145rem;
    border-radius: 50%;
    position: absolute;
    top: -0.05rem;
    right: -0.18rem;
  }

  /* mint-tab */
  .mint-tab{
    display: flex;
  }
  .mint-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 4px;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    font-size: 18px;
    height: 41px;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center
  }
  .mint-button::after {
    background-color: #000;
    content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute
  }
  .mint-button:not(.is-disabled):active::after {
    opacity: .4
  }
  .mint-tab-container {
    overflow: hidden;
    position: relative;
  }
  .mint-tab-container-wrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .mint-tab-container-item {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: 100%
  }
  .mint-cell {
    background-color:#fff;
    box-sizing:border-box;
    color:inherit;
    min-height:48px;
    display:block;
    overflow:hidden;
    position:relative;
    text-decoration:none;
  }
  .mint-tab-container .swipe-transition {
    -webkit-transition: -webkit-transform 150ms ease-in-out;
    transition: -webkit-transform 150ms ease-in-out;
    transition: transform 150ms ease-in-out;
    transition: transform 150ms ease-in-out, -webkit-transform 150ms ease-in-out;
  }
</style>
