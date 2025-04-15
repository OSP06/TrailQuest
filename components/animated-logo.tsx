"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimationControls } from "framer-motion"
import { Mountain, Compass, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAnimationProps, createAnimationSequence, type AnimationConfig } from "@/lib/animationUtils"

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  onAnimationComplete?: () => void
  className?: string
}

export function AnimatedLogo({ size = "md", animated = true, onAnimationComplete, className }: AnimatedLogoProps) {
  const [animationCompleted, setAnimationCompleted] = useState(false)
  const animationRef = useRef<AnimationControls | null>(null)

  const sizeClasses: Record<string, string> = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  }

  const iconSizes: Record<string, string> = {
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

  // Animation configurations
  const circleAnimations = createAnimationSequence([
    { 
      type: 'scale', 
      duration: 0.6, 
      from: animated ? { scale: 0, opacity: 0 } : undefined,
      to: { scale: 1, opacity: 1 }
    },
    { 
      type: 'scale', 
      duration: 0.6, 
      delay: 0.1, 
      from: animated ? { scale: 0, opacity: 0 } : undefined,
      to: { scale: 1, opacity: 1 }
    },
    { 
      type: 'scale', 
      duration: 0.6, 
      delay: 0.2, 
      from: animated ? { scale: 0, opacity: 0 } : undefined,
      to: { scale: 1, opacity: 1 }
    }
  ])

  const mountainAnimation = getAnimationProps({
    type: 'fade',
    duration: 0.5,
    delay: 0.4,
    from: animated ? { y: 20, opacity: 0 } : undefined,
    to: { y: 0, opacity: 1 }
  })

  const orbitAnimations = {
    main: getAnimationProps({
      type: 'rotate',
      duration: 20,
      from: { rotate: 0 },
      to: { rotate: 360 }
    }),
    secondary: getAnimationProps({
      type: 'rotate',
      duration: 15,
      from: { rotate: 0 },
      to: { rotate: -360 }
    }),
    items: createAnimationSequence([
      { type: 'scale', duration: 0.4, delay: 0.6, from: animated ? { scale: 0, opacity: 0 } : undefined },
      { type: 'scale', duration: 0.4, delay: 0.7, from: animated ? { scale: 0, opacity: 0 } : undefined }
    ])
  }

  const glowAnimation = getAnimationProps({
    type: 'scale',
    duration: 0.8,
    delay: 0.3,
    from: animated ? { scale: 0, opacity: 0 } : { scale: 1.5, opacity: 0.2 },
    to: { scale: 1.5, opacity: 0.2 }
  })

  const pulseAnimation = animated ? getAnimationProps({
    type: 'pulse',
    duration: 1.5,
    repeat: 3,
    repeatDelay: 0.5,
    from: { scale: 0.8, opacity: 1 },
    to: { scale: 1.5, opacity: 0 }
  }) : undefined

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700"
        {...circleAnimations[0]}
      />

      {/* Inner circle */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
        {...circleAnimations[1]}
      />

      {/* Center circle */}
      <motion.div
        className="absolute inset-4 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center"
        {...circleAnimations[2]}
      >
        {/* Mountain icon */}
        <motion.div className="absolute" {...mountainAnimation}>
          <Mountain className={cn("text-indigo-600", iconSizes[size])} />
        </motion.div>
      </motion.div>

      {/* Orbiting elements */}
      <motion.div className="absolute inset-0" {...orbitAnimations.main}>
        {/* Compass orbit */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          {...orbitAnimations.items[0]}
        >
          <div className="bg-amber-500 rounded-full p-1 shadow-lg">
            <Compass className={cn("text-white", iconSizes[size] === "w-12 h-12" ? "w-6 h-6" : "w-4 h-4")} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="absolute inset-0" {...orbitAnimations.secondary}>
        {/* Zap orbit */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
          {...orbitAnimations.items[1]}
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
        {...glowAnimation}
      />

      {/* Pulse effect */}
      {pulseAnimation !== undefined && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-indigo-400"
          {...pulseAnimation}
        />
      )}
    </div>
  )
}
