<template>
  <view-box ref="viewBox" class="express_list">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">快递信息</h2>
    </x-header>
    <div class="expressComm">
      <p class="expressStatus">运输中</p>
      <ul class="expressList">
        <li>
          <div class="expressLeft">
            <img src="../assets/img_service.png" />
          </div>
          <div class="expressRight">
            <p class="expressTitle overflowCon">北京盟度科技有限公司的发票北京盟度科技有限公司的发票</p>
            <span class="expressAddress overflowCon">运输到：【汕头市】分拨中心中转站分拨中心中转站</span>
          </div>
        </li>
        <li>
          <div class="expressLeft">
            <img src="../assets/img_service.png" />
          </div>
          <div class="expressRight">
            <p class="expressTitle overflowCon">北京盟度科技有限公司的发票</p>
            <span class="expressAddress overflowCon">运输到：【汕头市】分拨中心中转站分拨中心中转站</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="expressComm">
      <p class="expressStatus">已签收</p>
      <ul class="expressList">
        <li>
          <div class="expressLeft">
            <img src="../assets/img_service.png" />
          </div>
          <div class="expressRight">
            <p class="expressTitle overflowCon">北京盟度科技有限公司的发票</p>
            <span class="expressAddress overflowCon">运输到：【汕头市】分拨中心中转站分拨中心中转站</span>
          </div>
        </li>
        <li>
          <div class="expressLeft">
            <img src="../assets/img_service.png" />
          </div>
          <div class="expressRight">
            <p class="expressTitle overflowCon">北京盟度科技有限公司的发票</p>
            <span class="expressAddress overflowCon">运输到：【汕头市】分拨中心中转站分拨中心中转站</span>
          </div>
        </li>
      </ul>
    </div>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'

export default {
  name: 'ExpressList',
  components:{
    ViewBox,
    XHeader
  }
}
</script>

<style scoped>
  .expressComm{
    background: #fff;
    border-radius: 0.12rem;
    -moz-box-shadow:0px 1px 5px #ccc;/*firefox*/
    -webkit-box-shadow:0px 1px 5px #ccc;/*webkit*/
    box-shadow:0px 1px 5px #ccc;
    box-sizing: border-box;
    padding: 0.32rem;
    margin: 62px 0.32rem 0.32rem;
  }
  .express_list .expressComm:last-child{
    margin: 0.32rem;
  }
  .expressStatus{
    font-size: 0.32rem;
    color: #333;
    line-height: 0.6rem;
  }
  .expressList li{
    display: flex;
    align-items: center;
    padding: 0.32rem 0;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .expressList li:last-child{
    border:none;
  }
  .expressLeft{
    width: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .expressLeft img{
    width: 1.2rem;
  }
  .expressRight{
    width:4.2rem;
    padding-left: 0.32rem;
  }
  .expressTitle{
    font-size: 0.3rem;
    color: #333;
  }
  .expressAddress{
    color: #999;
    font-size: 0.28rem;
    display: block;
  }
</style>
