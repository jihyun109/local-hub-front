<script setup>
import L from 'leaflet'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  places: { type: Array, default: () => [] },
  center: { type: Array, default: () => [35.1531, 129.1189] },
  zoom: { type: Number, default: 11 },
  zoomControl: { type: Boolean, default: true },
  showPopup: { type: Boolean, default: true },
})

const emit = defineEmits(['select'])

const mapEl = ref(null)

// Leaflet 인스턴스는 반응형으로 감싸면 성능 문제가 생기므로 일반 변수로 보관한다.
let map = null
let markerLayer = null

const markerIcon = (place) =>
  L.divIcon({
    html: `<div style="background-color: ${
      place.type === 'FESTIVAL' ? '#EE6C4D' : '#134074'
    }; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(11,37,69,0.35);"></div>`,
    className: 'custom-leaflet-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

const popupHtml = (place) => `
  <div style="font-family: Pretendard, sans-serif; padding: 4px; min-width: 140px;">
    <span style="font-size: 9px; font-weight: 800; color: #EE6C4D; text-transform: uppercase;">${
      place.type === 'FESTIVAL' ? '🎉 축제' : '📸 자연명소'
    }</span>
    <h4 style="margin: 2px 0; font-size: 12px; font-weight: 800; color: #0B2545;">${place.name}</h4>
    <p style="margin: 0 0 6px 0; font-size: 10px; color: #8DA9C4;"><i class="fa-solid fa-location-dot"></i> ${place.district}</p>
  </div>
`

const drawMarkers = () => {
  if (!map) return

  markerLayer.clearLayers()

  props.places
    .filter((place) => place.latitude && place.longitude)
    .forEach((place) => {
      const marker = L.marker([place.latitude, place.longitude], { icon: markerIcon(place) })

      if (props.showPopup) marker.bindPopup(popupHtml(place))
      marker.on('click', () => emit('select', place))

      marker.addTo(markerLayer)
    })
}

onMounted(() => {
  map = L.map(mapEl.value, { zoomControl: props.zoomControl }).setView(props.center, props.zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)
  drawMarkers()
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  markerLayer = null
})

watch(() => props.places, drawMarkers, { deep: true })

watch(
  () => [props.center, props.zoom],
  ([center, zoom]) => {
    map?.setView(center, zoom)
  },
  { deep: true },
)
</script>

<template>
  <div ref="mapEl" class="h-full w-full"></div>
</template>
