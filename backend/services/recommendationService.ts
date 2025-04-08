import { PrismaClient } from '@prisma/client'
import { analyzeUserBehavior, trackRecommendationInteraction } from '../../lib/aiService'
import { verifyLocation } from './locationService.js'

const prisma = new PrismaClient()

export class RecommendationService {
  static async getForUser(userId: number) {
    // Get user data for AI analysis
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        activities: true,
        preferences: true,
        verifications: { take: 5 }
      }
    })

    if (!user) throw new Error('User not found')

    // Get enriched activities with location data
    const enrichedActivities = await Promise.all(user.activities.map(async (activity: {
      id: number
      userId: number
      type: string
      locationId: number | null
      timestamp: Date
      data: any
    }) => {
      const location = activity.locationId ? await prisma.location.findUnique({
        where: { id: activity.locationId }
      }) : null
      
      return {
        ...activity,
        location: location ? {
          lat: location.latitude,
          lng: location.longitude,
          name: location.name
        } : undefined
      }
    }))

    // Get AI recommendations
    const aiRecommendations = await analyzeUserBehavior({
      userId: userId.toString(),
      activities: enrichedActivities,
      preferences: user.preferences
    })

    // Create recommendation record
    const recommendation = await prisma.recommendation.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        items: {
          create: aiRecommendations.map(rec => ({
            activityType: rec.activityType,
            confidence: rec.confidence,
            reason: rec.reason
          }))
        }
      },
      include: { items: true }
    })

    return recommendation.items
  }

  static async logInteraction(
    userId: number,
    itemId: number,
    interactionType: 'accepted' | 'rejected' | 'ignored',
    location?: { lat: number; lng: number }
  ) {
    // Verify location if provided with enhanced checks
    let verificationScore = 0
    if (location) {
      verificationScore = await verifyLocation(userId, location, {
        requireMovement: true,
        minSpeed: 1, // Minimum 1 km/h
        maxSpeed: 20 // Maximum 20 km/h (running speed)
      })
    }

    // Log interaction
    await prisma.recommendationInteraction.create({
      data: {
        userId,
        itemId,
        type: interactionType.toUpperCase() as any,
        location: location ? JSON.stringify(location) : undefined,
        verificationScore
      }
    })

    // Track in AI service for learning
    trackRecommendationInteraction(interactionType)

    // Update user XP based on interaction
    const xpValues = {
      accepted: 15,
      rejected: 5,
      ignored: 2
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpValues[interactionType] }
      }
    })

    // Check for achievements
    if (interactionType === 'accepted') {
      const acceptedCount = await prisma.recommendationInteraction.count({
        where: {
          userId,
          type: 'ACCEPTED'
        }
      })

      if (acceptedCount === 1) {
        await this.grantAchievement(userId, 'FIRST_RECOMMENDATION')
      } else if (acceptedCount % 5 === 0) {
        await this.grantAchievement(
          userId,
          `RECOMMENDATION_EXPERT_${Math.floor(acceptedCount/5)}`
        )
      }
    }
  }

  private static async grantAchievement(userId: number, achievementName: string) {
    const achievement = await prisma.achievement.findUnique({
      where: { name: achievementName }
    })

    if (achievement) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id
        }
      })
    }
  }
}
