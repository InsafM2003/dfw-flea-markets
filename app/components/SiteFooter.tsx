import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-400">
        <Link
          href="/"
          className="font-semibold text-stone-600 hover:text-amber-600 transition-colors"
        >
          DFW Flea Markets
        </Link>
        <p>© {new Date().getFullYear()} DFW Flea Market Directory · Dallas–Fort Worth, TX</p>
      </div>
    </footer>
  )
}
