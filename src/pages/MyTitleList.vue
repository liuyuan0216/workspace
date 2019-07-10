<template>
  <view-box ref="viewBox" class="my_title_list">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">我的发票抬头</h2>
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
      <ul class="titleList" :class="!isMy ? 'titleListStyle':''" v-if="!empty">
        <li
          @click="jumpTitleInfor(item,item.id)"
          v-for="(item,index) in titleList"
          :key="index"
        >
          <h3 class="titleName overflowCon">{{item.gfname}}</h3>
          <p class="titleNum"><span v-if="item.gfsh">税号：</span>{{item.gfsh}}</p>
          <p
            class="titleEdit"
            @click.stop="jumpTitleEdit(item,item.id)"
            v-if="isMy=='true'"
          >编辑</p>
        </li>
      </ul>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus!=='pull'" :class="{'rotate': bottomStatus === 'drop'}">加载更多...</span>
        <span v-show="bottomStatus==='loading'">Loading...</span>
        <divider v-show="allLoaded">我是有底线的</divider>
      </div>
    </v-loadmore>

    <div class="listEmpty marginTop" v-if="empty">
      <img src="../assets/img_list_empty.png" />
      <p>还没有抬头</p>
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
  name: 'MyTitleList',
  data(){
    return{
      titleList: [],
      empty: false,
      timeOut: false,
      isMy: this.$route.query.isMy,
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
    //我的抬头列表
    listData(){
      this.showLoading = true;
      var _this = this;
      this.page = 0;
      var url = this.local+'/api/user/title_list';
      var data = {
        userid: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          this.showLoading = false;
          this.count = response.count;
          if(response.title_list.length>0){
            this.titleList = response.title_list;
          }else{
            this.empty = true;
          }
        }
        if(response.errcode==1003){   //登录用户失效
          this.showLoading = false;
          this.showInvalid = true;
          this.text = '登录用户失效，请重新登录';
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
      var url = this.local+'/api/user/title_list';
      var data = {
        userid: localStorage.getItem("token"),
        page: this.page,
        limit: this.limit
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          if(response.title_list.length>0){
            this.titleList = this.titleList.concat(response.title_list);
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
    //抬头详情
    jumpTitleInfor(item,id){
      if(this.isMy=="true"){
        this.$router.push({path:'/title_infor',query:{itemData:item,id:id}});
      }else{
        this.$router.push({path:'/billing',query:{itemTitleData:item}});
      }
    },
    //编辑
    jumpTitleEdit(item,id){
      this.$router.push({path:'/title_edit',query:{itemData:item,id:id}});
      return false;
    },
    //下拉加载更多
    loadBottom(){
      if(this.titleList.length < this.count){
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

<style scoped>
  .titleList{
    padding: 0 0.32rem;
  }
  .titleList li{
    background: #fff;
    padding: 0.32rem;
    border-radius: 0.12rem;
    margin-bottom: 0.32rem;
    position: relative;
  }
  .titleName{
    font-size: 0.32rem;
    line-height: 0.6rem;
    font-weight: bold;
    color: #333;
  }
  .titleNum{
    font-size: 0.28rem;
    height: 0.42rem;
    line-height: 0.42rem;
    color: #999;
    padding-top: 0.12rem;
  }
  .titleEdit{
    width: 1.5rem;
    text-align: center;
    position: absolute;
    right: 0;
    top: 0.4rem;
    font-size: 0.28rem;
    color: #333;
    height: 1rem;
    line-height: 1rem;
    border-left: 0.01rem solid #f2f2f2;
  }
  .my_title_list .titleName{
    width: 4.2rem;
  }
  .listEmpty{
    font-size: 0.28rem;
    color: #999;
    text-align: center;
    line-height: 0.2rem;
  }
  .orderListEmpty {
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
  .titleListStyle li .titleName{
    width: auto;
  }
</style>
