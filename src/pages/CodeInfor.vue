<template>
  <view-box ref="viewBox" class="code_infor">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="right" class="header_right" @click="close">关闭</p>
      <h2 class="header_title">开票</h2>
    </x-header>
    <ul class="commonList marginTop">
      <li>
        <p class="leftCon">提交时间</p>
        <p class="rightCon">{{data.create_time}}</p>
      </li>
      <li>
        <p class="leftCon">商品名称</p>
        <p class="rightCon">{{data.spmc}}</p>
      </li>
      <li>
        <p class="leftCon">发票金额</p>
        <p class="rightCon">{{je}}元</p>
      </li>
    </ul>
    <qrcode :value="qrcode" class="qrcode"></qrcode>
    <p class="qrcode_con">请出示给消费者<br/>消费者使用微信、支付宝扫码开票</p>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Qrcode from 'vux/src/components/qrcode'

export default {
  name: 'CodeInfor',
  data(){
    return{
      data: this.$route.query.data,
      je: '',
      qrcode: ''
    }
  },
  components:{
    ViewBox,
    XHeader,
    Qrcode
  },
  methods:{
    getData(){
      this.je = Number(this.data.je).toFixed(2);
      this.qrcode = this.data.url;
    },
    close(){
      this.$router.push({path:'/'});
    }
  },
  mounted(){
    this.getData();
  }
}
</script>

<style scoped>
  .header_right{
    color: #fff;
  }
  .qrcode{
    margin: 0.45rem auto 0;
    text-align: center;
  }
  .qrcode_con{
    color: #5F88FF;
    font-size: 0.32rem;
    line-height: 0.5rem;
    text-align: center;
  }
</style>
