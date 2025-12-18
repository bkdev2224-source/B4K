# B4K

## 📋 프로젝트 개요

Next.js와 TypeScript를 사용한 웹 애플리케이션 프로젝트입니다.  
구글 OAuth를 통한 JWT 기반 인증 시스템을 포함하고 있습니다.

---

## 🛠 기술 스택

### 프레임워크 & 라이브러리
- **Next.js**: ^14.2.0 (App Router)
- **React**: ^18.3.0
- **TypeScript**: ^5
- **NextAuth.js**: ^4.24.13 (인증)

### 개발 도구
- **ESLint**: ^8
- **eslint-config-next**: ^14.2.0

---

## 🚀 시작하기

### 필수 요구사항
- Node.js 20 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
# .env.local 파일을 생성하고 필요한 값들을 입력하세요 (아래 환경 설정 섹션 참고)

# 3. 개발 서버 실행
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

---

## 📁 프로젝트 구조

```
B4K/
├── app/                        # Next.js App Router
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts    # NextAuth API 라우트
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx        # 로그인 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 페이지
│   └── globals.css             # 전역 스타일
├── components/
│   ├── AuthButton.tsx          # 로그인/로그아웃 버튼
│   └── SessionProvider.tsx     # NextAuth 세션 프로바이더
├── lib/
│   ├── auth.ts                 # 인증 유틸리티 함수
│   └── authOptions.ts          # NextAuth 설정
├── types/
│   └── next-auth.d.ts          # NextAuth 타입 정의
├── public/                     # 정적 파일
├── package.json
├── tsconfig.json
├── next.config.js
└── .eslintrc.json
```

---

## ⚙️ 환경 설정

### 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> ⚠️ `.env.local` 파일은 Git에 커밋되지 않습니다. (`.gitignore`에 포함됨)

### NEXTAUTH_SECRET 생성

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**OpenSSL (Git Bash):**
```bash
openssl rand -base64 32
```

### Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **사용자 인증 정보** 이동
4. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션**
6. 승인된 리디렉션 URI 추가:
   - 개발: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/google`
7. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호**를 `.env.local`에 설정

---

## 🔐 인증 시스템 (구글 로그인)

### 구현 방식
- **NextAuth.js v4** 사용
- **JWT 세션 전략** (데이터베이스 불필요)
- **Google OAuth 2.0** 제공자
- **세션 유지 기간**: 30일

### 주요 기능
- ✅ 구글 계정으로 로그인/로그아웃
- ✅ JWT 토큰 기반 세션 관리
- ✅ 서버/클라이언트 컴포넌트에서 세션 접근 가능
- ✅ 타입 안전성 보장 (TypeScript)

### 사용 방법

#### 클라이언트 컴포넌트에서

```tsx
"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function MyComponent() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>로딩 중...</div>

  if (session) {
    return (
      <div>
        <p>안녕하세요, {session.user?.name}님!</p>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    )
  }

  return <button onClick={() => signIn("google")}>구글 로그인</button>
}
```

#### 서버 컴포넌트에서

```tsx
import { getSession, getCurrentUser } from "@/lib/auth"

export default async function ServerComponent() {
  // 전체 세션 정보 가져오기
  const session = await getSession()

  // 현재 사용자 정보만 가져오기
  const user = await getCurrentUser()

  if (!session) {
    return <div>로그인이 필요합니다.</div>
  }

  return <div>안녕하세요, {user?.name}님!</div>
}
```

### 세션 정보 구조

JWT 토큰에 다음 정보가 포함됩니다:

```typescript
{
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  accessToken?: string  // Google Access Token
}
```

### 인증 관련 파일

- **`lib/authOptions.ts`**: NextAuth 설정 (프로바이더, 세션 전략, 콜백)
- **`lib/auth.ts`**: 서버 컴포넌트용 인증 유틸리티 함수
- **`app/api/auth/[...nextauth]/route.ts`**: NextAuth API 라우트 핸들러
- **`components/AuthButton.tsx`**: 로그인/로그아웃 UI 컴포넌트
- **`components/SessionProvider.tsx`**: 클라이언트 세션 프로바이더
- **`types/next-auth.d.ts`**: NextAuth 타입 확장 정의

---

## 📝 TypeScript 설정

- **타겟**: ES2017
- **모듈 시스템**: ESNext
- **엄격 모드**: 활성화
- **경로 별칭**: `@/*` → `./*`

---

## 🔧 Next.js 설정

- **React Strict Mode**: 활성화
- **App Router**: 사용 중
- **빌드 최적화**: SWC 사용

---

## 📦 Git 설정

`.gitignore`에 다음이 포함되어 있습니다:
- `node_modules/`
- `.next/`
- `.env*.local`
- 빌드 산출물
- IDE 설정 파일

---

## 📚 추가 설정

추가 환경 설정은 이 섹션에 계속 정리됩니다.

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.
