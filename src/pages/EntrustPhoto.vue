<template>
  <view-box ref="viewBox">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'取消', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback">取消</p>
      <p slot="right" class="header_right" @click="submit">发送</p>
      <h2 class="header_title">拍照委托</h2>
    </x-header>
    <div class="photoWrap">
      <textarea class="photoText" placeholder="有什么要告诉业务员的？" ref="textarea"></textarea>
    </div>
    <ul class="photoList">
      <li><img :src="url" /></li>
      <li class="photoAdd"><img src="../assets/icon_add.png" /></li>
    </ul>

    <confirm v-model="show" title="提示">{{text}}</confirm>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'
import Alert from 'vux/src/components/alert'
import Confirm from 'vux/src/components/Confirm'

export default {
  name: 'EntrustPhoto',
  data(){
    return{
      data: this.$route.query.data,
      url: '',
      show: false,
      text: '',
      popupsStatus: false,
      timer: null
    }
  },
  components:{
    ViewBox,
    XHeader,
    Alert,
    Confirm
  },
  methods:{
    //弹窗显示
    showPopups(){
      if (this.popupsStatus) {
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    //取消操作
    goback(){
      this.$router.go(-1);
    },
    //获取图片
    getData(){
      //this.url = JSON.parse(this.data);
    },
    //删除图片
    deleteImg:function(index){
      this.imgs.splice(index,1);
    },
    //保存
    submit(){
      var textareaCon = this.$refs.textarea.value;  //留言数据

      //成功后操作
      this.popupsStatus = true;
      this.showPopups();
      this.text = '保存成功！';
    }
  },
  mounted(){
    this.getData();
  },
  beforeDestroy(){
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  .header_left{
    color: #fff;
  }
  .header_right{
    color: #fff;
  }
  .photoWrap{
    height: 2rem;
    background: #fff;
    padding: 0.2rem 0.32rem;
    border-radius: 0.12rem;
    border: 0.012rem solid #f2f2f2;
    margin: 62px 0.32rem 0;
  }
  .photoText{
    width:100%;
    height: 2rem;
    border: none;
    font-size: 0.28rem;
    color: #999;
    line-height: 0.46rem;
  }
  .photoList{
    padding-left: 0.32rem;
    margin-top: 0.32rem;
    display: flex;
    flex-flow: wrap;
  }
  .photoList li{
    width:1.6rem;
    height:1.5rem;
    border: 0.01rem solid #f2f2f2;
    background: #fff;
    margin-right: 0.24rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .photoList li img{
    height: 1.5rem;
  }
  .photoList .photoAdd img{
    width: 0.75rem;
    height: 0.75rem;
  }
</style>
