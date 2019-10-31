<template>
  <view-box ref="viewBox" class="goods_classify">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">税收分类编码</h2>
    </x-header>
    <div class="searchBlock marginTop" :class="showSearch?'shortBlock':''">
      <p class="searchCon" v-show="!showSearch"><img src="../../assets/icon_search.png" />搜索</p>
      <input type="text" class="searchInput" ref="mc" @click="clickSearch" @blur="blurSearch" />
      <button class="searchBtn" v-show="showBtn" @click="getSearch">搜索</button>
    </div>
    <ul class="commonList" v-show="!showSearchData">
      <li v-for="item in data" @click="jumpSub(item)">
        <p class="leftCon">{{item.name}}<b class="icon_arrow" v-if="item.children"></b></p>
      </li>
    </ul>
    <div v-show="!empty">
      <ul class="commonList" v-show="showSearchData">
        <li v-for="item in list" @click="jumpNext(item)">
          <p class="leftCon">{{item.bm}}<br/>{{item.name}}</p>
        </li>
      </ul>
    </div>

    <div class="orderListEmpty" v-if="empty">
      <img src="../../assets/img_list_empty.png" />
      <p>没有找到相关内容</p>
    </div>

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
    <loading v-model="showLoading" text=""></loading>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Confirm from 'vux/src/components/confirm/index'
import Loading from 'vux/src/components/loading/index'
import JsonData from '../../assets/data/spfl.json'

export default {
  name: 'GoodsClassify',
  data(){
    return{
      data: [],
      showSearch: false,
      showBtn: false,
      show: false,
      text: '',
      popupsStatus: false,
      showLoading: false,
      showInvalid: false,
      list: [],
      showSearchData: false,
      empty: false
    }
  },
  components:{
    ViewBox,
    XHeader,
    Confirm,
    Loading
  },
  created(){
    this.data = JsonData.spflData;
  },
  beforeRouteEnter(to, from, next){
    if(from.name=='AddGoods'){
      next(vm => {
        vm.$refs.mc.value = '';
        vm.showSearch = false;
        vm.showBtn = false;
        vm.showSearchData = false;
        vm.data = JsonData.spflData;
        vm.empty = false;
      });
    }else{
      next();
    }
  },
  methods:{
    //弹窗显示
    showPopups(){
      if(this.popupsStatus){
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    jumpSub(data){
      if(data.children){
        this.$router.push({path:'/goods_classify_sub',query:{itemData: data}});
      }
    },
    clickSearch(){
      this.showSearch = true;
      this.showBtn = true;
    },
    blurSearch(e){
      if(e.currentTarget.value.length==0){
        this.showSearch = false;
        this.showBtn = false;
        this.showSearchData = false;
        this.data = JsonData.spflData;
        this.empty = false;
      }
    },
    //搜索
    getSearch(){
      var _this = this;
      this.list = [];
      this.showLoading = true;
      this.empty = false;
      var url = this.local+'/api/user/spfl_list';
      this.data = {
        userid: localStorage.getItem("token"),
        mc: this.$refs.mc.value
      }
      this.$ajaxjp(url, this.data, true, (response) =>{
        if(response.errcode==0){
          this.showLoading = false;
          this.showSearchData = true;
          if(response.spfl_list.length>0){
            this.list = response.spfl_list;
          }else{
            this.empty = true;
          }
          return false
        }
        if(response.errcode==1003){   //登录用户失效
          this.showSearchData = true;
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
          this.showSearchData = true;
          this.showLoading = false;
          this.popupsStatus = true;
          this.showPopups();
          this.text = response.errmsg;
        }
      },function (error) {
        _this.showSearchData = true;
        _this.showLoading = false;
        _this.popupsStatus = true;
        _this.showPopups();
        _this.text = '网络异常';
        console.log(error);
      });
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    jumpNext(data){
      this.$router.push({path:'/add_goods',query:{itemData: data}});
    },
  },
  mounted(){
    this.locationData();  //local
  }
}
</script>

<style scoped>
  .goods_classify .commonList li{
    min-height: 0.6rem;
  }
  .goods_classify .leftCon{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    line-height: 0.45rem;
  }
  .searchBlock{
    display: flex;
    height: 0.8rem;
    border: 0.02rem solid #f1f1f1;
    border-radius: 0.22rem;
    background: #fff;
    margin: 55px 0.32rem 0.15rem;
    position: relative;
  }
  .searchCon{
    width:100%;
    height: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.3rem;
    color: #cdcdcd;
  }
  .searchBlock img{
    width:0.4rem;
    margin-right: 0.1rem;
  }
  .searchInput{
    position: absolute;
    left:0;
    top:0;
    padding: 0.2rem 5%;
    width:90%;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size:0.3rem;
  }
  .searchBtn{
    font-size: 0.3rem;
    color: #333;
    position: absolute;
    right: -0.9rem;
    height: 0.8rem;
  }
  .shortBlock{
    width:5.6rem;
  }
  .orderListEmpty{
    font-size: 0.28rem;
    color: #999;
    text-align: center;
    line-height: 0.2rem;
  }
</style>
