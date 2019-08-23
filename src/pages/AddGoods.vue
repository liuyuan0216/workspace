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
        <input type="number" class="rightInput" ref="spdj" placeholder="请输入商品单价" v-model="spdj" @change="spdjNum($event)" />
      </li>
    </ul>
    <ul class="commonList">
      <li class="spflStyle itemFlbm">
        <p class="leftCon"><span class="leftLabel">*</span>税收分类编码</p>
        <p class="rightInput" :class="spflStatus?'spflStatus':''" ref="spflbm">{{spflbm}}</p>
        <span class="icon_add" @click="jumpAdd">
          <img src="../assets/icon_addgoods.png" />
        </span>
      </li>
      <li class="spflStyle">
        <p class="leftCon"><span class="leftLabel">*</span>税收分类名称</p>
        <p class="rightInput" :class="spflStatus?'spflStatus':''" ref="spflmc">{{spflmc}}</p>
      </li>
      <li>
        <p class="leftCon">享受优惠政策</p>
        <select class="rightSelect" @change="changeType($event)" v-model="yhzc">
          <option value="0">否</option>
          <option value="1">是</option>
        </select>
      </li>
      <li>
        <p class="leftCon">优惠政策类型</p>
        <select class="rightSelect" :class="!disabled?'disSelect':''" :disabled="!disabled" v-model="yhzcmc" ref="yhzcmc">
          <option value="请选择">请选择</option>
          <option value="100%先征后退">100%先征后退</option>
          <option value="50%先征后退">50%先征后退</option>
          <option value="免税">免税</option>
          <option value="不征税">不征税</option>
          <option value="简易征税">简易征税</option>
          <option value="即征即退50%">即征即退50%</option>
          <option value="即征即退30%">即征即退30%</option>
          <option value="即征即退70%">即征即退70%</option>
        </select>
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
      goodsStatus: '',
      slv: '13%',
      spdj: '',
      disabled: false,
      titleText: '',
      //编码
      spflbm: '请选择税收分类编码',
      spflmc: '请选择税收分类名称',
      yhzc: '0',
      yhzcmc: '请选择',
      spflStatus: false,
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
    var fromparams_goods = [];
    var fromparams_bm = [];
    if(from.name=='GoodsList'||from.name=='GoodsClassify'||from.name=='GoodsClassifySub'||from.name=='GoodsClassifySubNext1'||from.name=='GoodsClassifySubNext2'||from.name=='GoodsClassifySubNext3'||from.name=='GoodsClassifySubNext4'||from.name=='GoodsClassifySubNext5'){
      if(typeof(to.query.itemGoodsData)=='object'){
        fromparams_goods.push(to.query.itemGoodsData);
      }else if(typeof(to.query.itemData)=='object'){
        fromparams_bm.push(to.query.itemData);
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
          if(from.name=='GoodsList'){
            vm.goodsData = [];
            vm.slv = '13%';
            //编码
            vm.spflbm = '请选择税收分类编码';
            vm.spflmc = '请选择税收分类名称';
            vm.yhzc = '0';
            vm.disabled = false;
            vm.yhzcmc = '请选择';
            vm.spflStatus = false;
          }
        });
        return
      }
      next(vm => {
        vm.showLoading = false;
        vm.spflStatus = true;
        vm.goodsStatus = sessionStorage.getItem("goodsStatus");
        vm.isMy = vm.$route.query.isMy;
        //商品信息
        if(fromparams_goods.length>0){
          vm.goodsData = fromparams_goods[0];
          vm.slv = Number(vm.goodsData.slv)*100+'%';
          vm.spdj = Number(vm.goodsData.spdj).toFixed(2).toString();
          if(vm.spdj=='0.00'){
            vm.spdj = '';
          }
          //编码赋值
          vm.spflbm = vm.goodsData.bm;
          vm.spflmc = vm.goodsData.name;
          vm.yhzc = vm.goodsData.yhzc;
          vm.yhzcmc = vm.goodsData.yhzcmc;
          //是否享受优惠政策
          if(vm.yhzc=='1'){
            vm.disabled = true;
          }else{
            vm.disabled = false;
            vm.yhzcmc = '请选择';
          }
        }else if(fromparams_bm.length>0){  //编码信息
          vm.spflbm = fromparams_bm[0].bm;
          vm.spflmc = fromparams_bm[0].name;
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
        //编码
        vm.spflbm = '请选择税收分类编码';
        vm.spflmc = '请选择税收分类名称';
        vm.yhzc = '0';
        vm.disabled = false;
        vm.yhzcmc = '请选择';
        vm.spflStatus = false;
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
    spdjNum(e){
      if(e.currentTarget.value) {
        this.spdj = Number(e.currentTarget.value).toFixed(2).toString();
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
      //是否享受优惠政策
      if(this.yhzc=='0'){
        this.yhzcmc = '';
      }

      if(this.isDone){ //通过了
        this.showLoading = true;  //loading
        var slv = this.$refs.slv.value;
        //如果 免税 或者 不征税的判断
        if(this.$refs.yhzcmc.value=="免税"||this.$refs.yhzcmc.value=="不征税"){
          slv = '0%';  //税率传0%
        }
        var url = this.local+'/api/user/save_update_sp';
        var data = {
          userid: localStorage.getItem("token"),
          id: this.$refs.id.value,
          spmc: this.$refs.spmc.value,
          ggxh: this.$refs.ggxh.value,
          jldw: this.$refs.jldw.value,
          slv: slv,
          spdj: this.$refs.spdj.value,
          bm: this.spflbm,
          name: this.spflmc,
          yhzc: this.yhzc,
          yhzcmc: this.yhzcmc
        }
        this.$ajaxjp(url, data, true,(response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;
            this.timer = setTimeout(() => {
              this.$router.push({path:'/goods_list?isMy=true'});
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
      //编码
      if(this.$refs.spflbm.innerHTML=='请选择税收分类编码'){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '税收分类编码不能为空';
        this.isDone = false;
        return false
      }
      //必须填写优惠政策类型
      if(this.yhzc=='1'){
        if(this.yhzcmc=='请选择'){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '优惠政策类型不能为空';
          this.isDone = false;
          return false
        }
      }
      if(this.$refs.spdj.value=="0.00"){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '请正确填写含税单价';
        this.isDone = false;
        return false
      }
      return this.isDone = true;
    },
    //跳转到添加商品页面
    jumpAdd(){
      this.$router.push({path:'/goods_classify'});
    },
    //切换是否享受优惠政策
    changeType(e){
      var val = e.currentTarget.options[e.currentTarget.selectedIndex].value;
      if(val=='1'){
        this.disabled = true;
        this.yhzc = '1';  //是否享受  是
      }else{
        this.disabled = false;
        this.yhzcmc = '请选择';
        this.yhzc = '0';  //是否享受  否
      }
    },
    goback(){
      if(this.isMy){
        this.$router.push({path:'/goods_list?isMy=true'});
      }else{
        this.$router.push({path:'/billing_code_alone'});
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
    background: url("../assets/icon_task.png") no-repeat right center transparent;
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
    width: 0.62rem;
  }
  .spflStyle .rightInput{
    color: #ccc;
    line-height: 0.34rem;
    height: auto;
  }
  .spflStyle .spflStatus{
    color: #999;
  }
  .disSelect{
    color: #ccc;
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
