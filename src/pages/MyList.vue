<template>
  <view-box ref="viewBox" class="my_list">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">我的发票</h2>
    </x-header>

    <v-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      @bottom-status-change="handleBottomChange"
      @top-status-change="handleTopChange"
      :auto-fill="false"
      ref="loadmore"
    >
      <div slot="top" class="mint-loadmore-top">
        <span v-show="topStatus!=='pull'"><inline-loading></inline-loading></span>
      </div>
      <ul class="orderList" v-if="!empty">
        <li
          @click="jumpDetail($event,item,index)"
          v-for="(item,index) in list"
          :data-type="item.fpzl"
        >
          <div class="orderListIcon">
            <img src="../assets/img_list_yes.png" />
          </div>
          <div class="orderListRight">
            <div class="orderListCon">
              <h2 class="orderListConTitle overflowCon">{{item.gfmc}}</h2>
              <p class="orderListConName overflowCon">{{item.spmc}}</p>
              <p v-if="item.fpzl=='t'">
                <span class="orderListConType">电子发票<b>{{item.kprq}}</b></span>
              </p>
              <p v-if="item.fpzl=='c'">
                <span class="orderListConType">普通发票<b>{{item.kprq}}</b></span>
              </p>
              <p v-if="item.fpzl=='s'">
                <span class="orderListConType">专用发票<b>{{item.kprq}}</b></span>
              </p>
            </div>
            <p class="orderListNoun">{{item.jshj}}</p>
          </div>
        </li>
      </ul>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus!=='pull'" :class="{'rotate': bottomStatus === 'drop'}">加载更多...</span>
        <span v-show="bottomStatus==='loading'">Loading...</span>
        <divider v-show="allLoaded">我是有底线的</divider>
      </div>
    </v-loadmore>

    <div class="orderListEmpty" v-if="empty">
      <img src="../assets/img_list_empty.png" />
      <p>还没有发票</p>
    </div>

    <div class="orderListEmpty" v-if="timeOut">
      <img src="../assets/img_list_empty.png" />
      <p>网络异常</p>
      <button class="emptyBtn" @click="tryAgain">请重试</button>
    </div>
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
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Alert from 'vux/src/components/alert'
import Confirm from 'vux/src/components/Confirm'
import Loading from 'vux/src/components/Loading'
import {Loadmore} from 'mint-ui'
import Divider from 'vux/src/components/divider'
import InlineLoading from 'vux/src/components/inline-loading'

export default {
  name: 'MyList',
  data(){
    return{
      list: [],
      fp_text: '',
      empty: false,
      timeOut: false,
      showInvalid: false,
      showLoading: false,
      text: '',
      allLoaded: false,
      topStatus: '',
      bottomStatus: '',
      count: 0,
      page: 0,
      limit: 10
    }
  },
  components:{
    ViewBox,
    XHeader,
    Alert,
    Confirm,
    Loading,
    Divider,
    InlineLoading,
    'v-loadmore':Loadmore
  },
  inject: ['reload'],
  methods:{
    //我的发票列表
    listData(){
      this.showLoading = true;
      var _this = this;
      this.page = 0;
      var url = this.local+'/api/user/fpkj_list';
      var data = {
        userid: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit,
        sign: '1'
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          this.showLoading = false;
          this.count = response.count;
          if(response.fp_list.length>0){
            this.list = response.fp_list;
          }else{
            this.empty = true;
          }
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
          return
        }else{
          this.showLoading = false;
          this.timeOut = true;
          return
        }
      },function (error) {
        _this.showLoading = false;
        _this.timeOut = true;
        console.log(error);
      });
    },
    //more
    moreList(){
      this.page++;
      var url = this.local+'/api/user/fpkj_list';
      var data = {
        userid: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit,
        sign: '1'
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          if(response.fp_list.length>0){
            this.list = this.list.concat(response.fp_list);
          }
        }
      },function (error) {
        console.log(error);
      });
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //请重试
    tryAgain(){
      this.reload();
    },
    //点击li查看详情
    jumpDetail(e,item,index){
      var type = e.currentTarget.getAttribute("data-type");
      if(type=="t"){
        this.$router.push({path:'/electronic_detail',query:{itemData:item,index:index}});
      }else{
        this.$router.push({path:'/paper_detail',query:{itemData:item,index:index}});
      }
    },
    //下拉加载更多
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
  mounted () {
    this.locationData();  //local
    this.listData();
  }
}
</script>

<style lang="less">
  @import "~vux/src/styles/reset.less";
  .my_list .orderList{
    /*margin-top: 62px;*/
    background: #fff;
  }
  .my_list .orderList li{
    padding: 0.12rem 0.3rem 0.1rem 0.32rem;
    display: flex;
  }
  .my_list .orderList li:first-child{
    padding: 0.22rem 0.3rem 0.1rem 0.32rem;
  }
  .orderListIcon{
    width: 0.6rem;
    height: 0.6rem;
    margin-top: 0.08rem;
  }
  .orderListIcon img{
    width: 0.6rem;
    height: 0.6rem;
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
  }
  .my_list .orderList li:last-child .orderListRight{
    border-bottom:none;
  }
  .orderListCon{
    width: 70%;
  }
  .orderListConTitle{
    font-size: 0.3rem;
    line-height: 0.6rem;
    font-weight: 600;
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
    font-size: 0.36rem;
    line-height: 0.6rem;
    font-weight: 800;
    width:30%;
    text-align: right;
  }
  .orderListEmpty{
    font-size: 0.28rem;
    color: #999;
    text-align: center;
    line-height: 0.2rem;
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
</style>
