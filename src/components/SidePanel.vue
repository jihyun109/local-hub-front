<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="side-panel">
      <div v-if="open" class="fixed inset-0 z-50 flex justify-end">
        <div class="absolute inset-0 bg-black/40" @click="$emit('close')" />

        <aside
          class="relative flex h-full w-80 max-w-full flex-col bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
        >
          <header class="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 class="font-semibold">{{ title }}</h2>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-900"
              aria-label="닫기"
              @click="$emit('close')"
            >
              &times;
            </button>
          </header>

          <div class="flex-grow overflow-y-auto p-4">
            <slot />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.side-panel-enter-active,
.side-panel-leave-active {
  transition: opacity 0.2s ease;
}

.side-panel-enter-from,
.side-panel-leave-to {
  opacity: 0;
}
</style>
