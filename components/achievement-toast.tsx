"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Star, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementToastProps {
  title: string
  description?: string
  type?: "badge" | "reward" | "xp"
  icon?: React.ReactNode
  color?: string
  onClose?: () => void
  autoClose?: boolean
  autoCloseTime?: number
}

export function AchievementToast({
  title,
  description,
  type = "badge",
  icon,
  color = "bg-gradient-to-r from-amber-500 to-yellow-500",
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) setTimeout(onClose, 300)
      }, autoCloseTime)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseTime, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) setTimeout(onClose, 300)
  }

  const defaultIcon =
    type === "badge" ? (
      <Award className="h-8 w-8 text-white" />
    ) : type === "reward" ? (
      <Trophy className="h-8 w-8 text-white" />
    ) : (
      <Star className="h-8 w-8 text-white" />
    )

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="rounded-lg shadow-lg overflow-hidden">
            <div className={cn("p-4 text-white flex items-center gap-3", color)}>
              <div className="flex-shrink-0">{icon || defaultIcon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{title}</h3>
                {description && <p className="text-sm opacity-90">{description}</p>}
              </div>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <motion.div
              className="h-1 bg-white"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: autoCloseTime / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

