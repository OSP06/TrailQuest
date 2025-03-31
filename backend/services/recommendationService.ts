import { AIClient } from '../clients/aiClient.js';
import { Database } from '../database.js';
import { FeatureStore } from '../featureStore.js';

export class RecommendationService {
  static async getForUser(userId: string) {
    const features = await FeatureStore.getUserFeatures(userId);
    return AIClient.getRecommendations({
      userId,
      features,
      context: {
        location: await Database.getUserLocation(userId),
        preferences: await Database.getUserPreferences(userId),
        recentActivities: await Database.getRecentActivities(userId)
      }
    });
  }

  static async logInteraction(
    userId: string, 
    activityId: string, 
    interactionType: 'accepted' | 'rejected' | 'ignored'
  ) {
    // Update user features
    await FeatureStore.updateUserFeatures(userId, {
      lastActivity: activityId,
      lastInteraction: new Date().toISOString()
    });
    
    // Log to AI service
    await AIClient.logInteraction({
      userId,
      activityId,
      interactionType,
      timestamp: new Date().toISOString()
    });

    // Track for gamification
    const xpAmounts = {
      accepted: 15,
      rejected: 5,
      ignored: 2
    };
    
    await FeatureStore.updateUserFeatures(userId, {
      xp: { $inc: xpAmounts[interactionType] || 0 },
      recommendationsAccepted: interactionType === 'accepted' ? { $inc: 1 } : undefined,
      rewards: interactionType === 'accepted' 
        ? { $push: 'recommendation_accepted' } 
        : { $push: `recommendation_${interactionType}` }
    });

    // Check for achievement milestones
    const features = await FeatureStore.getUserFeatures(userId);
    const acceptedCount = features.recommendationsAccepted || 0;
    
    if (interactionType === 'accepted') {
      if (acceptedCount >= 5 && acceptedCount % 5 === 0) {
        await FeatureStore.updateUserFeatures(userId, {
          achievements: { $push: `recommendation_expert_${Math.floor(acceptedCount/5)}` }
        });
      }
      if (acceptedCount === 1) {
        await FeatureStore.updateUserFeatures(userId, {
          achievements: { $push: 'first_recommendation' }
        });
      }
    }
  }
}
