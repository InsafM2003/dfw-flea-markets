import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { MarketCard } from "@/app/components/MarketCard"

function cityToSlug(city: string) {
  return city.toLowerCase().replace(/\s+/g, "-")
}

export default async function Home() {
  const { data: markets } = await supabase
    .from("markets")
    .select("name, slug, city, days_open, hours, categories")
    .order("name")

  const cities = [
    ...new Map(
      (markets ?? []).map((m) => [m.city, { name: m.city as string, slug: cityToSlug(m.city as string) }])
    ).values(),
  ].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">DFW Flea Market Directory</h1>
        <p className="text-gray-500">
          Flea markets, swap meets, and outdoor markets across the Dallas–Fort Worth area.
        </p>
      </header>

      {/* City filter links */}
      {cities.length > 0 && (
        <nav aria-label="Browse by city">
          <p className="text-sm font-medium text-gray-600 mb-2">Browse by city</p>
          <ul className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/city/${c.slug}`}
                  className="inline-block border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700 hover:border-gray-500 hover:bg-gray-50 transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(markets ?? []).map((market) => (
          <MarketCard key={market.slug} market={market as Parameters<typeof MarketCard>[0]["market"]} />
        ))}
      </div>
    </main>
  )
}
