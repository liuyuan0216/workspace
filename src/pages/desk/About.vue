<template>
  <view-box ref="viewBox" class="about">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">关于</h2>
    </x-header>
    <img src="../../assets/logo.png" class="logo" />
    <ul class="commonList">
      <li>
        <p class="leftCon">软件名称</p>
        <p class="rightCon">财开心</p>
      </li>
    </ul>
    <ul class="commonList aboutList">
      <li>
        <p class="leftCon">版本号</p>
        <p class="rightCon">{{this.version}}</p>
      </li>
    </ul>
    <div class="aboutBtCon">
      <p class="aboutCompany">北京盟度知汇科技有限公司</p>
      <span class="aboutCopy">Copyright © 2019 MOREDO. All rights reserved</span>
    </div>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'

export default {
  name: 'About',
  data(){
    return{
      version: ''
    }
  },
  components:{
    ViewBox,
    XHeader
  },
  mounted(){
    this.locationData();  //local
  }
}
</script>

<style scoped>
  .aboutList{
    margin-top: 0.32rem;
  }
  .aboutBtCon{
    text-align: center;
    position: fixed;
    bottom: 0.4rem;
    left: 0;
    width: 100%;
  }
  .aboutCompany{
    font-size: 0.28rem;
    line-height: 0.44rem;
    color: #333;
  }
  .aboutCopy{
    font-size: 0.26rem;
    color: #999;
    display: block;
  }
  .logo{
    display: block;
    width: 1.7rem;
    height: 1.7rem;
    margin: 75px auto 0.6rem;
  }
</style>
