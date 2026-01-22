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
- **MongoDB**: ^5.9.0 (데이터베이스)
- **@next-auth/mongodb-adapter**: ^1.1.3 (NextAuth MongoDB 어댑터)
- **Cloudinary**: 이미지 관리 및 최적화
- **next-cloudinary**: Next.js용 Cloudinary 통합

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
│   ├── authOptions.ts          # NextAuth 설정
│   └── mongodb.ts              # MongoDB 연결 유틸리티
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

# MongoDB 설정
MONGODB_URI=mongodb://localhost:27017/B4K_TEST

# Cloudinary 설정
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Next.js Public Cloudinary 설정 (클라이언트에서 사용)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
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
- **MongoDB 어댑터** 사용 (users, accounts 컬렉션 자동 관리)
- **JWT 세션 전략** (세션은 JWT, 사용자 정보는 MongoDB에 저장)
- **Google OAuth 2.0** 제공자
- **세션 유지 기간**: 30일

### 주요 기능
- ✅ 구글 계정으로 로그인/로그아웃
- ✅ 구글 로그인 시 MongoDB의 `users` 컬렉션에 자동 저장
- ✅ `accounts` 컬렉션에 OAuth 계정 정보 저장
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

### MongoDB 연동

#### 데이터베이스 구조

구글 로그인 시 NextAuth가 자동으로 다음 작업을 수행합니다:
- `users` 컬렉션에 사용자 정보 저장 (이름, 이메일, 프로필 이미지 등)
- `accounts` 컬렉션에 OAuth 계정 정보 저장 (provider, providerAccountId 등)
- `sessions` 컬렉션에 세션 정보 저장 (선택적, JWT 전략 사용 시 미사용)

#### 컬렉션 스키마

**users 컬렉션:**
```typescript
{
  _id: ObjectId
  name: string
  email: string
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}
```

**accounts 컬렉션:**
```typescript
{
  _id: ObjectId
  userId: ObjectId  // users 컬렉션 참조
  type: string      // "oauth"
  provider: string  // "google"
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}
```

#### MongoDB 연결 설정

**연결 정보:**
- 연결 URI: `mongodb://localhost:27017/B4K_TEST`
- 데이터베이스: `B4K_TEST`
- 필수 컬렉션: `users`, `accounts`

**연결 유틸리티 사용:**
```typescript
import clientPromise from "@/lib/mongodb"

// MongoDB 클라이언트 가져오기
const client = await clientPromise
const db = client.db("B4K_TEST")

// 컬렉션 접근
const usersCollection = db.collection("users")
const accountsCollection = db.collection("accounts")
```

#### 직접 MongoDB 사용 예시

```typescript
import clientPromise from "@/lib/mongodb"

export async function getUserByEmail(email: string) {
  const client = await clientPromise
  const db = client.db("B4K_TEST")
  const user = await db.collection("users").findOne({ email })
  return user
}

export async function createUser(userData: {
  name: string
  email: string
  image?: string
}) {
  const client = await clientPromise
  const db = client.db("B4K_TEST")
  const result = await db.collection("users").insertOne({
    ...userData,
    emailVerified: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}
```

#### MongoDB 서버 요구사항

- MongoDB 서버가 실행 중이어야 합니다
- 기본 포트: `27017`
- 로컬 개발: `mongodb://localhost:27017/B4K_TEST`
- 원격 서버: `mongodb://username:password@host:port/database`

#### 트러블슈팅

**연결 오류가 발생하는 경우:**
1. MongoDB 서버가 실행 중인지 확인
2. `.env.local`의 `MONGODB_URI`가 올바른지 확인
3. 방화벽 설정 확인 (원격 서버인 경우)
4. MongoDB Compass로 직접 연결 테스트

**컬렉션이 자동 생성되지 않는 경우:**
- 첫 로그인 시 NextAuth가 자동으로 생성합니다
- 수동으로 생성하려면 MongoDB Compass에서 빈 컬렉션을 생성하세요

### 인증 관련 파일

- **`lib/mongodb.ts`**: MongoDB 연결 유틸리티
- **`lib/authOptions.ts`**: NextAuth 설정 (프로바이더, MongoDB 어댑터, 세션 전략, 콜백)
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

---

## 🗄️ MongoDB 데이터베이스

### 데이터베이스 개요

이 프로젝트는 MongoDB를 사용하여 사용자 인증 정보를 저장합니다.  
NextAuth.js의 MongoDB 어댑터를 통해 자동으로 사용자 데이터를 관리합니다.

### 데이터베이스 정보

- **데이터베이스 이름**: `B4K_TEST`
- **연결 URI**: `mongodb://localhost:27017/B4K_TEST`
- **사용 컬렉션**: `users`, `accounts`

### 컬렉션 상세 정보

#### users 컬렉션

사용자 기본 정보를 저장하는 컬렉션입니다.

**필드:**
- `_id`: ObjectId (고유 식별자)
- `name`: string (사용자 이름)
- `email`: string (이메일 주소, 고유)
- `emailVerified`: Date | null (이메일 인증 날짜)
- `image`: string | null (프로필 이미지 URL)
- `createdAt`: Date (생성 날짜)
- `updatedAt`: Date (수정 날짜)

**인덱스:**
- `email`: 고유 인덱스 (자동 생성)

#### accounts 컬렉션

OAuth 제공자 계정 정보를 저장하는 컬렉션입니다.

**필드:**
- `_id`: ObjectId (고유 식별자)
- `userId`: ObjectId (users 컬렉션 참조)
- `type`: string (계정 타입, "oauth")
- `provider`: string (제공자, "google")
- `providerAccountId`: string (제공자 계정 ID)
- `refresh_token`: string | null (리프레시 토큰)
- `access_token`: string | null (액세스 토큰)
- `expires_at`: number | null (만료 시간)
- `token_type`: string | null (토큰 타입)
- `scope`: string | null (권한 범위)
- `id_token`: string | null (ID 토큰)
- `session_state`: string | null (세션 상태)

**인덱스:**
- `provider_providerAccountId`: 복합 인덱스 (자동 생성)

### MongoDB 연결 관리

#### 연결 유틸리티 (`lib/mongodb.ts`)

개발 환경과 프로덕션 환경에서 최적화된 연결 관리를 제공합니다.

**특징:**
- 개발 환경: 핫 리로드 시 연결 재사용 (전역 변수 캐싱)
- 프로덕션 환경: 새로운 연결 생성
- 자동 연결 풀 관리

**사용 예시:**
```typescript
import clientPromise from "@/lib/mongodb"

// 서버 컴포넌트 또는 API 라우트에서
export default async function MyComponent() {
  const client = await clientPromise
  const db = client.db("B4K_TEST")
  
  // users 컬렉션에서 모든 사용자 조회
  const users = await db.collection("users").find({}).toArray()
  
  return <div>{/* ... */}</div>
}
```

### 데이터 조작 예시

#### 사용자 조회

```typescript
import clientPromise from "@/lib/mongodb"

export async function getUserById(userId: string) {
  const client = await clientPromise
  const db = client.db("B4K_TEST")
  const user = await db.collection("users").findOne({ 
    _id: new ObjectId(userId) 
  })
  return user
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise
  const db = client.db("B4K_TEST")
  const user = await db.collection("users").findOne({ email })
  return user
}
```

#### 사용자 정보 업데이트

```typescript
import clientPromise from "@/lib/mongodb"

export async function updateUser(userId: string, data: {
  name?: string
  image?: string
}) {
  const client = await clientPromise
  const db = client.db("B4K_TEST")
  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { 
      $set: { 
        ...data, 
        updatedAt: new Date() 
      } 
    }
  )
  return result
}
```

#### 계정 정보 조회

```typescript
import clientPromise from "@/lib/mongodb"

export async function getUserAccounts(userId: string) {
  const client = await clientPromise
  const db = client.db("B4K_TEST")
  const accounts = await db.collection("accounts")
    .find({ userId: new ObjectId(userId) })
    .toArray()
  return accounts
}
```

### MongoDB 관리 도구

**MongoDB Compass:**
- GUI를 통한 데이터베이스 관리
- 쿼리 작성 및 실행
- 인덱스 관리
- 데이터 시각화

**연결 문자열:**
```
mongodb://localhost:27017/B4K_TEST
```

### 주의사항

1. **환경 변수 보안**: `.env.local` 파일은 절대 Git에 커밋하지 마세요
2. **연결 풀**: 개발 환경에서 연결이 재사용되므로 서버 재시작 시 연결이 초기화됩니다
3. **에러 처리**: MongoDB 연결 실패 시 적절한 에러 처리를 구현하세요
4. **인덱스**: NextAuth가 자동으로 필요한 인덱스를 생성하지만, 추가 쿼리가 많다면 커스텀 인덱스를 고려하세요

---

## 🖼️ Cloudinary 이미지 관리

### 개요

이 프로젝트는 Cloudinary를 사용하여 이미지 업로드, 최적화, 변환을 관리합니다.

### 주요 기능

- ✅ 이미지 업로드 (서버/클라이언트)
- ✅ 자동 이미지 최적화 (WebP 변환, 크기 조정 등)
- ✅ 이미지 삭제
- ✅ 동적 이미지 변환 URL 생성
- ✅ Next.js Image 컴포넌트와 통합

### Cloudinary 설정

1. [Cloudinary 대시보드](https://cloudinary.com/)에서 계정 생성
2. 대시보드에서 다음 정보 확인:
   - Cloud Name
   - API Key
   - API Secret
3. `.env.local` 파일에 설정 추가 (위 환경 설정 섹션 참고)

### 사용 방법

#### 1. 서버 사이드 이미지 업로드

```typescript
import { uploadImage } from '@/lib/cloudinary'

// Base64 또는 파일 버퍼로 업로드
const result = await uploadImage(fileBuffer, {
  folder: 'b4k/products',
  transformation: [
    { width: 800, height: 600, crop: 'fill' }
  ]
})

console.log(result.secure_url) // 업로드된 이미지 URL
console.log(result.public_id)  // Cloudinary public ID
```

#### 2. 클라이언트 사이드 이미지 업로드

```tsx
"use client"

import { uploadImageClient } from '@/lib/utils/cloudinary'
import { useState } from 'react'

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadImageClient(file, 'b4k/uploads')
      console.log('Uploaded:', result.url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleUpload}
      disabled={uploading}
    />
  )
}
```

#### 3. CloudinaryImage 컴포넌트 사용

```tsx
import CloudinaryImage from '@/components/CloudinaryImage'

export default function MyComponent() {
  return (
    <CloudinaryImage
      src="/image/maincarousel/1.jpg"
      alt="Main carousel image"
      width={1200}
      height={600}
      cloudinaryPublicId="b4k/maincarousel/1"
      transformation={{
        width: 1200,
        height: 600,
        quality: 'auto',
        format: 'webp',
        crop: 'fill'
      }}
    />
  )
}
```

#### 4. 이미지 URL 생성

```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary'

// 서버 사이드
const optimizedUrl = getCloudinaryUrl('b4k/products/image1', {
  width: 800,
  height: 600,
  quality: 'auto',
  format: 'webp',
  crop: 'fill'
})
```

```typescript
import { getCloudinaryImageUrl } from '@/lib/utils/cloudinary'

// 클라이언트 사이드
const optimizedUrl = getCloudinaryImageUrl('b4k/products/image1', {
  width: 800,
  height: 600,
  quality: 'auto',
  format: 'webp'
})
```

#### 5. 이미지 삭제

```typescript
import { deleteImage } from '@/lib/cloudinary'

await deleteImage('b4k/products/image1')
```

### API 라우트

#### 이미지 업로드 API (`/api/upload`)

**POST** `/api/upload`

**요청:**
- `file`: File (FormData)
- `folder`: string (선택사항)

**응답:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "b4k/folder/image"
}
```

**사용 예시:**
```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('folder', 'b4k/uploads')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})

const data = await response.json()
```

### 이미지 변환 옵션

Cloudinary는 다양한 이미지 변환 옵션을 제공합니다:

- **크기 조정**: `width`, `height`
- **자르기**: `crop` (`fill`, `fit`, `scale`, `thumb`)
- **품질**: `quality` (`auto` 또는 1-100)
- **포맷**: `format` (`auto`, `webp`, `jpg`, `png`)
- **중력**: `gravity` (이미지 중앙 정렬 등)

### 관련 파일

- **`lib/cloudinary.ts`**: 서버 사이드 Cloudinary 설정 및 유틸리티
- **`lib/utils/cloudinary.ts`**: 클라이언트 사이드 Cloudinary 유틸리티
- **`components/CloudinaryImage.tsx`**: 최적화된 이미지 컴포넌트
- **`app/api/upload/route.ts`**: 이미지 업로드 API 라우트
- **`next.config.js`**: Cloudinary 도메인 허용 설정

### 주의사항

1. **환경 변수 보안**: API Secret은 절대 클라이언트에 노출되지 않도록 주의하세요
2. **파일 크기 제한**: Cloudinary 무료 플랜은 10MB 제한이 있습니다
3. **폴더 구조**: 일관된 폴더 구조를 사용하여 이미지를 관리하세요
4. **이미지 최적화**: `quality: 'auto'`와 `format: 'auto'`를 사용하여 자동 최적화를 활용하세요

---

## 🔗 MongoDB와 Cloudinary 연동

### 개요

이 프로젝트는 MongoDB와 Cloudinary를 연동하여 이미지와 데이터를 함께 관리합니다.

### 주요 기능

- ✅ MongoDB에 이미지 URL 및 Cloudinary Public ID 저장
- ✅ 이미지 업로드와 동시에 MongoDB 업데이트
- ✅ POI, KContent, Package에 이미지 연동
- ✅ 여러 이미지 업로드 지원

### 데이터베이스 구조

#### POI 컬렉션

```typescript
{
  _id: ObjectId,
  name: string,
  address: string,
  location: { type: string, coordinates: number[] },
  categoryTags: string[],
  openingHours: string,
  entryFee: string,
  needsReservation: boolean,
  imageUrl?: string,              // Cloudinary 이미지 URL
  cloudinaryPublicId?: string,    // Cloudinary public ID
  createdAt?: Date,
  updatedAt?: Date
}
```

#### KContent 컬렉션

```typescript
{
  _id: ObjectId,
  subName: string,
  poiId: ObjectId,
  spotName: string,
  description: string,
  tags: string[],
  category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival',
  imageUrl?: string,              // 단일 이미지 URL
  cloudinaryPublicId?: string,    // 단일 이미지 public ID
  images?: string[],              // 여러 이미지 URL 배열
  cloudinaryPublicIds?: string[], // 여러 이미지 public ID 배열
  createdAt?: Date,
  updatedAt?: Date
}
```

#### Package 컬렉션

```typescript
{
  _id: ObjectId,
  name: string,
  duration: number,
  concept: string,
  cities: string[],
  highlights: string[],
  includedServices: string[],
  itinerary: Array<{ day: number, city: string, activities: string[] }>,
  category: 'kpop' | 'kdrama' | 'all',
  imageUrl: string,              // 메인 이미지 URL
  cloudinaryPublicId?: string,    // 메인 이미지 public ID
  images?: string[],              // 추가 이미지 URL 배열
  cloudinaryPublicIds?: string[], // 추가 이미지 public ID 배열
  createdAt?: Date,
  updatedAt?: Date
}
```

### 사용 방법

#### 1. MongoDB 데이터베이스 함수 사용

```typescript
import { getAllPOIs, getPOIById, createPOI, updatePOIImage } from '@/lib/db/pois'
import { getAllKContents, createKContent, updateKContentImage } from '@/lib/db/kcontents'
import { getAllPackages, createPackage, updatePackageImage } from '@/lib/db/packages'

// POI 조회
const pois = await getAllPOIs()
const poi = await getPOIById('poi_id_here')

// KContent 조회
const contents = await getAllKContents()
const contentsByCategory = await getKContentsByCategory('kpop')

// Package 조회
const packages = await getAllPackages()
const package = await getPackageById('package_id_here')
```

#### 2. 이미지 업로드와 MongoDB 저장 (API 사용)

```typescript
// 클라이언트에서
const formData = new FormData()
formData.append('file', file)
formData.append('entityType', 'poi')  // 'poi' | 'kcontent' | 'package'
formData.append('entityId', 'entity_id_here')
formData.append('folder', 'b4k/pois')  // 선택사항

const response = await fetch('/api/upload-and-save', {
  method: 'POST',
  body: formData
})

const data = await response.json()
// { success: true, url: "...", publicId: "...", entity: {...} }
```

#### 3. 유틸리티 함수 사용

```typescript
import { 
  uploadAndSavePOIImage,
  uploadAndSaveKContentImage,
  uploadAndSavePackageImage 
} from '@/lib/utils/mongodb-cloudinary'

// POI 이미지 업로드 및 저장
const result = await uploadAndSavePOIImage(file, poiId, 'b4k/pois')

// KContent 이미지 업로드 및 저장 (여러 이미지)
const result = await uploadAndSaveKContentImage(
  file, 
  contentId, 
  'b4k/kcontents',
  true  // isMultiple
)

// Package 이미지 업로드 및 저장
const result = await uploadAndSavePackageImage(file, packageId)
```

#### 4. 여러 이미지 업로드

```typescript
import { uploadAndSaveMultipleImages } from '@/lib/utils/mongodb-cloudinary'

const files = [file1, file2, file3]
const results = await uploadAndSaveMultipleImages(
  files,
  'kcontent',  // entityType
  contentId,
  'b4k/kcontents'
)
```

### API 엔드포인트

#### 이미지 업로드 및 저장 (`/api/upload-and-save`)

**POST** `/api/upload-and-save`

**요청 (FormData):**
- `file`: File (필수)
- `entityType`: 'poi' | 'kcontent' | 'package' (필수)
- `entityId`: string (필수)
- `folder`: string (선택)
- `isMultiple`: boolean (선택, 여러 이미지 업로드 여부)

**응답:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "b4k/pois/image",
  "entity": { /* 업데이트된 엔티티 데이터 */ }
}
```

### 데이터베이스 함수

#### POI 함수 (`lib/db/pois.ts`)

- `getAllPOIs()`: 모든 POI 조회
- `getPOIById(poiId)`: ID로 POI 조회
- `createPOI(poiData)`: POI 생성
- `updatePOI(poiId, updateData)`: POI 업데이트
- `updatePOIImage(poiId, imageUrl, cloudinaryPublicId)`: POI 이미지 업데이트
- `deletePOI(poiId)`: POI 삭제
- `getPOIsByCategory(category)`: 카테고리로 POI 검색

#### KContent 함수 (`lib/db/kcontents.ts`)

- `getAllKContents()`: 모든 KContent 조회
- `getKContentById(contentId)`: ID로 KContent 조회
- `getKContentsByPOIId(poiId)`: POI ID로 KContent 조회
- `getKContentsByCategory(category)`: 카테고리로 KContent 조회
- `getKContentsBySubName(subName)`: subName으로 KContent 조회
- `createKContent(contentData)`: KContent 생성
- `updateKContent(contentId, updateData)`: KContent 업데이트
- `updateKContentImage(contentId, imageUrl, cloudinaryPublicId)`: KContent 이미지 업데이트
- `addKContentImages(contentId, imageUrls, cloudinaryPublicIds)`: KContent에 여러 이미지 추가
- `deleteKContent(contentId)`: KContent 삭제

#### Package 함수 (`lib/db/packages.ts`)

- `getAllPackages()`: 모든 패키지 조회
- `getPackageById(packageId)`: ID로 패키지 조회
- `getPackagesByCategory(category)`: 카테고리로 패키지 조회
- `createPackage(packageData)`: 패키지 생성
- `updatePackage(packageId, updateData)`: 패키지 업데이트
- `updatePackageImage(packageId, imageUrl, cloudinaryPublicId)`: 패키지 이미지 업데이트
- `addPackageImages(packageId, imageUrls, cloudinaryPublicIds)`: 패키지에 여러 이미지 추가
- `deletePackage(packageId)`: 패키지 삭제

### 환경 변수

`.env.local` 파일에 다음 변수가 필요합니다:

```env
# MongoDB 설정
MONGODB_URI=mongodb://localhost:27017/B4K_TEST
MONGODB_DB_NAME=B4K_TEST  # 선택사항, 기본값: B4K_TEST

# Cloudinary 설정
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 관련 파일

- **`lib/db/pois.ts`**: POI 데이터베이스 함수
- **`lib/db/kcontents.ts`**: KContent 데이터베이스 함수
- **`lib/db/packages.ts`**: Package 데이터베이스 함수
- **`lib/utils/mongodb-cloudinary.ts`**: MongoDB와 Cloudinary 연동 유틸리티
- **`app/api/upload-and-save/route.ts`**: 이미지 업로드 및 MongoDB 저장 API
- **`lib/cloudinary.ts`**: Cloudinary 설정 및 함수

### 주의사항

1. **데이터베이스 이름**: `MONGODB_DB_NAME` 환경 변수를 설정하지 않으면 기본값 `B4K_TEST`가 사용됩니다
2. **ObjectId 변환**: MongoDB의 ObjectId는 문자열로 자동 변환됩니다
3. **이미지 삭제**: MongoDB에서 데이터를 삭제할 때 Cloudinary에서도 이미지를 삭제하는 것을 고려하세요
4. **에러 처리**: 모든 데이터베이스 함수는 에러를 적절히 처리하지만, API에서는 추가적인 에러 처리가 필요할 수 있습니다

---

## 📚 추가 설정

추가 환경 설정은 이 섹션에 계속 정리됩니다.

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.
