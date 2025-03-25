"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mountain, Compass, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  onAnimationComplete?: () => void
  className?: string
}

export function AnimatedLogo({ size = "md", animated = true, onAnimationComplete, className }: AnimatedLogoProps) {
  const [animationCompleted, setAnimationCompleted] = useState(false)

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  }

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  }

  useEffect(() => {
    if (animationCompleted && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [animationCompleted, onAnimationComplete])

  const handleAnimationComplete = () => {
    setAnimationCompleted(true)
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700"
        initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Inner circle */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
        initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      />

      {/* Center circle */}
      <motion.div
        className="absolute inset-4 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center"
        initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Mountain icon */}
        <motion.div
          className="absolute"
          initial={animated ? { y: 20, opacity: 0 } : { y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <Mountain className={cn("text-indigo-600", iconSizes[size])} />
        </motion.div>
      </motion.div>

      {/* Orbiting elements */}
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      >
        {/* Compass orbit */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="bg-amber-500 rounded-full p-1 shadow-lg">
            <Compass className={cn("text-white", iconSizes[size] === "w-12 h-12" ? "w-6 h-6" : "w-4 h-4")} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      >
        {/* Zap orbit */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
          initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          onAnimationComplete={handleAnimationComplete}
        >
          <div className="bg-green-500 rounded-full p-1 shadow-lg">
            <Zap className={cn("text-white", iconSizes[size] === "w-12 h-12" ? "w-6 h-6" : "w-4 h-4")} />
          </div>
        </motion.div>
      </motion.div>

      {/* Glowing effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-indigo-500 blur-xl"
        initial={animated ? { scale: 0, opacity: 0 } : { scale: 1.5, opacity: 0.2 }}
        animate={{ scale: 1.5, opacity: 0.2 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Pulse effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-indigo-400"
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: 3, repeatDelay: 0.5 }}
        />
      )}
    </div>
  )
}

