import type React from "react"
import type { Metadata } from "next"
import { Fraunces, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "TheArkitecktsHub - Contemporary Architecture & Design",
  description:
    "A curated platform celebrating contemporary architecture, connecting visionary architects with those who appreciate thoughtful design.",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="font-sans antialiased bg-background w-full">
        <div className="relative flex min-h-screen flex-col w-full">
          <SiteHeader />
          <main className="flex-1 w-full">{children}</main>
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
