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

    <p class="billingTitle">{{company}}</p>
    <ul class="commonList listBilling">
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
      <li v-show="modeType==1">
        <p class="leftCon">抬头类型</p>
        <div class="rightLabel">
          <div class="lxRadio" v-for="(item,index) in radios" :key="item.id">
            <label :class="{'onClick':item.isChecked}"></label>
            <input
              type="radio"
              v-model="radioType"
              :value="item.value"
              :checked='item.isChecked'
              @click="checkTt(index)"/>{{item.label}}
          </div>
        </div>
      </li>
    </ul>
    <ul class="commonList listBilling" v-show="modeType==1">
      <li class="itemBillingFirst" @click="jumpTitleList">
        <p>+ 选择抬头</p>
      </li>
      <li>
        <p class="leftCon">名称</p>
        <input type="text" class="rightInput" placeholder="请输入名称" ref="name" v-model="titleData.gfname"/>
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
    <div ref="listBox">
      <ul class="commonList listBilling ulList" v-for="(item,index) in spxx" :key="index">
        <li class="itemBillingName">
          <p class="leftCon">商品名称</p>
          <input type="hidden" class="spid" ref="spid" v-model="item.spid" />
          <input type="text" class="rightInput spmc" placeholder="请输入名称" v-model="item.spmc"/>
          <span class="chooseGoods" @click="jumpGoodsList">+ 选择商品</span>
        </li>
        <li>
          <p class="leftCon">规格型号</p>
          <input type="text" class="rightInput ggxh" placeholder="请输入规格型号" v-model="item.ggxh"/>
        </li>
        <li>
          <p class="leftCon">计算单位</p>
          <input type="text" class="rightInput jldw" placeholder="请输入计算单位"/>
        </li>
        <li>
          <p class="leftCon">税率</p>
          <select class="rightSelect slv" v-model="item.slv">
            <option>13%</option>
            <option>9%</option>
            <option>6%</option>
            <option>5%</option>
            <option>4%</option>
            <option>3%</option>
            <option>1.5%</option>
            <option>0</option>
          </select>
        </li>
        <li>
          <p class="leftCon">单价</p>
          <input
            type="number"
            class="rightInput spdj"
            placeholder="请输入单价"
            v-model="spdj"
            @change="spdjNum($event)" />
        </li>
        <li>
          <p class="leftCon">数量</p>
          <input
            type="number"
            class="rightInput spsl"
            placeholder="请输入数量"
            v-model="spsl"
            @change="spslNum($event)"/>
        </li>
        <li>
          <p class="leftCon">金额</p>
          <input
            type="number"
            class="rightInput je"
            placeholder="请输入金额"
            v-model="price"
            @change="jeNum($event)" />
        </li>
      </ul>
    </div>

    <!--<div class="addGoods" @click="addGoodsList">
      <img src="../assets/icon_plus_circle.png" />
      <p class="addGoodsCon">增加一条商品明细</p>
    </div>-->
    <div
      class="ftWrap"
      slot="bottom">
      <div class="jeBox">
        <p>合计金额：</p>
        <span class="jeNum">{{price||0}}</span>
      </div>
      <button class="submitBtn" @click="submitFpSp" v-show="modeType==0">生成二维码</button>
      <button class="submitBtn" @click="submitFpInfo" v-show="modeType==1">提交开票</button>
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
      modeType: '',
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
      title: '',
      popupsStatus: false,
      show: false,
      text: '',
      showUpdate: false,
      showInvalid: false,
      showLoading: false,
      showToast: false,
      //submit
      isDone: false,
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
      spxx: [
        {
          spid: '',
          spmc: '',
          ggxh: '',
          slv: '13%'
        }
      ],
      //data
      itemTitleData: this.$route.query.itemTitleData,
      itemGoodsData: this.$route.query.itemGoodsData,
      list: {},
      listAtrr: [],
      price: '',  //总金额
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
  inject: ['reload'],
  watch:{
    radioStatus: function(newval, oldval){
      console.log(newval, oldval);
    },
    checkedValue:function(){
      this.answer=[];
      this.answer.push(this.checkedValue);
    }
  },
  computed:{

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
    }else if(from.name=='GoodsList'){
      if(typeof(to.query.itemGoodsData)=='object'){
        fromparams_goods = to.query.itemGoodsData;
      }else{
        next();
        return
      }
      next(vm => {
        vm.goodsData = fromparams_goods;
        var slv = Number(vm.goodsData.slv)*100;
        vm.spxx = [
          {
            spid: vm.goodsData.spid,
            spmc: vm.goodsData.spmc,
            ggxh: vm.goodsData.ggxh,
            slv: slv+'%'
          }]
        vm.spdj = '';
        vm.spsl = '';
        vm.price = '';
      });
    }else{
      next(vm => {
        vm.modeType = localStorage.getItem("modeType");
        vm.fpzl_list_data = localStorage.getItem("fpzl_list");
        vm.fpzl_list = vm.fpzl_list_data.replace(/,/g, "");
        vm.company = localStorage.getItem("company");
        vm.titleData = [];
        vm.goodsData = [];
        vm.spxx = [
          {
            spid: '',
            spmc: '',
            ggxh: '',
            slv: '13%'
          }
        ]
        vm.spdj = '';
        vm.spsl = '';
        vm.price = '';
      });
    }
  },
  methods:{
    //初始化请求数据
    getData(){
      this.showLoading = false;
    },
    //发票类型
    checkFp(item){
      console.log(item)
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
    //change单价和数量
    spdjNum(e){
      if(e.currentTarget.value){
        this.spdj = Number(e.currentTarget.value).toFixed(2);
        //如果有单价和数量 计算总额
        if(this.spsl){
          this.price = (Number(this.spdj)*Number(this.spsl)).toFixed(2);
          return false
        }
        //如果有总额 计算数量
        if(this.price){
          this.spsl = (Number(this.price)/Number(this.spdj));
          //如果存在小数
          if((this.spsl).toString().split(".")[1]){
            if((this.spsl).toString().split(".")[1].length>6){
              this.spsl = (this.spsl).toFixed(6);
            }
          }
        }
      }else{
        this.spdj = (Number(this.price)/Number(this.spsl));
        //如果存在小数
        if((this.spdj).toString().split(".")[1]){
          if((this.spdj).toString().split(".")[1].length>6){
            this.spdj = (this.spdj).toFixed(6);
          }
        }
      }
    },
    spslNum(e){
      if(e.currentTarget.value){
        this.spsl = Number(e.currentTarget.value).toFixed(2);
        //如果有单价和数量 计算总额
        if(this.spdj){
          this.price = (Number(this.spdj)*Number(this.spsl)).toFixed(2);
          return false
        }
        //如果有总额 计算单价
        if(this.price){
          this.spdj = (Number(this.price)/Number(this.spsl));
          //如果存在小数
          if((this.spdj).toString().split(".")[1]){
            if((this.spdj).toString().split(".")[1].length>6){
              this.spdj = (this.spdj).toFixed(6);
            }
          }
        }
      }else{
        this.spsl = (Number(this.price)/Number(this.spdj));
        //如果存在小数
        if((this.spsl).toString().split(".")[1]){
          if((this.spsl).toString().split(".")[1].length>6){
            this.spsl = (this.spsl).toFixed(6);
          }
        }
      }
    },
    //金额控制数量
    jeNum(e){
      if(e.currentTarget.value){
        this.price = Number(e.currentTarget.value).toFixed(2);
        //如果有总额和数量 计算单价
        if(this.spsl){
          this.spdj = Number(this.price)/Number(this.spsl);
          //如果存在小数
          if((this.spdj).toString().split(".")[1]){
            if((this.spdj).toString().split(".")[1].length>6){
              this.spdj = (this.spdj).toFixed(6);
            }
          }
          return false
        }
        //如果有总额和单价 计算数量
        if(this.spdj){
          this.spsl = Number(this.price)/Number(this.spdj);
          //如果存在小数
          if((this.spsl).toString().split(".")[1]){
            if((this.spsl).toString().split(".")[1].length>6){
              this.spsl = (this.spsl).toFixed(6);
            }
          }
        }
      }else{
        if(this.spdj&&this.spsl){
          this.price = (Number(this.spdj)*Number(this.spsl)).toFixed(2);
        }
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
    //返回上一页
    goback(){
      this.$router.push({path:'/entrust'});
    },
    //手填模式 提交开票
    submitFpInfo(){
      this.submit();
      var _this = this;
      if(this.isDone){ //通过了
        this.showLoading = true;  //loading
        var listBox = this.$refs.listBox;
        var ul = listBox.getElementsByClassName("ulList");
        for(var i=0;i<ul.length;i++){
          var spid = ul[i].getElementsByClassName("spid");
          var spmc = ul[i].getElementsByClassName("spmc");
          var ggxh = ul[i].getElementsByClassName("ggxh");
          var jldw = ul[i].getElementsByClassName("jldw");
          var slv = ul[i].getElementsByClassName("slv");
          var spdj = ul[i].getElementsByClassName("spdj");
          var spsl = ul[i].getElementsByClassName("spsl");
          var je = ul[i].getElementsByClassName("je");
          var datadata =[{  //商品信息
            spid: spid[0].value,
            spmc: spmc[0].value,
            ggxh: ggxh[0].value,
            jldw: jldw[0].value,
            spsl: spsl[0].value,
            spdj: spdj[0].value,
            slv: slv[0].value,
            je: je[0].value
          }]
        }
        var url = this.local+'/api/user/submitFpInfo';
        var listData = JSON.stringify(datadata);
        //企业类型才有税号
        var shVal = this.$refs.sh.value;
        if(this.title_type==0){
          shVal = '';
        }
        var data = {
          userid: localStorage.getItem("token"),
          spxx: listData,
          name: this.$refs.name.value,
          title_type: this.title_type,  //抬头类型
          fpzl: this.fpzl,  //发票类型
          sh: shVal,
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
              this.$router.push({path:'/'});
            }, 500)
          }
          if(response.errcode==1003){   //登录用户失效
            this.showLoading = false;
            this.showInvalid = true;
            this.text = '登录用户失效，请重新登录';
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
    //扫码模式 商品开票
    submitFpSp(){
      this.submit();
      var _this = this;
      if(this.isDone){ //通过了
        this.showLoading = true;  //loading
        var listBox = this.$refs.listBox;
        var ul = listBox.getElementsByClassName("ulList");
        for(var i=0;i<ul.length;i++){
          var spid = ul[i].getElementsByClassName("spid");
          var spmc = ul[i].getElementsByClassName("spmc");
          var ggxh = ul[i].getElementsByClassName("ggxh");
          var jldw = ul[i].getElementsByClassName("jldw");
          var slv = ul[i].getElementsByClassName("slv");
          var spdj = ul[i].getElementsByClassName("spdj");
          var spsl = ul[i].getElementsByClassName("spsl");
          var je = ul[i].getElementsByClassName("je");
          var datadata =[{  //商品信息
            spid: spid[0].value,
            spmc: spmc[0].value,
            ggxh: ggxh[0].value,
            jldw: jldw[0].value,
            spsl: spsl[0].value,
            spdj: spdj[0].value,
            slv: slv[0].value,
            je: je[0].value
          }]
        }
        var url = this.local+'/api/user/submitFpSp';
        var listData = JSON.stringify(datadata);
        var data = {
          userid: localStorage.getItem("token"),
          fpzl: 't',
          spxx: listData
        }
        this.$ajaxjp(url, data, true,(response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;  //成功的提示
            this.timer = setTimeout(() => {
              this.$router.push({path:'/code_infor',query:{data:response}});
            }, 500)
          }
          if(response.errcode==1003){   //登录用户失效
            this.showLoading = false;
            this.showInvalid = true;
            this.text = '登录用户失效，请重新登录';
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
      if(this.modeType==1){
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
      }

      for(var i in this.spxx){
        var spmc = this.spxx[i].spmc;
        var slv = this.spxx[i].slv;
      }
      //商品名称
      if(!spmc){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '商品名称不能为空';
        this.isDone = false;
        return false
      }
      //税率
      if(!slv){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '税率不能为空';
        this.isDone = false;
        return false
      }
      //金额
      if(!this.price){
        this.popupsStatus = true;
        this.showPopups();
        this.title = '温馨提示';
        this.text = '金额不能为空';
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
      if(this.modeType==1){
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
      }
      return this.isDone = true;
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //增加一条商品明细
    addGoodsList(){
      var add =
        {
          spmc: '',
          ggxh: '',
          jldw: '',
          spsl: '',
          spdj: '',
          slv: '13%',
          je: ''
        };
      var obj = {};
      this.spxx.push(Object.assign(obj, add));
    },
    //跳转抬头列表
    jumpTitleList(){
      this.$router.push({path:'/my_title_list'});
    },
    //跳转商品列表
    jumpGoodsList(){
      this.$router.push({path:'/goods_list'});
    },
    //请重试
    tryAgain(){
      this.reload();
    }
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
  }
  .listBilling .rightInput{
    width:4.5rem;
  }
  .billingTitle{
    font-size: 0.3rem;
    color: #333;
    background: #fff;
    text-align: center;
    line-height: 0.6rem;
    padding: 0.24rem 0;
    margin-top: 46px;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .itemBillingFirst{
    text-align: center;
  }
  .itemBillingFirst p{
    width: 100%;
    font-size: 0.3rem;
    color: #ff9900;
  }
  .listBilling{
    margin-top: 0.32rem;
  }
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
  .itemBillingName .rightInput{
    width: 2.6rem;
  }
  .chooseGoods{
    font-size: 0.3rem;
    color: #ff9900;
    display: block;
    width: 2rem;
    text-align: right;
  }
  .addGoods{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0.6rem;
    line-height: 0.6rem;
    padding-top: 0.6rem;
  }
  .addGoods img{
    width:0.4rem;
    height:0.4rem;
  }
  .addGoodsCon{
    font-size: 0.28rem;
    color: #333;
    padding-left: 0.12rem;
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
  .billing .commonBtn{
    margin: 0.5rem auto 1rem;
  }
  .ftWrap{
    width:100%;
    background: #fff;
    height: 1.1rem;
    line-height: 1.1rem;
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
