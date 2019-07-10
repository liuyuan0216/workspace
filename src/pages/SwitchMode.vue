<template>
  <view-box ref="viewBox" class="switch_mode">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback" v-if="fromMy"></p>
      <h2 class="header_title">开票模式</h2>
    </x-header>
    <div class="switchWrap">
      <p class="detailMag">开票模式选择</p>
      <div class="modes">
        <div class="modes_item" v-for="(item,index) in modes">
          <img src="../assets/icon_modes_code.png" v-if="item.label=='扫码开票模式'"/>
          <img src="../assets/icon_modes_write.png" v-if="item.label=='手填开票模式'"/>
          <p class="modes_con">{{item.label}}</p>
          <input
            type="radio"
            class="modes_radio"
            v-model="type"
            :value="item.value"
            :checked='item.isChecked'
            @click="checkModes(index)"
          >
          <span class="modes_icon" :class="{'onClick':item.isChecked}"></span>
        </div>
      </div>
      <ul class="commonList">
        <li>
          <p class="leftCon">扫码开票模式</p>
          <p class="rightCon">填商品、金额后生成发票提取二维码，消费者扫码填写抬头后获得电子发票</p>
        </li>
      </ul>
      <ul class="commonList">
        <li>
          <p class="leftCon">手填开票模式</p>
          <p class="rightCon">填写抬头、商品、金额后直接开票</p>
        </li>
      </ul>
      <button class="commonBtn" @click="jumpList">确定</button>
    </div>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box'
import XHeader from 'vux/src/components/x-header'

export default {
  name: 'SwitchMode',
  data(){
    return{
      modeType: localStorage.getItem("modeType"),
      checkedValue: "",
      type: 0,
      modes: [
        {
          label: '扫码开票模式',
          value: 0,
          isChecked: true,
        },
        {
          label: '手填开票模式',
          value: 1,
          isChecked: false,
        }
      ],
      fromMy: this.$route.query.fromMy,
    }
  },
  components:{
    ViewBox,
    XHeader
  },
  methods:{
    //默认获取modesType
    getModesType(){
      if(this.modeType){
        this.type = this.modeType;
        this.modes.forEach((item) => {
          item.isChecked = false;
        });
        this.modes[this.modeType].isChecked = true;
      }
    },
    //点击选择模式
    checkModes(index){
      this.modes.forEach((item) => {
        item.isChecked = false;
      });
      this.type = this.modes[index].value;
      this.modes[index].isChecked = true;
    },
    //返回上一页
    goback(){
      this.$router.push({path:'/my'});
    },
    //跳转列表页
    jumpList(){
      localStorage.setItem("modeType", this.type);
      this.$router.push({path:'/',query:{fromLogin:'true'}});
    }
  },
  mounted(){
    this.getModesType();
  }
}
</script>

<style scoped>
  .detailMag{
    font-size: 0.3rem;
    color: #333;
    line-height: 1rem;
    padding-left: 0.32rem;
    font-weight: bold;
    margin-top: 46px;
  }
  .modes{
    background: #fff;
    display: flex;
    justify-content: space-evenly;
    padding: 0.45rem 0;
  }
  .modes img{
    width: 2.2rem;
    display: block;
    margin: 0 auto;
  }
  .modes_item{
    text-align: center;
    position: relative;
    width: 50%;
  }
  .modes_con{
    font-size: 0.3rem;
    line-height: 0.8rem;
    color: #333;
  }
  .switch_mode .commonList{
    margin-top: 0.32rem;
  }
  .switch_mode .commonList li{
    align-items: baseline;
  }
  .switch_mode .leftCon{
    width: 2.3rem;
  }
  .switch_mode .rightCon{
    height: auto;
  }
  .modes_radio{
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 2.2rem;
    height: 3.5rem;
  }
  .modes_icon{
    margin: 0 auto;
    display: block;
    width: 0.4rem;
    height: 0.4rem;
    background: url("../assets/icon_radio.png") no-repeat;
    background-size: contain;
  }
  .modes_icon.onClick{
    background: url("../assets/icon_radio_active.png") no-repeat;
    background-size: contain;
  }

  /*back icon*/
  .header_left{
    position: absolute;
    width: 30px;
    height: 30px;
    top: -5px;
    left: -5px;
  }
  .header_left:before{
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid #fff;
    border-width: 1px 0 0 1px;
    -webkit-transform: rotate(315deg);
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
  }
</style>
