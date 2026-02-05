"use client"

import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageContext'

interface RecommendationItem {
  id: string
  title: { title_en: string; title_ko: string }
  description: { description_en: string; description_ko: string }
  imageUrl: string
  category: { category_en: string; category_ko: string }
}

const editorRecommendations: RecommendationItem[] = [
  {
    id: '1',
    title: {
      title_en: 'Forest Retreat',
      title_ko: '숲 속 휴식',
    },
    description: {
      description_en: 'A moment to pause in a quiet winter forest in the heart of the city',
      description_ko: '도심 속 조용한 겨울 숲에서 잠시 멈춰 서는 순간',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770295872/Type1_%EC%A3%BD%EB%85%B9%EC%9B%90_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EA%B9%80%EC%A7%80%ED%98%B8_rvJgia_a57xhq.jpg',
    category: {
      category_en: 'Relaxation',
      category_ko: '휴식',
    },
  },
  {
    id: '2',
    title: {
      title_en: 'Starfield Library',
      title_ko: '별마당 도서관',
    },
    description: {
      description_en: 'Sparkling Christmas atmosphere under a giant tree',
      description_ko: '거대한 나무 아래 반짝이는 크리스마스 분위기',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770295776/%EB%B3%84%EB%A7%88%EB%8B%B9_%EA%B9%80%EA%B7%9C%EB%A6%BC_j63qri.jpg',
    category: {
      category_en: 'Culture',
      category_ko: '문화',
    },
  },
  {
    id: '3',
    title: {
      title_en: 'Lantern Festival',
      title_ko: '등불 축제',
    },
    description: {
      description_en: 'Seoul\'s night light festival that unfolds on winter nights',
      description_ko: '겨울 밤에 펼쳐지는 서울의 야간 조명 축제',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296093/Type1_%EC%B2%AD%EA%B3%84%EC%B2%9C_%EC%95%BC%EA%B2%BD_IR_%EC%8A%A4%ED%8A%9C%EB%94%94%EC%98%A4_JFYFMa_ra9bvv.jpg',
    category: {
      category_en: 'Festival',
      category_ko: '축제',
    },
  },
  {
    id: '4',
    title: {
      title_en: 'K-Pop Demon Hunters: Seoul 2-Day Golden Tour',
      title_ko: 'K-Pop 데몬 헌터: 서울 2일 골든 투어',
    },
    description: {
      description_en: 'An attractive 2-day travel course in Seoul following the main locations from K-Pop Demon Hunters',
      description_ko: 'K-Pop 데몬 헌터의 주요 촬영지를 따라가는 매력적인 서울 2일 여행 코스',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770295950/wp15515589-kpop-demon-hunters-wallpapers_isxchr.jpg',
    category: {
      category_en: 'K-Pop',
      category_ko: 'K-Pop',
    },
  },
  {
    id: '5',
    title: {
      title_en: 'Autumn Flavors with Seoul\'s Seasonal Desserts',
      title_ko: '서울의 계절 디저트와 함께하는 가을 맛',
    },
    description: {
      description_en: 'Autumn flavors with Seoul\'s seasonal desserts',
      description_ko: '서울의 계절 디저트와 함께하는 가을 맛',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296092/Type1_%EC%95%88%EB%8F%99_%EC%B9%B4%ED%8E%98_%EB%94%94%EC%97%94%EC%97%90%EC%9D%B4%EC%8A%A4%ED%8A%9C%EB%94%94%EC%98%A4_zOcaT5_u9offq.jpg',
    category: {
      category_en: 'K-Food',
      category_ko: 'K-Food',
    },
  },
  {
    id: '6',
    title: {
      title_en: 'Year-end Tree Spaces in Seoul',
      title_ko: '서울의 연말 트리 공간',
    },
    description: {
      description_en: 'Year-end atmosphere-filled tree spaces to enjoy indoors in Seoul',
      description_ko: '서울에서 실내에서 즐길 수 있는 연말 분위기 가득한 트리 공간',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296095/Type1_%EC%B2%AD%EA%B3%84%EC%B2%9C_%EC%95%BC%EA%B2%BD_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EC%9D%B4%EB%B2%94%EC%88%98_ZrI9Da_sepag8.jpg',
    category: {
      category_en: 'Event',
      category_ko: '이벤트',
    },
  }
]

const translations = {
  en: {
    title: 'Editor Recommendations',
    showAll: 'Show All',
    comingSoon: 'Coming Soon',
  },
  ko: {
    title: '에디터 추천',
    showAll: '전체 보기',
    comingSoon: '곧 출시',
  },
}

export default function EditorRecommendations() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section id="editor-recommendations" className="w-full py-16 bg-white dark:bg-gray-900">
      <div className="px-6">
        {/* Title section - centered with border lines */}
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
          {editorRecommendations.map((item) => {
            const title = language === 'ko' ? item.title.title_ko : item.title.title_en
            const description = language === 'ko' ? item.description.description_ko : item.description.description_en
            const category = language === 'ko' ? item.category.category_ko : item.category.category_en

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
                      <span className="px-3 py-1 bg-gray-900 dark:bg-gray-100 rounded-full text-white dark:text-gray-900 text-xs font-semibold">
                        {category}
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

