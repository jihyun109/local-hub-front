<script setup>
import { toast } from '@/store'
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-5 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-5 opacity-0"
  >
    <div
      v-if="toast.show"
      class="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-bold text-white shadow-xl"
      :class="
        toast.type === 'success'
          ? 'bg-emerald-600'
          : toast.type === 'error'
            ? 'bg-busan-accent'
            : 'bg-busan-primary'
      "
    >
      <i
        class="fa-solid"
        :class="
          toast.type === 'success'
            ? 'fa-circle-check'
            : toast.type === 'error'
              ? 'fa-circle-exclamation'
              : 'fa-circle-info'
        "
      ></i>
      <span>{{ toast.message }}</span>
    </div>
  </Transition>
</template>
