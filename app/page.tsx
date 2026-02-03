import type { Metadata } from 'next'
import LandingPage from '@/app/_components/landing/LandingPage'

export const metadata: Metadata = {
  title: 'Choose Your K Experience',
  description: 'Choose your K-Pop experience and explore Korea with B4K',
}

export default function Landing() {
  return <LandingPage />
}
