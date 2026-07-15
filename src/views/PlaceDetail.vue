<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import LeafletMap from '@/components/map/LeafletMap.vue'
import { findPlace, focusOnMap, openQuickChat } from '@/store'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const router = useRouter()

const place = ref(null)
const loading = ref(false)
const errorText = ref('')

const fallbackPlace = computed(() => findPlace(props.id))

const normalizePlaceDetail = (item) => {
  const placeType = item?.place_type ?? {}
  const typeCode = String(placeType?.code ?? item?.type ?? 'TOURIST').trim().toUpperCase()

  return {
    id: item?.id ?? Number(props.id),
    name: item?.name ?? '이름 없음',
    type: typeCode,
    description: item?.description ?? '',
    address: item?.address ?? '',
    operating_info: item?.operating_info ?? '',
    district: item?.district?.name ?? item?.district_name ?? '',
    latitude: item?.latitude ?? null,
    longitude: item?.longitude ?? null,
    placeTypeName: placeType?.name ?? '',
  }
}

const loadPlaceDetail = async () => {
  const placeId = props.id
  if (!placeId) {
    place.value = null
    errorText.value = ''
    return
  }

  loading.value = true
  errorText.value = ''

  try {
    const response = await fetch(`/api/places/${encodeURIComponent(placeId)}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    place.value = normalizePlaceDetail(data)

    if (place.value?.latitude != null && place.value?.longitude != null) {
      focusOnMap(place.value)
    }
  } catch (error) {
    console.warn('상세 장소 조회 실패. 로컬 데이터를 사용합니다.', error)
    place.value = fallbackPlace.value
    errorText.value = '상세 정보를 불러오지 못해 기존 데이터로 표시합니다.'
  } finally {
    loading.value = false
  }
}

const showOnMainMap = () => {
  if (!place.value) return
  focusOnMap(place.value)
  router.push({ name: 'home' })
}

onMounted(() => {
  loadPlaceDetail()
})

watch(() => props.id, () => {
  loadPlaceDetail()
})
</script>

<template>
  <div v-if="loading" class="shadow-premium rounded-3xl bg-white p-10 text-center text-sm font-medium text-gray-500">
    상세 정보를 불러오는 중입니다...
  </div>

  <div v-else-if="errorText && !place" class="shadow-premium space-y-4 rounded-3xl bg-white p-10 text-center">
    <p class="text-sm font-bold text-gray-500">{{ errorText }}</p>
    <RouterLink
      :to="{ name: 'places' }"
      class="bg-busan-primary inline-block rounded-xl px-4 py-2 text-xs font-bold text-white"
    >
      디렉토리로 돌아가기
    </RouterLink>
  </div>

  <div v-else-if="place" class="space-y-6">
    <div class="shadow-premium flex items-center justify-between rounded-2xl bg-white p-4">
      <RouterLink
        :to="{ name: 'places' }"
        class="text-busan-primary hover:text-busan-accent flex items-center gap-1.5 text-xs font-bold transition-all"
      >
        ← 디렉토리 목록으로 복귀
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="shadow-premium space-y-6 rounded-3xl bg-white p-6 md:p-8 lg:col-span-2">
        <div class="space-y-3.5">
          <span
            class="bg-busan-sand text-busan-primary rounded-full px-3 py-1 text-[10px] font-extrabold"
          >
            {{ place.placeTypeName || (place.type === 'FESTIVAL' ? '축제' : '명소') }}
          </span>
          <h1 class="text-busan-deep text-2xl font-extrabold md:text-3xl">{{ place.name }}</h1>
        </div>

        <div class="space-y-3">
          <h3 class="text-busan-primary border-b pb-2 text-sm font-extrabold">장소 설명</h3>
          <p class="text-xs leading-relaxed whitespace-pre-line text-gray-600 sm:text-sm">
            {{ place.description }}
          </p>
        </div>

        <div class="bg-busan-light space-y-3.5 rounded-2xl border p-5 text-xs">
          <h4 class="text-busan-primary font-extrabold">이용 안내</h4>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span class="block text-[10px] font-bold text-gray-400">주소</span>
              <span class="font-semibold text-gray-700">{{ place.address }}</span>
            </div>
            <div>
              <span class="block text-[10px] font-bold text-gray-400">운영 정보</span>
              <span class="font-semibold text-gray-700">{{ place.operating_info }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-gray-50 p-4 text-[10px] leading-normal text-gray-400">
          본 정보는 공공데이터 표준규격에 의거 출처를 명시하고 활용 중입니다.
        </div>
      </div>

      <div class="space-y-6">
        <div class="shadow-premium space-y-4 rounded-3xl bg-white p-5">
          <h3 class="flex items-center gap-1.5 text-sm font-extrabold">
            <i class="fa-solid fa-earth-asia text-busan-primary"></i>
            <span>위치 정보지도</span>
          </h3>

          <div class="h-44 overflow-hidden rounded-2xl border bg-gray-100">
            <LeafletMap
              :places="[place]"
              :center="[place.latitude, place.longitude]"
              :zoom="14"
              :zoom-control="false"
              :show-popup="false"
            />
          </div>

          <button
            class="bg-busan-primary hover:bg-busan-deep w-full rounded-xl py-2.5 text-xs font-bold text-white transition-all"
            @click="showOnMainMap"
          >
            메인 지도로 이동해 초점 맞추기
          </button>
        </div>

        <div class="shadow-premium space-y-4 rounded-3xl bg-white p-5 text-center">
          <div class="text-busan-accent text-3xl">
            <i class="fa-solid fa-wand-magic-sparkles animate-pulse"></i>
          </div>
          <h3 class="text-busan-deep text-sm font-extrabold">현장의 추가 정보가 필요하신가요?</h3>
          <button
            class="bg-busan-sand hover:bg-busan-sky/20 text-busan-primary w-full rounded-xl py-2.5 text-xs font-bold transition-all"
            @click="openQuickChat(`${place.name} 주변 주차장 및 대중교통 경로 추천해줘`)"
          >
            AI 기동 가이드 호출
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="shadow-premium space-y-4 rounded-3xl bg-white p-10 text-center">
    <p class="text-sm font-bold text-gray-500">요청하신 관광 콘텐츠를 찾을 수 없습니다.</p>
    <RouterLink
      :to="{ name: 'places' }"
      class="bg-busan-primary inline-block rounded-xl px-4 py-2 text-xs font-bold text-white"
    >
      디렉토리로 돌아가기
    </RouterLink>
  </div>
</template>
