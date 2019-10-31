<template>
  <view-box ref="viewBox" class="billing_code_alone">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback"></p>
      <p slot="right" class="header_right" @click="jumpMore">多明细开票</p>
      <h2 class="header_title">通知开票</h2>
    </x-header>
    <div class="commonList codeAloneSp marginTop">
      <p class="codeAloneTitle"><span class="leftLabel">*</span>商品选择<span class="codeAloneAdd" @click="jumpAddGoods">添加商品</span></p>
      <select
        class="codeAloneSelect"
        :class="sp_list.length==0?'codeAloneSelectNull':''"
        v-model="selectedOption"
        ref="spmc"
        @change="changeOption($event)"
      >
        <option v-for="item in sp_list">{{item.spmc}}</option>
        <option v-if="sp_list.length==0">请添加商品</option>
      </select>
    </div>

    <div class="commonList codeAloneJe" v-if="billingType=='one'">
      <p class="codeAloneTitle">金额<span class="leftLabel">*</span></p>
      <div class="codeAloneNum">
        <p class="leftCon">¥</p>
        <input
          type="number"
          class="rightInput"
          placeholder="请输入商品金额"
          ref="one_spje"
          v-on:input="priceNum($event)"
          @blur="spjeNum($event)">
        </input>
      </div>
    </div>

    <div class="djWrap" v-if="billingType=='two'">
      <div class="commonList">
        <p class="codeAloneTitle">单价<span class="leftLabel">*</span></p>
        <div class="codeAloneNum">
          <p class="leftCon">¥</p>
          <input
            type="number"
            class="rightInput"
            placeholder="请输入商品单价"
            ref="two_spdj"
            v-on:input="subNum($event)"
            @blur="spdjNum($event)">
          </input>
        </div>
      </div>
      <div class="commonList">
        <p class="codeAloneTitle">数量<span class="leftLabel">*</span></p>
        <div class="codeAloneNum">
          <input
            type="number"
            class="rightInput"
            placeholder="请输入商品数量"
            ref="two_spsl"
            v-on:input="subNum($event)"
            @blur="spslNum($event)">
          </input>
        </div>
      </div>
    </div>
    <div class="ftWrap" slot="bottom" v-if="billingType=='two'">
      <div class="jeBox">
        <p>合计金额：</p>
        <span class="jeNum">{{price}}</span>
      </div>
      <button class="submitBtn" @click="submitCode">生成二维码</button>
    </div>

    <div class="djWrap" v-if="billingType=='three'">
      <div class="commonList">
        <p class="codeAloneTitle">单价<span class="leftLabel">*</span></p>
        <div class="codeAloneNum">
          <p class="leftCon">¥</p>
          <input
            type="number"
            class="rightInput"
            placeholder="请输入商品单价"
            ref="three_spdj"
            v-on:input="subNum($event)"
            @blur="spdjNum($event)">
          </input>
        </div>
      </div>
      <div class="commonList">
        <p class="codeAloneTitle">金额<span class="leftLabel">*</span></p>
        <div class="codeAloneNum">
          <p class="leftCon">¥</p>
          <input
            type="number"
            class="rightInput"
            placeholder="请输入商品金额"
            ref="three_spje"
            v-on:input="priceNum($event)"
            @blur="spjeNum($event)">
          </input>
        </div>
      </div>
    </div>

    <div class="djWrap" v-if="billingType=='four'">
      <div class="commonList">
        <p class="codeAloneTitle">数量<span class="leftLabel">*</span></p>
        <div class="codeAloneNum">
          <input
            type="number"
            class="rightInput"
            placeholder="请输入商品数量"
            ref="four_spsl"
            v-on:input="subNum($event)"
            @blur="spslNum($event)">
          </input>
        </div>
      </div>
      <div class="commonList">
        <p class="codeAloneTitle">金额<span class="leftLabel">*</span></p>
        <div class="codeAloneNum">
          <p class="leftCon">¥</p>
          <input
            type="number"
            class="rightInput"
            placeholder="请输入商品金额"
            ref="four_spje"
            v-on:input="priceNum($event)"
            @blur="spjeNum($event)">
          </input>
        </div>
      </div>
    </div>
    <ul class="commonList listBilling">
      <li>
        <input type="text" class="rightInput bzInput" ref="bz" placeholder="添加备注（选填）"/>
      </li>
    </ul>
    <button class="commonBtn" @click="submitCode" v-if="billingType!='two'">生成二维码</button>
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
  name: 'BillingCodeAlone',
  data(){
    return {
      selectedOption: {},
      sp_list: [],
      sp_data: {},
      sp_dataArr: [],
      popupsStatus: false,
      show: false,
      text: '',
      showInvalid: false,
      showLoading: false,
      showToast: false,
      toastText: '提交成功',
      isDone: false,
      timer: null,
      price: 0,  //总金额
      billingType: sessionStorage.getItem('billingType')
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
    priceNum(e){
      var value = e.currentTarget.value;
      if(value){
        if(value.toString().split(".")[1]){
          if(value.toString().split(".")[1].length>2){
            e.currentTarget.value = Number(value).toFixed(2).toString();
          }
        }
      }
    },
    //初始化请求数据
    getData(){
      this.showLoading = false;
      //标记所操作的页面
      sessionStorage.setItem("codeModeType","alone");
      //开票设置的类型
      if(!this.billingType){
        this.billingType = 'one';
      }
      //请求下拉数据
      this.getSelectData();
    },
    //切换下拉商品名称
    changeOption(event){
      var index = event.target.selectedIndex;
      this.sp_data = this.sp_list[index];
      if(this.billingType=='two'){
        this.$refs.two_spdj.value = this.sp_list[index].spdj.toString();
      }
      if(this.billingType=='three'){
        this.$refs.three_spdj.value = this.sp_list[index].spdj.toString();
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
    //金额
    spjeNum(e){
      var value = e.currentTarget.value;
      if(value){
        //如果输入0.00
        if(value.toString().split(".")[1]){
          if (Number(value) < 0.01){
            if(this.billingType=='one'){
              this.$refs.one_spje.value = '0.01';
            }
            if(this.billingType=='three'){
              this.$refs.three_spje.value = '0.01';
            }
            if(this.billingType=='four'){
              this.$refs.four_spje.value = '0.01';
            }
          }
        }
      }
    },
    //单价
    spdjNum(e){
      var value = e.currentTarget.value;
      if(value){
        //如果输入0.00
        if(value.toString().split(".")[1]){
          if(Number(value)<0.000001){
            if(this.billingType=='two'){
              this.$refs.two_spdj.value = '0.000001';
            }
            if(this.billingType=='three'){
              this.$refs.three_spdj.value = '0.000001';
            }
          }
        }
        //如果有单价和数量 计算总额
        if(this.billingType=='two'){
          if(this.$refs.two_spsl.value){
            this.price = (Number(this.$refs.two_spdj.value)*Number(this.$refs.two_spsl.value)).toFixed(2);
          }else{
            this.price = 0;
          }
        }
      }else{
        this.price = 0;
      }
    },
    //数量
    spslNum(e){
      var value = e.currentTarget.value;
      if(value){
        //如果输入0.00
        if(value.toString().split(".")[1]){
          if(Number(value)<0.000001){
            if(this.billingType=='two'){
              this.$refs.two_spsl.value = '0.000001';
            }
            if(this.billingType=='four'){
              this.$refs.four_spsl.value = '0.000001';
            }
          }
        }
        //如果有单价和数量 计算总额
        if(this.billingType=='two'){
          if(this.$refs.two_spdj.value){
            this.price = (Number(this.$refs.two_spdj.value)*Number(this.$refs.two_spsl.value)).toFixed(2);
          }else{
            this.price = 0;
          }
        }
      }else{
        this.price = 0;
      }
    },
    //请求商品名称下拉数据
    getSelectData(){
      var _this = this;
      var url = this.local+'/api/desk/sp_list_all';
      var data = {
        userid: localStorage.getItem("token")
      }
      this.$ajaxjp(url, data, true,(response) =>{
        if(response.errcode==0){
          //下拉默认显示
          if(response.sp_list.length>0){
            _this.sp_list = response.sp_list;
            _this.selectedOption = _this.sp_list[0].spmc;
            _this.sp_data = _this.sp_list[0];
            //单价赋值
            if(_this.billingType=='two'){
              _this.$refs.two_spdj.value = _this.sp_list[0].spdj.toString();
            }
            if(_this.billingType=='three'){
              _this.$refs.three_spdj.value = _this.sp_list[0].spdj.toString();
            }
          }else{
            _this.selectedOption = '请添加商品';
          }
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
    },
    //生成二维码
    submitCode(){
      this.submit();
      var _this = this;
      if(this.isDone){ //通过了
        this.showLoading = true;  //loading
        var url = this.local+'/api/desk/submitFpSp';
        //金额添加到data对象里
        if(this.billingType=='one'){
          var one_je = {je:this.$refs.one_spje.value};
          this.sp_data = Object.assign({},this.sp_data,one_je)
          this.sp_dataArr.push(this.sp_data);
        }
        if(this.billingType=='two'){
          var spdj = this.$refs.two_spdj.value;
          var spsl = this.$refs.two_spsl.value;
          var data = {
            ggxh: this.sp_data.ggxh,
            jldw: this.sp_data.jldw,
            slv: this.sp_data.slv,
            spid: this.sp_data.spid,
            spmc: this.sp_data.spmc,
            spsl: spsl,
            spdj: spdj,
            je: this.price
          }
          this.sp_dataArr.push(data);
        }
        if(this.billingType=='three'){
          //金额和单价 计算数量
          var je = this.$refs.three_spje.value;
          var spdj = this.$refs.three_spdj.value;
          var spsl = (Number(je)/Number(spdj)).toString();
          //如果存在小数
          if(spsl.toString().split(".")[1]){
            if(spsl.toString().split(".")[1].length>6){
              spsl = Number(spsl).toFixed(6).toString();
            }
          }
          var data = {
            ggxh: this.sp_data.ggxh,
            jldw: this.sp_data.jldw,
            slv: this.sp_data.slv,
            spid: this.sp_data.spid,
            spmc: this.sp_data.spmc,
            spsl: spsl,
            spdj: spdj,
            je: je
          }
          this.sp_dataArr.push(data);
        }
        if(this.billingType=='four'){
          //金额和单价 计算数量
          var je = this.$refs.four_spje.value;
          var spsl = this.$refs.four_spsl.value;
          var spdj = (Number(je)/Number(spsl)).toString();
          //如果存在小数
          if(spdj.toString().split(".")[1]){
            if(spdj.toString().split(".")[1].length>6){
              spdj = Number(spdj).toFixed(6).toString();
            }
          }
          var data = {
            ggxh: this.sp_data.ggxh,
            jldw: this.sp_data.jldw,
            slv: this.sp_data.slv,
            spid: this.sp_data.spid,
            spmc: this.sp_data.spmc,
            spsl: spsl,
            spdj: spdj,
            je: je
          }
          this.sp_dataArr.push(data);
        }

        //转化为字符串
        var listData = JSON.stringify(this.sp_dataArr);
        var data = {
          userid: localStorage.getItem("token"),
          fpzl: 't',
          spxx: listData,
          bz: this.$refs.bz.value
        }
        this.$ajaxjp(url, data, true,(response) =>{
          if(response.errcode==0){
            this.showLoading = false;
            this.showToast = true;  //成功的提示
            this.timer = setTimeout(() => {
              this.$router.push({path:'/desk_code_infor',query:{data:response}});
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
      //金额
      if(this.billingType=='one'){
        if(!this.$refs.one_spje.value){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '金额不能为空';
          this.isDone = false;
          return false
        }
        if(this.$refs.one_spje.value){
          if(Number(this.$refs.one_spje.value)<0.01){
            this.popupsStatus = true;
            this.showPopups();
            this.text = '请正确填写含税金额';
            this.isDone = false;
            return false
          }
        }
      }
      if(this.billingType=='two'){
        if(!this.$refs.two_spdj.value){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '单价不能为空';
          this.isDone = false;
          return false
        }
        if(!this.$refs.two_spsl.value){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '数量不能为空';
          this.isDone = false;
          return false
        }
        if(this.$refs.two_spdj.value){
          if(Number(this.$refs.two_spdj.value)<0.000001){
            this.popupsStatus = true;
            this.showPopups();
            this.text = '请正确填写单价';
            this.isDone = false;
            return false
          }
        }
        if(this.$refs.two_spsl.value){
          if(Number(this.$refs.two_spsl.value)<0.000001){
            this.popupsStatus = true;
            this.showPopups();
            this.text = '请正确填写数量';
            this.isDone = false;
            return false
          }
        }
        if(Number(this.price)==0){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '合计金额不能为0';
          this.isDone = false;
          return false
        }
      }
      if(this.billingType=='three'){
        if(!this.$refs.three_spdj.value){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '单价不能为空';
          this.isDone = false;
          return false
        }
        if(!this.$refs.three_spje.value){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '金额不能为空';
          this.isDone = false;
          return false
        }
        if(this.$refs.three_spdj.value){
          if(Number(this.$refs.three_spdj.value)<0.000001){
            this.popupsStatus = true;
            this.showPopups();
            this.text = '请正确填写单价';
            this.isDone = false;
            return false
          }
        }
        if(this.$refs.three_spje.value){
          if(Number(this.$refs.three_spje.value)<0.01){
            this.popupsStatus = true;
            this.showPopups();
            this.text = '请正确填写含税金额';
            this.isDone = false;
            return false
          }
        }
      }
      if(this.billingType=='four'){
        if(!this.$refs.four_spsl.value){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '数量不能为空';
          this.isDone = false;
          return false
        }
        if(!this.$refs.four_spje.value){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '金额不能为空';
          this.isDone = false;
          return false
        }
        if(this.$refs.four_spsl.value){
          if(Number(this.$refs.four_spsl.value)<0.000001){
            this.popupsStatus = true;
            this.showPopups();
            this.text = '请正确填写数量';
            this.isDone = false;
            return false
          }
        }
        if(this.$refs.four_spje.value){
          if(Number(this.$refs.four_spje.value)<0.01){
            this.popupsStatus = true;
            this.showPopups();
            this.text = '请正确填写含税金额';
            this.isDone = false;
            return false
          }
        }
      }
      return this.isDone = true;
    },
    //返回上一页
    goback(){
      this.$router.push({path:'/desk_entrust'});
    },
    //重新登录
    goLogin(){
      this.$router.push({path:'/login'});
    },
    //跳转多明细开票
    jumpMore(){
      this.$router.push({path:'/desk_billing_code'});
    },
    //跳转添加商品
    jumpAddGoods(){
      sessionStorage.setItem("goodsStatus","add");
      this.$router.push({path:'/desk_add_goods'});
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
  @import "../../../node_modules/vux/src/styles/reset.less";
  .billing_code_alone .leftCon{
    font-size: 0.28rem;
  }
  .billing_code_alone .bzInput{
    width: 100% !important;
    color: #333;
  }
  .codeAloneSp{
    position: relative;
    margin-bottom: 0.32rem;
  }
  .codeAloneSp .leftLabel,.djWrap .leftLabel,.codeAloneJe .leftLabel{
    top: 0.36rem;
  }
  .codeAloneTitle{
    padding-top: 0.32rem;
    position: relative;
    font-size: 0.32rem;
    line-height: 0.4rem;
    display: flex;
    justify-content: space-between;
  }
  .codeAloneTitle .codeAloneAdd{
    color: #ff9900;
    font-size: 0.28rem;
  }
  .codeAloneSelect{
    display: block;
    margin: 0.45rem 0;
    font-size: 0.3rem;
    color: #333;
    border: 0.012rem solid #e0e0e0;
    background: none;
    border-radius: 0.08rem;
    line-height: 0.6rem;
    width: 100%;
    height: 0.6rem;
    padding: 0 0.12rem;
    outline: none;
    /*去掉默认的下拉三角*/
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    background: url("../../assets/icon_task.png") no-repeat right center transparent;
  }
  .codeAloneJe{
    margin-bottom: 0.32rem;
  }
  .codeAloneNum{
    margin: 0.45rem 0;
    display: flex;
    align-items: center;
    height: 0.46rem;
    line-height: 0.46rem;
  }
  .codeAloneNum .leftCon{
    font-size: 0.6rem;
    padding-left: 0.1rem;
    width:0.6rem;
  }
  .codeAloneNum .rightInput{
    font-size: 0.5rem;
    color: #5db6fa;
    height: auto;
  }
  .djWrap .codeAloneNum .rightInput{
    font-size: 0.5rem;
    color: #333;
    height: auto;
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
  .codeAloneSelectNull{
    color: #ccc;
  }
  .djWrap{
    margin-bottom: 0.32rem;
  }
  .djWrap .commonList:last-child{
    border-top: none;
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
