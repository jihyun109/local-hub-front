<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { busanDistricts, focusOnMap, openQuickChat, places } from '@/store'

const router = useRouter()

const filters = reactive({
  keyword: '',
  type: '',
  district: '',
})

const filteredPlaces = computed(() =>
  places.value.filter((place) => {
    const matchKeyword =
      !filters.keyword ||
      place.name.includes(filters.keyword) ||
      place.description.includes(filters.keyword)
    const matchType = !filters.type || place.type === filters.type
    const matchDistrict = !filters.district || place.district === filters.district
    return matchKeyword && matchType && matchDistrict
  }),
)

const resetFilters = () => {
  filters.keyword = ''
  filters.type = ''
  filters.district = ''
}

const viewDetail = (place) => {
  router.push({ name: 'place-detail', params: { id: place.id } })
}

const showOnMap = (place) => {
  focusOnMap(place)
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col items-start justify-between gap-4 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center"
    >
      <div>
        <h1 class="text-busan-primary flex items-center gap-2 text-xl font-extrabold">
          <i class="fa-solid fa-umbrella-beach text-busan-accent"></i>
          <span>부산 관광 콘텐츠 및 공식 축제 데이터베이스</span>
        </h1>
        <p class="mt-1 text-xs text-gray-500">
          공공 API와 연동된 실시간 부산 시그니처 랜드마크 디렉토리입니다.
        </p>
      </div>
      <span class="bg-busan-primary rounded-xl px-3 py-1.5 text-xs font-bold text-white">
        총 {{ filteredPlaces.length }}개 스팟 활성
      </span>
    </div>

    <!-- 필터 -->
    <div class="flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm">
      <input
        v-model="filters.keyword"
        type="text"
        placeholder="명칭/설명 키워드 검색"
        class="bg-busan-light rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
      />
      <select
        v-model="filters.type"
        class="bg-busan-light rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
      >
        <option value="">전체 유형</option>
        <option value="FESTIVAL">🎉 축제</option>
        <option value="TOURIST">📸 명소</option>
      </select>
      <select
        v-model="filters.district"
        class="bg-busan-light rounded-xl border px-3.5 py-2 text-xs focus:outline-none"
      >
        <option value="">전체 자치구</option>
        <option v-for="dist in busanDistricts" :key="dist" :value="dist">{{ dist }}</option>
      </select>
      <button
        class="hover:text-busan-accent pl-2 text-xs font-bold text-gray-500 transition-all"
        @click="resetFilters"
      >
        <i class="fa-solid fa-arrows-rotate mr-1"></i>필터초기화
      </button>
    </div>

    <!-- 카드 그리드 -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="place in filteredPlaces"
        :key="place.id"
        class="hover:shadow-premium flex flex-col justify-between overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300"
      >
        <div class="space-y-3.5 p-5">
          <div class="flex items-center justify-between">
            <span
              class="bg-busan-sand text-busan-primary rounded-full px-2.5 py-0.5 text-[9px] font-extrabold"
            >
              {{ place.type === 'FESTIVAL' ? '축제' : '일반관광지' }}
            </span>
            <span class="text-xs font-bold text-gray-400">
              <i class="fa-solid fa-map-pin text-busan-accent mr-1"></i>{{ place.district }}
            </span>
          </div>
          <h3
            class="text-busan-primary hover:text-busan-accent cursor-pointer text-base font-extrabold transition-colors"
            @click="viewDetail(place)"
          >
            {{ place.name }}
          </h3>
          <p class="line-clamp-3 text-xs leading-relaxed text-gray-500">{{ place.description }}</p>
        </div>

        <div class="bg-busan-light flex items-center justify-between border-t p-4 text-xs">
          <button
            class="text-busan-primary font-bold hover:underline"
            @click="viewDetail(place)"
          >
            상세 정보 가이드
          </button>
          <div class="flex gap-1.5">
            <button
              class="hover:bg-busan-sand text-busan-accent flex h-8 w-8 items-center justify-center rounded-lg border bg-white"
              @click="showOnMap(place)"
            >
              <i class="fa-solid fa-map-location-dot text-xs"></i>
            </button>
            <button
              class="hover:bg-busan-sand text-busan-primary flex h-8 w-8 items-center justify-center rounded-lg border bg-white"
              @click="openQuickChat(`${place.name} 주변 대중교통 정보 추천해줘`)"
            >
              <i class="fa-solid fa-robot text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <p
        v-if="filteredPlaces.length === 0"
        class="col-span-full py-12 text-center text-sm font-medium text-gray-400"
      >
        조건에 맞는 관광 스팟이 없습니다.
      </p>
    </div>
  </div>
</template>
