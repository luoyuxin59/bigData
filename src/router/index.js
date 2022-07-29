import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from '../store'

// 解决重复点击报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    redirect: '/LibraryCollection'
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    children: [
      // 数据库采集 
      {
        path: '/LibraryCollection',
        name: 'LibraryCollection',
        component: () => import('@/views/DataCollection/LibraryCollection.vue'),
        meta: {
          keepAlive: true,
          requireAuth: true,
        }
      },
      // 接口采集
      {
        path: '/InterfaceCollect',
        name: 'InterfaceCollect',
        component: () => import('@/views/DataCollection/InterfaceCollect.vue')
      },
      // 数据入库 
      {
        path: '/DataLoad',
        name: 'DataLoad',
        component: () => import('@/views/DataCollection/DataLoad.vue')
      },
      // 新建表格
      {
        path: '/CreateTable',
        name: 'CreateTable',
        component: () => import('@/views/DataCollection/CreateTable.vue')

      },
      // 数据库采集数据清洗
      {
        path: '/LibraryClean',
        name: 'LibraryClean',
        component: () => import('@/views/DataCollection/LibraryClean.vue')
      },
      // 接口采集数据清洗
      {
        path: 'InterfaceClean',
        name: 'InterfaceClean',
        component: () => import('@/views/DataCollection/InterfaceClean.vue' )
      },
      // 半结构化数据自动采集
      {
        path: 'AutomaticCollection',
        name: 'AutomaticCollection',
        component: () => import('@/views/HalfStructure/AutomaticCollection.vue')
      },
      // 非结构化数据采集 
      {
        path: 'UnstructuredCollection',
        name: 'UnstructuredCollection',
        component: () => import('../views/HalfStructure/UnstructuredCollection.vue')
      },
      // 创建清洗规则1
      {
        path: 'CreateRules',
        name: 'CreateRules',
        component: () => import('../views/DataClean/CreateRules.vue')
      },
      // 创建规则组
      {
        path: 'CreateRuleGroup',
        name: 'CreateRuleGroup',
        component: () => import('../views/DataClean/CreateRuleGroup.vue')
      },
      // 新建类型转换规则
      {
        path: 'CreateTypeRules',
        name: 'CreateTypeRules',
        component: () => import('../views/DataClean/CreateTypeRules.vue')
      },
      // 查看类型转换规则
      {
        path: 'TypeRules',
        name: 'TypeRules',
        component: () => import('../views/DataClean/TypeRules.vue')
      },
       // 信度分析
       {
        path: 'Reliability',
        name: 'Reliability',
        component: () => import('../views/DataDnalysis/Reliability.vue')
      },
      // 加权换算
      {
        path: 'WeightedConversion',
        name: 'WeightedConversion',
        component: () => import('../views/DataDnalysis/WeightedConversion.vue')
      },
       // Logistic
       {
        path: 'Logistic',
        name: 'Logistic',
        component: () => import('../views/DataDnalysis/Logistic.vue')
      },
      //K-means
      {
        path: 'K-means',
        name: 'K-means',
        component: () => import('../views/DataDnalysis/K-means.vue')
      },
      {
        path: 'Factor',
        name: 'Factor',
        component: () => import('../views/DataDnalysis/Factor.vue')
      },
      {
        path: 'Retrieve',
        name: 'Retrieve',
        component: () => import('../views/DataCollection/Retrieve.vue')
      },
      {
        path: 'Set',
        name: 'Set',
        component: () => import('../views/DataCollection/Set.vue')
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('../views/DataDnalysis/report.vue')
      },
      {
        path: 'ID3',
        name: 'ID3',
        component: () => import('../views/DataDnalysis/ID3.vue')
      },
      {
        path: 'DataClear',
        name: 'DataClear',
        component: () => import('../views/DataClean/DataClear.vue')
      },
      {
        path: 'systemInfo',
        name: 'systemInfo',
        component: () => import('../views/system/systemInfo.vue')
      },
      // 清洗转换字典
      {
        path: 'clearDictionary',
        name: 'clearDictionary',
        component: () => import('../views/system/clearDictionary.vue')
      },
       // 字典管理
       {
        path: 'dictionaryManagement',
        name: 'dictionaryManagement',
        component: () => import('../views/system/dictionaryManagement.vue')
      },
      
    ]
  },
  {
    path: '/registered',
    name: 'Registered',
    component: () => import('@/views/Registered.vue')
  },
  {
    path: '/questionnaireList',
    name: 'List',
    component: () => import('@/views/Questionnaire/List.vue')
  },
  {
    path: '/Detail/id=:id',
    name: 'Detail',
    component: () => import('../views/Questionnaire/Detail.vue')
  },
  

]

const router = new VueRouter({
  routes,
  base: '/armedPolice/',
  // mode: 'history',
})

router.beforeEach((to,from,next) => {
  document.title = "军校大数据教学质量管评系统"
  if(to.path === '/login') return next()
  if(to.path === '/registered') return next()
  console.log(to.path);
  sessionStorage.setItem('toPath',to.path)
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  sessionStorage.setItem('path',from.name)
  next()
})
export default router
