import { reactive, ref } from 'vue'

/**
 * 전역 공유 상태 저장소.
 * Pinia 도입 전까지 reactive/ref 기반의 경량 스토어로 운영한다.
 * 화면 전환(router)은 스토어가 아닌 컴포넌트에서 담당한다.
 */

// ---------------------------------------------
// 공용 상수
// ---------------------------------------------
export const busanDistricts = [
  '강서구',
  '금정구',
  '기장군',
  '남구',
  '동구',
  '동래구',
  '부산진구',
  '북구',
  '사상구',
  '사하구',
  '서구',
  '수영구',
  '연제구',
  '영도구',
  '중구',
  '해운대구',
]

const BUSAN_CENTER = [35.1531, 129.1189]

// ---------------------------------------------
// 토스트 알림
// ---------------------------------------------
export const toast = reactive({
  show: false,
  message: '',
  type: 'info',
})

let toastTimer = null

export function triggerToast(message, type = 'info') {
  toast.message = message
  toast.type = type
  toast.show = true

  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.show = false
  }, 3000)
}

// ---------------------------------------------
// 관광지 / 축제 (공공데이터 명세 호환 시드)
// ---------------------------------------------
export const places = ref([
  {
    id: 1,
    name: '광안리 어방축제',
    type: 'FESTIVAL',
    description:
      '전통 어촌 민속을 주제로 광안리해수욕장에서 열리는 부산의 대표 축제입니다. 어방 그물끌기, 경상좌수사 행렬, 가마우지 야간 수영 선상 불꽃놀이 등 환상적인 밤바다의 정취를 자랑합니다.',
    district: '수영구',
    latitude: 35.1531,
    longitude: 129.1189,
    address: '부산광역시 수영구 광안해변로 219 (광안동)',
    operating_info: '축제 프로그램별 상이 (오전 10시 ~ 오후 10시)',
  },
  {
    id: 2,
    name: '부산국제영화제 (BIFF 광장)',
    type: 'FESTIVAL',
    description:
      '전 세계 영화인의 눈이 쏠리는 아시아 최대의 영화 축제 BIFF입니다. 무대인사뿐만 아니라 핸드프린팅 구역, 극장 밀집지역 등에서 영화 문화를 마음껏 탐닉할 수 있습니다.',
    district: '중구',
    latitude: 35.0985,
    longitude: 129.0286,
    address: '부산광역시 중구 구덕로 58-1',
    operating_info: '부스 마다 상이 / 무료 및 유료 관람권 예매 병행',
  },
  {
    id: 3,
    name: '해운대 해수욕장',
    type: 'TOURIST',
    description:
      '대한민국 최고로 손꼽히는 여름 휴가지와 해양 액티비티 중심지입니다. 마천루 뷰를 한눈에 보며 도심 속 낭만적인 파도를 만나보세요.',
    district: '해운대구',
    latitude: 35.1587,
    longitude: 129.1604,
    address: '부산광역시 해운대구 우동',
    operating_info: '상시 개방 (입수 가능 기간 별도 고시)',
  },
  {
    id: 4,
    name: '감천문화마을',
    type: 'TOURIST',
    description:
      '계단식 파스텔 색조 가옥들과 아기자기한 예술 벽화가 가득한 마을입니다. 어린왕자 포토존이 특히 유명합니다.',
    district: '사하구',
    latitude: 35.0975,
    longitude: 129.0092,
    address: '부산광역시 사하구 감내2로 203',
    operating_info: '하절기 09:00~18:00 / 동절기 09:00~17:00',
  },
  {
    id: 5,
    name: '태종대 유원지',
    type: 'TOURIST',
    description:
      '기암괴석과 푸른 바다가 어우러진 국가 지정 명승지입니다. 등대 밑 절벽에서 펼쳐진 영도 바다 경치는 단연 으뜸입니다.',
    district: '영도구',
    latitude: 35.0531,
    longitude: 129.0877,
    address: '부산광역시 영도구 전망로 24',
    operating_info: '유원지 개방 04:00~24:00',
  },
])

export function findPlace(id) {
  return places.value.find((place) => place.id === Number(id)) ?? null
}

// ---------------------------------------------
// 지도 포커스 (홈 화면 메인 지도 제어)
// ---------------------------------------------
export const mapFocus = reactive({
  center: [...BUSAN_CENTER],
  zoom: 11,
})

export function focusOnMap(place) {
  if (!place?.latitude || !place?.longitude) return
  mapFocus.center = [place.latitude, place.longitude]
  mapFocus.zoom = 14
}

// ---------------------------------------------
// 익명 게시판
// ---------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function apiRequest(path, options = {}) {
  const headers = { Accept: 'application/json', ...(options.headers || {}) }
  const config = { ...options, headers }

  if (options.body && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config)
  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.detail || '요청에 실패했습니다.')
  }

  return data
}

function normalizePost(post) {
  const linkedPlace = Array.isArray(post.places) && post.places.length > 0 ? post.places[0] : null
  const districtName =
    (typeof post.district === 'string' && post.district) || post.district?.name || linkedPlace?.district || '부산전역'

  return {
    id: post.id,
    category: post.category?.code || 'REVIEW',
    title: post.title,
    content: post.content,
    author_name: post.author_name,
    password: '',
    place_id: linkedPlace?.id ?? null,
    place_name: linkedPlace?.name ?? '',
    district: districtName,
    views: post.views ?? 0,
    likes: post.likes ?? 0,
    created_at: post.created_at,
  }
}

export const posts = ref([])

export function findPost(id) {
  return posts.value.find((post) => post.id === Number(id)) ?? null
}

export async function loadPosts() {
  try {
    const result = await apiRequest('/posts')
    posts.value = (result.items || []).map(normalizePost)
    return posts.value
  } catch (error) {
    triggerToast(error.message, 'error')
    return []
  }
}

export function increaseViews(post) {
  if (!post) return
  post.views += 1
}

export async function toggleLike(post) {
  if (!post) return

  try {
    const result = await apiRequest(`/posts/${post.id}/like`, { method: 'POST' })
    post.likes = result.likes
  } catch (error) {
    triggerToast(error.message, 'error')
  }
}

// ---------------------------------------------
// 게시글 작성 / 수정 모달
// ---------------------------------------------
const emptyForm = () => ({
  id: null,
  category: 'REVIEW',
  title: '',
  content: '',
  author_name: '',
  password: '',
  place_id: null,
})

export const postEditor = reactive({
  open: false,
  isEdit: false,
  form: emptyForm(),
})

export async function loadPlaces() {
  try {
    const result = await apiRequest('/places')
    places.value = (result.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      district: item.district,
    }))
  } catch (error) {
    triggerToast(error.message, 'error')
  }
}

export function openWriteModal() {
  postEditor.isEdit = false
  postEditor.form = emptyForm()
  postEditor.open = true
  loadPlaces().catch(() => {})
}

export function closeWriteModal() {
  postEditor.open = false
}

function linkedPlaceInfo(placeId) {
  const linked = placeId ? findPlace(placeId) : null
  return {
    place_name: linked ? linked.name : '',
    district: linked ? linked.district : '부산전역',
  }
}

/**
 * 작성/수정 폼 제출. 화면 이동은 호출한 컴포넌트가 결과를 보고 처리한다.
 * @returns {{ ok: boolean, mode?: 'create' | 'edit', postId?: number }}
 */
export async function submitPostForm() {
  const form = postEditor.form

  if (form.password.length < 4) {
    triggerToast('비밀번호는 최소 4글자 이상 지정해야 보안이 유지됩니다.', 'error')
    return { ok: false }
  }

  const categoryId = form.category === 'AD' ? 2 : 1
  const linkedPlaceMeta = linkedPlaceInfo(form.place_id)
  const payload = {
    category_id: categoryId,
    title: form.title,
    content: form.content,
    district_id: null,
    district: linkedPlaceMeta.district,
    district_name: linkedPlaceMeta.district,
    place_ids: form.place_id ? [form.place_id] : [],
  }

  try {
    if (postEditor.isEdit) {
      const target = findPost(form.id)
      if (!target) {
        triggerToast('수정할 게시글을 찾지 못했습니다.', 'error')
        return { ok: false }
      }

      await apiRequest(`/posts/${target.id}/verify-password`, {
        method: 'POST',
        body: JSON.stringify({ password: form.password }),
      })

      const updated = await apiRequest(`/posts/${target.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      const normalized = normalizePost({
        ...updated,
        district: linkedPlaceMeta.district,
        places: linkedPlaceMeta.place_name
          ? [{ id: form.place_id, name: linkedPlaceMeta.place_name, district: linkedPlaceMeta.district }]
          : updated.places || [],
      })
      const index = posts.value.findIndex((post) => post.id === normalized.id)
      if (index >= 0) {
        posts.value[index] = normalized
      }

      postEditor.open = false
      triggerToast('게시글 수정을 완료했습니다.', 'success')
      return { ok: true, mode: 'edit', postId: normalized.id }
    }

    const created = await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        author_name: form.author_name,
        password: form.password,
      }),
    })
    posts.value.unshift(
      normalizePost({
        ...created,
        district: linkedPlaceMeta.district,
        places: linkedPlaceMeta.place_name
          ? [{ id: form.place_id, name: linkedPlaceMeta.place_name, district: linkedPlaceMeta.district }]
          : created.places || [],
      }),
    )

    postEditor.open = false
    triggerToast('신규 익명 수다가 생성되었습니다!', 'success')
    return { ok: true, mode: 'create', postId: created.id }
  } catch (error) {
    triggerToast(error.message, 'error')
    return { ok: false }
  }
}

// ---------------------------------------------
// 비밀번호 검증 (수정 / 삭제 권한)
// ---------------------------------------------
export const authPrompt = reactive({
  open: false,
  action: 'edit',
  targetPostId: null,
  passwordInput: '',
})

function requestAuth(action, postId) {
  authPrompt.action = action
  authPrompt.targetPostId = postId
  authPrompt.passwordInput = ''
  authPrompt.open = true
}

export function requestEdit(postId) {
  requestAuth('edit', postId)
}

export function requestDelete(postId) {
  requestAuth('delete', postId)
}

/**
 * 비밀번호를 검증하고 수정 모달을 열거나 게시글을 삭제한다.
 * @returns {{ ok: boolean, action?: 'edit' | 'delete' }}
 */
export async function executeAuthAction() {
  const target = findPost(authPrompt.targetPostId)
  if (!target) {
    triggerToast('대상 게시글을 찾지 못했습니다.', 'error')
    return { ok: false }
  }

  try {
    await apiRequest(`/posts/${target.id}/verify-password`, {
      method: 'POST',
      body: JSON.stringify({ password: authPrompt.passwordInput }),
    })

    authPrompt.open = false

    if (authPrompt.action === 'edit') {
      postEditor.isEdit = true
      postEditor.form = {
        id: target.id,
        category: target.category,
        title: target.title,
        content: target.content,
        author_name: target.author_name,
        password: '',
        place_id: target.place_id,
      }
      postEditor.open = true
      return { ok: true, action: 'edit' }
    }

    await apiRequest(`/posts/${target.id}`, {
      method: 'DELETE',
      body: JSON.stringify({ password: authPrompt.passwordInput }),
    })

    posts.value = posts.value.filter((post) => post.id !== target.id)
    triggerToast('성공적으로 게시글이 삭제되었습니다.', 'success')
    return { ok: true, action: 'delete' }
  } catch (error) {
    triggerToast(error.message, 'error')
    return { ok: false }
  }
}

loadPosts().catch(() => {})

// ---------------------------------------------
// 갈매기 AI 챗봇
// ---------------------------------------------
export const chat = reactive({
  open: false,
  welcomeVisible: true,
  loading: false,
  messages: [],
})

export function toggleChatbot() {
  chat.open = !chat.open
  chat.welcomeVisible = false
}

export function sendChatMessage(text) {
  const query = (text || '').trim()
  if (!query) return

  chat.messages.push({ sender: 'user', text: query })
  chat.loading = true

  // TODO: 백엔드 AI 엔드포인트 연동 시 fetch 호출로 교체
  setTimeout(() => {
    const normalized = query.toLowerCase()
    let replyText
    let recommended

    if (
      normalized.includes('축제') ||
      normalized.includes('일정') ||
      normalized.includes('어방')
    ) {
      replyText =
        "대표적으로 가마우지 그물끌기와 수령 가마놀이가 유명한 '광안리 어방축제'가 매해 봄 5월에 개최됩니다. 아래 연계 추천 카드에서 실시간 일정과 주차장 정보를 확인하입시더!"
      recommended = [places.value[0], places.value[1]]
    } else if (
      normalized.includes('힐링') ||
      normalized.includes('조용') ||
      normalized.includes('산책')
    ) {
      replyText =
        "파도 소리만을 느끼며 한적하게 힐링하고 싶으시다면, 영도 남단에 절경을 품은 '태종대 유원지'를 산책하거나 파스텔 가옥의 매력을 머금은 '감천문화마을' 골목을 추천합니데이."
      recommended = [places.value[4], places.value[3]]
    } else {
      replyText =
        '현재 부산 해양권 핫 플레이스인 해운대 해수욕장 정보와 인근 상권 후기를 찾아드렸습니다. 추가로 원하시는 버스 교통편이 있다면 상세 카드를 봐주세요!'
      recommended = [places.value[2], places.value[0]]
    }

    chat.messages.push({
      sender: 'bot',
      text: replyText,
      recommendedPlaces: recommended.filter(Boolean),
    })
    chat.loading = false
  }, 1000)
}

export function openQuickChat(question) {
  chat.open = true
  chat.welcomeVisible = false
  sendChatMessage(question)
}
