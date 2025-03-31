import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/session'
import { RecommendationService } from '../../../backend/services/recommendationService'
import { AIError, type Recommendation } from '../../../lib/aiService'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get latest activities
    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 10
    })

    // Get user preferences
    const preferences = await prisma.preference.findMany({
      where: { userId: user.id }
    })

    // Get recommendations through service layer
    const recommendations = await RecommendationService.getForUser(user.id)

    // Save recommendations
    const savedRecs = await prisma.recommendation.create({
      data: {
        userId: user.id,
        modelId: 1, // Default model
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        items: {
          create: recommendations.map((rec: Recommendation) => ({
            activityType: rec.activityType,
            confidence: rec.confidence,
            reason: rec.reason
          }))
        }
      },
      include: { items: true }
    })

    // Calculate potential rewards
    const potentialXp = recommendations.length * 15 // Max 15 XP per recommendation
    const achievements = []
    
    // Check for first recommendation achievement
    const existingRecs = await prisma.recommendation.count({
      where: { userId: user.id }
    })
    if (existingRecs === 1) {
      achievements.push('first_recommendation')
    }

    const response = {
      ...savedRecs,
      rewards: {
        xp: 0, // Will be granted when recommendations are acted upon
        potentialXp,
        achievements
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof Error && 'type' in error && error instanceof AIError) {
      return NextResponse.json(
        { error: `AI Service Error: ${error.message}` },
        { status: error.type === 'validation' ? 400 : 503 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
