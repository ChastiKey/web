import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'
import LockeeView from '../views/Lockee.vue'
import KeyholderView from '../views/Keyholder.vue'
import Login from '../views/Login.vue'
import { getSessionHeaders } from '@/utils/session'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/lockee',
    name: 'lockee',
    component: LockeeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/keyholder',
    name: 'keyholder',
    component: KeyholderView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login/:session?',
    name: 'login',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: Login,
    meta: {
      guest: true
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const cachedSession = getSessionHeaders()

  console.log('route:', to.path)
  console.log('requiresAuth', requiresAuth)
  console.log('isCached', cachedSession.isCached)

  // Auth required + Session is MISSING
  if (requiresAuth && !cachedSession.isCached) {
    console.log('router before => Auth required, Re-routing to /login', to.path)
    next('/login')
  }
  if (requiresAuth && cachedSession.isCached) {
    console.log(
      'router before => Auth required, Session stored, Proceed!',
      to.path
    )
    // Auth required + Session is set
    next()
  }
  // Auth not required
  if (!requiresAuth) {
    console.log('router before => No Auth required!', to.path)
    next()
  }
})

export default router
