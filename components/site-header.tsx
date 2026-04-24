"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import { MobileUserMenu } from "@/components/mobile-user-menu"

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Architects", href: "/architects" },
  { name: "Blog", href: "/blog" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav
        className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 items-center gap-2">
          <Link href="/" className="-m-1.5 p-1.5">
            <img src="/logo.png" alt="TheArkitecktsHub" className="h-8 w-8" />
          </Link>
          <Link href="/" className="hidden sm:block">
            <span className="text-xl font-semibold tracking-tight">TheArkitecktsHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <UserMenu />

        <MobileUserMenu navigation={navigation} pathname={pathname} />
      </nav>
    </header>
  )
}
