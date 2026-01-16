"use client"

import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import { getKContentsByCategory, getPOIById, KContent } from '@/lib/data'

type AccentKey = 'purple' | 'pink' | 'amber' | 'emerald'

const accentClasses: Record<AccentKey, {
  from: string
  solid: string
  text: string
  hoverText: string
  groupHoverText: string
  badge: string
  borderHover: string
  shadow: string
  pill: string
}> = {
  purple: {
    from: 'from-purple-500',
    solid: 'bg-purple-500',
    text: 'text-purple-600',
    hoverText: 'hover:text-purple-700',
    groupHoverText: 'group-hover:text-purple-600',
    badge: 'bg-purple-500',
    borderHover: 'hover:border-purple-400',
    shadow: 'hover:shadow-purple-500/20',
    pill: 'bg-purple-100 text-purple-700 border-purple-300'
  },
  pink: {
    from: 'from-pink-500',
    solid: 'bg-pink-500',
    text: 'text-pink-600',
    hoverText: 'hover:text-pink-700',
    groupHoverText: 'group-hover:text-pink-600',
    badge: 'bg-pink-500',
    borderHover: 'hover:border-pink-400',
    shadow: 'hover:shadow-pink-500/20',
    pill: 'bg-pink-100 text-pink-700 border-pink-300'
  },
  amber: {
    from: 'from-amber-500',
    solid: 'bg-amber-500',
    text: 'text-amber-600',
    hoverText: 'hover:text-amber-700',
    groupHoverText: 'group-hover:text-amber-600',
    badge: 'bg-amber-500',
    borderHover: 'hover:border-amber-400',
    shadow: 'hover:shadow-amber-500/20',
    pill: 'bg-amber-100 text-amber-700 border-amber-300'
  },
  emerald: {
    from: 'from-emerald-500',
    solid: 'bg-emerald-500',
    text: 'text-emerald-600',
    hoverText: 'hover:text-emerald-700',
    groupHoverText: 'group-hover:text-emerald-600',
    badge: 'bg-emerald-500',
    borderHover: 'hover:border-emerald-400',
    shadow: 'hover:shadow-emerald-500/20',
    pill: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  }
}

const categorySections = [
  {
    id: 'kpop',
    title: 'Kpop',
    subtitle: 'K-pop hot spots and fandom destinations',
    accent: 'purple' as AccentKey
  },
  {
    id: 'kbeauty',
    title: 'Kbeauty',
    subtitle: 'Beauty landmarks, flagship stores, and skin care hubs',
    accent: 'pink' as AccentKey
  },
  {
    id: 'kfood',
    title: 'Kfood',
    subtitle: 'Taste-driven content and food discovery spots',
    accent: 'amber' as AccentKey
  },
  {
    id: 'kfestival',
    title: 'Kfestival',
    subtitle: 'Seasonal festivals and cultural highlights',
    accent: 'emerald' as AccentKey
  }
]

function ContentCard({ content, accent }: { content: KContent; accent: AccentKey }) {
  const contentPoi = getPOIById(content.poiId.$oid)
  const accentStyle = accentClasses[accent]

  return (
    <Link
      href={`/contents/${encodeURIComponent(content.subName)}`}
      className="group no-underline"
    >
      <div className={`relative overflow-hidden rounded-xl bg-white border border-gray-200 ${accentStyle.borderHover} transition-all duration-300 hover:shadow-lg ${accentStyle.shadow} hover:scale-[1.02] h-full`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={`https://picsum.photos/seed/${content.poiId.$oid}-${content.spotName}/800/600`}
            alt={content.spotName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`px-3 py-1 ${accentStyle.badge} rounded-full text-white text-xs font-semibold`}>
              {content.subName}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className={`text-lg font-bold text-gray-900 mb-2 line-clamp-2 ${accentStyle.groupHoverText} transition-colors`}>
            {content.spotName}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {content.description}
          </p>
          {contentPoi && (
            <p className={`${accentStyle.text} text-xs mb-3`}>
              📍 {contentPoi.name}
            </p>
          )}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.tags.slice(0, 3).map((tag, tagIdx) => (
                <span
                  key={tagIdx}
                  className={`px-2 py-1 border rounded-md text-xs ${accentStyle.pill}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function ContentsPage() {
  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      {categorySections.map((section) => {
        const accentStyle = accentClasses[section.accent]
        const contents = getKContentsByCategory(section.id as 'kpop' | 'kbeauty' | 'kfood' | 'kfestival')
        const previewItems = contents.slice(0, 6)

        return (
          <section key={section.id} id={section.id} className="w-full py-16 bg-white">
            <div className="px-6">
              <div className="text-center mb-12">
                <div className="flex items-center gap-4 mb-4 justify-start pl-2">
                  <div className={`w-10 h-px ${accentStyle.solid}`}></div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-left">
                    {section.title}
                  </h2>
                  <div className={`flex-1 h-px bg-gradient-to-r ${accentStyle.from} to-transparent`}></div>
                </div>
                <div className="flex justify-end mt-2 pr-2">
                  <Link
                    href={`/contents?category=${section.id}`}
                    className={`text-sm font-medium transition-colors ${accentStyle.text} ${accentStyle.hoverText}`}
                  >
                    Show All
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previewItems.map((content, index) => (
                  <ContentCard key={`${section.id}-${index}`} content={content} accent={section.accent} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </PageLayout>
  )
}

