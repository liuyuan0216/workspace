<template>
  <view-box ref="viewBox" class="title_infor">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback"></p>
      <h2 class="header_title">抬头信息</h2>
    </x-header>
    <div class="titleInforWrap">
      <div class="commonInfor">
        <h3 class="commonTitle">{{data.gfname}}
          <b @click="jumpTitleEdit(data)"><img src="../assets/icon_tabbar_edit.png" /></b>
        </h3>
        <ul class="titleList clear">
          <li v-if="data.gfsh">
            <p class="titleLeft">税号：</p>
            <p class="titleRight">{{data.gfsh}}</p>
          </li>
          <li v-if="data.gfdzdh">
            <p class="titleLeft">地址电话：</p>
            <p class="titleRight">{{data.gfdzdh}}</p>
          </li>
          <li v-if="data.gfyhzh">
            <p class="titleLeft">开户行及账号：</p>
            <p class="titleRight">{{data.gfyhzh}}</p>
          </li>
        </ul>
      </div>
      <div
        class="commonInfor"
        v-if="data.email||data.receipt_address||data.receiver||data.phone"
      >
        <h3 class="commonTitle">收票信息</h3>
        <ul class="titleList clear">
          <li v-if="data.email">
            <p class="titleLeft">电子邮箱：</p>
            <p class="titleRight">{{data.email}}</p>
          </li>
          <li v-if="data.receipt_address">
            <p class="titleLeft">收货地址：</p>
            <p class="titleRight">{{data.receipt_address}}</p>
          </li>
          <li v-if="data.receiver">
            <p class="titleLeft">联系人：</p>
            <p class="titleRight">{{data.receiver}}</p>
          </li>
          <li v-if="data.phone">
            <p class="titleLeft">联系电话：</p>
            <p class="titleRight">{{data.phone}}</p>
          </li>
        </ul>
      </div>
    </div>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'

export default {
  name: 'TitleInfor',
  data(){
    return{
      data: [],
      itemData: this.$route.query.itemData,
      itemId: ''
    }
  },
  components:{
    ViewBox,
    XHeader
  },
  beforeRouteEnter(to, from, next){
    var fromparams_list = [];
    var fromparams_edit = [];
    if(from.name=='MyTitleList'){
      if(to.query.itemData){
        fromparams_list = to.query.itemData;
      }
      next(vm => {
        vm.data = fromparams_list;
        vm.itemId = fromparams_list.id;
      });
    }else if(from.name=='TitleEdit'){
      if(to.query.itemData){
        fromparams_edit = to.query.itemData;
      }
      next(vm => {
        vm.data = fromparams_edit;
      });
    }else{
      next();
    }
  },
  methods:{
    //抬头详情
    getData(){
      //this.data = this.itemData;
    },
    //编辑
    jumpTitleEdit(item){
      this.$router.push({path:'/title_edit',query:{itemData:item,id:this.itemId}});
    },
    goback(){
      this.$router.push({path:'/my_title_list?isMy=true'});
    }
  },
  mounted () {
    this.getData();
  }
}
</script>

<style scoped>
  .titleInforWrap{
    background: #fff;
    margin: 62px 0.32rem;
    border-radius: 0.12rem;
    padding-bottom: 0.32rem;
  }
  .commonInfor{
    padding: 0.32rem 0.32rem 0;
  }
  .commonTitle{
    font-size: 0.32rem;
    color: #333;
    font-weight: bold;
    line-height: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .commonTitle img{
    width:0.3rem;
  }
  .titleList{
    padding: 0.1rem 0 0.2rem;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .titleList li{
    font-size:0.3rem;
    color: #999;
    line-height: 0.46rem;
    padding: 0.1rem 0;
    float: left;
    width: 100%;
  }
  .titleLeft{
    width: 2.2rem;
    float: left;
  }
  .titleRight{
    width: 3.9rem;
    float: left;
  }
  .titleInforWrap .commonInfor:last-child .titleList{
    border:none;
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
