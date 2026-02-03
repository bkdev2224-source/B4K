export type LogoCategory = 'kpop' | 'kbeauty' | 'kfood' | 'kfestival' | 'kdrama'

function normalizeKey(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '')
}

// NOTE: 파일명은 mockupdata/logo 실제 파일명을 그대로 사용 (오타 포함)
const LOGO_FILENAME_BY_KEY: Record<string, string> = {
  // K-pop (artists)
  aespa: 'aespa_logo.jpg',
  bts: 'bts_logo.png',
  blackpink: 'blcakpink_logo.png',
  exo: 'exo_logo.jpg',
  gdragon: 'g-dragon_logo.jpg',
  ive: 'ive_logo.svg',
  newjeans: 'newjeans_logo.svg',
  seventeen: 'seventeen_logo.jpg',
  straykids: 'straykids_logo.svg',
  twice: 'twice_logo.jpg',
  ateez: 'ateez_logo.png',

  // K-beauty (brands / companies)
  innisfree: 'Innisfree_logo.png',
  tonymoly: 'tonymoly_logo.png',
  oliveyoung: 'oliveyuong_logo.svg',
  amorepacific: 'amorepucific_logo.svg',

  // labels / companies (필요 시 subName이 회사로 들어오는 경우 대응)
  hybe: 'hybe_logo.svg',
  yg: 'yg_logo.svg',
  jyp: 'jyp_logo.svg',
  sm: 'sm_logo.png',
}

export function getLogoFilenameBySubName(subName: string) {
  const key = normalizeKey(subName)
  return LOGO_FILENAME_BY_KEY[key] ?? null
}

export function getLogoSrcBySubName(subName: string) {
  const filename = getLogoFilenameBySubName(subName)
  return filename ? `/api/logo/${encodeURIComponent(filename)}` : null
}

/** 아티스트/브랜드 이름에서 로고 플레이스홀더용 이니셜 추출 (최대 2글자) */
export function getInitials(subName: string) {
  const s = subName.trim()
  if (!s) return '?'
  const words = s.split(/\s+/).slice(0, 2)
  const letters = words.map((w) => w[0]).join('')
  return (letters || s[0]).toUpperCase()
}

export function getContentTypeLabel(category: LogoCategory) {
  switch (category) {
    case 'kpop':
      return 'artist'
    case 'kbeauty':
      return 'brand'
    case 'kfood':
      return 'food'
    case 'kfestival':
      return 'festival'
    case 'kdrama':
      return 'drama'
  }
}


