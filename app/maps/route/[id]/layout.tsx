import type { Metadata } from 'next'
import { getRouteById } from '@/lib/services/routes'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params?.id || ''
  const route = getRouteById(id)
  if (!route) return { title: 'Route Not Found' }
  const title = route.name
  const description = `${route.name} — ${route.duration}, ${route.distance}. ${route.description?.slice(0, 120)}...`
  const imageUrl = route.imageUrl || `https://picsum.photos/seed/${id}/1200/630`
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || '').trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://b4korea.com')
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
      url: `${baseUrl}/maps/route/${id}`,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
