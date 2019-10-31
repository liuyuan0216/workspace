<template>
  <view-box ref="viewBox" class="all_list">
    <div class="headerBlock" slot="header">
      <x-header

        class="header"
        :left-options= "{showBack:false, backText:'', preventGoBack:true}"
      >
        <p slot="right" class="header_right" @click="tryAgain">刷新</p>
        <h2 class="header_title">发票列表</h2>
      </x-header>
      <ul class="mint-tab">
        <li
          class="mint-button"
          @click="activeTab1"
          :class="active=='tab-container1'?'activeTab':''"
        >全部</li>
        <li
          class="mint-button"
          @click="activeTab2"
          :class="active=='tab-container2'?'activeTab':''"
        >已开票</li>
        <li
          class="mint-button"
          @click="activeTab3"
          :class="active=='tab-container3'?'activeTab':''"
        >未开票</li>
        <li
          class="mint-button"
          @click="activeTab4"
          :class="active=='tab-container4'?'activeTab':''"
        >待扫码</li>
      </ul>
    </div>

    <mt-tab-container v-model="active">
      <mt-tab-container-item id="tab-container1">
        <div v-if="!empty">
          <v-loadmore
            :bottom-method="allListLoadBottom"
            :bottom-all-loaded="allListLoaded"
            @bottom-status-change="allListHandleBottomChange"
            :auto-fill="false"
            ref="allListLoadmore"
            class="loadmore"
          >
            <ul class="orderList" ref="allList">
              <li
                @click="jumpDetail($event,'allList',item,index)"
                v-for="(item,index) in all_list"
                :data-readFlag="item.readFlag"
              >
                <div class="orderListIcon" v-if="item.sign=='1'">
                  <img src="../../assets/img_list_yes.png" />
                </div>
                <div class="orderListIcon" v-if="item.sign=='0'&&!item.qrcode_url">
                  <img src="../../assets/img_list_no.png" />
                </div>
                <div class="orderListIcon" v-if="item.sign=='0'&&item.qrcode_url">
                  <img src="../../assets/img_list_nosm.png" />
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
              <span v-show="allListBottomStatus!=='pull'" :class="{'rotate': allListBottomStatus === 'drop'}">加载更多...</span>
              <span v-show="allListBottomStatus==='loading'">Loading...</span>
              <divider v-show="allListLoaded">我是有底线的</divider>
            </div>
          </v-loadmore>
        </div>
        <div class="orderListEmpty" v-if="empty">
          <img src="../../assets/img_list_empty.png" />
          <p>还没有订单</p>
          <button class="emptyBtn" @click="setBilling">立即添加</button>
        </div>
      </mt-tab-container-item>

      <mt-tab-container-item id="tab-container2">
        <div v-if="!empty">
          <v-loadmore
            :bottom-method="issuedListLoadBottom"
            :bottom-all-loaded="issuedListLoaded"
            @bottom-status-change="issuedListHandleBottomChange"
            :auto-fill="false"
            ref="issuedListLoadmore"
            class="loadmore"
          >
            <ul class="orderList" ref="issuedList">
              <li
                @click="jumpDetail($event,'issuedList',item,index)"
                v-for="(item,index) in issued_list"
                :data-readFlag="item.readFlag"
              >
                <div class="orderListIcon" v-if="item.sign=='1'">
                  <img src="../../assets/img_list_yes.png" />
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
              <span v-show="issuedListBottomStatus!=='pull'" :class="{'rotate': issuedListBottomStatus === 'drop'}">加载更多...</span>
              <span v-show="issuedListBottomStatus==='loading'">Loading...</span>
              <divider v-show="issuedListLoaded">我是有底线的</divider>
            </div>
          </v-loadmore>
        </div>
        <div class="orderListEmpty" v-if="empty">
          <img src="../../assets/img_list_empty.png" />
          <p>还没有订单</p>
          <button class="emptyBtn" @click="setBilling">立即添加</button>
        </div>
      </mt-tab-container-item>

      <mt-tab-container-item id="tab-container3">
        <div v-if="!empty">
          <v-loadmore
            :bottom-method="unissuedListLoadBottom"
            :bottom-all-loaded="unissuedListLoaded"
            @bottom-status-change="unissuedListHandleBottomChange"
            :auto-fill="false"
            ref="unissuedListLoadmore"
            class="loadmore"
          >
            <ul class="orderList" ref="unissuedList">
              <li
                @click="jumpDetail($event,'unissuedList',item,index)"
                v-for="(item,index) in unissued_list"
                :data-readFlag="item.readFlag"
              >
                <div class="orderListIcon" v-if="item.sign=='0'&&!item.qrcode_url">
                  <img src="../../assets/img_list_no.png" />
                </div>
                <div class="orderListIcon" v-if="item.sign=='0'&&item.qrcode_url">
                  <img src="../../assets/img_list_nosm.png" />
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
              <span v-show="unissuedListBottomStatus!=='pull'" :class="{'rotate': unissuedListBottomStatus === 'drop'}">加载更多...</span>
              <span v-show="unissuedListBottomStatus==='loading'">Loading...</span>
              <divider v-show="unissuedListLoaded">我是有底线的</divider>
            </div>
          </v-loadmore>
        </div>
        <div class="orderListEmpty" v-if="empty">
          <img src="../../assets/img_list_empty.png" />
          <p>还没有订单</p>
          <button class="emptyBtn" @click="setBilling">立即添加</button>
        </div>
      </mt-tab-container-item>

      <mt-tab-container-item id="tab-container4">
        <div v-if="!empty">
          <v-loadmore
            :bottom-method="unscannedListLoadBottom"
            :bottom-all-loaded="unscannedListLoaded"
            @bottom-status-change="unscannedListHandleBottomChange"
            :auto-fill="false"
            ref="unscannedListLoadmore"
            class="loadmore"
          >
            <ul class="orderList" ref="unscannedList">
              <li
                @click="jumpDetail($event,'unscannedList',item,index)"
                v-for="(item,index) in unscanned_list"
                :data-readFlag="item.readFlag"
              >
                <div class="orderListIcon" v-if="item.sign=='0'&&!item.qrcode_url">
                  <img src="../../assets/img_list_no.png" />
                </div>
                <div class="orderListIcon" v-if="item.sign=='0'&&item.qrcode_url">
                  <img src="../../assets/img_list_nosm.png" />
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
              <span v-show="unscannedListBottomStatus!=='pull'" :class="{'rotate': unscannedListBottomStatus === 'drop'}">加载更多...</span>
              <span v-show="unscannedListBottomStatus==='loading'">Loading...</span>
              <divider v-show="unscannedListLoaded">我是有底线的</divider>
            </div>
          </v-loadmore>
        </div>
        <div class="orderListEmpty" v-if="empty">
          <img src="../../assets/img_list_empty.png" />
          <p>还没有订单</p>
          <button class="emptyBtn" @click="setBilling">立即添加</button>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>

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
      <img src="../../assets/img_list_empty.png" />
      <p>登录用户失效，请重新登录</p>
      <button class="emptyBtn" @click="goLogin">重新登录</button>
    </div>

    <div class="orderListEmpty" v-if="timeOut">
      <img src="../../assets/img_list_empty.png" />
      <p>网络异常</p>
      <button class="emptyBtn" @click="tryAgain">请重试</button>
    </div>
    <loading v-model="showLoading" text=""></loading>
    <tabbar
      slot="bottom">
      <tabbar-item link="/desk_entrust">
        <img slot="icon" src="../../assets/icon_tabbar_edit.png" v-if="!tabbarEdit">
        <img slot="icon" src="../../assets/icon_tabbar_edit_active.png" v-if="tabbarEdit">
        <span slot="label" :class="tabbarEdit? 'activeCon':''">委托开票</span>
      </tabbar-item>
      <tabbar-item selected>
        <img slot="icon" src="../../assets/icon_tabbar_list.png" v-if="!tabbarList">
        <img slot="icon" src="../../assets/icon_tabbar_list_active.png" v-if="tabbarList">
        <span slot="label" :class="tabbarList? 'activeCon':''">发票列表</span>
      </tabbar-item>
      <tabbar-item link="/desk_my">
        <img slot="icon" src="../../assets/icon_tabbar_my.png" v-if="!tabbarMy">
        <img slot="icon" src="../../assets/icon_tabbar_my_active.png" v-if="tabbarMy">
        <span slot="label" :class="tabbarMy? 'activeCon':''">我的</span>
      </tabbar-item>
    </tabbar>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Tabbar from 'vux/src/components/tabbar/tabbar'
import TabbarItem from 'vux/src/components/tabbar/tabbar-item'
import Alert from 'vux/src/components/alert/index'
import Confirm from 'vux/src/components/confirm/index'
import Loading from 'vux/src/components/loading/index'
import {Loadmore} from 'mint-ui'
import Divider from 'vux/src/components/divider/index'
import InlineLoading from 'vux/src/components/inline-loading/index'
import { TabContainer, TabContainerItem } from 'mint-ui'

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
      showInvalid: false,
      showAlertLogin: false,
      showLoading: false,
      showPopstate: false,
      text: '',
      limit: 10,
      //全部
      allListLoaded: false,
      allListBottomStatus: '',
      allListCount: 0,
      all_page: 0,
      all_list: [],
      //已开
      issued_page: 0,
      issued_list: [],
      issuedListLoaded: false,
      issuedListBottomStatus: '',
      issuedListCount: 0,
      //未开
      unissued_page: 0,
      unissued_list: [],
      unissuedListLoaded: false,
      unissuedListBottomStatus: '',
      unissuedListCount: 0,
      //待扫码
      unscanned_page: 0,
      unscanned_list: [],
      unscannedListLoaded: false,
      unscannedListBottomStatus: '',
      unscannedListCount: 0,

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
    if(from.name=='DeskEntrust'||from.name=='DeskMy'||from.name=='DeskElectronicDetail'){
      next(vm => {
        vm.token = localStorage.getItem("token");
        if(vm.token){
          vm.came = sessionStorage.getItem("came");
          if(!vm.came){
            vm.empty = false;
            vm.all_list = [];
            vm.showLoading = true;
            vm.allListData();
            //默认显示全部
            vm.active = 'tab-container1';
          }else{
            var allListIndex = Number(sessionStorage.getItem("allListIndex"));
            var issuedListIndex = Number(sessionStorage.getItem("issuedListIndex"));
            if(vm.active=="tab-container1"){
              if(allListIndex>=0){
                if(vm.all_list[allListIndex].sign=='1'){
                  vm.all_list[allListIndex].readFlag = '1';
                }
              }
            }
            if(vm.active=="tab-container2"){
              if(issuedListIndex>=0){
                if(vm.issued_list[issuedListIndex].sign=='1'){
                  vm.issued_list[issuedListIndex].readFlag = '1';
                }
              }
            }
          }
          return
        }else{
          vm.allListData();
        }
      });
    }else{
      next(vm => {
        vm.token = localStorage.getItem("token");
        vm.empty = false;
        vm.showLoading = true;
        vm.allListData();
        //默认显示全部
        vm.active = 'tab-container1';
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
      if(to.name==='DeskOrderList'){
        if(from.name=='DeskBilling'||from.name=='DeskCodeInfor'){
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
    //切换tab
    activeTab1(){
      this.active = 'tab-container1';
      this.allListLoaded = false;
      this.$refs.viewBox.scrollTo(0);
      this.showLoading = true;
      this.allListData();
    },
    activeTab2(){
      this.active = 'tab-container2';
      this.issuedListLoaded = false;
      this.$refs.viewBox.scrollTo(0);
      this.showLoading = true;
      this.issuedListData();
    },
    activeTab3(){
      this.active = 'tab-container3';
      this.unissuedListLoaded = false;
      this.$refs.viewBox.scrollTo(0);
      this.showLoading = true;
      this.unissuedListData();
    },
    activeTab4(){
      this.active = 'tab-container4';
      this.unscannedListLoaded = false;
      this.$refs.viewBox.scrollTo(0);
      this.showLoading = true;
      this.unscannedListData();
    },

    //全部发票列表
    allListData(){
      if(!this.token){
        this.empty = true;
        this.timeOut = false;
        this.showInvalid = false;
        this.showLoading = false;
        return
      }
      var _this = this;
      this.all_page = 0;
      var url = this.local+'/api/desk/fp_list';
      this.data = {
        userid: this.token,
        page: this.all_page,
        limit: this.limit
      }
      this.$ajaxjp(url, this.data, true, (response) =>{
        if(response.errcode==0){
          _this.showLoading = false;
          _this.allListCount = response.count;
          if(response.fp_list.length>0){
            _this.empty = false;
            _this.timeOut = false;
            _this.all_list = response.fp_list;
          }else{
            _this.empty = true;
          }
          return false
        }
        if(response.errcode==1003||response.errcode==1016){   //登录用户失效
          this.showLoading = false;
          this.empty = false;
          this.timeOut = false;
          this.showInvalid = true;
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
        }else{
          this.showLoading = false;
          this.showInvalid = false;
          this.empty = false;
          this.timeOut = true;
        }
      },function (error) {
        _this.showLoading = false;
        _this.showInvalid = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.all_list = [];
        console.log(error);
      });
    },
    //more
    allListMore(){
      this.all_page++;
      var _this = this;
      var url = this.local+'/api/desk/fp_list';
      var data = {
        userid: this.token,
        page: this.all_page,
        limit: this.limit
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          if(response.fp_list.length>0){
            this.all_list = this.all_list.concat(response.fp_list);
          }
        }
      },function (error) {
        _this.showLoading = false;
        _this.showInvalid = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.all_list = [];
        console.log(error);
      });
    },
    //更新已读列表
    updateReadFlag(item,index){
      var _this = this;
      var url = this.local+'/api/desk/updateReadFlag';
      var data = {
        userid: this.token,
        id: item.id,
        readFlag: '1'
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          this.$router.push({path:'/desk_electronic_detail',query:{itemData:item,index:index}});
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
    jumpDetail(e,type,item,index){
      var readFlag = e.currentTarget.getAttribute("data-readFlag");
      if(type=="allList"){
        sessionStorage.setItem("allListIndex",index);
      }else if(type=="issuedList"){
        sessionStorage.setItem("issuedListIndex",index);
      }else if(type=="unissuedList"){
        sessionStorage.setItem("unissuedListIndex",index);
      }else if(type=="unscannedList"){
        sessionStorage.setItem("unscannedListIndex",index);
      }

      if(readFlag=="0"){
        this.updateReadFlag(item,index);
      }else{
        this.$router.push({path:'/desk_electronic_detail',query:{itemData:item,index:index}});
      }
    },
    //去开票
    setBilling(){
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.$router.push({path:'/desk_entrust'});
    },
    //请重试
    tryAgain(){
      if(!this.token){
        this.showAlertLogin = true;
        this.text = '请先登录';
        return false;
      }
      this.showLoading = true;
      this.$refs.viewBox.scrollTo(0);
      //判断是哪一类
      if(this.active=='tab-container1'){
        this.allListData();
      }else if(this.active=='tab-container2'){
        this.issuedListData();
      }else if(this.active=='tab-container3'){
        this.unissuedListData();
      }else if(this.active=='tab-container4'){
        this.unscannedListData();
      }
    },
    //全部---上拉加载更多
    allListLoadBottom(){
      if(this.all_list.length < this.allListCount){
        this.allListMore();
      }else{
        this.allListLoaded = true;
      }
      this.$refs.allListLoadmore.onBottomLoaded();
    },
    allListHandleBottomChange(status){
      this.allListBottomStatus = status;
    },


    //已开发票列表
    issuedListData(){
      if(!this.token){
        this.empty = true;
        this.timeOut = false;
        this.showInvalid = false;
        this.showLoading = false;
        return
      }
      var _this = this;
      this.issued_page = 0;
      var url = this.local+'/api/desk/fpkj_list';
      this.data = {
        userid: this.token,
        page: this.issued_page,
        limit: this.limit,
        sign: '1'
      }
      this.$ajaxjp(url, this.data, true, (response) =>{
        if(response.errcode==0){
          _this.showLoading = false;
          _this.issuedListCount = response.count;
          if(response.fp_list.length>0){
            _this.empty = false;
            _this.timeOut = false;
            _this.issued_list = response.fp_list;
          }else{
            _this.empty = true;
          }
          return false
        }
        if(response.errcode==1003||response.errcode==1016){   //登录用户失效
          this.showLoading = false;
          this.empty = false;
          this.timeOut = false;
          this.showInvalid = true;
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
        }else{
          this.showLoading = false;
          this.showInvalid = false;
          this.empty = false;
          this.timeOut = true;
        }
      },function (error) {
        _this.showLoading = false;
        _this.showInvalid = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.issued_list = [];
        console.log(error);
      });
    },
    //more
    issuedListMore(){
      this.issued_page++;
      var _this = this;
      var url = this.local+'/api/desk/fpkj_list';
      var data = {
        userid: this.token,
        page: this.issued_page,
        limit: this.limit,
        sign: '1'
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          if(response.fp_list.length>0){
            this.issued_list = this.issued_list.concat(response.fp_list);
          }
        }
      },function (error) {
        _this.showLoading = false;
        _this.showInvalid = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.issued_list = [];
        console.log(error);
      });
    },
    //已开---上拉加载更多
    issuedListLoadBottom(){
      if(this.issued_list.length < this.issuedListCount){
        this.issuedListMore();
      }else{
        this.issuedListLoaded = true;
      }
      this.$refs.issuedListLoadmore.onBottomLoaded();
    },
    issuedListHandleBottomChange(status){
      this.issuedListBottomStatus = status;
    },

    //未开发票列表
    unissuedListData(){
      if(!this.token){
        this.empty = true;
        this.timeOut = false;
        this.showInvalid = false;
        this.showLoading = false;
        return
      }
      var _this = this;
      this.unissued_page = 0;
      var url = this.local+'/api/desk/fpkj_list';
      this.data = {
        userid: this.token,
        page: this.unissued_page,
        limit: this.limit,
        sign: '0'
      }
      this.$ajaxjp(url, this.data, true, (response) =>{
        if(response.errcode==0){
          _this.showLoading = false;
          _this.unissuedListCount = response.count;
          if(response.fp_list.length>0){
            _this.empty = false;
            _this.timeOut = false;
            _this.unissued_list = response.fp_list;
          }else{
            _this.empty = true;
          }
          return false
        }
        if(response.errcode==1003||response.errcode==1016){   //登录用户失效
          this.showLoading = false;
          this.empty = false;
          this.timeOut = false;
          this.showInvalid = true;
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
        }else{
          this.showLoading = false;
          this.showInvalid = false;
          this.empty = false;
          this.timeOut = true;
        }
      },function (error) {
        _this.showLoading = false;
        _this.showInvalid = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.unissued_list = [];
        console.log(error);
      });
    },
    //more
    unissuedListMore(){
      this.unissued_page++;
      var _this = this;
      var url = this.local+'/api/desk/fpkj_list';
      var data = {
        userid: this.token,
        page: this.unissued_page,
        limit: this.limit,
        sign: '0'
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          if(response.fp_list.length>0){
            this.unissued_list = this.unissued_list.concat(response.fp_list);
          }
        }
      },function (error) {
        _this.showLoading = false;
        _this.showInvalid = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.unissued_list = [];
        console.log(error);
      });
    },
    //未开---上拉加载更多
    unissuedListLoadBottom(){
      if(this.unissued_list.length < this.unissuedListCount){
        this.unissuedListMore();
      }else{
        this.unissuedListLoaded = true;
      }
      this.$refs.unissuedListLoadmore.onBottomLoaded();
    },
    unissuedListHandleBottomChange(status){
      this.unissuedListBottomStatus = status;
    },

    //待扫码列表
    unscannedListData(){
      if(!this.token){
        this.empty = true;
        this.timeOut = false;
        this.showInvalid = false;
        this.showLoading = false;
        return
      }
      var _this = this;
      this.unscanned_page = 0;
      var url = this.local+'/api/desk/fp_scan_list';
      this.data = {
        userid: this.token,
        page: this.unscanned_page,
        limit: this.limit
      }
      this.$ajaxjp(url, this.data, true, (response) =>{
        if(response.errcode==0){
          _this.showLoading = false;
          _this.unscannedListCount = response.count;
          if(response.fp_list.length>0){
            _this.empty = false;
            _this.timeOut = false;
            _this.unscanned_list = response.fp_list;
          }else{
            _this.empty = true;
          }
          return false
        }
        if(response.errcode==1003||response.errcode==1016){   //登录用户失效
          this.showLoading = false;
          this.empty = false;
          this.timeOut = false;
          this.showInvalid = true;
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
        }else{
          this.showLoading = false;
          this.showInvalid = false;
          this.empty = false;
          this.timeOut = true;
        }
      },function (error) {
        _this.showLoading = false;
        _this.showInvalid = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.unscanned_list = [];
        console.log(error);
      });
    },
    //more
    unscannedListMore(){
      this.unscanned_page++;
      var _this = this;
      var url = this.local+'/api/desk/fp_scan_list';
      var data = {
        userid: this.token,
        page: this.unscanned_page,
        limit: this.limit,
        sign: '0'
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          if(response.fp_list.length>0){
            this.unscanned_list = this.unscanned_list.concat(response.fp_list);
          }
        }
      },function (error) {
        _this.showLoading = false;
        _this.showInvalid = false;
        _this.empty = false;
        _this.timeOut = true;
        _this.unscanned_list = [];
        console.log(error);
      });
    },
    //未开---上拉加载更多
    unscannedListLoadBottom(){
      if(this.unscanned_list.length < this.unscannedListCount){
        this.unscannedListMore();
      }else{
        this.unscannedListLoaded = true;
      }
      this.$refs.unscannedListLoadmore.onBottomLoaded();
    },
    unscannedListHandleBottomChange(status){
      this.unscannedListBottomStatus = status;
    }
  },
  mounted(){
    this.locationData();  //local
    this.allListData();
  }
}
</script>

<style lang="less">
  @import "../../../node_modules/vux/src/styles/reset.less";
  .headerBlock{
    height: 46px;
    padding-bottom: 0.85rem;
  }
  .all_list .weui-tab__panel{
    padding-bottom: 105px;
  }
  .all_list .orderList{
    background: #fff;
    position: relative;
  }
  .all_list .orderList li{
    padding: 0.12rem 0.3rem 0.1rem 0.32rem;
    display: flex;
  }
  .all_list .orderList li:first-child{
    padding: 0.3rem 0.3rem 0.1rem 0.32rem;
  }
  .all_list .mint-loadmore-bottom{
    padding-bottom: 40px;
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
    background: #fff;
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width:100%;
    height: 0.85rem;
    border-bottom: 0.01rem solid #f2f2f2;
    background: #fff;
    top:46px;
    position: relative;
    /*position: fixed;
    top: 46px;
    left:0;*/
    z-index: 100;
    box-sizing: border-box;
  }
  .mint-tab .vux-tab-container{
    height:0.85rem;
    box-sizing: border-box;
  }
  .mint-tab .vux-tab{
    height:0.85rem;
  }
  .mint-button {
    position: relative;
    text-align: center;
    width:25%;
    font-size: 0.28rem;
    color: #999;
    height: 0.85rem;
    line-height: 0.85rem;
  }
  .mint-button.activeTab{
    box-sizing: border-box;
    color: #ff9900;
    border-bottom: 0.045rem solid #ff9900;
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
