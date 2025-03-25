"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementBadgeProps {
  id: string
  name: string
  description: string
  unlocked: boolean
  icon: any
  color: string
  textColor: string
  glow?: string
  onClick?: () => void
}

export function AchievementBadge({
  id,
  name,
  description,
  unlocked,
  icon: Icon,
  color,
  textColor,
  glow,
  onClick,
}: AchievementBadgeProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={onClick}
    >
      <Card
        className={cn("border transition-all duration-300 cursor-pointer", unlocked ? "" : "border-dashed opacity-80")}
      >
        <CardHeader className="p-4 pb-2 text-center">
          <motion.div
            className={cn(
              "mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full shadow-lg",
              unlocked ? color : "bg-muted",
            )}
            style={{
              boxShadow: unlocked && isHovering ? glow : "none",
            }}
            animate={{
              rotate: isHovering && unlocked ? [0, -10, 10, -10, 10, 0] : 0,
              scale: isHovering && unlocked ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {unlocked ? (
              <Icon className="h-8 w-8 text-white" />
            ) : (
              <div className="relative">
                <Icon className="h-8 w-8 text-muted-foreground" />
                <div className="absolute -top-1 -right-1 rounded-full bg-background p-0.5">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </motion.div>
          <CardTitle className={`text-base ${unlocked ? textColor : ""}`}>{name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-center">
          <p className="text-xs text-muted-foreground">{description}</p>
          {unlocked && (
            <Badge variant="outline" className="mt-2 gap-1">
              <Award className="h-3 w-3" />
              <span>Earned</span>
            </Badge>
          )}
          {!unlocked && (
            <Badge variant="outline" className="mt-2 gap-1 border-muted-foreground/30">
              <Lock className="h-3 w-3" />
              <span>Locked</span>
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

