<template>
  <view-box ref="viewBox" class="personal_infor">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback"></p>
      <h2 class="header_title">个人信息</h2>
    </x-header>
    <ul class="passwordList marginTop">
      <li>
        <p class="leftCon">登录用户名<span class="personName">{{phone}}</span></p>
      </li>
      <li>
        <p class="leftCon">公司名称<span class="personName">{{company}}</span></p>
      </li>
      <li>
        <p class="leftCon">税号<span class="personName">{{invoice}}</span></p>
      </li>
      <li>
        <p class="leftCon">开票机号<span class="personName">{{kpjh}}</span></p>
      </li>
    </ul>
    <ul class="passwordList">
      <li @click="changePassword">
        <p class="leftCon">修改密码<b class="icon_arrow"></b></p>
      </li>
    </ul>
    <ul class="passwordList">
      <li @click="changePhone">
        <p class="leftCon">修改手机号<b class="icon_arrow"></b></p>
      </li>
    </ul>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'

export default {
  name: 'PersonalInfor',
  data(){
    return{
      token: localStorage.getItem("token"),
      phone: localStorage.getItem("phone"),
      company: localStorage.getItem("company"),
      invoice: localStorage.getItem("invoice"),
      kpjh: localStorage.getItem("kpjh"),
      show: false,
      text: ''
    }
  },
  components:{
    ViewBox,
    XHeader
  },
  methods:{
    //修改密码
    changePassword(){
      this.$router.push({path:'/desk_change_password'});
    },
    //修改手机号
    changePhone(){
      this.$router.push({path:'/desk_unbind_phone'});
    },
    //返回上一页
    goback(){
      this.$router.push({path: '/desk_my'});
    }
  },
  mounted () {
    this.locationData();  //local
  }
}
</script>

<style lang="less">
  @import "../../../node_modules/vux/src/styles/reset.less";
  .personal_infor .passwordList{
    background: #fff;
    margin-bottom: 0.32rem;
  }
  .personal_infor .passwordList li{
    padding: 0.24rem 0.45rem;
    line-height: 0.6rem;
    border-bottom: 0.01rem solid #f2f2f2;
    display: flex;
    align-items: center;
  }
  .personal_infor .passwordList li:last-child{
    border: none;
  }
  .personal_infor .passwordList img{
    width:0.45rem;
  }
  .personal_infor .passwordList .leftCon{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .personal_infor .personWrap{
    padding: 0.2rem 0.45rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.32rem;
  }
  .personal_infor .personPhoto{
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding-left: 0.24rem;
    margin-right: 0.24rem;
  }
  .personal_infor .personWrap img{
    width: 1rem;
  }
  .personal_infor .personName{
    line-height: 0.6rem;
    padding-right: 0.32rem;
  }
  .personHdCon{
    font-size: 0.3rem;
    color: #333;
  }
  .personHdRight{
    display: flex;
    align-items: center;
    justify-content: space-between;
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
