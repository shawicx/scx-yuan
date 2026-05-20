import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/wake-signal',
    name: 'WakeSignal',
    component: () => import('./scenes/WakeSignal.vue')
  },
  {
    path: '/frequency',
    name: 'Frequency',
    component: () => import('./scenes/Frequency.vue')
  },
  {
    path: '/fragments',
    name: 'Fragments',
    component: () => import('./scenes/FloatingFragments.vue')
  },
  {
    path: '/orbit',
    name: 'Orbit',
    component: () => import('./scenes/OrbitDrift.vue')
  },
  {
    path: '/transmission',
    name: 'Transmission',
    component: () => import('./scenes/LastTransmission.vue')
  },
  {
    path: '/',
    redirect: '/wake-signal'
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})