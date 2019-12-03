import Vue from 'vue'
import VueRouter from 'vue-router'

// Views
import HomeView from '../views/Home.vue'
import LockeeView from '../views/Lockee.vue'
import KeyholderView from '../views/Keyholder.vue'
import LoginView from '../views/Login.vue'
import LogoutView from '../views/Logout.vue'
import StatsLocksView from '../views/StatsLocks.vue'
import DecisionManagerView from '../views/DecisionManager.vue'

// Utils
import { getSessionHeaders } from '@/utils/session'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      guest: true
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
    component: LoginView,
    meta: {
      guest: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutView,
    meta: {
      guest: true
    }
  },
  {
    path: '/stats/locks',
    name: 'stats-locks',
    component: StatsLocksView,
    meta: {
      guest: true
    }
  },
  {
    path: '/decision/manager',
    name: 'decision-manager',
    component: DecisionManagerView,
    meta: {
      requiresAuth: true
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
    console.log('router before => Auth required, Session stored, Proceed!', to.path)
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
