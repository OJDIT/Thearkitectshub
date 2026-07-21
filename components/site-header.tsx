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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav
        className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 items-center gap-2">
          <Link href="/" className="-m-1 p-1">
            <img src="/logo.png" alt="TheArkitecktsHub" className="h-7 w-7" />
          </Link>
          <Link href="/" className="hidden sm:block">
            <span className="font-display text-[1.35rem] font-semibold tracking-[-0.06em]">TheArkitecktsHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-7">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-primary ${
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
