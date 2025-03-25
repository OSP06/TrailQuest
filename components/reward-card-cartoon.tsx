"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Crown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RewardCardCartoonProps {
  id: string
  name: string
  description: string
  unlocked: boolean
  icon: React.ReactNode
  bgColor: string
  onUse?: () => void
  onUpgrade?: () => void
}

export function RewardCardCartoon({
  id,
  name,
  description,
  unlocked,
  icon,
  bgColor,
  onUse,
  onUpgrade,
}: RewardCardCartoonProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div whileHover={{ y: -5 }} onHoverStart={() => setIsHovering(true)} onHoverEnd={() => setIsHovering(false)}>
      <Card
        className={cn(
          "overflow-hidden border-2 transition-all duration-300",
          unlocked
            ? "border-amber-500 dark:border-amber-400"
            : "border-dashed border-gray-300 dark:border-gray-600 opacity-80",
        )}
      >
        <div className="relative">
          {/* Card header with icon */}
          <div className={cn("p-4 flex items-center gap-3", unlocked ? bgColor : "bg-gray-200 dark:bg-gray-700")}>
            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">{icon}</div>
            <h3 className="font-bold text-white text-lg">{name}</h3>

            {/* Lock icon for locked rewards */}
            {!unlocked && (
              <div className="absolute top-2 right-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
            )}

            {/* Shine effect */}
            {unlocked && (
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                  backgroundSize: "200% 200%",
                  animation: isHovering ? "shine 1.5s ease infinite" : "none",
                }}
              />
            )}
          </div>

          {/* Card content */}
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </CardContent>

          {/* Card footer */}
          <CardFooter className="p-4 pt-0">
            {unlocked ? (
              <Button className="w-full gap-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={onUse}>
                <span>Use Reward</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" className="w-full gap-1 border-amber-500 text-amber-500" onClick={onUpgrade}>
                <Crown className="h-4 w-4" />
                <span>Upgrade to Unlock</span>
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>

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
    </motion.div>
  )
}

