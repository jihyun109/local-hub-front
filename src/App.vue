<script setup>
import PostFormModal from '@/components/board/PostFormModal.vue'
import FloatingChatbot from '@/components/chat/FloatingChatbot.vue'
import AuthPrompt from '@/components/common/AuthPrompt.vue'
import ToastMessage from '@/components/common/ToastMessage.vue'
import TheFooter from '@/components/Layout/TheFooter.vue'
import TheHeader from '@/components/Layout/TheHeader.vue'
</script>

<template>
  <div class="bg-busan-sand text-busan-deep flex min-h-screen flex-col font-sans antialiased">
    <TheHeader />

    <ToastMessage />

    <main class="mx-auto w-full max-w-7xl flex-grow px-4 py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>

    <FloatingChatbot />
    <AuthPrompt />
    <PostFormModal />

    <TheFooter />
  </div>
</template>
