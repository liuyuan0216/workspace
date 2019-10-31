<template>
  <view-box ref="viewBox" class="edit_goods">
    <x-header
      slot="header"
      class="header"
      :left-options= "{showBack:false, backText:'', preventGoBack:true}"
    >
      <p slot="left" class="header_left" @click="goback"></p>
      <h2 class="header_title">明细录入</h2>
    </x-header>

    <ul class="commonList listBilling">
      <li class="itemBillingName">
        <p class="leftCon"><span class="leftLabel">*</span>商品名称</p>
        <input type="hidden" class="spid" ref="spid" v-model="goodsData.spid" />
        <input type="hidden" ref="bm" v-model="goodsData.bm" />
        <input type="hidden" ref="name" v-model="goodsData.name" />
        <input type="hidden" ref="yhzc" v-model="goodsData.yhzc" />
        <input type="hidden" ref="yhzcmc" v-model="goodsData.yhzcmc" />
        <input type="text" class="rightInput" ref="spmc" placeholder="请输入商品名称" v-model="goodsData.spmc"/>
        <span class="chooseGoods" @click="jumpGoodsList">+ 选择商品</span>
      </li>
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>税率</p>
        <select class="rightSelect" ref="slv" v-model="slv">
          <option>13%</option>
          <option>9%</option>
          <option>6%</option>
          <option>5%</option>
          <option>4%</option>
          <option>3%</option>
          <option>1.5%</option>
          <option>0%</option>
        </select>
      </li>
      <li>
        <p class="leftCon">规格型号</p>
        <input type="text" class="rightInput" ref="ggxh" placeholder="请输入规格型号" v-model="goodsData.ggxh"/>
      </li>
      <li>
        <p class="leftCon">计量单位</p>
        <input type="text" class="rightInput" ref="jldw" placeholder="请输入计量单位" v-model="goodsData.jldw"/>
      </li>
    </ul>
    <ul class="commonList addUl">
      <li>
        <p class="leftCon">含税单价</p>
        <input
          type="number"
          class="rightInput"
          placeholder="请输入含税单价"
          ref="spdj"
          v-on:input="subNum($event)"
          @blur="spdjNum($event)">
        </input>
      </li>
      <li>
        <p class="leftCon">商品数量</p>
        <input
          type="number"
          class="rightInput"
          placeholder="请输入商品数量"
          ref="spsl"
          v-on:input="subNum($event)"
          @blur="spslNum($event)">
        </input>
      </li>
      <li>
        <p class="leftCon"><span class="leftLabel">*</span>含税金额</p>
        <input
          type="number"
          class="rightInput"
          placeholder="请输入含税金额"
          ref="price"
          v-on:input="priceNum($event)"
          @blur="jeNum($event)">
        </input>
      </li>
    </ul>
    <div class="handleBtn" :class="deleteStatus?'deleteBtn':''">
      <button class="commonBtn deleteItem" @click="deleteData" v-if="deleteStatus">删除</button>
      <button class="commonBtn" @click="conserve">保存</button>
    </div>

    <confirm
      v-model="show"
      title="温馨提醒"
      confirm-text="确定"
      :show-cancel-button="false"
    >
      {{text}}
    </confirm>
    <loading v-model="showLoading" text=""></loading>
    <toast v-model="showToast" type="text">{{toastText}}</toast>
  </view-box>
</template>

<script>
import ViewBox from 'vux/src/components/view-box/index'
import XHeader from 'vux/src/components/x-header/index'
import Confirm from 'vux/src/components/confirm/index'
import Loading from 'vux/src/components/loading/index'
import Toast from 'vux/src/components/toast/index'

export default {
  name: 'EditGoods',
  data(){
    return{
      modeType: localStorage.getItem("modeType"),
      show: false,
      showLoading: false,
      showToast: false,
      text: '',
      isDone: false,
      timer: null,
      goodsData: [],
      itemGoodsData: this.$route.query.itemGoodsData,
      itemChangeData: this.$route.query.itemChangeData,
      changeStatus: this.$route.query.changeStatus,
      index: this.$route.query.index,
      slv: '13%',
      data: [],
      deleteStatus: false,
      toastText: '保存成功'
    }
  },
  components:{
    ViewBox,
    XHeader,
    Confirm,
    Loading,
    Toast
  },
  beforeRouteEnter(to, from, next){
    var fromparams_goods = [];
    var fromparams_change = [];
    if(from.name=='GoodsList'){
      if(typeof(to.query.itemGoodsData)=='object'){
        fromparams_goods = to.query.itemGoodsData;
      }else{
        next();
        return
      }
      next(vm => {
        vm.modeType = localStorage.getItem("modeType");
        vm.changeStatus = vm.$route.query.changeStatus;
        vm.index = vm.$route.query.index;
        vm.goodsData = fromparams_goods;
        vm.slv = Number(vm.goodsData.slv)*100+'%';
        vm.$refs.spdj.value = (vm.goodsData.spdj).toString();
        vm.$refs.spsl.value = '';
        vm.$refs.price.value = '';
      });
    }else if(from.name=='Billing'||from.name=='BillingCode'){
      if(typeof(to.query.itemChangeData)=='object'){
        fromparams_change = to.query.itemChangeData;
      }else{
        next(vm => {
          vm.modeType = localStorage.getItem("modeType");
          vm.changeStatus = vm.$route.query.changeStatus;
          vm.index = vm.$route.query.index;
          if(!vm.changeStatus){
            vm.deleteStatus = false;
          }
          vm.goodsData = [];
          vm.slv = '13%';
          vm.$refs.spdj.value = '';
          vm.$refs.spsl.value = '';
          vm.$refs.price.value = '';
        });
        return
      }
      next(vm => {
        vm.modeType = localStorage.getItem("modeType");
        vm.changeStatus = vm.$route.query.changeStatus;
        vm.index = vm.$route.query.index;
        if(vm.changeStatus){
          vm.deleteStatus = true;
        }
        vm.goodsData = fromparams_change;
        vm.slv = vm.goodsData.slv;
        vm.$refs.spdj.value = (vm.goodsData.spdj).toString();
        vm.$refs.spsl.value = vm.goodsData.spsl;
        vm.$refs.price.value = vm.goodsData.je;
      });
    }else{
      next();
    }
  },
  methods:{
    subNum(e){
      var value = e.currentTarget.value;
      if(value){
        if(value.toString().split(".")[1]){
          if(value.toString().split(".")[1].length>6){
            e.currentTarget.value = Number(value).toFixed(6).toString();
          }
        }
      }
    },
    priceNum(e){
      var value = e.currentTarget.value;
      if(value){
        if(value.toString().split(".")[1]){
          if(value.toString().split(".")[1].length>2){
            e.currentTarget.value = Number(value).toFixed(2).toString();
          }
        }
      }
    },
    getData(){
      if(this.changeStatus){
        this.deleteStatus = true;
      }
    },
    //change单价和数量
    spdjNum(e){
      var value = e.currentTarget.value;
      if(value){
        //如果输入0.00
        if(value.toString().split(".")[1]){
          if(Number(value)<0.000001){
            this.$refs.spdj.value = '0.000001';
          }
        }
        //如果有单价和数量 计算总额
        if(this.$refs.spsl.value){
          this.$refs.price.value = (Number(this.$refs.spdj.value)*Number(this.$refs.spsl.value)).toFixed(2).toString();
          return false
        }
        //如果有总额 计算数量
        if(this.$refs.price.value){
          if(Number(value)==0){
            this.$refs.spsl.value = '0';
            return
          }
          if(Number(this.$refs.price.value)==0){
            this.$refs.spsl.value = '0';
            return
          }
          this.$refs.spsl.value = (Number(this.$refs.price.value)/Number(this.$refs.spdj.value)).toString();
          //如果存在小数
          if((this.$refs.spsl.value).toString().split(".")[1]){
            if((this.$refs.spsl.value).toString().split(".")[1].length>6){
              this.$refs.spsl.value = Number(this.$refs.spsl.value).toFixed(6).toString();
            }
          }
        }
      }else{
        if(this.$refs.price.value&&this.$refs.spsl.value){
          if(Number(this.$refs.spsl.value)==0){
            this.$refs.spdj.value = '0';
            return
          }
          if(Number(this.$refs.price.value)==0){
            this.$refs.spdj.value = '0';
            return
          }
          this.$refs.spdj.value = (Number(this.$refs.price.value)/Number(this.$refs.spsl.value)).toString();
          //如果存在小数
          if((this.$refs.spdj.value).toString().split(".")[1]){
            if((this.$refs.spdj.value).toString().split(".")[1].length>6){
              this.$refs.spdj.value = Number(this.$refs.spdj.value).toFixed(6).toString();
            }
          }
        }
      }
    },
    spslNum(e){
      var value = e.currentTarget.value;
      if(value){
        //如果输入0.00
        if(value.toString().split(".")[1]){
          if (Number(value) < 0.000001){
            this.$refs.spsl.value = '0.000001';
          }
        }
        //如果有单价和数量 计算总额
        if(this.$refs.spdj.value){
          this.$refs.price.value = (Number(this.$refs.spdj.value)*Number(this.$refs.spsl.value)).toFixed(2).toString();
          return false
        }
        //如果有总额 计算单价
        if(this.$refs.price.value){
          if(Number(value)==0){
            this.$refs.spdj.value = '0';
            return
          }
          if(Number(this.$refs.price.value)==0){
            this.$refs.spdj.value = '0';
            return
          }
          this.$refs.spdj.value = (Number(this.$refs.price.value)/Number(this.$refs.spsl.value)).toString();
          //如果存在小数
          if((this.$refs.spdj.value).toString().split(".")[1]){
            if((this.$refs.spdj.value).toString().split(".")[1].length>6){
              this.$refs.spdj.value = Number(this.$refs.spdj.value).toFixed(6).toString();
            }
          }
        }
      }else{
        if(this.$refs.price.value&&this.$refs.spdj.value){
          if(Number(this.$refs.spdj.value)==0){
            this.$refs.spsl.value = '0';
            return
          }
          if(Number(this.$refs.price.value)==0){
            this.$refs.spsl.value = '0';
            return
          }
          this.$refs.spsl.value = (Number(this.$refs.price.value)/Number(this.$refs.spdj.value)).toString();
          //如果存在小数
          if((this.$refs.spsl.value).toString().split(".")[1]){
            if((this.$refs.spsl.value).toString().split(".")[1].length>6){
              this.$refs.spsl.value = Number(this.$refs.spsl.value).toFixed(6).toString();
            }
          }
        }
      }
    },
    //金额控制数量
    jeNum(e){
      var value = e.currentTarget.value;
      if(value){
        //如果有总额和数量 计算单价
        if(this.$refs.spsl.value){
          if(Number(this.$refs.spsl.value)==0){
            this.$refs.spdj.value = '0';
            return
          }
          if(Number(this.$refs.price.value)==0){
            this.$refs.spdj.value = '0';
            return
          }
          this.$refs.spdj.value = (Number(this.$refs.price.value)/Number(this.$refs.spsl.value)).toString();
          //如果存在小数
          if((this.$refs.spdj.value).toString().split(".")[1]){
            if((this.$refs.spdj.value).toString().split(".")[1].length>6){
              this.$refs.spdj.value = Number(this.$refs.spdj.value).toFixed(6).toString();
            }
          }
        }
        //如果有总额和单价 计算数量
        if(this.$refs.spdj.value){
          if(Number(this.$refs.spdj.value)==0){
            this.$refs.spsl.value = '0';
            return
          }
          if(Number(this.$refs.price.value)==0){
            this.$refs.spsl.value = '0';
            return
          }
          this.$refs.spsl.value = (Number(this.$refs.price.value)/Number(this.$refs.spdj.value)).toString();
          //如果存在小数
          if((this.$refs.spsl.value).toString().split(".")[1]){
            if((this.$refs.spsl.value).toString().split(".")[1].length>6){
              this.$refs.spsl.value = Number(this.$refs.spsl.value).toFixed(6).toString();
            }
          }
        }
      }else{
        if(this.$refs.spdj.value!=''&&this.$refs.spsl.value!=''){
          this.$refs.price.value = (Number(this.$refs.spdj.value)*Number(this.$refs.spsl.value)).toFixed(2).toString();
        }
      }
    },
    //弹窗显示
    showPopups(){
      if(this.popupsStatus){
        this.show = true;
        this.timer = setTimeout(() => {
          this.show = false;
        }, 3000)
      }
    },
    //保存
    conserve(){
      this.submit();
      if(this.isDone){ //通过了
        this.data = [
          {
            spid: this.$refs.spid.value,
            spmc: this.$refs.spmc.value,
            slv: this.slv,
            ggxh: this.$refs.ggxh.value,
            jldw: this.$refs.jldw.value,
            spdj: this.$refs.spdj.value,
            spsl: this.$refs.spsl.value,
            je: this.$refs.price.value,
            bm: this.$refs.bm.value,
            name: this.$refs.name.value,
            yhzc: this.$refs.yhzc.value,
            yhzcmc :this.$refs.yhzcmc.value
          }
        ]
        this.showToast = true;
        this.timer = setTimeout(() => {
          if(this.modeType=='1'){  //手填
            if(this.changeStatus){
              this.$router.push({path:'/billing',query:{itemGoodsData: this.data,changeStatus:'true',index:this.index,return:'true'}});
            }else{
              this.$router.push({path:'/billing',query:{itemGoodsData: this.data,return:'true'}});
            }
          }else if(this.modeType=='0'){  //开票
            if(this.changeStatus){
              this.$router.push({path:'/billing_code',query:{itemGoodsData: this.data,changeStatus:'true',index:this.index,return:'true'}});
            }else{
              this.$router.push({path:'/billing_code',query:{itemGoodsData: this.data,return:'true'}});
            }
          }
        }, 500)
      }
    },
    //删除
    deleteData(){
      this.showToast = true;
      this.toastText = '删除成功';
      this.timer = setTimeout(() => {
        if(this.modeType=='1'){  //手填
          this.$router.push({path:'/billing',query:{deleteStatus:'true',index:this.index}});
        }else if(this.modeType=='0'){  //开票
          this.$router.push({path:'/billing_code',query:{deleteStatus:'true',index:this.index}});
        }
      }, 500)
    },
    //表单验证
    submit(){
      //商品名称
      if(!this.$refs.spmc.value){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '商品名称不能为空';
        this.isDone = false;
        return false
      }
      //税率
      if(!this.$refs.slv.value){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '税率不能为空';
        this.isDone = false;
        return false
      }
      //金额
      if(!this.$refs.price.value){
        this.popupsStatus = true;
        this.showPopups();
        this.text = '含税金额不能为空';
        this.isDone = false;
        return false
      }
      if(this.$refs.spdj.value){
        if(Number(this.$refs.spdj.value)<0.000001){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '请正确填写含税单价';
          this.isDone = false;
          return false
        }
      }
      if(this.$refs.spsl.value){
        if(Number(this.$refs.spsl.value)<0.000001){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '请正确填写商品数量';
          this.isDone = false;
          return false
        }
      }
      if(this.$refs.price.value){
        if(Number(this.$refs.price.value)<0.01){
          this.popupsStatus = true;
          this.showPopups();
          this.text = '请正确填写含税金额';
          this.isDone = false;
          return false
        }
      }
      return this.isDone = true;
    },
    //跳转商品列表
    jumpGoodsList(){
      this.$router.push({path:'/goods_list'});
    },
    //返回上一页
    goback(){
      if(this.modeType=='1'){  //手填
        this.$router.push({path: '/billing'});
      }else if(this.modeType=='0'){  //开票
        this.$router.push({path: '/billing_code'});
      }
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
  .listBilling .rightInput{
    width:4.5rem;
  }
  .itemBillingFirst p{
    width: 100%;
    font-size: 0.3rem;
    color: #ff9900;
  }
  .edit_goods .listBilling{
    margin-top: 64px;
  }
  .rightSelect{
    font-size: 0.28rem;
    color: #333;
    border: 0.012rem solid #e0e0e0;
    background: none;
    border-radius: 0.08rem;
    line-height: 0.5rem;
    width: 3rem;
    height: 0.5rem;
    padding: 0 0.12rem;
    outline: none;
    /*去掉默认的下拉三角*/
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    background: url("../../assets/icon_task.png") no-repeat right center transparent;
  }
  .itemBillingName .rightInput{
    width: 3.2rem;
  }
  .chooseGoods{
    font-size: 0.3rem;
    color: #ff9900;
    display: block;
    width: 2rem;
    text-align: right;
  }
  .addUl{
    margin-top: 0.32rem;
  }
  .deleteBtn{
    display: flex;
    padding: 0 0.32rem;
  }
  .deleteBtn .commonBtn{
    width: 44%;
    margin: 0.72rem 3% 0;
  }
  .deleteBtn .deleteItem{
    background: #ccc;
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
