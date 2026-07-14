<script setup>
import { ref } from 'vue'

const posts = ref([
  { id: 1, title: '첫 번째 글', author: '지현', createdAt: '2026-07-14' },
])
</script>

<template>
  <section class="mx-auto max-w-5xl">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">게시판</h1>

      <RouterLink
        :to="{ name: 'board-write' }"
        class="rounded bg-gray-900 px-4 py-2 text-sm text-white"
      >
        글쓰기
      </RouterLink>
    </div>

    <ul class="mt-4 divide-y divide-gray-200 rounded border border-gray-200 bg-white">
      <li v-for="post in posts" :key="post.id" class="flex justify-between p-4">
        <span class="font-medium">{{ post.title }}</span>
        <span class="text-sm text-gray-500">{{ post.author }} · {{ post.createdAt }}</span>
      </li>

      <li v-if="posts.length === 0" class="p-4 text-center text-sm text-gray-400">
        게시글이 없습니다.
      </li>
    </ul>
  </section>
</template>
