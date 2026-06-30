import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { MarketCard } from "@/app/components/MarketCard"
import { cityToSlug } from "@/lib/utils"

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
  const citySearch = city.replace(/-/g, " ")

  const { data: markets } = await supabase
    .from("markets")
    .select("name, slug, city, days_open, hours, categories, photo_urls")
    .ilike("city", citySearch)
    .order("name")

  if (!markets || markets.length === 0) notFound()

  const cityName = markets[0].city as string

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-stone-400">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            All markets
          </Link>
          {" / "}
          <span>{cityName}</span>
        </p>
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight">
          Flea Markets in {cityName}, TX
        </h1>
        <p className="text-stone-500 text-lg">
          {markets.length} market{markets.length !== 1 ? "s" : ""} in {cityName}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {markets.map((market) => (
          <MarketCard
            key={market.slug}
            market={market as Parameters<typeof MarketCard>[0]["market"]}
          />
        ))}
      </div>
    </main>
  )
}
