"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Trophy, User, Crown, Compass, Mountain, Waves, MountainIcon, Droplet } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function DesktopNavigation() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const routes = [
    {
      href: "/(main)",
      icon: Home,
      title: "Home",
    },
    {
      href: "/hiking",
      icon: Mountain,
      title: "Hiking",
    },
    {
      href: "/track",
      icon: Compass,
      title: "Track Activity",
    },
    {
      href: "/adventure-log",
      icon: BookOpen,
      title: "Adventure Log",
    },
    {
      href: "/leaderboard",
      icon: Trophy,
      title: "Leaderboard",
    },
    {
      href: "/profile",
      icon: User,
      title: "Profile & Stats",
    },
    {
      href: "/premium",
      icon: Crown,
      title: "Premium",
    },
    {
      title: "Side Quests",
      icon: Compass,
      children: [
        {
          href: "/side-quests/kayaking",
          icon: Waves,
          title: "Kayaking",
        },
        {
          href: "/side-quests/rock-climbing",
          icon: MountainIcon,
          title: "Rock Climbing",
        },
        {
          href: "/side-quests/cliff-jumping",
          icon: Droplet,
          title: "Cliff Jumping",
        },
      ],
    },
  ]

  return (
    <div
      className={cn(
        "hidden border-r bg-card/40 md:flex md:flex-col transition-all duration-300",
        isCollapsed ? "md:w-20" : "md:w-64",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b px-6 justify-between">
        <div className="flex items-center gap-2">
          <MountainIcon className="h-6 w-6 text-primary" />
          {!isCollapsed && <span className="font-bold text-xl">TrailQuest</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("transition-transform duration-200", isCollapsed ? "rotate-180" : "")}
          >
            <path d="m15 6-6 6 6 6" />
          </svg>
        </Button>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-2">
          {routes.map((route, i) =>
            route.children ? (
              <div key={i} className="space-y-1">
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-muted-foreground",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{route.title}</span>}
                </div>
                {!isCollapsed && (
                  <div className="grid gap-1 pl-6">
                    {route.children.map((child, j) => (
                      <Link
                        key={j}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === child.href ? "bg-accent text-accent-foreground" : "transparent",
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={i}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                  isCollapsed ? "justify-center px-2 py-2" : "px-4 py-2",
                )}
                title={isCollapsed ? route.title : undefined}
              >
                <route.icon className="h-4 w-4" />
                {!isCollapsed && <span>{route.title}</span>}
              </Link>
            ),
          )}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <div className={cn("flex items-center gap-4", isCollapsed && "justify-center")}>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>TQ</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="grid gap-0.5 text-sm">
              <div className="font-medium">Trail Blazer</div>
              <div className="text-xs text-muted-foreground">Level 12</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
