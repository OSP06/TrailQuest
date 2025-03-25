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

  static async logInteraction(userId: string, activityId: string, interactionType: string) {
    await FeatureStore.updateUserFeatures(userId, {
      lastActivity: activityId,
      lastInteraction: new Date().toISOString()
    });
    
    await AIClient.logInteraction({
      userId,
      activityId,
      interactionType,
      timestamp: new Date().toISOString()
    });
  }
}
