/**
 * SNS 로고 이미지 URL (공식/공개 CDN).
 * Cloudinary MCP 비활성 시 이 URL을 그대로 사용.
 */
export const SOCIAL_ICON_URLS = {
  /** 글자 없는 빨간 네모 + 재생 삼각형 (Full-color button icon 2024) */
  youtube:
    'https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_full-color_icon_%282024%29.svg',
  instagram:
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Instagram.svg',
  x: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg',
  wikipedia:
    'https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg',
} as const
