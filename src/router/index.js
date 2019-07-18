import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/Login'
import SwitchMode from '@/pages/SwitchMode'
import OrderList from '@/pages/OrderList'
import Entrust from '@/pages/Entrust'
import Billing from '@/pages/Billing'
import My from '@/pages/My'

import ForgetPassword from '@/pages/ForgetPassword'
import ElectronicDetail from '@/pages/ElectronicDetail'
import PaperDetail from '@/pages/PaperDetail'
import TitleList from '@/pages/TitleList'
import GoodsList from '@/pages/GoodsList'
import EntrustPhoto from '@/pages/EntrustPhoto'
import PersonalInfor from '@/pages/PersonalInfor'
import ChangePassword from '@/pages/ChangePassword'
import MyList from '@/pages/MyList'
import Again from '@/pages/Again'
import Express from '@/pages/Express'
import MyService from '@/pages/MyService'
import MyTitleList from '@/pages/MyTitleList'
import Contact from  '@/pages/Contact'
import ExpressList from '@/pages/ExpressList'
import TitleEdit from '@/pages/TitleEdit'
import TitleInfor from '@/pages/TitleInfor'
import CodeInfor from '@/pages/CodeInfor'
import AddGoods from '@/pages/AddGoods'
import Privacy from '@/pages/Privacy'
import About from '@/pages/About'

Vue.use(Router)

export default new Router({
  routes: [
    {  //委托开票
      path: '/',
      name: 'Entrust',
      component: Entrust
    },
    {  //发票列表
      path: '/list',
      name: 'OrderList',
      component: OrderList,
      meta: {
        keepAlive: true  // 需要被缓存
      }
    },
    {  //切换模式
      path: '/switch_mode',
      name: 'SwitchMode',
      component: SwitchMode
    },
    {  //登录
      path: '/login',
      name: 'Login',
      component: Login
    },
    {  //忘记密码
      path: '/forget',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {  //我的
      path: '/my',
      name: 'My',
      component: My
    },
    {  //电子详情
      path: '/electronic_detail',
      name: 'ElectronicDetail',
      component: ElectronicDetail
    },
    {  //纸质详情
      path: '/paper_detail',
      name: 'PaperDetail',
      component: PaperDetail
    },
    {  //开票
      path: '/billing',
      name: 'Billing',
      component: Billing,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {  //抬头列表
      path: '/title_list',
      name: 'TitleList',
      component: TitleList
    },
    {  //商品列表
      path: '/goods_list',
      name: 'GoodsList',
      component: GoodsList
    },
    {  //拍照委托
      path: '/entrust_photo',
      name: 'EntrustPhoto',
      component: EntrustPhoto
    },
    {  //个人信息
      path: '/personal_infor',
      name: 'PersonalInfor',
      component: PersonalInfor
    },
    {  //修改密码
      path: '/change_password',
      name: 'ChangePassword',
      component: ChangePassword
    },
    {  //我的发票列表
      path: '/my_list',
      name: 'MyList',
      component: MyList
    },
    {  //重新发送电子发票
      path: '/again',
      name: 'Again',
      component: Again
    },
    {  //物流状态
      path: '/express',
      name: 'Express',
      component: Express
    },
    {  //我的服务
      path: '/my_service',
      name: 'MyService',
      component: MyService
    },
    {  //我的发票抬头
      path: '/my_title_list',
      name: 'MyTitleList',
      component: MyTitleList
    },
    {  //联系我们
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {  //快递信息
      path: '/express_list',
      name: 'ExpressList',
      component: ExpressList
    },
    {  //编辑抬头
      path: '/title_edit',
      name: 'TitleEdit',
      component: TitleEdit
    },
    {  //抬头信息详情
      path: '/title_infor',
      name: 'TitleInfor',
      component: TitleInfor,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {  //二维码页面
      path: '/code_infor',
      name: 'CodeInfor',
      component: CodeInfor,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {  //开票-选择商品
      path: '/add_goods',
      name: 'AddGoods',
      component: AddGoods
    },
    {  //隐私政策
      path: '/privacy',
      name: 'Privacy',
      component: Privacy
    },
    {  //关于
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
