<template>
  <view-box ref="viewBox" class="goodsList">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback"></p>
      <p slot="right" class="header_right" v-if="isMy=='true'" @click="jumpAddGoods">添加商品</p>
      <h2 class="header_title" v-if="!isMy">选择商品</h2>
      <h2 class="header_title" v-if="isMy=='true'">我的商品信息</h2>
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
      <div class="listWrap">
        <div class="titleList" v-if="haveList">
          <span>商品</span>
          <span>税率</span>
          <span>规格型号</span>
        </div>
        <ul class="goodsList" v-if="!empty">
          <li v-for="(item,index) in list" @click="jumpBilling(item,index)">
            <span class="overflowCon">{{item.spmc}}</span>
            <span>{{(item.slv)*100+'%'||'-'}}</span>
            <span>{{item.ggxh||'-'}}</span>
          </li>
        </ul>
      </div>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus!=='pull'" :class="{'rotate': bottomStatus === 'drop'}">加载更多...</span>
        <span v-show="bottomStatus==='loading'">Loading...</span>
        <divider v-show="allLoaded">我是有底线的</divider>
      </div>
    </v-loadmore>

    <div class="orderListEmpty marginTop" v-if="empty">
      <img src="../assets/img_list_empty.png" />
      <p>还没有商品</p>
    </div>
    <div class="orderListEmpty marginTop" v-if="timeOut">
      <img src="../assets/img_list_empty.png" />
      <p>网络超时</p>
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
  name: 'GoodsList',
  data(){
    return{
      isMy: this.$route.query.isMy,
      list: [],
      showInvalid: false,
      text: '',
      empty: false,
      timeOut: false,
      haveList: false,
      allLoaded: false,
      showLoading: false,
      topStatus: '',
      bottomStatus: '',
      count: 0,
      page: 0,
      limit: 20
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
    //列表数据
    listData(){
      this.showLoading = true;
      var _this = this;
      this.page = 0;
      if(this.isMy){
        var url = this.local + '/api/user/sp_list_all';
        var data = {
          userid: localStorage.getItem("token")
        }
      }else{
        var url = this.local + '/api/user/sp_list_fm';
        var data = {
          userid: localStorage.getItem("token"),
          page: this.page,
          limit: this.limit
        }
      }
      this.$ajaxjp(url, data, true, (response) => {
        if (response.errcode == 0) {
          this.showLoading = false;
          this.count = response.count;
          if(response.sp_list.length>0){
            this.haveList = true;
            this.list = response.sp_list;
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
        }
      }, function (error) {
        _this.showLoading = false;
        _this.timeOut = true;
        console.log(error);
      });
    },
    //more
    moreList(){
      this.page++;
      var url = this.local + '/api/user/sp_list';
      var data = {
        userid: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit
      }
      this.$ajaxjp(url, data, true, (response) => {
        if (response.errcode == 0) {
          this.count = response.count;
          if(response.sp_list.length>0){
            this.list = this.list.concat(response.sp_list);
          }
        }
      }, function (error) {
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
    //选择商品
    jumpBilling(item,index){
      if(!this.isMy){
        this.$router.push({path:'/edit_goods',query:{itemGoodsData:item,itemGoodsIndex:index}});
      }else{
        sessionStorage.setItem("goodsStatus","edit");
        this.$router.push({path:'/add_goods?isMy=true',query:{itemGoodsData:item}});
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
    },
    //跳转添加商品
    jumpAddGoods(){
      sessionStorage.setItem("goodsStatus","add");
      this.$router.push({path:'/add_goods?isMy=true'});
    },
    goback(){
      if(this.isMy){
        this.$router.push({path:'/my'});
      }else{
        this.$router.push({path:'/edit_goods'});
      }
    }
  },
  mounted () {
    this.locationData();  //local
    this.listData();
  }
}
</script>

<style scoped>
  .titleList span:last-child,.goodsList span:last-child{
    border-right:none;
  }
  .titleList{
    background: #fff;
    width: 100%;
    display: flex;
    height: 0.8rem;
    line-height: 0.8rem;
    color: #999;
  }
  .titleList span{
    border-top: 0.01rem solid #f2f2f2;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .titleList span,.goodsList li span{
    display: inline-block;
    font-size: 0.3rem;
    width:25%;
    text-align: center;
    border-right: 0.01rem solid #f2f2f2;
    box-sizing: border-box;
  }
  .goodsList li span:first-child{
    text-align: left;
  }
  .titleList span:first-child,.goodsList li span:first-child{
    width:50%;
    padding: 0 0.2rem;
    box-sizing: border-box;
  }
  .goodsList{
    background: #fff;
    /*border-top: 0.01rem solid #f2f2f2;*/
    padding-bottom: 0.2rem;
  }
  .goodsList li{
    color: #333;
    width: 100%;
    display: flex;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .goodsList li span{
    font-size: 0.28rem;
  }
  .orderListEmpty{
    font-size: 0.28rem;
    color: #999;
    text-align: center;
    line-height: 0.2rem;
  }
  .emptyBtn {
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
