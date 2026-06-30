import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/app/components/SiteHeader"
import { SiteFooter } from "@/app/components/SiteFooter"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "DFW Flea Market Directory",
  description:
    "Find flea markets, swap meets, and outdoor markets across the Dallas–Fort Worth area.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 antialiased font-sans">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
