import { createRouter, createWebHistory } from 'vue-router'

import BoardView from '@/views/BoardView.vue'
import HomeView from '@/views/HomeView.vue'
import PlaceDetail from '@/views/PlaceDetail.vue'
import PlacesDirectory from '@/views/PlacesDirectory.vue'
import PostDetail from '@/views/PostDetail.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/places', name: 'places', component: PlacesDirectory },
  { path: '/places/:id', name: 'place-detail', component: PlaceDetail, props: true },
  { path: '/board', name: 'board', component: BoardView },
  { path: '/board/:id', name: 'post-detail', component: PostDetail, props: true },
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
