<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { closeWriteModal, placeOptions, postEditor, submitPostForm } from '@/store'

const router = useRouter()

const placeQuery = ref('')
const showPlaceList = ref(false)

const filteredPlaces = computed(() => {
  const keyword = placeQuery.value.trim().toLowerCase()
  if (!keyword) return placeOptions.value
  return placeOptions.value.filter((place) => place.name.toLowerCase().includes(keyword))
})

const selectPlace = (place) => {
  postEditor.form.place_id = place.id
  placeQuery.value = place.name
  showPlaceList.value = false
}

const clearPlace = () => {
  postEditor.form.place_id = null
  placeQuery.value = ''
  showPlaceList.value = false
}

// 클릭이 먼저 처리되도록 blur 시 약간의 지연 후 목록을 닫는다.
const hidePlaceListDelayed = () => {
  setTimeout(() => {
    showPlaceList.value = false
  }, 150)
}

watch(
  () => postEditor.open,
  (open) => {
    if (!open) return
    const selected = postEditor.form.place_id
      ? placeOptions.value.find((place) => place.id === postEditor.form.place_id)
      : null
    placeQuery.value = selected ? selected.name : ''
    showPlaceList.value = false
  },
)

const submit = () => {
  const result = submitPostForm()
  if (!result.ok) return

  if (result.mode === 'edit') {
    router.push({ name: 'post-detail', params: { id: result.postId } })
  } else {
    router.push({ name: 'board' })
  }
}
</script>

<template>
  <div
    v-if="postEditor.open"
    class="bg-busan-deep/50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 backdrop-blur-sm"
  >
    <div class="shadow-premium w-full max-w-xl overflow-hidden rounded-3xl bg-white">
      <div class="bg-busan-primary flex items-center justify-between p-5 text-white">
        <h2 class="flex items-center gap-2 text-base font-extrabold">
          <i class="fa-solid" :class="postEditor.isEdit ? 'fa-pen-nib' : 'fa-circle-plus'"></i>
          <span>{{ postEditor.isEdit ? '게시글 수정' : '소통글 등록' }}</span>
        </h2>
        <button class="text-white/80 hover:text-white" @click="closeWriteModal">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form class="space-y-4 p-6" @submit.prevent="submit">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-1">
            <label class="block text-[11px] font-bold text-gray-500">카테고리</label>
            <select
              v-model="postEditor.form.category"
              required
              class="bg-busan-light w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
            >
              <option value="REVIEW">후기 💬</option>
              <option value="AD">홍보 / 광고 📢</option>
            </select>
          </div>

          <div class="relative space-y-1">
            <label class="block text-[11px] font-bold text-gray-500">관련 관광지 지정 (선택)</label>
            <input
              v-model="placeQuery"
              type="text"
              placeholder="장소명을 검색해주세요 (예: 해운대)"
              class="bg-busan-light w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
              @focus="showPlaceList = true"
              @blur="hidePlaceListDelayed"
            />
            <div
              v-if="showPlaceList"
              class="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border bg-white shadow-lg"
            >
              <button
                type="button"
                class="block w-full px-3.5 py-2 text-left text-xs font-medium text-gray-500 hover:bg-busan-light"
                @mousedown.prevent="clearPlace"
              >
                장소 미연계
              </button>
              <button
                v-for="place in filteredPlaces"
                :key="place.id"
                type="button"
                class="block w-full px-3.5 py-2 text-left text-xs hover:bg-busan-light"
                @mousedown.prevent="selectPlace(place)"
              >
                {{ place.name }}
              </button>
              <p v-if="filteredPlaces.length === 0" class="px-3.5 py-2 text-xs text-gray-400">
                검색 결과가 없습니다.
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-gray-500">글 제목</label>
          <input
            v-model="postEditor.form.title"
            type="text"
            required
            placeholder="제목을 완성해주세요."
            class="bg-busan-light w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-gray-500">내용</label>
          <textarea
            v-model="postEditor.form.content"
            required
            rows="5"
            placeholder="내용을 채워주세요. (이미지 첨부 및 태그는 MVP 예외 스코프 대상입니다.)"
            class="bg-busan-light w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-1">
            <label class="block text-[11px] font-bold text-gray-500">필명 (닉네임)</label>
            <input
              v-model="postEditor.form.author_name"
              type="text"
              required
              placeholder="예: 바다갈매기"
              :disabled="postEditor.isEdit"
              class="bg-busan-light w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-[11px] font-bold text-gray-500">
              권한 비밀번호 (4글자 이상)
            </label>
            <input
              v-model="postEditor.form.password"
              type="password"
              required
              placeholder="••••"
              class="bg-busan-light w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            class="rounded-xl px-4 py-2 text-xs font-bold text-gray-500 transition-all hover:bg-gray-100"
            @click="closeWriteModal"
          >
            취소
          </button>
          <button
            type="submit"
            class="bg-busan-accent hover:bg-busan-accent/90 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-sm transition-all"
          >
            {{ postEditor.isEdit ? '수정 완료' : '등록 완료' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
