import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import HomeView from '../views/qrcode_mock.vue'
import WorkOrderScan from '../views/WorkOrderScan.vue'
import InspectionProcess from '../views/InspectionProcess.vue'
import Login from '../views/Login.vue'
import Setting from '../views/Setting.vue'
import Summerize from '../views/Summerize.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/e_warranty.vue')
  },
  {
    path: '/table',
    name: 'dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/table.vue')
  },
  {
    path: '/report',
    name: 'report',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/report.vue')
  },
  {
    path: '/viewer/:id',
    name: 'viewer',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/viewer.vue')
  },
  {
    path: '/thankyou',
    name: 'viewer',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/thx.vue')
  },
  {
    path: '/qrcode',
    name: 'viewer',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/qrcode_link.vue')
  },
  {
    path: '/',
    name: 'WorkOrderScan',
    component: WorkOrderScan
  },
  {
    path: '/inspection/:workOrderId',
    name: 'InspectionProcess',
    component: InspectionProcess,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: true
  },
  {
    path: '/settings',
    name: 'setting',
    component: Setting,
    props: true
  },
  {
    path: '/summerize',
    name: 'summerize',
    component: Summerize,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
