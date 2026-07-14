<script setup>
import { ref } from 'vue'

import SidePanel from '@/components/SidePanel.vue'

const panelOpen = ref(false)
</script>

<template>
  <section class="mx-auto max-w-5xl">
    <h1 class="text-2xl font-bold">메인 페이지</h1>
    <p class="mt-2 text-gray-600">우리 동네 소식을 한곳에서.</p>

    <button
      type="button"
      class="mt-4 rounded bg-gray-900 px-4 py-2 text-sm text-white"
      @click="panelOpen = true"
    >
      사이드 패널 열기
    </button>

    <SidePanel :open="panelOpen" title="사이드 패널" @close="panelOpen = false">
      <p class="text-sm text-gray-600">패널 내용을 여기에 넣으세요.</p>
    </SidePanel>
  </section>
</template>
