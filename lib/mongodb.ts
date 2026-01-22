import { MongoClient } from "mongodb"
import { env, getMongoUriOptional } from "@/lib/env"

const uri = getMongoUriOptional()
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  // Vercel/CI 빌드 단계에서 env가 비어있으면 import 시점 throw로 빌드가 깨질 수 있어
  // 실제로 DB를 사용할 때(await)만 에러가 나도록 rejected Promise로 둡니다.
  clientPromise = Promise.reject(
    new Error("MONGODB_URI is not set. Configure it in Vercel Environment Variables.")
  )
} else if (env("NODE_ENV") === "development") {
  // 개발 환경에서는 전역 변수에 저장하여 핫 리로드 시 재사용
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // 프로덕션 환경
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

