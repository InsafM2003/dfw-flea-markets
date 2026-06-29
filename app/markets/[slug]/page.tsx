import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"

// ---------------------------------------------------------------------------
// Map a raw Supabase row to the shape the page template expects
// ---------------------------------------------------------------------------
function rowToMarket(row: Record<string, unknown>) {
  const splitCsv = (val: unknown) =>
    typeof val === "string" && val.trim()
      ? val.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined

  return {
    name: row.name as string,
    slug: row.slug as string,
    address: row.address as string,
    city: row.city as string,
    latitude: row.latitude as number,
    longitude: row.longitude as number,
    daysOpen: (row.days_open as string | null) ?? undefined,
    hours: (row.hours as string | null) ?? undefined,
    categories: splitCsv(row.categories),
    description: (row.description as string | null) ?? undefined,
    amenities: splitCsv(row.amenities),
    phone: (row.phone as string | null) ?? undefined,
    website: (row.website as string | null) ?? undefined,
    facebook: (row.facebook as string | null) ?? undefined,
  }
}

// ---------------------------------------------------------------------------
// Static generation — tells Next.js which slugs to pre-render at build time
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const { data } = await supabase.from("markets").select("slug")
  return (data ?? []).map((row) => ({ slug: row.slug as string }))
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
  const { data } = await supabase
    .from("markets")
    .select("name, city, address, days_open, description")
    .eq("slug", slug)
    .single()

  if (!data) {
    return { title: "Market Not Found" }
  }

  return {
    title: `${data.name} — Flea Market in ${data.city}, TX`,
    description:
      (data.description as string | null) ??
      `Visit ${data.name} at ${data.address}. Open ${(data.days_open as string | null) ?? "weekends"}.`,
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
  const { data } = await supabase
    .from("markets")
    .select(
      "name, slug, address, city, latitude, longitude, days_open, hours, categories, description, amenities, phone, website, facebook"
    )
    .eq("slug", slug)
    .single()

  // Show Next.js 404 page if the slug doesn't match any market
  if (!data) notFound()

  const market = rowToMarket(data)

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
