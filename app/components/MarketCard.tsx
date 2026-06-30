import Link from "next/link"

export type MarketCardData = {
  name: string
  slug: string
  city: string
  days_open: string | null
  hours: string | null
  categories: string | null
  photo_urls: string | null
}

export function MarketCard({ market }: { market: MarketCardData }) {
  const categories = market.categories
    ? market.categories.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : []

  const hours = [market.days_open, market.hours].filter(Boolean).join(" · ")

  return (
    <Link
      href={`/markets/${market.slug}`}
      className="group h-full flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all duration-200"
    >
      <div className="h-40 shrink-0 bg-stone-100">
        {market.photo_urls ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={market.photo_urls}
            alt={market.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100" aria-hidden>
            <span className="text-4xl opacity-50">🧺</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h2 className="font-semibold text-stone-900 text-base leading-snug group-hover:text-amber-700 transition-colors">
          {market.name}
        </h2>
        <p className="mt-0.5 text-sm text-stone-400">{market.city}, TX</p>

        <div className="mt-auto pt-4 flex flex-col gap-2">
          {hours && (
            <p className="inline-flex items-center gap-1.5 self-start text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
              {hours}
            </p>
          )}

          {categories.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full capitalize"
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Link>
  )
}
