<template>
  <view-box ref="viewBox" class="my_service">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">我的服务</h2>
    </x-header>
    <div class="serviceHd">
      <div class="serviceHdWrap">
        <div class="serviceHdImg"><img src="../../assets/img_service.png" /></div>
        <h4 class="serviceHdName">东升会计师事务所</h4>
        <p class="serviceHdDesc">东审入围全国百强北京会计师事务所,一般纳税人企业,40家分区覆盖全北京,5A级税务事务所</p>
      </div>
    </div>
    <ul class="serviceList">
      <li data-key="0" @click="slide($event)">
        <p class="itemTab" :class="key==0?'activeCon':''">审计服务</p>
        <span class="tabCon" v-show="key==0">会计报表审计、财务专项审计、内控调查、评价及绩效评价业务、企业集团审计、财务调查、商定程序审计、企业经济效益审计、基本建设项目竣工决算审计、司法签定审计、系统风险评估审计</span>
      </li>
      <li data-key="1" @click="slide($event)">
        <p class="itemTab" :class="key==1?'activeCon':''">验资服务</p>
        <span class="tabCon" v-show="key==1">会计报表审计、财务专项审计、内控调查、评价及绩效评价业务、企业集团审计、财务调查、商定程序审计、企业经济效益审计、基本建设项目竣工决算审计、司法签定审计、系统风险评估审计</span>
      </li>
      <li data-key="2" @click="slide($event)">
        <p class="itemTab" :class="key==2?'activeCon':''">税务审计服务</p>
        <span class="tabCon" v-show="key==2">会计报表审计、财务专项审计、内控调查、评价及绩效评价业务、企业集团审计、财务调查、商定程序审计、企业经济效益审计、基本建设项目竣工决算审计、司法签定审计、系统风险评估审计</span>
      </li>
      <li data-key="3" @click="slide($event)">
        <p class="itemTab" :class="key==3?'activeCon':''">资产评估服务</p>
        <span class="tabCon" v-show="key==3">会计报表审计、财务专项审计、内控调查、评价及绩效评价业务、企业集团审计、财务调查、商定程序审计、企业经济效益审计、基本建设项目竣工决算审计、司法签定审计、系统风险评估审计</span>
      </li>
    </ul>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'

export default {
  name: 'MyService',
  data(){
    return{
      key: 0
    }
  },
  components:{
    ViewBox,
    XHeader
  },
  methods:{
    slide(e){
      this.key=e.currentTarget.getAttribute("data-key");
    }
  }
}
</script>

<style scoped>
  .serviceHd{
    height: 3rem;
    background: #ff9900;
    padding: 0 0.45rem;
    margin-top: 46px;
  }
  .serviceHdWrap{
    width:100%;
    background: #fff;
    border-radius: 0.12rem;
    -moz-box-shadow:0px 1px 5px #ccc;/*firefox*/
    -webkit-box-shadow:0px 1px 5px #ccc;/*webkit*/
    box-shadow:0px 1px 5px #ccc;
    box-sizing: border-box;
    padding: 0.32rem 0.32rem 0.6rem;
  }
  .serviceHdImg{
    width: 1.65rem;
    height: 1.65rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 0.12rem;
  }
  .serviceHdWrap img{
    display: block;
    width: 1.65rem;
  }
  .serviceHdName{
    font-size: 0.32rem;
    font-weight: bold;
    color: #333;
    line-height: 0.8rem;
    text-align: center;
  }
  .serviceHdDesc{
    padding-top: 0.24rem;
    font-size: 0.28rem;
    color: #999;
    line-height: 0.45rem;
  }
  .serviceList{
    border-top: 0.01rem solid #f2f2f2;
    background: #fff;
    margin-top: 2rem;
  }
  .serviceList li{
    font-size: 0.3rem;
    line-height: 0.6rem;
  }
  .itemTab{
    padding: 0.24rem 0.45rem;
    font-size: 0.3rem;
    color: #333;
    font-weight: bold;
    text-align: center;
    border-bottom: 0.01rem solid #f2f2f2;
  }
  .tabCon{
    display: block;
    font-size: 0.28rem;
    color: #999;
    line-height: 0.46rem;
    padding: 0.24rem 0.32rem;
    border-bottom: 0.01rem solid #f2f2f2;
  }
</style>
