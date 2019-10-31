<template>
  <view-box ref="viewBox" class="add_goods">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback"></p>
      <h2 class="header_title">{{titleText}}</h2>
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
        <input
          type="number"
          class="rightInput"
          ref="spdj"
          placeholder="请输入商品单价"
          v-on:input="subNum($event)"
          @blur="spdjNum($event)">
        </input>
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
    <toast v-model="showToast" type="text">{{toastText}}</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Confirm from 'vux/src/components/confirm/index'
import Loading from 'vux/src/components/loading/index'
import Toast from 'vux/src/components/toast/index'

export default {
  name: 'AddGoods',
  data(){
    return{
      show: false,
      text: '',
      showLoading: false,
      showToast: false,
      toastText: '保存成功',
      popupsStatus: false,
      timer: null,
      goodsData: [],
      goodsStatus: '',
      slv: '13%',
      disabled: false,
      titleText: '',
      isMy: this.$route.query.isMy
    }
  },
  components:{
    ViewBox,
    XHeader,
    Confirm,
    Loading,
    Toast
  },
  beforeRouteEnter(to, from, next){
    var fromparams = [];
    if(from.name=='DeskGoodsList'){
      if(typeof(to.query.itemGoodsData)=='object'){
        fromparams.push(to.query.itemGoodsData);
      }else{
        next(vm => {
          vm.goodsStatus = sessionStorage.getItem("goodsStatus");
          vm.isMy = vm.$route.query.isMy;
          if(vm.goodsStatus=='edit'){
            vm.titleText = '编辑商品'
          }else{
            vm.titleText = '添加商品'
          }
          //判断刚进来初始化
          vm.goodsData = [];
          vm.slv = '13%';
          vm.$refs.spdj.value = '';
        });
        return
      }
      next(vm => {
        vm.showLoading = false;
        vm.goodsStatus = sessionStorage.getItem("goodsStatus");
        vm.isMy = vm.$route.query.isMy;
        //商品信息
        if(fromparams.length>0){
          vm.goodsData = fromparams[0];
          vm.slv = Number(vm.goodsData.slv)*100+'%';
          vm.$refs.spdj.value = (vm.goodsData.spdj).toString();
        }
        if(vm.goodsStatus=='edit'){
          vm.titleText = '编辑商品'
        }else{
          vm.titleText = '添加商品'
        }
      });
    }else{
      next(vm => {
        vm.goodsData = [];
        vm.slv = '13%';
        vm.$refs.spdj.value = '';
        vm.goodsStatus = sessionStorage.getItem("goodsStatus");
        vm.isMy = vm.$route.query.isMy;
        if(vm.goodsStatus=='edit'){
          vm.titleText = '编辑商品'
        }else{
          vm.titleText = '添加商品'
        }
      });
    }
  },
  methods:{
    subNum(e){
      var value = e.currentTarget.value;
      if(value){
        if(value.toString().split(".")[1]){
          if(value.toString().split(".")[1].length>6){
            e.currentTarget.value = Number(value).toFixed(6).toString();
          }
        }
      }
    },
    spdjNum(e){
      var value = e.currentTarget.value;
      if(value){
        //如果输入0.00
        if(value.toString().split(".")[1]){
          if(Number(value)<0.000001){
            this.$refs.spdj.value = '0.000001';
          }
        }
      }
    },
    getData(){
      if(this.itemGoodsData){
        this.goodsData = this.itemGoodsData;
        this.slv = (this.goodsData.slv)*100+'%';
      }
      this.showLoading = false;
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
        var url = this.local+'/api/desk/save_update_sp';
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
            return false
          }
          if(response.errcode==1016){   //登录用户失效
            this.showLoading = false;
            this.showInvalid = true;
            this.text = '您的账号已在其他设备登录，请重新登录';
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
      //含税单价
      if(this.$refs.spdj.value){
        if(Number(this.$refs.spdj.value)<0.000001){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '请正确填写含税单价';
          this.isDone = false;
          return false
        }
      }
      return this.isDone = true;
    },
    goback(){
      if(this.isMy){
        this.$router.push({path:'/desk_goods_list?isMy=true'});
      }else{
        this.$router.push({path:'/desk_billing_code_alone'});
      }
    }
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
    background: url("../../assets/icon_task.png") no-repeat right center transparent;
  }
  .add_goods .commonList{
    margin-bottom: 0.32rem;
  }
  .add_goods .leftCon{
    width: 2.1rem;
  }
  .add_goods .rightInput{
    width:4.8rem;
  }
  .itemFlbm{
    position: relative;
  }
  .itemFlbm .icon_add{
    position: absolute;
    right: 0;
  }
  .itemFlbm .icon_add img {
    width: 0.48rem;
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
