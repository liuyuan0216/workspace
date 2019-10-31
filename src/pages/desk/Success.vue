<template>
  <view-box ref="viewBox" class="success">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <h2 class="header_title">开票</h2>
    </x-header>
    <img class="successIcon" src="../../assets/icon_success.png" />
    <p class="successCon">提交成功</p>
    <div class="successBtn">
      <button class="commonBtn" @click="jumpBilling">继续开票</button>
      <button class="commonBtn" @click="jumpList">查看发票</button>
    </div>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'

export default {
  name: 'Success',
  components:{
    ViewBox,
    XHeader
  },
  methods:{
    jumpBilling(){
      this.$router.push({path:'/desk_billing'});
    },
    jumpList(){
      this.$router.push({path:'/desk_list'});
    }
  }
}
</script>

<style scoped>
  .successIcon{
    display: block;
    margin: 80px auto 0;
  }
  .successCon{
    font-size: 0.34rem;
    color: #333;
    text-align: center;
    line-height: 1rem;
  }
  .successBtn{
    display: flex;
    padding: 0 0.32rem;
  }
  .successBtn .commonBtn{
    width: 44%;
    margin: 0.72rem 3% 0;
  }
</style>
