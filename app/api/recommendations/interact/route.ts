import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/session'
import { RecommendationService } from '../../../../backend/services/recommendationService'
import { AIError } from '../../../../lib/aiService'
import { FeatureStore } from '../../../../backend/featureStore'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { activityId, interactionType } = await request.json()
    
    if (!['accepted', 'rejected', 'ignored'].includes(interactionType)) {
      return NextResponse.json(
        { error: 'Invalid interaction type' },
        { status: 400 }
      )
    }

    await RecommendationService.logInteraction(
      user.id,
      activityId,
      interactionType
    )

    // Get updated user features to return rewards
    const features = await FeatureStore.getUserFeatures(user.id)
    
    return NextResponse.json({
      success: true,
      rewards: {
        xp: features.xp,
        achievements: features.achievements || []
      }
    })
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
