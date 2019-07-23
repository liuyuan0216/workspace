<template>
  <view-box ref="viewBox" class="billing">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback"></p>
      <h2 class="header_title">开票</h2>
    </x-header>

    <!--<p class="billingTitle">{{company}}</p>-->
    <ul class="commonList listBilling BillingTop">
      <li>
        <p class="leftCon">发票类型</p>
        <div class="rightLabel">
          <!--<div class="lxRadio" v-for="(item,index) in fpzl_list" :key="item.id">
            <label :class="{'onClick':checkedValue==index}"></label>
            <input
              type="radio"
              v-model="checkedValue"
              :value="index"
              @click="checkFp(item)"
              />
            <span v-if="item=='t'">电子发票</span>
            <span v-if="item=='c'">普票</span>
            <span v-if="item=='s'">专票</span>
          </div>-->
          <div class="lxRadio">
            <label class="onClick"></label>
            <input type="radio"/>
            <span>电子发票</span>
          </div>
        </div>
      </li>
      <li>
        <p class="leftCon">抬头类型</p>
        <div class="rightLabel">
          <div class="lxRadio" v-for="(item,index) in radios" :key="item.id">
            <label :class="{'onClick':item.isChecked}"></label>
            <input
              type="radio"
              v-model="radioType"
              :value="item.value"
              :checked='item.isChecked'
              @click="checkTt(index)"/>
            <span>{{item.label}}</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="itemBillingFirst" @click="jumpTitleList">
      <p>购方信息</p>
      <span>+ 选择抬头</span>
    </div>
    <ul class="commonList listBilling">
      <li class="itemName">
        <p class="leftCon">名称</p>
        <input type="text" class="rightInput" placeholder="请输入名称" ref="name" v-model="titleData.gfname"/>
        <span class="iconCode" @click=""><img src="../assets/icon_code.png" /></span>
      </li>
      <li v-show="type_enterprises">
        <p class="leftCon">税号</p>
        <input type="text" class="rightInput" placeholder="请输入税号" ref="sh" v-model="titleData.gfsh"/>
      </li>
      <li v-show="type_enterprises">
        <p class="leftCon">地址电话</p>
        <input type="text" class="rightInput" placeholder="请输入地址电话" ref="dzdh" v-model="titleData.gfdzdh"/>
      </li>
      <li v-show="type_enterprises">
        <p class="leftCon">开户行及账号</p>
        <input type="text" class="rightInput" placeholder="请输入开户行及账号" ref="yhzh" v-model="titleData.gfyhzh"/>
      </li>
      <li v-show="type_t">
        <p class="leftCon">手机号</p>
        <input type="number" class="rightInput" placeholder="请输入手机号码" ref="phone" v-model="titleData.phone"/>
      </li>
      <li v-show="type_t">
        <p class="leftCon">邮箱地址</p>
        <input type="text" class="rightInput" placeholder="请输入邮箱地址" ref="email" v-model="titleData.email"/>
      </li>
      <li v-show="type_c">
        <p class="leftCon">邮寄地址</p>
        <input type="text" class="rightInput" placeholder="请输入邮寄地址" ref="receipt_address" v-model="titleData.receipt_address"/>
      </li>
      <li v-show="type_c">
        <p class="leftCon">联系人</p>
        <input type="text" class="rightInput" placeholder="请输入联系人" ref="receiver" v-model="titleData.receiver"/>
      </li>
      <li v-show="type_c">
        <p class="leftCon">联系方式</p>
        <input type="number" class="rightInput" placeholder="请输入联系方式" ref="phone" v-model="titleData.phone"/>
      </li>
    </ul>
    <div class="commonList listBilling">
      <div class="addGoodsTitle">
        <p>商品</p>
        <p>数量</p>
        <p>含税单价</p>
        <p>含税金额</p>
      </div>
      <ul class="addGoodsList" ref="listBox">
        <li class="itemGoods" v-if="spxx" v-for="(item,index) in spxx" @click="changeItem(item,index)">
          <input class="spid" v-model="item.spid" hidden></input>
          <div class="goodsItem spmcItem">
            <p class="spmc overflowCon">{{item.spmc}}</p>
            <span v-if="item.slv">税率：<b class="slv">{{item.slv}}</b></span>
          </div>
          <input class="ggxh" v-model="item.ggxh" hidden></input>
          <input class="jldw" v-model="item.jldw" hidden></input>
          <p class="goodsItem spsl">{{item.spsl||0}}</p>
          <p class="goodsItem spdj">{{item.spdj||0}}</p>
          <p class="goodsItem je">{{item.je}}</p>
        </li>
      </ul>
      <p class="addCon" @click="jumpAddGoods">点击录入商品</p>
    </div>
    <div
      class="ftWrap"
      slot="bottom">
      <div class="jeBox">
        <p>合计金额：</p>
        <span class="jeNum">{{price}}</span>
      </div>
      <button class="submitBtn" @click="submitEdit">提交开票</button>
    </div>
    <confirm
      v-model="show"
      :title="title"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>
    <confirm
      v-model="showUpdate"
      :title="title"
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
    <toast v-model="showToast" type="text">提交成功</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Alert from 'vux/src/components/alert'
import Confirm from 'vux/src/components/Confirm'
import Loading from 'vux/src/components/Loading'
import Toast from 'vux/src/components/toast'

export default {
  name: 'Billing',
  data(){
    return {
      fpzl_list_data: [],
      fpzl_list: '',
      company: '',
      //发票
      answer:[],
      checkedValue: '',
      radioType: '企业',
      radios:[
        {
          label: '企业',
          value:'企业',
          isChecked: true,
        },
        {
          label: '个人/其他',
          value:'个人/其他',
          isChecked: false,
        }
      ],
      //alert
      title: '温馨提示',
      popupsStatus: false,
      show: false,
      text: '',
      showUpdate: false,
      showInvalid: false,
      showLoading: false,
      showToast: false,
      //submit
      isDone: false,
      timer: null,
      //type
      fpzl: 't',
      title_type: '1',
      //type
      type_t: true,
      type_c: false,
      type_enterprises: true,
      //专票个人隐藏
      type_personal_show: false,
      radioStatus: '',  //抬头类型状态
      //选择的数据
      titleData: [],
      goodsData: [],
      spxx: [],
      //data
      itemTitleData: this.$route.query.itemTitleData,
      itemGoodsData: this.$route.query.itemGoodsData,
      changeStatus: this.$route.query.changeStatus,
      deleteStatus: this.$route.query.deleteStatus,
      index: this.$route.query.index,
      return: this.$route.query.return,
      scrollTop: 0,
      list: {},
      dataArr: [],
      price: 0,  //总金额
      spdj: '',
      spsl: ''
    }
  },
  components:{
    ViewBox,
    XHeader,
    Alert,
    Confirm,
    Loading,
    Toast
  },
  watch:{
    radioStatus: function(newval, oldval){
      console.log(newval, oldval);
    },
    checkedValue:function(){
      this.answer=[];
      this.answer.push(this.checkedValue);
    }
  },
  beforeRouteEnter(to, from, next){
    var fromparams_title = [];
    var fromparams_goods = [];
    if(from.name=='MyTitleList'){
      if(typeof(to.query.itemTitleData)=='object'){
        fromparams_title = to.query.itemTitleData;
      }else{
        next();
        return
      }
      next(vm => {
        vm.titleData = fromparams_title;
      });
    }else if(from.name=='AddGoods'){
      if(typeof(to.query.itemGoodsData)=='object'){
        fromparams_goods = to.query.itemGoodsData;
      }else{
        next(vm => {
          vm.price = 0;
          //如果是删除操作
          vm.deleteStatus = vm.$route.query.deleteStatus;
          if(vm.deleteStatus){
            vm.spxx.splice(vm.index,1);
          }
          //计算总金额
          for(var i in vm.spxx){
            var val = Number(vm.spxx[i].je);
            vm.price += val;
          }
          if(vm.spxx.length==0){
            vm.price = 0;
          }else{
            vm.price = vm.price.toFixed(2);
          }
        });
        return
      }
      next(vm => {
        vm.changeStatus = vm.$route.query.changeStatus;
        vm.index = vm.$route.query.index;
        vm.goodsData = fromparams_goods;
        var add = {
            spid: vm.goodsData[0].spid,
            spmc: vm.goodsData[0].spmc,
            ggxh: vm.goodsData[0].ggxh,
            jldw: vm.goodsData[0].jldw,
            slv: vm.goodsData[0].slv,
            spsl: vm.goodsData[0].spsl,
            spdj: vm.goodsData[0].spdj,
            je: vm.goodsData[0].je
          }
        var obj = {};
        vm.price = 0;
        //如果是修改操作
        if(vm.changeStatus){
          vm.spxx.splice(vm.index,1,add);
        }else{
          vm.spxx.push(Object.assign(obj, add));
        }
        //计算总金额
        for(var i in vm.spxx){
          var val = Number(vm.spxx[i].je);
          vm.price += val;
        }
        vm.price = vm.price.toFixed(2);
      });
    }else{
      next(vm => {
        vm.fpzl_list_data = localStorage.getItem("fpzl_list");
        vm.fpzl_list = vm.fpzl_list_data.replace(/,/g, "");
        vm.company = localStorage.getItem("company");
        vm.titleData = [];
        vm.goodsData = [];
        //清空商品列表
        vm.spxx = [];
        //重置抬头类型
        vm.radios = [
          {
            label: '企业',
            value:'企业',
            isChecked: true,
          },
          {
            label: '个人/其他',
            value:'个人/其他',
            isChecked: false,
          }
        ]
        vm.type_enterprises = true;
        vm.price = 0;
      });
    }
  },
  beforeRouteLeave(to, from, next){
    this.scrollTop = this.$refs.viewBox.getScrollTop();
    this.$store.commit('changeRecruitScrollY', this.scrollTop);
    next();
  },
  watch:{
    $route(to, from){
      if(to.name==='Billing'){
        if(from.name=='AddGoods'){
          //如果是需要记住位置的
          this.return = this.$route.query.return;
          if(this.return){
            this.$nextTick(() => {
              this.$refs.viewBox.scrollTo(this.$store.getters.recruitScrollY);
            })
          }
        }
      }
    }
  },
  methods:{
    //初始化请求数据
    getData(){
      this.showLoading = false;
    },
    //发票类型
    checkFp(item){
      if(item=='t'){
        this.fpzl = 't';
        this.type_t = true;
        this.type_c = false;
        this.type_personal_show = false;
        if(this.title_type == '1'){
          this.type_enterprises = true;
        }
      }else if(item=='c'){
        this.fpzl = 'c';
        this.type_t = false;
        this.type_c = true;
        this.type_personal_show = false;
        if(this.title_type == '1'){
          this.type_enterprises = true;
        }
      }else if(item=='s'){
        this.fpzl = 's';
        this.type_t = false;
        this.type_c = true;
        //专票个人抬头隐藏
        this.type_personal_show = true;
        if(this.title_type == '1'){
          this.type_enterprises = true;
        }
      }
    },
    //抬头类型
    checkTt(index){
      this.radios.forEach((item) => {
        item.isChecked = false;
      });
      this.radioType = this.radios[index].value;
      this.radios[index].isChecked = true;
      //显示的判断
      if(index==0){
        this.title_type = '1';
        this.type_enterprises = true;
      }else{
        this.title_type = '0';
        this.type_enterprises = false;
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
    //手填模式 提交开票
    submitEdit(){
      this.submit();
      var _this = this;
      if(this.isDone){ //通过了
        this.showLoading = true;  //loading
        this.dataArr = [];
        var li = this.$refs.listBox.children;
        for(var i=0;i<li.length;i++){
          var spid = li[i].getElementsByClassName("spid");
          var spmc = li[i].getElementsByClassName("spmc");
          var ggxh = li[i].getElementsByClassName("ggxh");
          var jldw = li[i].getElementsByClassName("jldw");
          var slv = li[i].getElementsByClassName("slv");
          var spdj = li[i].getElementsByClassName("spdj");
          var spsl = li[i].getElementsByClassName("spsl");
          var je = li[i].getElementsByClassName("je");
          var itemData ={  //商品信息
            spid: spid[0].value,
            spmc: spmc[0].innerHTML,
            ggxh: ggxh[0].value,
            jldw: jldw[0].value,
            spsl: spsl[0].innerHTML,
            spdj: spdj[0].innerHTML,
            slv: slv[0].innerHTML,
            je: je[0].innerHTML
          }
          this.dataArr.push(itemData);
        }
        var url = this.local+'/api/user/submitFpInfo';
        var listData = JSON.stringify(this.dataArr);

        //企业类型才有税号
        if(this.title_type==0){
          this.$refs.sh.value = '';
          this.$refs.dzdh.value = '';
          this.$refs.yhzh.value = '';
        }
        var data = {
          userid: localStorage.getItem("token"),
          spxx: listData,
          name: this.$refs.name.value,
          title_type: this.title_type,  //抬头类型
          fpzl: this.fpzl,  //发票类型
          sh: this.$refs.sh.value,
          dzdh: this.$refs.dzdh.value,
          yhzh: this.$refs.yhzh.value,
          email: this.$refs.email.value,
          phone: this.$refs.phone.value,
          receipt_address: this.$refs.receipt_address.value,
          receiver: this.$refs.receiver.value
        }
        this.$ajaxjp(url, data, true,(response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;
            this.timer = setTimeout(() => {
              this.$router.push({path:'/list'});
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
          _this.title = '温馨提示';
          _this.text = '网络异常';
          console.log(error);
        });
      }
    },
    //表单验证
    submit(){
      var name = this.$refs.name.value;
      var nameVal = name.replace(/[^\x00-\xff]/g, "**").length;
      var sh = this.$refs.sh.value;
      var dzdh = this.$refs.dzdh.value;
      var dzdhVal = dzdh.replace(/[^\x00-\xff]/g, "**").length;
      var yhzhVal = this.$refs.yhzh.value.replace(/[^\x00-\xff]/g, "**").length;
      var phone = this.$refs.phone.value;
      var email = this.$refs.email.value;
      //发票类型
      if(!this.fpzl){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '发票类型不能为空';
        this.isDone = false;
        return false
      }
      //抬头类型
      if(!this.title_type){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '抬头类型不能为空';
        this.isDone = false;
        return false
      }
      //手填开票模式下 判断抬头模块
      //抬头名称
      if(!name){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '抬头名称不能为空';
        this.isDone = false;
        return false
      }
      //税号
      if(!sh){
        if(this.title_type==1){
          this.popupsStatus = true;
          this.showPopups();
          this.title = '温馨提示';
          this.text = '税号不能为空';
          this.isDone = false;
          return false
        }
      }
      //邮箱
      if(this.fpzl=='t'){
        if(!email){
          this.popupsStatus = true;
          this.showPopups();
          this.title = '温馨提示';
          this.text = '邮箱不能为空';
          this.isDone = false;
          return false
        }
      }
      //商品不能为空
      if(this.spxx.length<1){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '商品不能为空';
        this.isDone = false;
        return false
      }
      //判断格式
      if(nameVal>100){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '输入名称超过最大限制';
        this.isDone = false;
        return false
      }
      //税号格式判断
      if(sh){
        if(this.title_type==1){
          this.isSh(sh);
          if(this.shFormat){
            this.popupsStatus = true;
            this.showPopups();
            this.title = '温馨提示';
            this.text = this.shText;
            this.isDone = false;
            return false
          }
        }
      }
      //银行账号长度
      if(yhzhVal>100){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '输入开户行及账号超过最大限制';
        this.isDone = false;
        return false
      }
      //地址电话长度
      if(dzdhVal>100){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '输入地址电话超过最大限制';
        this.isDone = false;
        return false
      }
      //手机号格式判断
      if(phone){
        this.isPhoneAvailable(phone);
        if(this.phoneFormat){
          this.popupsStatus = true;
          this.showPopups();
          this.title = '温馨提示';
          this.text = this.phoneText;
          this.isDone = false;
          return false
        }
      }
      //邮箱格式判断
      if(email){
        this.isEmail(email);
        if(this.emailFormat){
          this.popupsStatus = true;
          this.showPopups();
          this.title = '温馨提示';
          this.text = this.emailText;
          this.isDone = false;
          return false
        }
      }
      return this.isDone = true;
    },
    //点击每个商品可编辑
    changeItem(data,index){
      this.$router.push({path:'/add_goods',query:{itemChangeData: data, changeStatus: 'true', index:index}});
    },
    //返回上一页
    goback(){
      this.$router.push({path:'/'});
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //跳转抬头列表
    jumpTitleList(){
      this.$router.push({path:'/my_title_list'});
    },
    //点击录入商品
    jumpAddGoods(){
      this.$router.push({path:'/add_goods'});
    },
  },
  mounted () {
    this.locationData();  //local
    this.getData();
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
  @import "~vux/src/styles/reset.less";
  .billing .leftCon{
    width:2rem;
    font-size: 0.28rem;
  }
  .billing .BillingTop{
    margin-top: 58px;
  }
  .billing .listBilling .rightInput{
    width:4.8rem;
  }
  .billing .billingTitle{
    font-size: 0.3rem;
    color: #333;
    background: #fff;
    text-align: center;
    line-height: 0.6rem;
    padding: 0.12rem 0;
    margin-top: 46px;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .billing .itemBillingFirst{
    padding: 0.16rem 0.32rem;
    display: flex;
  }
  .billing .itemBillingFirst p{
    color: #333;
    font-size: 0.3rem;
    width: 2rem;
  }
  .billing .itemBillingFirst span{
    color: #ff9900;
    font-size: 0.28rem;
  }
  .billing .listBilling{
    margin-bottom: 0.17rem;
  }
  .billing .listBilling li{
    position: relative;
    height: 0.6rem !important;
    padding: 0.16rem 0 !important;
  }
  .billing .itemName .rightInput{
    width: 4.2rem;
  }
  .rightLabel{
    color: #999;
    font-size: 0.28rem;
    display: flex;
  }
  .rightLabel label{
    position: absolute;
    top: 0.12rem;
    left:0;
    width: 0.3rem;
    height: 0.3rem;
    background: url("../assets/icon_radio.png") no-repeat;
    background-size: contain;
  }
  .rightLabel label.onClick{
    background: url("../assets/icon_radio_active.png") no-repeat;
    background-size: contain;
  }
  .rightLabel div{
    margin-right: 0.32rem;
    position: relative;
    height: 0.6rem;
    line-height: 0.6rem;
    padding-left: 0.34rem;
  }
  .rightLabel input{
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height:0.6rem;
  }
  .rightLabel span{
    padding-left: 0.06rem;
  }
  .billing .commonBtn{
    margin: 0.5rem auto 1rem;
  }
  .ftWrap{
    width:100%;
    background: #fff;
    height: 1rem;
    line-height: 1rem;
    position: absolute;
    bottom: 0;
    left:0;
    display: flex;
    justify-content: space-between;
  }
  .jeBox{
    display: flex;
  }
  .jeBox p{
    color: #ff9900;
    font-size: 0.32rem;
    padding-left: 0.45rem;
  }
  .jeBox .jeNum{
    font-size: 0.28rem;
    color: #999;
    padding-left: 0.2rem;
  }
  .submitBtn{
    width:2.4rem;
    background: #ff9900;
    text-align: center;
    color: #fff;
    font-size: 0.32rem;
  }
  .billing .addGoodsTitle{
    display: flex;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .billing .addGoodsTitle p:first-child{
    width: 28%;
    text-align: left;
  }
  .billing .addGoodsTitle p{
    height: 0.6rem;
    font-size: 0.28rem;
    color: #333;
    width: 24%;
    padding: 0.16rem 0;
    line-height: 0.6rem;
    text-align: center;
  }
  .billing .addGoodsList .goodsItem.je{
    color: #5db6fa;
  }
  .billing .addCon{
    font-size: 0.28rem;
    color: #ff9900;
    text-align: center;
    line-height: 0.6rem;
    padding: 0.16rem 0;
  }
  #app .billing .addGoodsList li{
    height: auto !important;
    border-bottom: 0.01rem solid #f2f2f2 !important;
  }
  .billing .addGoodsList .goodsItem{
    font-size: 0.28rem;
    color: #333;
    line-height: 0.6rem;
    width: 24%;
    text-align: center;
  }
  .billing .addGoodsList .spmcItem{
    width: 28%;
    font-size: 0.26rem;
    text-align: left;
    line-height: 0.4rem;
  }
  .spmcItem span{
    display: block;
    color: #999;
  }
  .spmcItem b{
    font-weight: normal;
  }
  .spmc{
    width: 100%;
  }
  .iconCode{
    position: absolute;
    right:-0.1rem;
  }
  .iconCode img{
    width:0.7rem;
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
