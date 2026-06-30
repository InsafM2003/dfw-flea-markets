import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"
import { cityToSlug } from "@/lib/utils"

const BASE_URL = "https://dfwfleamarkets.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: markets } = await supabase
    .from("markets")
    .select("slug, city, date_verified")

  const rows = markets ?? []
  const now = new Date()

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: BASE_URL,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  }

  const cityLastModified = new Map<string, Date>()
  for (const row of rows) {
    const slug = cityToSlug(row.city as string)
    const verified = row.date_verified ? new Date(row.date_verified as string) : now
    const current = cityLastModified.get(slug)
    if (!current || verified > current) cityLastModified.set(slug, verified)
  }

  const cityEntries: MetadataRoute.Sitemap = [...cityLastModified.entries()].map(
    ([slug, lastModified]) => ({
      url: `${BASE_URL}/city/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  )

  const marketEntries: MetadataRoute.Sitemap = rows.map((row) => ({
    url: `${BASE_URL}/markets/${row.slug as string}`,
    lastModified: row.date_verified ? new Date(row.date_verified as string) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [homeEntry, ...cityEntries, ...marketEntries]
}
