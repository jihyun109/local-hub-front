<script setup>
import { useRouter } from 'vue-router'

import LeafletMap from '@/components/map/LeafletMap.vue'
import { focusOnMap, mapFocus, openQuickChat, places } from '@/store'

const router = useRouter()

const viewDetail = (place) => {
  router.push({ name: 'place-detail', params: { id: place.id } })
}
</script>

<template>
  <div class="space-y-6">
    <!-- 히어로 -->
    <div class="gradient-hero shadow-premium relative overflow-hidden rounded-3xl p-6 text-white md:p-10">
      <div class="pointer-events-none absolute -right-12 -bottom-12 text-[180px] opacity-15">
        <i class="fa-solid fa-ship"></i>
      </div>

      <div class="relative z-10 max-w-2xl space-y-4">
        <span
          class="text-busan-gold rounded-full bg-white/20 px-3.5 py-1 text-xs font-extrabold tracking-widest uppercase backdrop-blur-md"
        >
          🌊 Local Hub: Busan Revitalization Platform
        </span>
        <h1 class="text-3xl leading-tight font-extrabold tracking-tight md:text-5xl">
          가장 완벽한 부산,<br />
          <span class="text-busan-gold">축제와 관광</span>을 지도에서 한눈에!
        </h1>
        <p class="text-xs leading-relaxed font-medium text-white/85 md:text-sm">
          부산 전역에 분산되어 있는 로컬 전통 축제 일정부터 사계절 힐링 산책코스까지, 직관적인
          인터랙티브 지도로 즉시 찾아드립니다.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <button
            class="text-busan-primary rounded-xl bg-white px-5 py-2.5 text-xs font-bold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
            @click="places.length && viewDetail(places[0])"
          >
            <i class="fa-solid fa-star mr-1"></i> 대표 축제 세부정보 보기
          </button>
          <button
            class="bg-busan-accent/95 hover:bg-busan-accent rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95"
            @click="openQuickChat('주말에 가기 좋은 조용한 힐링 코스 추천해줘.')"
          >
            <i class="fa-solid fa-robot mr-1"></i> AI 도우미에게 질문하기
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- 메인 지도 -->
      <div class="shadow-premium flex min-h-[420px] flex-col rounded-3xl bg-white p-5 lg:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="flex items-center gap-2 text-base font-extrabold">
            <i class="fa-solid fa-location-dot text-busan-accent"></i>
            <span>실시간 로컬 관광 지도 시각화</span>
          </h2>
          <span class="text-[10px] font-bold text-gray-400">마커 클릭으로 위치 파악</span>
        </div>

        <div
          class="border-busan-sand/50 min-h-[350px] flex-grow overflow-hidden rounded-2xl border shadow-inner"
        >
          <LeafletMap
            :places="places"
            :center="mapFocus.center"
            :zoom="mapFocus.zoom"
            @select="viewDetail"
          />
        </div>
      </div>

      <!-- 인기 스팟 -->
      <div class="shadow-premium flex flex-col justify-between rounded-3xl bg-white p-5">
        <div class="space-y-4">
          <h3 class="flex items-center justify-between text-base font-extrabold">
            <span>🔥 현재 핫한 명소/축제</span>
            <span class="text-[10px] font-bold text-gray-400">인기순</span>
          </h3>

          <div class="max-h-[300px] space-y-3 overflow-y-auto pr-1">
            <div
              v-for="place in places"
              :key="place.id"
              class="group hover:border-busan-sky hover:bg-busan-sand/40 cursor-pointer rounded-2xl border border-gray-100 p-3 transition-all duration-200"
              @click="focusOnMap(place)"
            >
              <div class="mb-1.5 flex items-center justify-between">
                <span
                  class="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-700"
                >
                  {{ place.type === 'FESTIVAL' ? '🎉 축제' : '📸 명소' }}
                </span>
                <span class="text-[10px] font-bold text-gray-400">
                  <i class="fa-solid fa-map-pin text-busan-accent mr-1"></i>{{ place.district }}
                </span>
              </div>
              <h4
                class="text-busan-primary group-hover:text-busan-accent text-sm font-extrabold transition-colors"
              >
                {{ place.name }}
              </h4>
              <p class="mt-1 line-clamp-1 text-xs text-gray-500">{{ place.description }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-busan-sand/50 border-busan-sky/20 mt-4 rounded-2xl border p-4 text-[11px] leading-relaxed text-gray-500"
        >
          <span class="text-busan-primary mb-1 block font-bold">🗺️ 지도 위 연계 핀 팁</span>
          동백 색상의 붉은 핀은 다채로운 축제가 열리는 위치이며, 네이비 블루 핀은 상시 자연 관광
          명소를 나타냅니다.
        </div>
      </div>
    </div>
  </div>
</template>
