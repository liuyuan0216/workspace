<template>
  <view-box ref="viewBox" class="contact">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">联系我们</h2>
    </x-header>
    <div class="contactWrap">
      <img src="../../assets/img_contact.png" />
      <ul class="commonList">
        <li>
          <p class="leftCon">联系电话</p>
          <p class="rightCon">400-888-8888</p>
        </li>
      </ul>
      <ul class="commonList">
        <li>
          <p class="leftCon">地址</p>
          <p class="rightCon">北京市海淀区北三环西路48号科技会展中心1号楼B座甲15层B室</p>
        </li>
      </ul>
    </div>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'

export default {
  name: 'Contact',
  components:{
    ViewBox,
    XHeader
  }
}
</script>

<style scoped>
  .contactWrap img{
    display: block;
    margin: 68px auto 0.2rem;
  }
  .contactWrap .commonList:last-child{
    margin-top: 0.32rem;
  }
  .contactWrap .rightCon{
    height: auto;
  }
</style>
