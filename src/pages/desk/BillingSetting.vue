<template>
  <view-box ref="viewBox" class="billing_setting">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">开票设置</h2>
    </x-header>
    <ul class="commonList listBilling">
      <li class="itemBillingName">
        <p class="leftCon">扫码失效时间</p>
        <input type="text" class="rightInput failureTimeCon" v-model="failureTime" />
        <p class="textCon">单位（天）</p>
      </li>
      <li>
        <p class="leftCon">开票时间段</p>
        <p class="textCon">从</p>
        <select class="rightSelect" v-model="startTime">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <p class="textCon">点</p>
      </li>
      <li>
        <p class="leftCon"></p>
        <p class="textCon">至</p>
        <select class="rightSelect" v-model="endTime">
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
          <option value="24">24</option>
        </select>
        <p class="textCon">点</p>
      </li>
      <li>
        <p class="leftCon">开票限额</p>
        <select class="rightSelect" v-model="kpxe">
          <option value="t">千元版</option>
          <option value="th">万元版</option>
          <option value="oth">十万元版</option>
          <option value="million">百万元版</option>
          <option value="ten_million">千万元版</option>
          <option value="billions">亿元版</option>
        </select>
      </li>
    </ul>
    <ul class="commonList settingList">
      <li>
        <p class="leftCon">商品金额录入方式：</p>
      </li>
      <li>
        <div class="rightLabel">
          <div class="lxRadio" @click="chooseTypeOne">
            <label :class="{'onClick':isChecked=='one'}"></label>
            <input type="radio"/>
            <span>仅录入金额</span>
          </div>
        </div>
      </li>
      <li>
        <div class="rightLabel">
          <div class="lxRadio" @click="chooseTypeTwo">
            <label :class="{'onClick':isChecked=='two'}"></label>
            <input type="radio"/>
            <span>录入单价、数量</span>
          </div>
        </div>
      </li>
      <li>
        <div class="rightLabel">
          <div class="lxRadio" @click="chooseTypeThree">
            <label :class="{'onClick':isChecked=='three'}"></label>
            <input type="radio"/>
            <span>录入单价、金额</span>
          </div>
        </div>
      </li>
      <li>
        <div class="rightLabel">
          <div class="lxRadio" @click="chooseTypeFour">
            <label :class="{'onClick':isChecked=='four'}"></label>
            <input type="radio"/>
            <span>录入数量、金额</span>
          </div>
        </div>
      </li>
    </ul>
    <button class="commonBtn" @click="send">保存</button>
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
      @on-cancel="goIndex"
      @on-confirm="goLogin"
    >
      {{text}}
    </confirm>
    <toast v-model="showToast" type="text">保存成功</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Confirm from 'vux/src/components/confirm/index'
import Toast from 'vux/src/components/toast/index'

export default {
  name: 'BillingSetting',
  data(){
    return{
      failureTime: '',  //失效时间
      startTime: '9',
      endTime: '18',
      isChecked: 'one',
      billingType: sessionStorage.getItem('billingType'),
      popupsStatus: false,
      show: false,
      timer: null,
      showInvalid: false,
      showToast: false,
      text: '',
      kpxe: 't'
    }
  },
  components:{
    ViewBox,
    XHeader,
    Confirm,
    Toast
  },
  beforeRouteEnter(to, from, next){
    next(vm => {
      vm.billingType = sessionStorage.getItem('billingType');
      if(!vm.billingType){
        vm.isChecked = 'one';
        sessionStorage.setItem('billingType','one');
      }else if(vm.billingType=='one'){
        vm.isChecked = 'one';
      }else if(vm.billingType=='two'){
        vm.isChecked = 'two';
      }else if(vm.billingType=='three'){
        vm.isChecked = 'three';
      }else if(vm.billingType=='four'){
        vm.isChecked = 'four';
      }
    })
  },
  methods:{
    //弹窗显示
    showPopups () {
      if (this.popupsStatus) {
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    chooseTypeOne(){
      this.isChecked = 'one';
    },
    chooseTypeTwo(){
      this.isChecked = 'two';
    },
    chooseTypeThree(){
      this.isChecked = 'three';
    },
    chooseTypeFour(){
      this.isChecked = 'four';
    },
    //初始化数据
    getData(){
      var _this = this;
      var url = this.local+'/api/desk/getKpSet';
      var data = {
        userid: localStorage.getItem("token")
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          this.failureTime = response.failureTime;
          var kpsjd = response.kpsjd.split("-");
          if(kpsjd.length>1){
            this.startTime = kpsjd[0];
            this.endTime = kpsjd[1];
          }else{
            this.startTime = '9';
            this.endTime = '18';
          }
          //开票限额
          if(response.kpxe){
            this.kpxe = response.kpxe;
          }
          return
        }
        //手机号或密码不正确弹窗
        if(response.errcode==1003){   //登录用户失效
          this.showInvalid = true;
          this.text = '登录用户失效，请重新登录';
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
          return false
        }
        if(response.errcode==1016){
          this.showInvalid = true;
          this.text = '您的账号已在其他设备登录，请重新登录';
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
        }else{
          this.popupsStatus = true;
          this.showPopups();
          this.text = response.errmsg;
        }
      },function (error) {
        _this.popupsStatus = true;
        _this.showPopups();
        _this.text = '网络异常';
        console.log(error);
      });
    },
    //保存
    send(){
      //天数格式判断
      var val = (this.failureTime).toString();
      if(val.indexOf(".")>0){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '时间只能输入整数';
        return false
      }

      var _this = this;
      var url = this.local+'/api/desk/updateKpSet';
      var data = {
        userid: localStorage.getItem("token"),
        failureTime: this.failureTime,
        kpsjd: this.startTime+'-'+this.endTime,
        kpxe: this.kpxe
      }
      this.$ajaxjp(url, data, true, (response) =>{
        if(response.errcode==0){
          sessionStorage.setItem('billingType',this.isChecked);
          this.showToast = true;
          this.timer = setTimeout(() => {
            this.$router.push({path:'/desk_entrust'});
          }, 500)
          return
        }
        //手机号或密码不正确弹窗
        if(response.errcode==1003){   //登录用户失效
          this.showInvalid = true;
          this.text = '登录用户失效，请重新登录';
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
          return false
        }
        if(response.errcode==1016){
          this.showInvalid = true;
          this.text = '您的账号已在其他设备登录，请重新登录';
          //登录失效 重置
          var local_storage = window.localStorage;
          var session_storage = window.sessionStorage;
          local_storage.clear();  //清除localStorage
          session_storage.clear();  //清除sessionStorage
          return false
        }else{
          this.popupsStatus = true;
          this.showPopups();
          this.text = response.errmsg;
        }
      },function (error) {
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
    //取消回到首页
    goIndex(){
      this.$router.push({path:'/desk_entrust'});
    }
  },
  mounted () {
    this.locationData();  //local
    this.getData();
  }
}
</script>

<style scoped>
  .billing_setting .listBilling{
    margin-top: 64px;
  }
  .billing_setting .leftCon{
    width:2rem;
  }
  .textCon{
    font-size: 0.3rem;
    color: #333;
  }
  .billing_setting .rightInput{
    width:2rem;
  }
  .billing_setting .listBilling li:last-child .rightSelect{
    margin: 0;
    width: 3.4rem;
  }
  .billing_setting .rightSelect{
    font-size: 0.28rem;
    color: #333;
    border: 0.012rem solid #e0e0e0;
    background: none;
    border-radius: 0.08rem;
    line-height: 0.5rem;
    width: 2.4rem;
    height: 0.5rem;
    padding: 0 0.12rem;
    margin: 0 0.2rem;
    outline: none;
    /*去掉默认的下拉三角*/
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    background: url("../../assets/icon_task.png") no-repeat right center transparent;
  }
  .settingList{
    margin-top: 0.32rem;
  }
  .settingList .leftCon{
    width: auto;
  }
  .failureTimeCon{
    border: 0.012rem solid #e0e0e0;
    border-radius: 0.08rem;
    margin-right: 0.15rem;
    padding:0 0.12rem;
    color: #333;
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
    background: url("../../assets/icon_radio.png") no-repeat;
    background-size: contain;
  }
  .rightLabel label.onClick{
    background: url("../../assets/icon_radio_active.png") no-repeat;
    background-size: contain;
  }
  .rightLabel .lxRadio{
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
</style>
