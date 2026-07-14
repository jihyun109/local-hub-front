import { createRouter, createWebHistory } from 'vue-router'

import MainPage from '@/views/MainPage.vue'
import MapPage from '@/views/MapPage.vue'
import BoardList from '@/views/BoardList.vue'
import BoardWrite from '@/views/BoardWrite.vue'

const routes = [
  { path: '/', name: 'main', component: MainPage },
  { path: '/map', name: 'map', component: MapPage },
  { path: '/board', name: 'board', component: BoardList },
  { path: '/board/write', name: 'board-write', component: BoardWrite },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
