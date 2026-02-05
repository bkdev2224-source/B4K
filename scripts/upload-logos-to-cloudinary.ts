/**
 * mockupdata/logo 이미지를 Cloudinary에 업로드하고
 * kpop_artists 문서의 logoUrl에 secure_url 저장
 *
 * 사용법: npx tsx scripts/upload-logos-to-cloudinary.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'
import { getMongoDbName, getMongoUriRequired } from '../lib/config/env'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const LOGO_DIR = resolve(process.cwd(), 'mockupdata', 'logo')
const IMAGE_EXT = /\.(png|svg|jpe?g|webp|gif)$/i

/** 파일명에서 확장자 제거 후 _logo 제거, 키로 사용 (소문자) */
function fileBaseKey(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '').trim()
  const base = withoutExt.replace(/_logo$/i, '').trim()
  return base.toLowerCase()
}

/** 아티스트 name을 매칭용 키로 정규화 (소문자, 공백/따옴표 제거) */
function artistNameToKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/'/g, '')
    .trim()
}

/** 파일 키 -> 아티스트 name 매핑 (오타 등 수동 보정) */
const FILE_KEY_TO_ARTIST: Record<string, string> = {
  blcakpink: 'BLACKPINK', // 오타: blcakpink -> BLACKPINK
}

async function main() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET 가 .env.local에 필요합니다.')
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

  const client = new MongoClient(getMongoUriRequired())
  await client.connect()
  const db = client.db(getMongoDbName())
  const artistsColl = db.collection('kpop_artists')

  const artists = await artistsColl.find<{ name: string }>({}).toArray()
  const keyToArtistName = new Map<string, string>()
  for (const a of artists) {
    const key = artistNameToKey(a.name)
    if (keyToArtistName.has(key)) {
      console.warn(`경고: 아티스트 키 중복 "${key}" -> ${keyToArtistName.get(key)}, ${a.name}`)
    }
    keyToArtistName.set(key, a.name)
  }
  Object.entries(FILE_KEY_TO_ARTIST).forEach(([k, name]) => keyToArtistName.set(k, name))

  if (artists.length === 0) {
    throw new Error('kpop_artists 컬렉션에 문서가 없습니다.')
  }

  const files = readdirSync(LOGO_DIR).filter((f) => IMAGE_EXT.test(f))
  console.log(`\n[1] mockupdata/logo 이미지 파일 ${files.length}개 확인`)
  const fileKeysFromLogo = [...new Set(files.map((f) => fileBaseKey(f)))]
  const matchedKeys = fileKeysFromLogo.filter((k) => keyToArtistName.has(k))
  const unmatchedKeys = fileKeysFromLogo.filter((k) => !keyToArtistName.has(k))
  console.log(`아티스트 ${artists.length}명, 파일 키 중 매칭됨: ${matchedKeys.length}개, 제외(브랜드 등): ${unmatchedKeys.length}개\n`)

  const toProcess: { filePath: string; baseKey: string; artistName: string }[] = []
  const skipped: { file: string; reason: string }[] = []

  for (const file of files) {
    const baseKey = fileBaseKey(file)
    const artistName = keyToArtistName.get(baseKey)
    const filePath = resolve(LOGO_DIR, file)
    if (artistName) {
      toProcess.push({ filePath, baseKey, artistName })
    } else {
      skipped.push({ file, reason: 'kpop_artists에 매칭되는 name 없음 (브랜드/회사 로고 등)' })
    }
  }

  if (skipped.length) {
    console.log('매칭 제외된 파일 (아티스트가 아님):')
    skipped.forEach(({ file, reason }) => console.log(`  - ${file}: ${reason}`))
    console.log('')
  }

  console.log(`[2] 업로드 및 DB 반영 대상: ${toProcess.length}개\n`)

  for (const { filePath, baseKey, artistName } of toProcess) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'logos',
        public_id: `kpop_${baseKey}`,
        overwrite: true,
      })
      await artistsColl.updateOne(
        { name: artistName },
        { $set: { logoUrl: result.secure_url } }
      )
      console.log(`✓ ${artistName} <- ${filePath.split(/[/\\]/).pop()} (${result.secure_url})`)
    } catch (err) {
      console.error(`✗ ${artistName} (${filePath}):`, err)
    }
  }

  console.log('\n완료.')
  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
