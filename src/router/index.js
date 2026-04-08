import Vue from 'vue'
import VueRouter from 'vue-router'
import WorkOrderScan from '../views/WorkOrderScan.vue'
import InspectionProcess from '../views/InspectionProcess.vue'
import Login from '../views/Login.vue'
import Setting from '../views/Setting.vue'
import Summary from '../views/Summary.vue'
import { jwtDecode } from 'jwt-decode'

Vue.use(VueRouter)

const routes = [
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/e_warranty.vue') },
  { path: '/table', component: () => import('../views/table.vue') },
  { path: '/report', name: 'report', component: () => import('../views/report.vue') },
  { path: '/viewer/:id', name: 'viewer', component: () => import('../views/viewer.vue') },
  { path: '/thankyou', component: () => import('../views/thx.vue') },
  { path: '/qrcode', component: () => import('../views/qrcode_link.vue') },
  { path: '/', name: 'WorkOrderScan', component: WorkOrderScan },
  { path: '/inspection/:workOrderId', name: 'InspectionProcess', component: InspectionProcess, props: true },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/settings',
    name: 'setting',
    component: Setting,
    meta: { requiresSupervisor: true }
  },
  {
    path: '/summary',
    name: 'summary',
    component: Summary,
    meta: { requiresSupervisor: true }
  }
]

// ✅ สร้าง router ก่อน
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// ✅ แล้วค่อยใส่ beforeEach
router.beforeEach((to, from, next) => {
  if (!to.meta.requiresSupervisor) return next()

  const token = localStorage.getItem('authToken')
  if (!token) return next({ path: '/login' })

  try {
    const decoded = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return next({ path: '/login' })
    }

    if (decoded.role === 'supervisor') {
      return next()
    } else {
      return next({ path: '/' })
    }

  } catch (e) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    return next({ path: '/login' })
  }
})

export default router