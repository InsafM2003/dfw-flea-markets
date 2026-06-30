import Link from "next/link"

export type MarketCardData = {
  name: string
  slug: string
  city: string
  days_open: string | null
  hours: string | null
  categories: string | null
}

export function MarketCard({ market }: { market: MarketCardData }) {
  const categories = market.categories
    ? market.categories.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : []

  return (
    <Link
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
}
