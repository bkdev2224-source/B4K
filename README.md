# B4K

## 프로젝트 개요

Next.js와 TypeScript를 사용한 웹 애플리케이션 프로젝트입니다.

## 기술 스택

### 프레임워크 & 라이브러리
- **Next.js**: ^14.2.0 (App Router 사용)
- **React**: ^18.3.0
- **TypeScript**: ^5

### 개발 도구
- **ESLint**: ^8
- **eslint-config-next**: ^14.2.0

## 환경 설정

### 필수 요구사항
- Node.js 20 이상
- npm 또는 yarn

### 설치 방법

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 개발 모드로 실행
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

## 프로젝트 구조

```
B4K/
├── app/                 # Next.js App Router 디렉토리
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 홈 페이지
│   └── globals.css     # 전역 스타일
├── public/             # 정적 파일
├── package.json        # 프로젝트 의존성 및 스크립트
├── tsconfig.json       # TypeScript 설정
├── next.config.js      # Next.js 설정
└── .eslintrc.json      # ESLint 설정
```

## TypeScript 설정

- **타겟**: ES2017
- **모듈 시스템**: ESNext
- **엄격 모드**: 활성화
- **경로 별칭**: `@/*` → `./*`

## Next.js 설정

- **React Strict Mode**: 활성화
- **App Router**: 사용 중

## 환경 변수

환경 변수는 `.env.local` 파일에 설정하세요. (Git에 커밋되지 않음)

## Git 설정

`.gitignore`에 다음이 포함되어 있습니다:
- `node_modules/`
- `.next/`
- `.env*.local`
- 빌드 산출물

---

## 추가 설정

추가 환경 설정은 이 섹션에 계속 정리됩니다.
