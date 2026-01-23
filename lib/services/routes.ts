export interface Route {
  _id: { $oid: string }
  name: string
  description: string
  startLocation: {
    name: string
    address: string
    coordinates: number[] // [longitude, latitude]
  }
  endLocation: {
    name: string
    address: string
    coordinates: number[] // [longitude, latitude]
  }
  waypoints?: Array<{
    name: string
    address: string
    coordinates: number[] // [longitude, latitude]
  }>
  duration: string // e.g., "2 hours 30 minutes"
  distance: string // e.g., "15.5 km"
  transportation: string[] // e.g., ["Subway", "Bus", "Walking"]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string[]
  imageUrl: string
  blogReviews: number
  phoneNumber?: string
  operatingHours?: string
  tags: string[]
  // Map data structure - can be populated later with actual map information
  mapData?: {
    center: number[] // [longitude, latitude] - map center coordinates
    zoom?: number // map zoom level
    bounds?: {
      northeast: number[] // [longitude, latitude]
      southwest: number[] // [longitude, latitude]
    }
    polyline?: number[][] // Array of [longitude, latitude] for route path
    markers?: Array<{
      id: string
      type: 'start' | 'end' | 'waypoint'
      coordinates: number[] // [longitude, latitude]
      title: string
    }>
  }
}

export const mockRoutes: Route[] = [
  {
    _id: { $oid: 'route_001' },
    name: 'Gangnam K-Pop Tour Route',
    description: 'Explore the heart of K-Pop culture in Gangnam district, visiting famous entertainment companies and K-Pop themed locations.',
    startLocation: {
      name: 'Gangnam Station',
      address: 'Seoul, Gangnam-gu, Gangnam-daero 396',
      coordinates: [127.0276, 37.4980]
    },
    endLocation: {
      name: 'SM Town Coex Artium',
      address: 'Seoul, Gangnam-gu, Samseong-dong',
      coordinates: [127.0590, 37.5120]
    },
    waypoints: [
      {
        name: 'K-Star Road',
        address: 'Seoul, Gangnam-gu, Apgujeong-ro',
        coordinates: [127.0300, 37.5200]
      },
      {
        name: 'HYBE Insight',
        address: 'Seoul, Yongsan-gu, Hangang-daero',
        coordinates: [127.0600, 37.5200]
      }
    ],
    duration: '3 hours 30 minutes',
    distance: '8.2 km',
    transportation: ['Subway', 'Walking'],
    difficulty: 'Easy',
    category: ['K-Pop', 'Culture', 'Entertainment'],
    imageUrl: 'https://picsum.photos/seed/gangnam-kpop/800/600',
    blogReviews: 245,
    phoneNumber: '02-1234-5678',
    operatingHours: 'Open 24 hours',
    tags: ['K-Pop', 'Gangnam', 'Entertainment', 'Culture'],
    // Map data - can be populated with actual map information later
    mapData: {
      center: [127.0433, 37.5050], // Center point between start and end
      zoom: 13,
      bounds: {
        northeast: [127.0600, 37.5200],
        southwest: [127.0276, 37.4980]
      },
      polyline: [
        [127.0276, 37.4980], // Start: Gangnam Station
        [127.0300, 37.5200], // Waypoint: K-Star Road
        [127.0600, 37.5200], // Waypoint: HYBE Insight
        [127.0590, 37.5120]  // End: SM Town Coex Artium
      ],
      markers: [
        {
          id: 'start',
          type: 'start',
          coordinates: [127.0276, 37.4980],
          title: 'Gangnam Station'
        },
        {
          id: 'waypoint_1',
          type: 'waypoint',
          coordinates: [127.0300, 37.5200],
          title: 'K-Star Road'
        },
        {
          id: 'waypoint_2',
          type: 'waypoint',
          coordinates: [127.0600, 37.5200],
          title: 'HYBE Insight'
        },
        {
          id: 'end',
          type: 'end',
          coordinates: [127.0590, 37.5120],
          title: 'SM Town Coex Artium'
        }
      ]
    }
  }
]

export function getAllRoutes(): Route[] {
  return mockRoutes
}

export function getRouteById(routeId: string): Route | undefined {
  return mockRoutes.find(route => route._id.$oid === routeId)
}

