"use client"

import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageContext'

interface SeasonalItem {
  id: string
  title: { title_en: string; title_ko: string }
  description: { description_en: string; description_ko: string }
  imageUrl: string
  season: { season_en: 'Spring' | 'Summer' | 'Autumn' | 'Winter'; season_ko: string }
  href?: string
}

const seasonalRecommendations: SeasonalItem[] = [
  {
    id: '1',
    title: {
      title_en: 'Cherry Blossom Festival',
      title_ko: '벚꽃 축제',
    },
    description: {
      description_en: 'Spring\'s representative festival, enjoying Seoul\'s spring while admiring beautiful cherry blossoms',
      description_ko: '봄의 대표 축제, 아름다운 벚꽃을 감상하며 서울의 봄을 즐기세요',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296690/Type1_%EC%98%81%EB%93%B1%ED%8F%AC_%EC%97%AC%EC%9D%98%EB%8F%84_%EB%B4%84%EA%BD%83%EC%B6%95%EC%A0%9C_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EC%9D%B4%EB%B2%94%EC%88%98_4BHEFa_tsatpe.jpg',
    season: {
      season_en: 'Spring',
      season_ko: '봄',
    },
    href: '/seasons/spring'
  },
  {
    id: '2',
    title: {
      title_en: 'Summer Hangang Picnic',
      title_ko: '여름 한강 피크닉',
    },
    description: {
      description_en: 'Summer night picnics and outdoor concerts enjoyed at the cool Hangang River',
      description_ko: '시원한 한강에서 즐기는 여름 밤 피크닉과 야외 콘서트',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296747/Type1_%EC%84%9C%EC%9A%B8_%EB%B0%A4%EB%8F%84%EA%B9%A8%EB%B9%84_%EC%95%BC%EC%8B%9C%EC%9E%A5_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EC%9D%B4%EB%B2%94%EC%88%98_J7FqNa_ybsj0i.jpg',
    season: {
      season_en: 'Summer',
      season_ko: '여름',
    },
    href: '/seasons/summer'
  },
  {
    id: '3',
    title: {
      title_en: 'Autumn Foliage Tour',
      title_ko: '가을 단풍 투어',
    },
    description: {
      description_en: 'Explore Seoul\'s parks and mountains painted with brilliant autumn leaves',
      description_ko: '화려한 가을 단풍으로 물든 서울의 공원과 산을 탐험하세요',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296856/Type1_%EB%8D%95%EC%88%98%EA%B6%81%EC%9D%98_%EA%B0%80%EC%9D%84_%EB%B0%95%EA%B7%BC%ED%98%95_Nvklba_lbd53t.jpg',
    season: {
      season_en: 'Autumn',
      season_ko: '가을',
    },
    href: '/seasons/autumn'
  },
  {
    id: '4',
    title: {
      title_en: 'Winter Snow Festival',
      title_ko: '겨울 눈 축제',
    },
    description: {
      description_en: 'Winter festivals enjoyed in snow-covered Seoul',
      description_ko: '눈으로 덮인 서울에서 즐기는 겨울 축제',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296843/Type1_%EC%9E%90%EB%9D%BC%EC%84%AC_%EC%94%BD%EC%94%BD%EA%B2%A8%EC%9A%B8%EC%B6%95%EC%A0%9C_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EA%B9%80%EC%A7%80%ED%98%B8_pF7Kza_xtjomn.jpg',
    season: {
      season_en: 'Winter',
      season_ko: '겨울',
    },
    href: '/seasons/winter'
  },
  {
    id: '5',
    title: {
      title_en: 'Spring Flower Festival',
      title_ko: '봄 꽃 축제',
    },
    description: {
      description_en: 'Seoul\'s parks and gardens filled with various spring flowers',
      description_ko: '다양한 봄 꽃으로 가득한 서울의 공원과 정원',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296849/Type1_%EB%82%99%EB%8F%99%EA%B0%95%EC%9C%A0%EC%B1%84%EC%B6%95%EC%A0%9C_%EC%9C%A4%EC%83%81%ED%83%9C_pWkIza_l20tjk.jpg',
    season: {
      season_en: 'Spring',
      season_ko: '봄',
    },
    href: '/seasons/spring-flowers'
  },
  {
    id: '6',
    title: {
      title_en: 'Summer Water Festival',
      title_ko: '여름 물 축제',
    },
    description: {
      description_en: 'Seoul\'s summer festival enjoyed with cool water activities',
      description_ko: '시원한 물놀이와 함께 즐기는 서울의 여름 축제',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296850/Type1_2018_%EC%A0%95%EB%82%A8%EC%A7%84%EC%9E%A5%ED%9D%A5%EB%AC%BC%EC%B6%95%EC%A0%9C_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EA%B9%80%EC%A7%80%ED%98%B8_ogSPQa_un0od4.jpg',
    season: {
      season_en: 'Summer',
      season_ko: '여름',
    },
    href: '/seasons/summer-festival'
  }
]

const translations = {
  en: {
    title: 'Seasonal Travel Recommendations',
    showAll: 'Show All',
    comingSoon: 'Coming Soon',
  },
  ko: {
    title: '계절별 여행 추천',
    showAll: '전체 보기',
    comingSoon: '곧 출시',
  },
}

export default function SeasonalRecommendations() {
  const { language } = useLanguage()
  const t = translations[language]

  // Monochrome season badges with different opacity
  const seasonColors = {
    'Spring': 'bg-gray-800 dark:bg-gray-200',
    'Summer': 'bg-gray-700 dark:bg-gray-300',
    'Autumn': 'bg-gray-600 dark:bg-gray-400',
    'Winter': 'bg-gray-900 dark:bg-gray-100'
  }

  return (
    <section id="seasonal-recommendations" className="w-full py-16 bg-white dark:bg-gray-900">
      <div className="px-6">
        {/* Title section */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4 justify-start pl-2">
            <div className="w-10 h-px bg-gray-400 dark:bg-gray-600"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-left">
              {t.title}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-400 dark:from-gray-600 to-transparent"></div>
          </div>
          <div className="flex justify-end mt-2 pr-2">
            <button
              type="button"
              className="focus-ring rounded-md px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
              aria-label={t.showAll}
            >
              {t.showAll}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasonalRecommendations.map((item) => {
            const title = language === 'ko' ? item.title.title_ko : item.title.title_en
            const description = language === 'ko' ? item.description.description_ko : item.description.description_en
            const season = language === 'ko' ? item.season.season_ko : item.season.season_en
            const seasonKey = item.season.season_en

            return (
              <div
                key={item.id}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-[border-color,box-shadow] duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    {/* Coming Soon overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="px-4 py-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-800 dark:text-gray-200 text-sm font-semibold">
                        {t.comingSoon}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 ${seasonColors[seasonKey]} rounded-full text-white dark:text-gray-900 text-xs font-semibold`}>
                        {season}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

