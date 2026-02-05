"use client"

import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageContext'

interface ExplorationItem {
  id: string
  title: { title_en: string; title_ko: string }
  description: { description_en: string; description_ko: string }
  imageUrl: string
  area: { area_en: string; area_ko: string }
}

const seoulExplorations: ExplorationItem[] = [
  {
    id: '1',
    title: {
      title_en: 'Gangnam District',
      title_ko: '강남구',
    },
    description: {
      description_en: 'Explore the modern and vibrant attractions of Gangnam',
      description_ko: '강남의 현대적이고 활기찬 명소를 탐험하세요',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296395/Type1_%EC%84%9C%EC%9A%B8%EC%95%BC%EA%B2%BD_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EC%B9%B4%EB%A9%9C%ED%94%84%EB%A0%88%EC%8A%A4_jV5Dea_lxpdn1.jpg',
    area: {
      area_en: 'Gangnam-gu',
      area_ko: '강남구',
    },
  },
  {
    id: '2',
    title: {
      title_en: 'Hongdae Street Culture',
      title_ko: '홍대 거리 문화',
    },
    description: {
      description_en: 'Experience the unique culture of Hongdae, overflowing with youth and creativity',
      description_ko: '젊음과 창의력이 넘치는 홍대의 독특한 문화를 경험하세요',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296398/Type1_%ED%99%8D%EB%8C%80%EA%B1%B0%EB%A6%AC_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EC%9D%B4%EB%B2%94%EC%88%98_XqixUa_apok5t.jpg',
    area: {
      area_en: 'Mapo-gu',
      area_ko: '마포구',
    },
  },
  {
    id: '3',
    title: {
      title_en: 'Gyeongbokgung Palace & Hanok Village',
      title_ko: '경복궁과 한옥마을',
    },
    description: {
      description_en: 'Explore the palace and hanok of the Joseon Dynasty, where tradition and history come alive',
      description_ko: '전통과 역사가 살아있는 조선왕조의 궁궐과 한옥을 탐험하세요',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296396/Type1_%EA%B2%BD%EB%B3%B5%EA%B6%81_IR_%EC%8A%A4%ED%8A%9C%EB%94%94%EC%98%A4_Q0FNNa_zobewc.jpg',
    area: {
      area_en: 'Jongno-gu',
      area_ko: '종로구',
    },
  },
  {
    id: '4',
    title: {
      title_en: 'Myeongdong Shopping Street',
      title_ko: '명동 쇼핑거리',
    },
    description: {
      description_en: 'Seoul\'s representative center for shopping and entertainment',
      description_ko: '서울의 대표적인 쇼핑과 엔터테인먼트 중심지',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296397/Type1_%EB%AA%85%EB%8F%99%EA%B1%B0%EB%A6%AC_%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC_%EC%9D%B4%EB%B2%94%EC%88%98_nIbHea_exmajn.jpg',
    area: {
      area_en: 'Jung-gu',
      area_ko: '중구',
    },
  },
  {
    id: '5',
    title: {
      title_en: 'Hangang Park',
      title_ko: '한강공원',
    },
    description: {
      description_en: 'Various leisure activities along the Hangang River, the heart of Seoul',
      description_ko: '서울의 심장인 한강을 따라 즐기는 다양한 여가 활동',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296434/%ED%95%9C%EA%B0%95%EA%B3%B5%EC%9B%90_11_qc8r9v.jpg',
    area: {
      area_en: 'Yongsan-gu',
      area_ko: '용산구',
    },
  },
  {
    id: '6',
    title: {
      title_en: 'Bukchon Hanok Village',
      title_ko: '북촌 한옥마을',
    },
    description: {
      description_en: 'A beautiful village where traditional hanok and modern cafes coexist',
      description_ko: '전통 한옥과 현대적인 카페가 공존하는 아름다운 마을',
    },
    imageUrl: 'https://res.cloudinary.com/deobrd4nv/image/upload/v1770296419/%EB%B6%81%EC%B4%8C%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_7_etuez3.jpg',
    area: {
      area_en: 'Jongno-gu',
      area_ko: '종로구',
    },
  }
]

const translations = {
  en: {
    title: 'Explore Seoul',
    showAll: 'Show All',
    comingSoon: 'Coming Soon',
  },
  ko: {
    title: '서울 탐험',
    showAll: '전체 보기',
    comingSoon: '곧 출시',
  },
}

export default function SeoulExploration() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section id="seoul-exploration" className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="px-6">
        {/* Title section - left aligned */}
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
          {seoulExplorations.map((item) => {
            const title = language === 'ko' ? item.title.title_ko : item.title.title_en
            const description = language === 'ko' ? item.description.description_ko : item.description.description_en
            const area = language === 'ko' ? item.area.area_ko : item.area.area_en

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
                        {area}
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

