import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/config/env'
import { getAllPOIs } from '@/lib/db/pois'
import { getAllPackages } from '@/lib/db/packages'
import { getAllKContents } from '@/lib/db/kcontents'
import { getAllRoutes } from '@/lib/services/routes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/contents`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/package`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/maps`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookie-settings`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/info`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    const [pois, packages, contents, routes] = await Promise.all([
      getAllPOIs(),
      getAllPackages(),
      getAllKContents(),
      Promise.resolve(getAllRoutes()),
    ])

    const contentSubNames = [...new Set(contents.map((c) => typeof c.subName === 'string' ? c.subName : c.subName.subName_en))]

    dynamicPages = [
      ...pois.map((p) => ({
        url: `${baseUrl}/poi/${p._id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...packages.map((p) => ({
        url: `${baseUrl}/package/${p._id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...contentSubNames.map((subName) => ({
        url: `${baseUrl}/contents/${encodeURIComponent(subName)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...routes.map((r) => ({
        url: `${baseUrl}/maps/route/${r._id.$oid}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  } catch (error) {
    console.error('[sitemap] Failed to fetch dynamic routes:', error)
  }

  return [...staticPages, ...dynamicPages]
}
