<script setup>
import TheHeader from '@/components/Layout/TheHeader.vue'
import TheFooter from '@/components/Layout/TheFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50 text-gray-900">
    <TheHeader />

    <main class="flex-grow p-4">
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>
