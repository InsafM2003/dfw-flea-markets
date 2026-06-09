import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { markets, getMarketBySlug } from "@/app/data/markets"

// ---------------------------------------------------------------------------
// Static generation — tells Next.js which slugs to pre-render at build time
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return markets.map((market) => ({ slug: market.slug }))
}

// ---------------------------------------------------------------------------
// Dynamic SEO metadata — title/description per market
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const market = getMarketBySlug(slug)

  if (!market) {
    return { title: "Market Not Found" }
  }

  return {
    title: `${market.name} — Flea Market in ${market.city}, TX`,
    description:
      market.description ??
      `Visit ${market.name} at ${market.address}. Open ${market.daysOpen ?? "weekends"}.`,
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function MarketPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const market = getMarketBySlug(slug)

  // Show Next.js 404 page if the slug doesn't match any market
  if (!market) notFound()

  // JSON-LD structured data (schema.org/LocalBusiness) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: market.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: market.address,
      addressLocality: market.city,
      addressRegion: "TX",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: market.latitude,
      longitude: market.longitude,
    },
    ...(market.phone && { telephone: market.phone }),
    ...(market.website && { url: market.website }),
  }

  return (
    <>
      {/* Inject structured data into <head> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* ── Header ── */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">{market.name}</h1>
          <p className="mt-1 text-gray-500">{market.address}</p>

          {/* Hours badge — only shown when data exists */}
          {(market.daysOpen || market.hours) && (
            <p className="mt-2 inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {[market.daysOpen, market.hours].filter(Boolean).join(" · ")}
            </p>
          )}
        </header>

        {/* ── Description ── */}
        {market.description && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-700 leading-relaxed">{market.description}</p>
          </section>
        )}

        {/* ── Google Maps embed (no API key required) ── */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Location</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              src={`https://www.google.com/maps?q=${market.latitude},${market.longitude}&output=embed`}
              width="100%"
              height="300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${market.name}`}
              className="block"
            />
          </div>
        </section>

        {/* ── Categories ── */}
        {market.categories && market.categories.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Categories
            </h2>
            <ul className="flex flex-wrap gap-2">
              {market.categories.map((cat) => (
                <li
                  key={cat}
                  className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full capitalize"
                >
                  {cat}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Amenities ── */}
        {market.amenities && market.amenities.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Amenities
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {market.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500" aria-hidden>✓</span>
                  {amenity}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Contact & Links ── */}
        {(market.phone || market.website || market.facebook) && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Contact
            </h2>
            <ul className="space-y-2">
              {market.phone && (
                <li>
                  <a
                    href={`tel:${market.phone.replace(/\D/g, "")}`}
                    className="text-blue-600 hover:underline"
                  >
                    {market.phone}
                  </a>
                </li>
              )}
              {market.website && (
                <li>
                  <a
                    href={market.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Official website
                  </a>
                </li>
              )}
              {market.facebook && (
                <li>
                  <a
                    href={market.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Facebook page
                  </a>
                </li>
              )}
            </ul>
          </section>
        )}
      </main>
    </>
  )
}
