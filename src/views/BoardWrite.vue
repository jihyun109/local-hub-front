<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  title: '',
  content: '',
})

const submit = () => {
  // TODO: API 연동
  router.push({ name: 'board' })
}
</script>

<template>
  <section class="mx-auto max-w-3xl">
    <h1 class="text-2xl font-bold">글쓰기</h1>

    <form class="mt-4 space-y-4" @submit.prevent="submit">
      <div>
        <label for="title" class="block text-sm font-medium">제목</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label for="content" class="block text-sm font-medium">내용</label>
        <textarea
          id="content"
          v-model="form.content"
          rows="10"
          required
          class="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div class="flex justify-end gap-2">
        <RouterLink
          :to="{ name: 'board' }"
          class="rounded border border-gray-300 px-4 py-2 text-sm"
        >
          취소
        </RouterLink>
        <button type="submit" class="rounded bg-gray-900 px-4 py-2 text-sm text-white">
          등록
        </button>
      </div>
    </form>
  </section>
</template>
