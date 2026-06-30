import { supabase } from "@/lib/supabase"
import { MarketCard } from "@/app/components/MarketCard"

export default async function Home() {
  const { data: markets } = await supabase
    .from("markets")
    .select("name, slug, city, days_open, hours, categories, photo_urls")
    .order("name")

  const count = (markets ?? []).length

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-stone-900 tracking-tight">
          DFW Flea Market Directory
        </h1>
        <p className="text-stone-500 text-lg leading-relaxed">
          {count > 0
            ? `${count} flea market${count !== 1 ? "s" : ""} across the Dallas–Fort Worth area.`
            : "Flea markets, swap meets, and outdoor markets across the Dallas–Fort Worth area."}
        </p>
      </header>

      {count > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(markets ?? []).map((market) => (
            <MarketCard
              key={market.slug}
              market={market as Parameters<typeof MarketCard>[0]["market"]}
            />
          ))}
        </div>
      ) : (
        <p className="text-stone-400 py-12 text-center">No markets found.</p>
      )}
    </main>
  )
}
