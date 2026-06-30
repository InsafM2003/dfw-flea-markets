import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

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
    photoUrls: (row.photo_urls as string | null) ?? undefined,
  }
}

export async function generateStaticParams() {
  const { data } = await supabase.from("markets").select("slug")
  return (data ?? []).map((row) => ({ slug: row.slug as string }))
}

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

  if (!data) return { title: "Market Not Found" }

  return {
    title: `${data.name} — Flea Market in ${data.city}, TX`,
    description:
      (data.description as string | null) ??
      `Visit ${data.name} at ${data.address}. Open ${(data.days_open as string | null) ?? "weekends"}.`,
  }
}

export default async function MarketPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await supabase
    .from("markets")
    .select(
      "name, slug, address, city, latitude, longitude, days_open, hours, categories, description, amenities, phone, website, facebook, photo_urls"
    )
    .eq("slug", slug)
    .single()

  if (!data) notFound()

  const market = rowToMarket(data)

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

  const hours = [market.daysOpen, market.hours].filter(Boolean).join(" · ")

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* ── Breadcrumb ── */}
        <p className="text-sm text-stone-400 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            All markets
          </Link>
          {" / "}
          <Link
            href={`/city/${market.city.toLowerCase().replace(/\s+/g, "-")}`}
            className="hover:text-amber-600 transition-colors"
          >
            {market.city}
          </Link>
        </p>

        {/* ── Hero ── */}
        <header className="pb-8 border-b border-stone-100">
          {market.photoUrls && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-stone-200 shadow-sm aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={market.photoUrls}
                alt={market.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-stone-900 leading-tight">
            {market.name}
          </h1>
          <p className="mt-2 text-stone-500">{market.address}</p>

          {hours && (
            <p className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
              {hours}
            </p>
          )}
        </header>

        <div className="space-y-8 mt-8">
          {/* ── Description ── */}
          {market.description && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                About
              </h2>
              <p className="text-stone-700 leading-relaxed">{market.description}</p>
            </section>
          )}

          {/* ── Map ── */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Location
            </h2>
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
              <iframe
                src={`https://www.google.com/maps?q=${market.latitude},${market.longitude}&output=embed`}
                width="100%"
                height="360"
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
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Categories
              </h2>
              <ul className="flex flex-wrap gap-2">
                {market.categories.map((cat) => (
                  <li
                    key={cat}
                    className="bg-amber-50 text-amber-700 text-sm px-3 py-1 rounded-full capitalize"
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
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Amenities
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                {market.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-stone-700"
                  >
                    <span className="text-emerald-500 font-bold text-base leading-none" aria-hidden>
                      ✓
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Contact ── */}
          {(market.phone || market.website || market.facebook) && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Contact
              </h2>
              <ul className="space-y-2.5">
                {market.phone && (
                  <li>
                    <a
                      href={`tel:${market.phone.replace(/\D/g, "")}`}
                      className="text-sm text-amber-600 hover:text-amber-700 hover:underline font-medium"
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
                      className="text-sm text-amber-600 hover:text-amber-700 hover:underline font-medium"
                    >
                      Official website ↗
                    </a>
                  </li>
                )}
                {market.facebook && (
                  <li>
                    <a
                      href={market.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-amber-600 hover:text-amber-700 hover:underline font-medium"
                    >
                      Facebook page ↗
                    </a>
                  </li>
                )}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
