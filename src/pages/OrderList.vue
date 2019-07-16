<template>
  <view-box ref="viewBox" class="all_list">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
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
      <tabbar-item selected>
        <img slot="icon" src="../assets/icon_tabbar_list.png" v-if="!tabbarList">
        <img slot="icon" src="../assets/icon_tabbar_list_active.png" v-if="tabbarList">
        <span slot="label" :class="tabbarList? 'activeCon':''">发票列表</span>
      </tabbar-item>
      <tabbar-item link="entrust">
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

export default {
  name: 'OrderList',
  data(){
    return {
      token: localStorage.getItem("token"),
      fromLogin: this.$route.query.fromLogin,
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
      scrollTop: 0
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
    'v-loadmore':Loadmore
  },
  inject: ['reload'],
  beforeRouteEnter(to, from, next){
    if(from.name=='Entrust'||from.name=='My'||from.name=='ElectronicDetail'||from.name=='PaperDetail'){
      next(vm => {
        vm.token = localStorage.getItem("token");
        if(vm.token){
          return
        }else{
          vm.listData();
        }
      });
    }else{
      next(vm => {
        vm.token = localStorage.getItem("token");
        vm.empty = false;
        vm.listData();
      })
    }
  },
  beforeRouteLeave(to, from, next){
    this.scrollTop = this.$refs.viewBox.getScrollTop();
    this.$store.commit('changeRecruitScrollY', this.scrollTop);
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
    //发票列表
    listData(){
      if(!this.token){
        this.empty = true;
        return
      }
      //from
      if(this.fromLogin){
        this.showLoading = true;
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
          this.showLoading = false;
          this.count = response.count;
          if(response.fp_list.length>0){
            this.list = response.fp_list;
          }else{
            this.empty = true;
          }
          return false
        }
        if(response.errcode==103){   //登录用户失效
          this.showLoading = false;
          this.showInvalid = true;
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
      if(type=="t"){
        this.$router.push({path:'/electronic_detail',query:{itemData:item,index:index}});
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
      this.$router.push({path:'/billing'});
    },
    //请重试
    tryAgain(){
      this.reload();
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
  /*@import "~element-ui/lib/theme-chalk/index.css";*/
  .orderList{
    /*margin-top: 62px;*/
    background: #fff;
    border-bottom: 0.01rem solid #f2f2f2;
    position: relative;
    top: 0;
  }
  .orderList li{
    padding: 0.12rem 0.3rem 0.1rem 0.32rem;
    display: flex;
  }
  .orderList li:first-child{
    padding: 0.22rem 0.3rem 0.1rem 0.32rem;
  }
  .orderList li:last-child{
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
  }
  .orderList li:last-child .orderListRight{
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
</style>
