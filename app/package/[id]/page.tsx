"use client"

import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import PageLayout from '@/components/PageLayout'
import { getPackageById } from '@/lib/data/mock'
import { useCart } from '@/components/CartContext'

export default function PackageDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { addToCart, removeFromCart, isInCart } = useCart()
  const id = params?.id as string || ''
  
  const pkg = getPackageById(id)
  const cartItemId = pkg ? `package-${pkg._id.$oid}` : ''
  const inCart = cartItemId ? isInCart(cartItemId) : false

  const handleCartClick = () => {
    if (pkg) {
      if (inCart) {
        removeFromCart(cartItemId)
      } else {
        addToCart({
          id: cartItemId,
          name: pkg.name,
          type: 'package',
          packageId: pkg._id.$oid
        })
      }
    }
  }

  if (!pkg) {
    return (
      <PageLayout showSidePanel={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
            <button
              onClick={() => router.push('/package')}
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Return to Packages
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Group itinerary by city
  const citiesWithDays = pkg.cities.map(city => ({
    city,
    days: pkg.itinerary.filter(day => day.city === city)
  }))

  return (
    <PageLayout showSidePanel={false}>
      {/* Banner image */}
      <div className="relative h-96">
        <Image
          src={pkg.imageUrl || `https://picsum.photos/seed/${pkg._id.$oid}/1920/600`}
          alt={pkg.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
          <div className="container mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {/* Package name */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">{pkg.name}</h1>
                
                {/* Category, duration, cities */}
                <div className="mb-4 flex flex-wrap items-center gap-3 text-white/90 text-sm md:text-base">
                  <span className="px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-white font-medium uppercase">
                    {pkg.category}
                  </span>
                  <span className="text-white/70">·</span>
                  <span>{pkg.duration} Days</span>
                  <span className="text-white/70">·</span>
                  <span>{pkg.cities.join(' → ')}</span>
                </div>

                {/* Concept */}
                <p className="text-white/90 text-lg max-w-3xl leading-relaxed">
                  {pkg.concept}
                </p>
              </div>
              {/* Action buttons */}
              <div className="ml-4 flex gap-3">
                {/* Cart button */}
                <button
                  onClick={handleCartClick}
                  className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                    inCart 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30'
                  }`}
                  aria-label={inCart ? "Remove from Cart" : "Add to Cart"}
                  title={inCart ? "Remove from Cart" : "Add to Cart"}
                >
                  <svg className={`w-7 h-7 transition-colors ${inCart ? 'text-white' : 'text-white'}`} fill={inCart ? "currentColor" : "none"} stroke={inCart ? "none" : "currentColor"} viewBox="0 0 24 24">
                    {inCart ? (
                      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto px-6 pt-8 pb-16">
        {/* Highlights section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-purple-500"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 px-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Highlights
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-500 to-purple-500"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pkg.highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-900 font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Included Services section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500 to-green-500"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 px-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Included Services
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-green-500 to-green-500"></div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pkg.includedServices.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Itinerary section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500 to-blue-500"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 px-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {pkg.duration}-Day Itinerary
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-500 to-blue-500"></div>
            </div>
          </div>

          <div className="space-y-6">
            {pkg.itinerary.map((day, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white">
                    <span className="text-xs font-medium">DAY</span>
                    <span className="text-2xl font-bold">{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-lg font-semibold text-gray-900">{day.city}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {day.activities.map((activity, actIdx) => (
                        <span
                          key={actIdx}
                          className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
