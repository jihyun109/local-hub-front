<script setup>
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { chat, openQuickChat, sendChatMessage, toggleChatbot } from '@/store'

const router = useRouter()

const localInput = ref('')
const chatScrollContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatScrollContainer.value) {
      chatScrollContainer.value.scrollTop = chatScrollContainer.value.scrollHeight
    }
  })
}

const handleSend = () => {
  if (!localInput.value.trim()) return
  sendChatMessage(localInput.value)
  localInput.value = ''
}

const viewPlace = (placeId) => {
  router.push({ name: 'place-detail', params: { id: placeId } })
}

watch(() => chat.messages.length, scrollToBottom)
watch(() => chat.loading, scrollToBottom)
</script>

<template>
  <div class="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3.5">
    <!-- 웰컴 말풍선 -->
    <div
      v-if="chat.welcomeVisible"
      class="border-busan-sky/30 shadow-floating relative max-w-xs animate-bounce rounded-2xl border bg-white p-3.5 text-xs"
    >
      <button
        class="absolute top-1 right-1 text-gray-300 hover:text-gray-500"
        @click="chat.welcomeVisible = false"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <span class="text-busan-accent mb-1 block font-extrabold">👋 부산 갈매기 AI 챗봇</span>
      <span>"안녕하세요! 부산 축제 일정이나 교통 안내가 필요하신가요?"</span>
    </div>

    <!-- 챗봇 토글 트리거 -->
    <button
      class="shadow-floating flex items-center justify-center rounded-full p-4 text-white transition-all"
      :class="chat.open ? 'bg-busan-deep' : 'bg-busan-accent'"
      @click="toggleChatbot"
    >
      <i class="fa-solid text-xl" :class="chat.open ? 'fa-xmark' : 'fa-robot'"></i>
    </button>

    <!-- 챗 패널 -->
    <Transition name="chat-panel">
      <div
        v-show="chat.open"
        class="border-busan-sky/20 shadow-floating flex h-[480px] w-[90vw] max-w-md flex-col overflow-hidden rounded-3xl border bg-white sm:w-[380px]"
      >
        <div class="bg-busan-deep flex items-center justify-between p-4 text-white">
          <div class="flex items-center gap-2.5">
            <div class="rounded-xl bg-white/10 p-2">
              <i class="fa-solid fa-robot text-busan-gold"></i>
            </div>
            <div>
              <h3 class="text-sm font-extrabold">부산 갈매기 AI 챗봇</h3>
              <p class="text-busan-sky text-[10px] font-semibold">축제 현장에 맞는 실시간 꿀팁 제공</p>
            </div>
          </div>
          <button class="text-white/60 hover:text-white" @click="toggleChatbot">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- 대화 바디 -->
        <div ref="chatScrollContainer" class="bg-busan-light flex-grow space-y-4 overflow-y-auto p-4">
          <div class="flex gap-2">
            <div
              class="bg-busan-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs text-white"
            >
              <i class="fa-solid fa-robot"></i>
            </div>
            <div
              class="max-w-[80%] rounded-2xl rounded-tl-none bg-white p-3.5 text-xs leading-relaxed text-gray-600 shadow-sm"
            >
              반갑습니데이! 무엇이든 여쭤보이소!
              <div class="bg-busan-sand/50 mt-3 space-y-1 rounded-xl border p-2">
                <button
                  class="text-busan-primary block text-left text-[10px] font-extrabold hover:underline"
                  @click="openQuickChat('광안리 주변 축제는 언제 해?')"
                >
                  광안리 주변 축제 일정
                </button>
                <button
                  class="text-busan-primary block text-left text-[10px] font-extrabold hover:underline"
                  @click="openQuickChat('조용히 힐링하기 좋은 산책로 알려줘')"
                >
                  부산 힐링 명소 추천
                </button>
              </div>
            </div>
          </div>

          <!-- 대화 루프 -->
          <div
            v-for="(msg, idx) in chat.messages"
            :key="idx"
            class="flex gap-2"
            :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              v-if="msg.sender === 'bot'"
              class="bg-busan-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs text-white"
            >
              <i class="fa-solid fa-robot"></i>
            </div>
            <div
              class="max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm"
              :class="
                msg.sender === 'user'
                  ? 'bg-busan-accent rounded-tr-none text-white'
                  : 'rounded-tl-none bg-white text-gray-700'
              "
            >
              <div class="whitespace-pre-line">{{ msg.text }}</div>

              <!-- AI 추천 장소 카드 -->
              <div
                v-if="msg.recommendedPlaces?.length"
                class="mt-3 space-y-1.5 border-t border-gray-100 pt-2"
              >
                <span class="block text-[10px] font-bold text-gray-400">🎯 추천 장소</span>
                <div
                  v-for="rec in msg.recommendedPlaces"
                  :key="rec.id"
                  class="bg-busan-sand/50 hover:bg-busan-sky/20 text-busan-primary cursor-pointer rounded p-2 text-left text-[11px] font-bold transition-all"
                  @click="viewPlace(rec.id)"
                >
                  {{ rec.name }} ({{ rec.district }})
                </div>
              </div>
            </div>
          </div>

          <!-- 응답 대기 로더 -->
          <div v-if="chat.loading" class="flex gap-2">
            <div
              class="bg-busan-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs text-white"
            >
              <i class="fa-solid fa-robot animate-spin"></i>
            </div>
            <div class="rounded-2xl rounded-tl-none bg-white p-3 text-xs text-gray-400">
              갈매기가 답변을 생각 중입니다...
            </div>
          </div>
        </div>

        <!-- 전송 입력창 -->
        <div class="border-t bg-white p-3">
          <form class="flex gap-2" @submit.prevent="handleSend">
            <input
              v-model="localInput"
              type="text"
              placeholder="메시지를 입력하세요..."
              class="flex-grow rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
            />
            <button
              type="submit"
              class="bg-busan-primary hover:bg-busan-deep flex items-center justify-center rounded-xl px-3.5 text-xs font-bold text-white transition-all"
            >
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chat-panel-enter-active,
.chat-panel-leave-active {
  transition: all 0.2s ease-out;
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}
</style>
