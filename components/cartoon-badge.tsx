"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CartoonBadgeProps {
  id: string
  name: string
  description: string
  unlocked: boolean
  icon: React.ReactNode
  bgColor: string
  onClick?: () => void
  size?: "sm" | "md" | "lg"
  showLock?: boolean
}

export function CartoonBadge({
  id,
  name,
  description,
  unlocked,
  icon,
  bgColor,
  onClick,
  size = "md",
  showLock = true,
}: CartoonBadgeProps) {
  const [isHovering, setIsHovering] = useState(false)

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{
          scale: 1.05,
          rotate: unlocked ? [0, -5, 5, -5, 5, 0] : 0,
        }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={onClick}
        className="relative cursor-pointer"
      >
        <div
          className={cn(
            "rounded-full flex items-center justify-center mb-2 mx-auto relative",
            sizeClasses[size],
            unlocked ? bgColor : "bg-gray-200 dark:bg-gray-700",
          )}
        >
          {/* Badge shadow */}
          <div
            className={cn("absolute inset-0 rounded-full", unlocked ? "shadow-lg" : "")}
            style={{
              boxShadow: unlocked
                ? `0 10px 25px -5px ${bgColor.includes("from") ? "rgba(245, 158, 11, 0.5)" : bgColor}`
                : "none",
            }}
          />

          {/* Badge icon */}
          <div
            className={cn(
              "relative z-10 transform transition-transform duration-300",
              unlocked && isHovering ? "scale-110" : "",
            )}
          >
            {icon}
          </div>

          {/* Badge border */}
          <div
            className={cn(
              "absolute inset-0 rounded-full border-4",
              unlocked ? "border-white dark:border-gray-800" : "border-gray-300 dark:border-gray-600",
            )}
          />

          {/* Lock icon for locked badges */}
          {!unlocked && showLock && (
            <div className="absolute -bottom-1 -right-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1 border-2 border-gray-300 dark:border-gray-600">
              <Lock className="h-4 w-4 text-gray-500" />
            </div>
          )}

          {/* Shine effect */}
          {unlocked && (
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                backgroundSize: "200% 200%",
                animation: isHovering ? "shine 1.5s ease infinite" : "none",
              }}
            />
          )}
        </div>

        <div className="text-center">
          <p
            className={cn(
              "font-bold",
              textSizeClasses[size],
              unlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400",
            )}
          >
            {name}
          </p>
          <p className={cn("text-gray-500 dark:text-gray-400", size === "sm" ? "text-xs" : "text-xs")}>{description}</p>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shine {
          0% {
            background-position: -100% -100%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
      `}</style>
    </div>
  )
}

