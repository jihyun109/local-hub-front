<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

import {
  districts,
  increaseViews,
  loadDistricts,
  loadPlaces,
  openWriteModal,
  posts,
  toggleLike,
} from '@/store'

const router = useRouter()

onMounted(() => {
  loadDistricts().catch(() => {})
  loadPlaces().catch(() => {})
})

const filters = reactive({
  category: '',
  district: '',
  keyword: '',
})

const filteredPosts = computed(() => {
  const keyword = (filters.keyword || '').trim().toLowerCase()

  return posts.value.filter((post) => {
    const categoryCode = post.category || 'REVIEW'
    const matchCategory = !filters.category || categoryCode === filters.category
    const matchDistrict = !filters.district || post.district === filters.district
    const matchKeyword =
      !keyword ||
      (post.title || '').toLowerCase().includes(keyword) ||
      (post.content || '').toLowerCase().includes(keyword) ||
      (post.place_name || '').toLowerCase().includes(keyword)

    return matchCategory && matchDistrict && matchKeyword
  })
})

const viewPost = (post) => {
  increaseViews(post)
  router.push({ name: 'post-detail', params: { id: post.id } })
}
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col items-start justify-between gap-4 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center"
    >
      <div>
        <h1 class="text-busan-primary flex items-center gap-2 text-xl font-extrabold">
          <i class="fa-regular fa-comments text-busan-accent"></i>
          <span> 로컬 상권 홍보 &amp; 후기 광장</span>
        </h1>
        <p class="mt-1 text-xs text-gray-500">
          부산의 축제 소감, 숨은 맛집, 제휴 상업 광고 등을 자유롭게
          공유하세요.
        </p>
      </div>
      <button
        class="bg-busan-accent hover:bg-busan-accent/90 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
        @click="openWriteModal"
      >
        <i class="fa-solid fa-pen"></i> 소통글 쓰기
      </button>
    </div>

    <!-- 필터 -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm"
    >
      <div class="flex gap-2">
        <button
          class="rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
          :class="filters.category === '' ? 'bg-busan-primary text-white' : 'bg-busan-sand text-gray-600'"
          @click="filters.category = ''"
        >
          전체 수다
        </button>
        <button
          class="rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
          :class="
            filters.category === 'REVIEW'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-busan-sand text-gray-600'
          "
          @click="filters.category = 'REVIEW'"
        >
          💬 축제 후기
        </button>
        <button
          class="rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
          :class="
            filters.category === 'AD' ? 'bg-rose-100 text-rose-800' : 'bg-busan-sand text-gray-600'
          "
          @click="filters.category = 'AD'"
        >
          📢 제휴 홍보
        </button>
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="filters.district"
          class="bg-busan-sand rounded-xl border px-3 py-1.5 text-xs font-bold focus:outline-none"
        >
          <option value="">모든 자치구</option>
          <option v-for="dist in districts" :key="dist.id" :value="dist.name">{{ dist.name }}</option>
        </select>
        <input
          v-model="filters.keyword"
          type="text"
          placeholder="제목/내용/장소 통합검색"
          class="bg-busan-sand rounded-xl border px-3.5 py-1.5 text-xs focus:outline-none"
        />
      </div>
    </div>

    <!-- 목록 -->
    <div class="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="bg-busan-light text-busan-deep border-b text-xs font-bold">
              <th class="px-6 py-4">유형</th>
              <th class="w-1/2 px-6 py-4">글 제목</th>
              <th class="px-6 py-4">필명</th>
              <th class="px-6 py-4 text-center">조회수</th>
              <th class="px-6 py-4 text-center">좋아요</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-xs sm:text-sm">
            <tr
              v-for="post in filteredPosts"
              :key="post.id"
              class="hover:bg-busan-sand/10 transition-colors"
            >
              <td class="px-6 py-4">
                <span
                  class="rounded-full px-2.5 py-1 text-[10px] font-extrabold"
                  :class="
                    (post.category || 'REVIEW') === 'AD'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  "
                >
                  {{ (post.category || 'REVIEW') === 'AD' ? '홍보/광고' : '축제 후기' }}
                </span>
              </td>
              <td class="px-6 py-4 font-semibold">
                <div class="flex flex-col gap-0.5">
                  <button
                    class="text-busan-primary hover:text-busan-accent text-left font-bold"
                    @click="viewPost(post)"
                  >
                    {{ post.title }}
                  </button>
                  <span
                    v-if="post.place_name"
                    class="flex items-center gap-1 text-[9px] font-bold text-gray-400"
                  >
                    <i class="fa-solid fa-link"></i>{{ post.place_name }} ({{ post.district }})
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 font-medium text-gray-500">{{ post.author_name }}</td>
              <td class="px-6 py-4 text-center font-bold text-gray-400">{{ post.views }}</td>
              <td class="px-6 py-4 text-center">
                <button
                  class="text-busan-accent rounded-lg bg-red-50 px-2 py-1 text-xs font-bold transition-all"
                  @click.stop="toggleLike(post)"
                >
                  <i class="fa-solid fa-heart mr-1"></i>{{ post.likes }}
                </button>
              </td>
            </tr>

            <tr v-if="filteredPosts.length === 0">
              <td colspan="5" class="py-12 text-center font-medium text-gray-400">
                검색된 소통 기록이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
