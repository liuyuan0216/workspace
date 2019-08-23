<template>
  <view-box ref="viewBox" class="choose_goods">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:true, backText:''}"
    >
      <h2 class="header_title">选择商品</h2>
    </x-header>

  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'

export default {
  name: 'ChooseGoods',
  components:{
    ViewBox,
    XHeader
  },
}
</script>

<style scoped>

</style>
