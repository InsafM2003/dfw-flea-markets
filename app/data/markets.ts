export type Market = {
  // Required — every market must have these
  name: string
  slug: string
  address: string
  city: string
  latitude: number
  longitude: number

  // Optional — gracefully omitted when data isn't available
  daysOpen?: string
  hours?: string
  categories?: string[]
  description?: string
  amenities?: string[]
  phone?: string
  website?: string
  facebook?: string
}

export const markets: Market[] = [
  {
    name: "Traders Village Grand Prairie",
    slug: "traders-village-grand-prairie",
    address: "2602 Mayfield Rd, Grand Prairie, TX 75052",
    city: "Grand Prairie",
    latitude: 32.706,
    longitude: -97.02,
    daysOpen: "Sat-Sun",
    hours: "9am-6pm",
    categories: ["antiques", "vintage", "food", "tools", "crafts"],
    description:
      "Massive outdoor flea market with shopping, special events, rides & food vendors.",
    amenities: ["Parking", "Food court", "Restrooms", "Mostly outdoor"],
    phone: "(972) 647-2331",
    website: "https://tradersvillage.com/grand-prairie",
    facebook: "https://www.facebook.com/TradersVillageMarkets/",
  },
]

/** Look up a single market by its URL slug. Returns undefined if not found. */
export function getMarketBySlug(slug: string): Market | undefined {
  return markets.find((m) => m.slug === slug)
}
