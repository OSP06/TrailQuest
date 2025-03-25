"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface XPProgressProps {
  level: number
  currentXP: number
  requiredXP: number
  showAnimation?: boolean
  className?: string
}

export function XPProgress({ level, currentXP, requiredXP, showAnimation = false, className }: XPProgressProps) {
  const [animatedXP, setAnimatedXP] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const percentage = (currentXP / requiredXP) * 100

  useEffect(() => {
    if (showAnimation) {
      setAnimatedXP(0)
      const timer = setTimeout(() => {
        setAnimatedXP(currentXP)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setAnimatedXP(currentXP)
    }
  }, [currentXP, showAnimation])

  useEffect(() => {
    if (animatedXP >= requiredXP) {
      setShowLevelUp(true)
      const timer = setTimeout(() => {
        setShowLevelUp(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [animatedXP, requiredXP])

  const animatedPercentage = (animatedXP / requiredXP) * 100

  return (
    <div className={cn("space-y-2 relative", className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs">
            {level}
          </div>
          <span className="font-medium">Level {level}</span>
        </div>
        <div>
          <span className="font-medium">{currentXP.toLocaleString()}</span>
          <span className="text-muted-foreground"> / {requiredXP.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="relative">
        <Progress
          value={showAnimation ? animatedPercentage : percentage}
          className="h-3 bg-gray-200 dark:bg-gray-700"
        />

        {/* XP particles */}
        {showAnimation && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  y: [-20, -40],
                  x: i % 2 === 0 ? "-=20" : "+=20",
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1 + Math.random(),
                  delay: Math.random() * 0.5,
                }}
                className="absolute"
              >
                <Zap className="h-4 w-4 text-amber-500" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Level up animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg"
          >
            <Zap className="h-5 w-5" />
            <span>Level Up!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

