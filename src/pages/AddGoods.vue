<template>
  <view-box ref="viewBox" class="add_goods">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title" v-if="!itemGoodsData">添加商品</h2>
      <h2 class="header_title" v-if="itemGoodsData">编辑商品</h2>
    </x-header>
    <ul class="commonList marginTop">
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>商品名称</p>
        <input hidden ref="id" v-model="goodsData.spid" />
        <input type="text" class="rightInput" ref="spmc" placeholder="请输入商品名称" v-model="goodsData.spmc" />
      </li>
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>税率</p>
        <select class="rightSelect" ref="slv" v-model="slv">
          <option>13%</option>
          <option>9%</option>
          <option>6%</option>
          <option>5%</option>
          <option>4%</option>
          <option>3%</option>
          <option>1.5%</option>
          <option>0%</option>
        </select>
      </li>
      <li>
        <p class="leftCon">规格型号</p>
        <input type="text" class="rightInput" ref="ggxh" placeholder="请输入规格型号" v-model="goodsData.ggxh" />
      </li>
      <li>
        <p class="leftCon">计量单位</p>
        <input type="text" class="rightInput" ref="jldw" placeholder="请输入计量单位" v-model="goodsData.jldw" />
      </li>
      <li>
        <p class="leftCon">商品单价</p>
        <input type="number" class="rightInput" ref="spdj" placeholder="请输入商品单价" v-model="goodsData.spdj" />
      </li>
    </ul>
    <button class="commonBtn" @click="conserve">保存</button>

    <confirm
      v-model="show"
      title="温馨提醒"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>
    <loading v-model="showLoading" text=""></loading>
    <toast v-model="showToast" type="text">保存成功</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Confirm from 'vux/src/components/Confirm'
import Loading from 'vux/src/components/Loading'
import Toast from 'vux/src/components/toast'

export default {
  name: 'AddGoods',
  data(){
    return{
      show: false,
      text: '',
      showLoading: false,
      showToast: false,
      popupsStatus: false,
      timer: null,
      goodsData: [],
      itemGoodsData: this.$route.query.itemGoodsData,
      slv: '13%'
    }
  },
  components:{
    ViewBox,
    XHeader,
    Confirm,
    Loading,
    Toast
  },
  methods:{
    getData(){
      if(this.itemGoodsData){
        this.goodsData = this.itemGoodsData;
        this.slv = (this.goodsData.slv)*100+'%';
      }
    },
    //弹窗显示
    showPopups(){
      if(this.popupsStatus){
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    //保存
    conserve(){
      this.submit();
      var _this = this;
      if(this.isDone){ //通过了
        this.showLoading = true;  //loading
        var url = this.local+'/api/user/save_update_sp';
        var data = {
          userid: localStorage.getItem("token"),
          id: this.$refs.id.value,
          spmc: this.$refs.spmc.value,
          ggxh: this.$refs.ggxh.value,
          jldw: this.$refs.jldw.value,
          slv: this.$refs.slv.value,
          spdj: this.$refs.spdj.value
        }
        this.$ajaxjp(url, data, true,(response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;
            this.timer = setTimeout(() => {
              this.$router.go(-1);
            }, 500)
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
          }else{
            this.showLoading = false;
            this.popupsStatus = true;
            this.showPopups();
            this.text = response.errmsg;
          }
        },function (error) {
          _this.showLoading = false;
          _this.popupsStatus = true;
          _this.showPopups();
          _this.text = '网络异常';
          console.log(error);
        });
      }
    },
    //表单验证
    submit(){
      //商品名称
      if(!this.$refs.spmc.value){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '商品名称不能为空';
        this.isDone = false;
        return false
      }
      //税率
      if(!this.$refs.slv.value){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '税率不能为空';
        this.isDone = false;
        return false
      }
      return this.isDone = true;
    },
  },
  mounted(){
    this.locationData();  //local
    this.getData();
  },
  beforeDestroy(){
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  .rightSelect{
    font-size: 0.28rem;
    color: #333;
    border: 0.012rem solid #e0e0e0;
    background: none;
    border-radius: 0.08rem;
    line-height: 0.5rem;
    width: 3rem;
    height: 0.5rem;
    padding: 0 0.12rem;
    outline: none;
    /*去掉默认的下拉三角*/
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    background: url("../assets/icon_task.png") no-repeat right center transparent;
  }
</style>
