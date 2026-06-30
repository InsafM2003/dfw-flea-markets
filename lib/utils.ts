export function cityToSlug(city: string) {
  return city.toLowerCase().replace(/\s+/g, "-")
}
