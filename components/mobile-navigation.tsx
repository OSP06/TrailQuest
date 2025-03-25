"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Trophy, User, Mountain, Users, Compass, Waves, MountainIcon, Droplet, Award, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function MobileNavigation() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      component: (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-auto flex-col gap-1">
              <Compass className="h-5 w-5" />
              <span className="text-xs">Explore</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mb-2 w-48 p-2">
            <div className="grid gap-1">
              <Link href="/hiking" className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                <Mountain className="h-4 w-4" />
                <span>Hiking</span>
              </Link>
              <Link href="/side-quests/kayaking" className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                <Waves className="h-4 w-4" />
                <span>Kayaking</span>
              </Link>
              <Link href="/side-quests/rock-climbing" className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                <MountainIcon className="h-4 w-4" />
                <span>Rock Climbing</span>
              </Link>
              <Link href="/side-quests/cliff-jumping" className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                <Droplet className="h-4 w-4" />
                <span>Cliff Jumping</span>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    {
      href: "/adventure-feed",
      icon: Users,
      label: "Feed",
    },
    {
      href: "/adventure-log",
      icon: BookOpen,
      label: "Log",
    },
    {
      component: (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-auto flex-col gap-1">
              <Award className="h-5 w-5" />
              <span className="text-xs">More</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mb-2 w-48 p-2">
            <div className="grid gap-1">
              <Link href="/leaderboard" className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      )
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {routes.map((route) => {
          if ('component' in route && route.component) {
            return (
              <div key={`popup-${Math.random().toString(36).substring(2, 9)}`}>
                {route.component}
              </div>
            )
          }
          return (
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
          )
        })}
      </div>
    </div>
  )
}
