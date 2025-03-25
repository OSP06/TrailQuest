import { ReactNode } from "react"
import { BackButton } from "@/components/back-button"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function HikingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container px-4 sm:px-6 max-w-screen-xl py-4 hidden md:block">
        <BackButton />
      </div>
      <main className="flex-1 pb-16">{children}</main>
      <div className="md:hidden">
        <MobileNavigation />
      </div>
    </div>
  )
}
