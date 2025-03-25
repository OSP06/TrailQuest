"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  className?: string
  path?: string
}

export function BackButton({ className, path }: BackButtonProps) {
  const router = useRouter()
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className={`mb-4 ${className}`}
      onClick={() => path ? router.push(path) : router.back()}
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  )
}
