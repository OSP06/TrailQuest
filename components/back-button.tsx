"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      className="absolute left-4 top-4"
      onClick={() => router.push("/")}
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  )
}
