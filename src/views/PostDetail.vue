<script setup>
import { computed } from 'vue'

import { findPost, requestDelete, requestEdit } from '@/store'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const post = computed(() => findPost(props.id))

const categoryLabel = computed(() => ((post.value?.category || 'REVIEW') === 'AD' ? '홍보 / 광고' : '축제 후기'))
</script>

<template>
  <div v-if="post" class="space-y-6">
    <div class="shadow-premium flex items-center justify-between rounded-2xl bg-white p-4">
      <RouterLink
        :to="{ name: 'board' }"
        class="text-busan-primary hover:text-busan-accent flex items-center gap-1.5 text-xs font-bold transition-all"
      >
        ← 소통 게시판 목록으로 돌아가기
      </RouterLink>

      <div class="flex items-center gap-2">
        <button
          class="rounded-xl border px-3 py-1.5 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50"
          @click="requestEdit(post.id)"
        >
          수정
        </button>
        <button
          class="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-50"
          @click="requestDelete(post.id)"
        >
          삭제
        </button>
      </div>
    </div>

    <div class="shadow-premium space-y-6 rounded-3xl bg-white p-6 md:p-8">
      <div class="space-y-3.5 border-b pb-5">
        <div class="flex items-center gap-2">
          <span
            class="rounded-full px-2.5 py-1 text-[9px] font-extrabold"
            :class="
              (post.category || 'REVIEW') === 'AD' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
            "
          >
            {{ categoryLabel }}
          </span>
          <span class="text-xs font-medium text-gray-400">등록일: {{ post.created_at }}</span>
        </div>
        <h1 class="text-busan-deep text-xl leading-relaxed font-extrabold md:text-2xl">
          {{ post.title }}
        </h1>
        <p class="text-xs font-bold text-gray-500">필명: {{ post.author_name }} (익명)</p>
      </div>

      <div
        v-if="post.place_id"
        class="bg-busan-sand/50 flex items-center justify-between rounded-2xl border p-4 text-xs"
      >
        <div class="flex items-center gap-2.5">
          <i class="fa-solid fa-umbrella-beach text-busan-primary text-xl"></i>
          <div>
            <span class="block text-[10px] font-bold text-gray-400">연계 관광지</span>
            <span class="text-busan-primary font-extrabold">{{ post.place_name }}</span>
          </div>
        </div>
        <RouterLink
          :to="{ name: 'place-detail', params: { id: post.place_id } }"
          class="rounded-lg border bg-white px-3 py-1.5 text-[10px] font-extrabold"
        >
          정보 카드 열기
        </RouterLink>
      </div>

      <div class="py-4 text-xs leading-relaxed whitespace-pre-line text-gray-700 sm:text-sm">
        {{ post.content }}
      </div>
    </div>
  </div>

  <div v-else class="shadow-premium space-y-4 rounded-3xl bg-white p-10 text-center">
    <p class="text-sm font-bold text-gray-500">삭제되었거나 존재하지 않는 게시글입니다.</p>
    <RouterLink
      :to="{ name: 'board' }"
      class="bg-busan-primary inline-block rounded-xl px-4 py-2 text-xs font-bold text-white"
    >
      게시판으로 돌아가기
    </RouterLink>
  </div>
</template>
