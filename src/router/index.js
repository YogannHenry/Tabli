import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/tables', name: 'TableList', component: () => import('../views/TableList.vue') },
  { path: '/tables/:id', name: 'TableDetail', component: () => import('../views/TableDetail.vue') },
  { path: '/train', name: 'TrainConfig', component: () => import('../views/TrainConfig.vue') },
  { path: '/quiz', name: 'QuizSession', component: () => import('../views/QuizSession.vue') },
  { path: '/progress', name: 'Progress', component: () => import('../views/Progress.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
