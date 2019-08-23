<template>
  <view-box ref="viewBox" class="goods_classify_sub_next5">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">税收分类编码</h2>
    </x-header>
    <div class="breadcrumbs">
      <p class="activeCrumbs firstCrumbs overflowCon" @click="returnPar">{{name}}</p>
      <p class="activeCrumbs">&gt;</p>
      <p class="activeCrumbs secondCrumbs overflowCon" @click="returnSub">{{name_sub}}</p>
      <p class="activeCrumbs">&gt;</p>
      <p class="activeCrumbs thirdCrumbs overflowCon" @click="returnSubNext1">{{name_sub_next1}}</p>
      <p class="activeCrumbs">&gt;</p>
      <p class="activeCrumbs fourthCrumbs overflowCon" @click="returnSubNext2">{{name_sub_next2}}</p>
      <p class="activeCrumbs">&gt;</p>
      <p class="activeCrumbs fifthCrumbs overflowCon" @click="returnSubNext3">{{name_sub_next3}}</p>
      <p class="activeCrumbs">&gt;</p>
      <p class="lastCrumbs overflowCon">{{name_sub_next4}}</p>
    </div>
    <ul class="commonList">
      <li v-for="item in childrenList" @click="jumpNext(item)">
        <p class="leftCon" v-if="item.children">{{item.name}}<b class="icon_arrow"></b></p>
        <p class="leftCon" v-if="!item.children">{{item.bm}}<br/>{{item.name}}</p>
      </li>
    </ul>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'

export default {
  name: 'GoodsClassifySubNext5',
  data(){
    return{
      data: this.$route.query.itemData,
      childrenList: [],
      name: this.$route.query.name,
      name_sub: this.$route.query.name_sub,
      name_sub_next1: this.$route.query.name_sub_next1,
      name_sub_next2: this.$route.query.name_sub_next2,
      name_sub_next3: this.$route.query.name_sub_next3,
      name_sub_next4: this.$route.query.itemData.name
    }
  },
  components:{
    ViewBox,
    XHeader
  },
  beforeRouteEnter(to, from, next){
    if(from.name=='GoodsClassifySubNext4'){
      next(vm => {
        vm.data = vm.$route.query.itemData;
        vm.childrenList = vm.data.children;
        vm.name = vm.$route.query.name;
        vm.name_sub = vm.$route.query.name_sub;
        vm.name_sub_next1 = vm.$route.query.name_sub_next1;
        vm.name_sub_next2 = vm.$route.query.name_sub_next2;
        vm.name_sub_next3 = vm.$route.query.name_sub_next3;
        vm.name_sub_next4 = vm.$route.query.itemData.name;
      });
    }else{
      next();
    }
  },
  methods:{
    jumpNext(data){
      this.$router.push({path:'/add_goods',query:{itemData: data}});
    },
    //返回一级分类
    returnPar(){
      this.$router.go(-5);
    },
    //返回二级分类
    returnSub(){
      this.$router.go(-4);
    },
    returnSubNext1(){
      this.$router.go(-3);
    },
    returnSubNext2(){
      this.$router.go(-2);
    },
    returnSubNext3(){
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
  .goods_classify_sub_next5 .leftCon{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .breadcrumbs{
    margin-top: 48px;
    padding: 0.3rem 0 0.32rem 0.32rem;
    display: flex;
  }
  .breadcrumbs p{
    font-size: 0.3rem;
    color: #333;
    padding-right: 0.06rem;
  }
  .breadcrumbs .activeCrumbs{
    color: #ff9900;
  }
  .breadcrumbs .firstCrumbs{
    max-width: 0.8rem;
  }
  .breadcrumbs .secondCrumbs{
    max-width: 0.8rem;
  }
  .breadcrumbs .thirdCrumbs{
    max-width: 0.8rem;
  }
  .breadcrumbs .fourthCrumbs{
    max-width: 0.8rem;
  }
  .breadcrumbs .fifthCrumbs{
    max-width: 0.8rem;
  }
  .breadcrumbs .lastCrumbs{
    max-width: 1.4rem;
    padding-right: 0;
  }
</style>
