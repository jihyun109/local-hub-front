<script setup>
import { useRouter } from 'vue-router'

import { authPrompt, executeAuthAction } from '@/store'

const router = useRouter()

const submit = () => {
  const result = executeAuthAction()
  if (result.ok && result.action === 'delete') {
    router.push({ name: 'board' })
  }
}
</script>

<template>
  <div
    v-if="authPrompt.open"
    class="bg-busan-deep/50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 backdrop-blur-sm"
  >
    <div class="shadow-premium w-full max-w-sm space-y-4 rounded-3xl bg-white p-6">
      <h3 class="text-busan-deep flex items-center gap-1.5 text-base font-extrabold">
        <i class="fa-solid fa-key text-busan-accent"></i>
        <span>게시글 인증 비밀번호 확인</span>
      </h3>
      <p class="text-xs text-gray-500">본 게시글을 관리하기 위한 비밀번호를 입력해주십시오.</p>

      <form @submit.prevent="submit">
        <input
          v-model="authPrompt.passwordInput"
          type="password"
          required
          placeholder="비밀번호 입력"
          class="mb-4 w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
        />
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="rounded-xl px-4 py-2 text-xs font-bold text-gray-500 transition-all hover:bg-gray-100"
            @click="authPrompt.open = false"
          >
            취소
          </button>
          <button
            type="submit"
            class="bg-busan-primary hover:bg-busan-deep rounded-xl px-4 py-2 text-xs font-bold text-white transition-all"
          >
            승인
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
