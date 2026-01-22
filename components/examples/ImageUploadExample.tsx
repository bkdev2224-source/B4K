"use client"

/**
 * MongoDB와 Cloudinary 연동 사용 예시 컴포넌트
 * 
 * 이 컴포넌트는 이미지 업로드와 MongoDB 저장을 연동하는 방법을 보여줍니다.
 */

import { useState } from 'react'
import { uploadAndSavePOIImage } from '@/lib/utils/mongodb-cloudinary'

interface ImageUploadExampleProps {
  entityType: 'poi' | 'kcontent' | 'package'
  entityId: string
}

export default function ImageUploadExample({ entityType, entityId }: ImageUploadExampleProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<{ url: string; publicId: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      // 방법 1: 유틸리티 함수 사용
      if (entityType === 'poi') {
        const result = await uploadAndSavePOIImage(file, entityId, `b4k/${entityType}`)
        setUploadedImage(result)
      }

      // 방법 2: API 직접 호출
      // const formData = new FormData()
      // formData.append('file', file)
      // formData.append('entityType', entityType)
      // formData.append('entityId', entityId)
      // formData.append('folder', `b4k/${entityType}`)
      //
      // const response = await fetch('/api/upload-and-save', {
      //   method: 'POST',
      //   body: formData
      // })
      //
      // if (!response.ok) {
      //   throw new Error('Upload failed')
      // }
      //
      // const data = await response.json()
      // setUploadedImage({ url: data.url, publicId: data.publicId })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">이미지 업로드 예시</h3>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          이미지 선택 ({entityType})
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
      </div>

      {uploading && (
        <div className="mb-4 text-blue-600">업로드 중...</div>
      )}

      {error && (
        <div className="mb-4 text-red-600">에러: {error}</div>
      )}

      {uploadedImage && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">업로드 완료!</p>
          <img
            src={uploadedImage.url}
            alt="Uploaded"
            className="max-w-xs rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-2">
            Public ID: {uploadedImage.publicId}
          </p>
        </div>
      )}
    </div>
  )
}

