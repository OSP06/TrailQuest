"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Trophy, User, Mountain } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavigation() {
  const pathname = usePathname()

  // Update the routes array to include hiking as a main feature
  const routes = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/hiking",
      icon: Mountain,
      label: "Hiking",
    },
    {
      href: "/adventure-log",
      icon: BookOpen,
      label: "Log",
    },
    {
      href: "/leaderboard",
      icon: Trophy,
      label: "Ranks",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-5">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
              pathname === route.href && "text-primary",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="text-xs">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

