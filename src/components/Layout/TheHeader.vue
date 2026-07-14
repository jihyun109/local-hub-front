<script setup>
import { ref } from 'vue'

const navItems = [
  { name: 'home', label: '홈 / 지도 탐색', icon: 'fa-solid fa-map-location-dot' },
  { name: 'places', label: '관광 & 축제 정보', icon: 'fa-solid fa-umbrella-beach' },
  { name: 'board', label: '소통 커뮤니티', icon: 'fa-regular fa-comments' },
]

const mobileMenuOpen = ref(false)
</script>

<template>
  <nav class="border-busan-sand sticky top-0 z-40 border-b bg-white/95 shadow-sm backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex items-center">
          <RouterLink
            :to="{ name: 'home' }"
            class="text-busan-primary flex items-center gap-2 text-xl font-extrabold tracking-tight"
          >
            <i class="fa-solid fa-anchor text-busan-accent animate-pulse text-2xl"></i>
            <span>LocalHub <span class="text-busan-accent">Busan</span></span>
          </RouterLink>
        </div>

        <!-- 데스크톱 메뉴 -->
        <div class="hidden items-center space-x-6 md:flex">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="hover:text-busan-primary flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold text-gray-500 transition-all hover:bg-gray-50"
            active-class="bg-busan-sand !text-busan-primary"
          >
            <i :class="item.icon"></i>
            {{ item.label }}
          </RouterLink>
        </div>

        <!-- 모바일 햄버거 -->
        <div class="flex items-center md:hidden">
          <button
            class="bg-busan-sand/50 hover:text-busan-primary rounded-xl p-2 text-gray-500"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <i class="fa-solid" :class="mobileMenuOpen ? 'fa-xmark' : 'fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 모바일 드롭다운 -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="mobileMenuOpen"
        class="border-busan-sand space-y-1 border-t bg-white px-2 pt-2 pb-4 md:hidden"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="block w-full rounded-lg px-4 py-2.5 text-left text-base font-semibold text-gray-600 hover:bg-gray-50"
          active-class="bg-busan-sand !text-busan-primary"
          @click="mobileMenuOpen = false"
        >
          <i :class="item.icon" class="w-6"></i>
          {{ item.label }}
        </RouterLink>
      </div>
    </Transition>
  </nav>
</template>
