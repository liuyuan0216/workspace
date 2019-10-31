<template>
  <view-box ref="viewBox" class="goods_classify_sub">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">税收分类编码</h2>
    </x-header>
    <div class="breadcrumbs">
      <p class="activeCrumbs" @click="returnPar">{{name}}</p>
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
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'

export default {
  name: 'GoodsClassifySub',
  data(){
    return{
      data: this.$route.query.itemData,
      childrenList: [],
      name: this.$route.query.itemData.name
    }
  },
  components:{
    ViewBox,
    XHeader
  },
  beforeRouteEnter(to, from, next){
    if(from.name=='GoodsClassify'){
      next(vm => {
        vm.data = vm.$route.query.itemData;
        vm.childrenList = vm.data.children;
        vm.name = vm.$route.query.itemData.name;
      });
    }else{
      next();
    }
  },
  methods:{
    jumpNext(data){
      if(data.children){
        this.$router.push({path:'/goods_classify_sub_next1',query:{itemData: data,name:this.name}});
      }else{
        this.$router.push({path:'/add_goods',query:{itemData: data}});
      }
    },
    //返回一级分类
    returnPar(){
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
  .goods_classify_sub .leftCon{
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
    padding-right: 0.1rem;
  }
  .breadcrumbs .activeCrumbs{
    color: #ff9900;
  }
</style>
