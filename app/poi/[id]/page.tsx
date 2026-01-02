"use client"

import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import { getPOIById, getKContentsByPOIId } from '@/lib/data'
import { useSidebar } from '@/components/SidebarContext'

export default function POIDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string || ''
  const { sidebarOpen } = useSidebar()
  
  const poi = getPOIById(id)
  const kContents = poi ? getKContentsByPOIId(id) : []

  if (!poi) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2a1a3e] to-[#1a1a2e]">
        <Sidebar />
        <TopNav />
        <main className={`pt-16 pb-8 flex items-center justify-center min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-[12.75%] lg:w-[87.25%]' : 'lg:ml-[80px] lg:w-[calc(100%-80px)]'
        }`}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">장소를 찾을 수 없습니다</h1>
            <button
              onClick={() => router.push('/')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2a1a3e] to-[#1a1a2e]">
      <Sidebar />
      <TopNav />
      <main className={`min-h-screen pt-16 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-[17%] lg:w-[83%]' : 'lg:ml-20 lg:w-[calc(100%-5rem)]'
      }`}>
        {/* 배너 이미지 */}
        <div className="relative h-96">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-purple-900/50 to-transparent z-10" />
          <img
            src={`https://picsum.photos/seed/${poi._id.$oid}/1920/600`}
            alt={poi.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <div className="container mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">{poi.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-purple-200 text-sm md:text-base">
                <div className="flex gap-2 flex-wrap">
                  {poi.categoryTags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-500/30 border border-purple-400/50 rounded-full text-purple-200">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-purple-300">·</span>
                <span>{kContents.length}개 스팟</span>
                <span className="text-purple-300">·</span>
                <span>{poi.openingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="container mx-auto px-6 pt-8 pb-16">
          {/* K-Contents 섹션 */}
          {kContents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                방문할 스팟
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kContents.map((content, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 hover:from-purple-800/60 hover:to-pink-800/60 transition-all duration-200 shadow-lg hover:shadow-purple-500/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {/* spotName을 제목으로 */}
                        <h3 className="text-xl font-bold text-white mb-2">{content.spotName}</h3>
                        {/* subName을 해시태그로 */}
                        {content.subName && (
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-full text-purple-200 text-sm font-medium mb-3">
                            #{content.subName}
                          </span>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex-shrink-0">
                        <img
                          src={`https://picsum.photos/seed/${poi._id.$oid}-${content.spotName}/100/100`}
                          alt={content.spotName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                      {content.description}
                    </p>
                    {content.tags && content.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {content.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2 py-1 bg-purple-500/30 border border-purple-400/50 rounded-md text-purple-200 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 장소 정보 카드 */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              장소 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-purple-300 text-sm font-medium mb-2">📍 주소</p>
                <p className="text-white">{poi.address}</p>
              </div>
              <div className="space-y-1">
                <p className="text-purple-300 text-sm font-medium mb-2">💰 입장료</p>
                <p className="text-white">{poi.entryFee}</p>
              </div>
              <div className="space-y-1">
                <p className="text-purple-300 text-sm font-medium mb-2">🕐 운영 시간</p>
                <p className="text-white">{poi.openingHours}</p>
              </div>
              <div className="space-y-1">
                <p className="text-purple-300 text-sm font-medium mb-2">📞 예약 필요</p>
                <p className="text-white">{poi.needsReservation ? '예' : '아니오'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
