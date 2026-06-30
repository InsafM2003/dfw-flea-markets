import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { MarketCard } from "@/app/components/MarketCard"

function cityToSlug(city: string) {
  return city.toLowerCase().replace(/\s+/g, "-")
}

export async function generateStaticParams() {
  const { data } = await supabase.from("markets").select("city")
  const unique = [...new Set((data ?? []).map((r) => cityToSlug(r.city as string)))]
  return unique.map((city) => ({ city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `Flea Markets in ${cityName}, TX | DFW Flea Market Directory`,
    description: `Browse all flea markets and swap meets in ${cityName}, TX.`,
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params

  // Convert slug back to search term: "grand-prairie" → "grand prairie" (ilike handles case)
  const citySearch = city.replace(/-/g, " ")

  const { data: markets } = await supabase
    .from("markets")
    .select("name, slug, city, days_open, hours, categories")
    .ilike("city", citySearch)
    .order("name")

  if (!markets || markets.length === 0) notFound()

  // Use the DB city name for display (correct capitalisation)
  const cityName = markets[0].city as string

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">
          Flea Markets in {cityName}, TX
        </h1>
        <p className="text-gray-500">
          {markets.length} market{markets.length !== 1 ? "s" : ""} in {cityName}.{" "}
          <a href="/" className="text-blue-600 hover:underline">
            View all cities
          </a>
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {markets.map((market) => (
          <MarketCard key={market.slug} market={market as Parameters<typeof MarketCard>[0]["market"]} />
        ))}
      </div>
    </main>
  )
}
