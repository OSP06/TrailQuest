"use client"

import { motion } from "framer-motion"
import { Lock, Crown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RewardCardProps {
  id: string
  name: string
  description: string
  unlocked: boolean
  icon: any
  color: string
  textColor: string
  borderColor: string
  glow?: string
  onUse?: () => void
  onUpgrade?: () => void
}

export function RewardCard({
  id,
  name,
  description,
  unlocked,
  icon: Icon,
  color,
  textColor,
  borderColor,
  glow,
  onUse,
  onUpgrade,
}: RewardCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}>
      <Card
        className={cn(
          "border transition-all duration-300",
          unlocked ? "border-primary/20" : "border-dashed opacity-80",
        )}
      >
        <div className={`h-2 w-full rounded-t-lg ${unlocked ? color : "bg-muted"}`}></div>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full shadow-md",
                unlocked ? color : "bg-muted",
              )}
              style={{
                boxShadow: unlocked ? glow : "none",
              }}
              whileHover={{
                rotate: unlocked ? 360 : 0,
                scale: unlocked ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {unlocked ? (
                <Icon className="h-6 w-6 text-white" />
              ) : (
                <div className="relative">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                  <div className="absolute -top-1 -right-1 rounded-full bg-background p-0.5">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              )}
            </motion.div>
            <CardTitle className={`text-base ${unlocked ? textColor : ""}`}>{name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground">{description}</p>
          {!unlocked && (
            <div className="mt-3">
              <Badge variant="outline" className="gap-1 border-primary/50 text-primary">
                <Crown className="h-3 w-3" />
                <span>Premium Feature</span>
              </Badge>
            </div>
          )}
        </CardContent>
        {unlocked && (
          <CardFooter className="p-4 pt-0">
            <Button variant="outline" size="sm" className={cn("w-full gap-1", textColor, borderColor)} onClick={onUse}>
              <span>Use Reward</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        )}
        {!unlocked && (
          <CardFooter className="p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1 border-primary/50 text-primary"
              onClick={onUpgrade}
            >
              <Crown className="h-4 w-4" />
              <span>Upgrade to Unlock</span>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}

