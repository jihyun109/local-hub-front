<script setup>
const navItems = [
  { name: 'main', label: '홈' },
  { name: 'map', label: '지도' },
  { name: 'board', label: '게시판' },
]
</script>

<template>
  <header class="border-b border-gray-200 bg-white">
    <div class="mx-auto flex max-w-5xl items-center justify-between p-4">
      <RouterLink :to="{ name: 'main' }" class="text-lg font-bold">
        Local Hub
      </RouterLink>

      <nav class="flex gap-4 text-sm">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="text-gray-600 hover:text-gray-900"
          active-class="font-semibold text-gray-900"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
