import Link from "next/link"
import { Instagram, Mail, Music2, Phone, Twitter, Youtube } from "lucide-react"

const footerNavigation = {
  discover: [
    { name: "Projects", href: "/projects" },
    { name: "Architects", href: "/architects" },
    { name: "Blog", href: "/blog" },
    { name: "Resources", href: "/resources" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/the.arkitecktshub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", icon: Instagram },
  { name: "X", href: "https://x.com/ArkitecktsHub", icon: Twitter },
  { name: "TikTok", href: "https://www.tiktok.com/@the.arkitecktshub?_r=1&_t=ZS-95okRloCx6K", icon: Music2 },
  { name: "YouTube", href: "https://www.youtube.com/@thearkitecktshub", icon: Youtube },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background w-full">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="TheArkitecktsHub" className="h-8 w-8" />
              <h3 className="text-xl font-semibold tracking-tight">TheArkitecktsHub</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              A curated platform celebrating contemporary architecture, connecting visionary architects with those who
              appreciate thoughtful design.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    aria-label={link.name}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                )
              })}
              <a
                href="mailto:info@thearkitecktshub.com"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="tel:+2349134602377"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                aria-label="Phone"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p>
                <a href="mailto:info@thearkitecktshub.com" className="hover:text-foreground">
                  info@thearkitecktshub.com
                </a>
              </p>
              <p>
                <a href="tel:+2349134602377" className="hover:text-foreground">
                  09134602377
                </a>
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Discover</h4>
            <ul className="space-y-3">
              {footerNavigation.discover.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TheArkitecktsHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerNavigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
