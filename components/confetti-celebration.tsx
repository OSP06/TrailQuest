"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

interface ConfettiCelebrationProps {
  active: boolean
  duration?: number
  onComplete?: () => void
}

export function ConfettiCelebration({ active, duration = 3000, onComplete }: ConfettiCelebrationProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (active) {
      setIsActive(true)
      const timer = setTimeout(() => {
        setIsActive(false)
        if (onComplete) onComplete()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [active, duration, onComplete])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <ReactConfetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
        colors={["#F59E0B", "#FBBF24", "#FCD34D", "#10B981", "#34D399", "#6EE7B7"]}
      />
    </div>
  )
}

