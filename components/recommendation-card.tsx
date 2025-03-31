'use client'

import { useState } from 'react'
import { Award } from 'lucide-react'
import { Button } from './ui/button'
import { RewardCard } from './reward-card'
import { AchievementBadge } from './achievement-badge'
import { toast } from './ui/use-toast'

interface Recommendation {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
}

interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  icon: string
  xp: number
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

interface Reward {
  points: number
  type: 'xp' | 'badge' | 'item'
}

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)

  const handleInteraction = async (interactionType: 'accepted' | 'rejected' | 'ignored') => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/recommendations/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId: recommendation.id,
          interactionType
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setIsAccepted(interactionType === 'accepted')
        toast({
          title: interactionType === 'accepted' ? 'Recommendation accepted!' : 'Feedback recorded',
          description: interactionType === 'accepted' 
            ? `+${recommendation.xpReward} XP earned!` 
            : 'Thanks for your feedback!',
        })

        // Show rewards if accepted
        if (interactionType === 'accepted' && result.rewards) {
          toast({
            title: 'Rewards updated!',
            description: (
              <div className="flex gap-2">
                {result.rewards.achievements?.map((a: string) => (
                  <AchievementBadge 
                    key={a}
                    id={a}
                    name={a}
                    description={`Achievement: ${a}`}
                    unlocked={true}
                    icon={Award}
                    color="bg-yellow-500"
                    textColor="text-yellow-500"
                    glow="0 0 10px rgba(234, 179, 8, 0.7)"
                  />
                ))}
              </div>
            )
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record interaction',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{recommendation.title}</h3>
        <p className="text-sm text-muted-foreground">{recommendation.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-secondary rounded-full">
            {recommendation.difficulty}
          </span>
          <RewardCard 
            id={`xp-${recommendation.id}`}
            name={`${recommendation.xpReward} XP`}
            description="Experience points for completing this activity"
            unlocked={true}
            icon={Award}
            color="bg-blue-500"
            textColor="text-blue-500"
            borderColor="border-blue-500"
            glow="0 0 10px rgba(59, 130, 246, 0.7)"
          />
        </div>
      </div>

      {!isAccepted ? (
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={() => handleInteraction('accepted')}
            disabled={isLoading}
          >
            Accept
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleInteraction('rejected')}
            disabled={isLoading}
          >
            Not for me
          </Button>
        </div>
      ) : (
        <div className="text-sm text-green-500">
          You've accepted this recommendation!
        </div>
      )}
    </div>
  )
}
