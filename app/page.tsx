import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default async function Home() {
  const { data: markets } = await supabase
    .from("markets")
    .select("name, slug, city, days_open, hours, categories")
    .order("name")

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">DFW Flea Market Directory</h1>
        <p className="text-gray-500">
          Flea markets, swap meets, and outdoor markets across the Dallas–Fort Worth area.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(markets ?? []).map((market) => {
          const categories = market.categories
            ? (market.categories as string)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 3)
            : []

          return (
            <Link
              key={market.slug}
              href={`/markets/${market.slug}`}
              className="block rounded-xl border border-gray-200 p-5 hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-gray-900 text-lg leading-snug">
                {market.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{market.city}, TX</p>

              {(market.days_open || market.hours) && (
                <p className="mt-2 text-sm text-gray-700">
                  {[market.days_open, market.hours].filter(Boolean).join(" · ")}
                </p>
              )}

              {categories.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full capitalize"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          )
        })}
      </div>
    </main>
  )
}
