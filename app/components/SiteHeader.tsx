import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { cityToSlug } from "@/lib/utils"

export async function SiteHeader() {
  const { data } = await supabase.from("markets").select("city")
  const cities = [...new Set((data ?? []).map((r) => r.city as string))].sort()

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        {/* Primary row — logo + desktop city links */}
        <div className="flex items-center h-14 gap-6">
          <Link
            href="/"
            className="font-bold text-amber-600 text-lg tracking-tight shrink-0 hover:text-amber-700 transition-colors"
          >
            DFW Flea Markets
          </Link>

          {cities.length > 0 && (
            <nav
              aria-label="Browse by city"
              className="hidden md:flex items-center gap-0.5 overflow-x-auto"
            >
              {cities.map((city) => (
                <Link
                  key={city}
                  href={`/city/${cityToSlug(city)}`}
                  className="text-sm text-stone-500 hover:text-amber-600 px-2.5 py-1 rounded-lg hover:bg-amber-50 transition-colors whitespace-nowrap"
                >
                  {city}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Mobile city strip — horizontally scrollable */}
        {cities.length > 0 && (
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2.5 -mx-4 px-4 scrollbar-none">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/city/${cityToSlug(city)}`}
                className="shrink-0 text-xs text-stone-600 bg-stone-100 hover:bg-amber-50 hover:text-amber-700 px-3 py-1 rounded-full transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
