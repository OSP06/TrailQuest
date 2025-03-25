import type React from "react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { DesktopNavigation } from "@/components/desktop-navigation"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <DesktopNavigation />
      <div className="flex-1 flex flex-col">
      <main className="flex-1 pb-16">{children}</main>
      <div className="md:hidden">
        <MobileNavigation />
      </div>
      </div>
    </div>
  )
}
