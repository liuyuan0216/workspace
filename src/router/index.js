import Vue from 'vue'
import Router from 'vue-router'

/*hub*/
import Login from '@/pages/login/Login'
import HubOrderList from '@/pages/hub/OrderList'
import HubEntrust from '@/pages/hub/Entrust'
import HubMy from '@/pages/hub/My'

import HubForgetPassword from '@/pages/hub/ForgetPassword'
import HubChangePassword from '@/pages/hub/ChangePassword'
import HubBilling from '@/pages/hub/Billing'
import HubBillingCode from '@/pages/hub/BillingCode'
import HubBillingCodeAlone from '@/pages/hub/BillingCodeAlone'

import HubElectronicDetail from '@/pages/hub/ElectronicDetail'
import HubPaperDetail from '@/pages/hub/PaperDetail'

import HubPersonalInfor from '@/pages/hub/PersonalInfor'
import HubMyList from '@/pages/hub/MyList'
import HubMyTitleList from '@/pages/hub/MyTitleList'
import HubTitleList from '@/pages/hub/TitleList'
import HubGoodsList from '@/pages/hub/GoodsList'
import HubPrivacy from '@/pages/hub/Privacy'
import HubAbout from '@/pages/hub/About'
import HubTitleEdit from '@/pages/hub/TitleEdit'
import HubTitleInfor from '@/pages/hub/TitleInfor'
import HubCodeInfor from '@/pages/hub/CodeInfor'
import HubEditGoods from '@/pages/hub/EditGoods'
import HubAddGoods from '@/pages/hub/AddGoods'
import HubAddTitle from '@/pages/hub/AddTitle'
import HubSuccess from '@/pages/hub/Success'
import HubGoodsClassify from '@/pages/hub/GoodsClassify'
import HubGoodsClassifySub from '@/pages/hub/GoodsClassifySub'
import HubGoodsClassifySubNext1 from '@/pages/hub/GoodsClassifySubNext1'
import HubGoodsClassifySubNext2 from '@/pages/hub/GoodsClassifySubNext2'
import HubGoodsClassifySubNext3 from '@/pages/hub/GoodsClassifySubNext3'
import HubGoodsClassifySubNext4 from '@/pages/hub/GoodsClassifySubNext4'
import HubGoodsClassifySubNext5 from '@/pages/hub/GoodsClassifySubNext5'
import HubChooseGoods from '@/pages/hub/ChooseGoods'

/*desk*/
import DeskCreate from '@/pages/desk/Create'
import DeskOrderList from '@/pages/desk/OrderList'
import DeskEntrust from '@/pages/desk/Entrust'
import DeskMy from '@/pages/desk/My'

import DeskForgetPassword from '@/pages/desk/ForgetPassword'
import DeskChangePassword from '@/pages/desk/ChangePassword'
import DeskElectronicDetail from '@/pages/desk/ElectronicDetail'
import DeskBilling from '@/pages/desk/Billing'
import DeskBillingCode from '@/pages/desk/BillingCode'
import DeskBillingCodeAlone from '@/pages/desk/BillingCodeAlone'
import DeskSuccess from '@/pages/desk/Success'
import DeskCodeInfor from '@/pages/desk/CodeInfor'

import DeskPersonalInfor from '@/pages/desk/PersonalInfor'
import DeskMyList from '@/pages/desk/MyList'
import DeskBillingSetting from '@/pages/desk/BillingSetting'
import DeskGoodsList from '@/pages/desk/GoodsList'
import DeskPrivacy from '@/pages/desk/Privacy'
import DeskAbout from '@/pages/desk/About'
import DeskEditGoods from '@/pages/desk/EditGoods'
import DeskAddGoods from '@/pages/desk/AddGoods'
import DeskUnbindPhone from '@/pages/desk/UnbindPhone'
import DeskBindPhone from '@/pages/desk/BindPhone'

Vue.use(Router)

export default new Router({
  routes: [
    //首页
    {
      path: '/',
      name: 'Entrust',
      component: HubEntrust,
      meta: {
        auth: true
      }
    },
    //登录
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/list',
      name: 'OrderList',
      component: HubOrderList,
      meta: {
        keepAlive: true  // 需要被缓存
      }
    },
    {
      path: '/my',
      name: 'My',
      component: HubMy
    },
    //忘记密码
    {
      path: '/forget',
      name: 'ForgetPassword',
      component: HubForgetPassword
    },
    {
      path: '/change_password',
      name: 'ChangePassword',
      component: HubChangePassword
    },
    //电子详情
    {
      path: '/electronic_detail',
      name: 'ElectronicDetail',
      component: HubElectronicDetail
    },
    {
      path: '/paper_detail',
      name: 'PaperDetail',
      component: HubPaperDetail
    },
    //开票
    {
      path: '/billing',
      name: 'Billing',
      component: HubBilling,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/billing_code',
      name: 'BillingCode',
      component: HubBillingCode,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/billing_code_alone',
      name: 'BillingCodeAlone',
      component: HubBillingCodeAlone
    },
    {
      path: '/code_infor',
      name: 'CodeInfor',
      component: HubCodeInfor,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/success',
      name: 'Success',
      component: HubSuccess
    },
    {
      path: '/choose_goods',
      name: 'ChooseGoods',
      component: HubChooseGoods
    },
    //我的---
    {
      path: '/title_list',
      name: 'TitleList',
      component: HubTitleList
    },
    {
      path: '/goods_list',
      name: 'GoodsList',
      component: HubGoodsList
    },
    {
      path: '/personal_infor',
      name: 'PersonalInfor',
      component: HubPersonalInfor
    },

    {
      path: '/my_list',
      name: 'MyList',
      component: HubMyList
    },
    {
      path: '/my_title_list',
      name: 'MyTitleList',
      component: HubMyTitleList
    },
    {
      path: '/title_edit',
      name: 'TitleEdit',
      component: HubTitleEdit
    },
    {
      path: '/title_infor',
      name: 'TitleInfor',
      component: HubTitleInfor,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/edit_goods',
      name: 'EditGoods',
      component: HubEditGoods,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/add_goods',
      name: 'AddGoods',
      component: HubAddGoods,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/add_title',
      name: 'AddTitle',
      component: HubAddTitle
    },
    //隐私政策
    {
      path: '/privacy',
      name: 'Privacy',
      component: HubPrivacy
    },
    {
      path: '/about',
      name: 'About',
      component: HubAbout
    },
    {
      path: '/goods_classify',
      name: 'GoodsClassify',
      component: HubGoodsClassify,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    //编码分类
    {
      path: '/goods_classify_sub',
      name: 'GoodsClassifySub',
      component: HubGoodsClassifySub,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/goods_classify_sub_next1',
      name: 'GoodsClassifySubNext1',
      component: HubGoodsClassifySubNext1,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/goods_classify_sub_next2',
      name: 'GoodsClassifySubNext2',
      component: HubGoodsClassifySubNext2,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/goods_classify_sub_next3',
      name: 'GoodsClassifySubNext3',
      component: HubGoodsClassifySubNext3,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/goods_classify_sub_next4',
      name: 'GoodsClassifySubNext4',
      component: HubGoodsClassifySubNext4,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/goods_classify_sub_next5',
      name: 'GoodsClassifySubNext5',
      component: HubGoodsClassifySubNext5,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },



    /*desk*/
    {
      path: '/desk_create',
      name: 'DeskCreate',
      component: DeskCreate
    },
    {
      path: '/desk_entrust',
      name: 'DeskEntrust',
      component: DeskEntrust,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/desk_list',
      name: 'DeskOrderList',
      component: DeskOrderList,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/desk_my',
      name: 'DeskMy',
      component: DeskMy
    },
    //忘记密码
    {
      path: '/desk_forget',
      name: 'DeskForgetPassword',
      component: DeskForgetPassword
    },
    {
      path: '/desk_change_password',
      name: 'DeskChangePassword',
      component: DeskChangePassword
    },
    //修改手机号
    {
      path: '/desk_unbind_phone',
      name: 'DeskUnbindPhone',
      component: DeskUnbindPhone
    },
    {
      path: '/desk_bind_phone',
      name: 'DeskBindPhone',
      component: DeskBindPhone
    },
    //电子详情
    {
      path: '/desk_electronic_detail',
      name: 'DeskElectronicDetail',
      component: DeskElectronicDetail
    },
    //开票
    {
      path: '/desk_billing',
      name: 'DeskBilling',
      component: DeskBilling,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/desk_billing_code',
      name: 'DeskBillingCode',
      component: DeskBillingCode,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/desk_billing_code_alone',
      name: 'DeskBillingCodeAlone',
      component: DeskBillingCodeAlone
    },
    {
      path: '/desk_success',
      name: 'DeskSuccess',
      component: DeskSuccess
    },
    {
      path: '/desk_code_infor',
      name: 'DeskCodeInfor',
      component: DeskCodeInfor,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    //我的
    {
      path: '/desk_personal_infor',
      name: 'DeskPersonalInfor',
      component: DeskPersonalInfor
    },
    {
      path: '/desk_my_list',
      name: 'DeskMyList',
      component: DeskMyList
    },
    {
      path: '/desk_billing_setting',
      name: 'DeskBillingSetting',
      component: DeskBillingSetting
    },
    {
      path: '/desk_goods_list',
      name: 'DeskGoodsList',
      component: DeskGoodsList
    },
    {
      path: '/desk_privacy',
      name: 'DeskPrivacy',
      component: DeskPrivacy
    },
    {
      path: '/desk_about',
      name: 'DeskAbout',
      component: DeskAbout
    },
    {
      path: '/desk_edit_goods',
      name: 'DeskEditGoods',
      component: DeskEditGoods,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/desk_add_goods',
      name: 'DeskAddGoods',
      component: DeskAddGoods,
      meta: {
        keepAlive: true // 需要被缓存
      }
    }
  ]
})
