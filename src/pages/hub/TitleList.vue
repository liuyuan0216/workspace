<template>
  <view-box ref="viewBox">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">我的发票抬头</h2>
    </x-header>
    <ul class="titleList marginTop">
      <li>
        <h3 class="titleName overflowCon">公司名称公司名称公司名称公司名称公司名称</h3>
        <p class="titleNum">税号：1234566789</p>
      </li>
      <li>
        <h3 class="titleName overflowCon">公司名称公司名称公司名称公司名称公司名称</h3>
        <p class="titleNum">税号：1234566789</p>
      </li>
      <li>
        <h3 class="titleName overflowCon">公司名称公司名称公司名称公司名称公司名称</h3>
        <p class="titleNum">税号：1234566789</p>
      </li>
      <li>
        <h3 class="titleName overflowCon">公司名称公司名称公司名称公司名称公司名称</h3>
        <p class="titleNum">税号：1234566789</p>
      </li>
    </ul>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'

export default {
  name: 'TitleList',
  components:{
    ViewBox,
    XHeader
  }
}
</script>

<style scoped>
  .titleList{
    padding: 0 0.45rem;
  }
  .titleList li{
    background: #fff;
    padding: 0.32rem;
    border-radius: 0.12rem;
    margin-bottom: 0.32rem;
  }
  .titleName{
    font-size: 0.32rem;
    line-height: 0.6rem;
    font-weight: bold;
    color: #333;
  }
  .titleNum{
    font-size: 0.28rem;
    line-height: 0.42rem;
    color: #999;
    padding-top: 0.12rem;
  }
</style>
