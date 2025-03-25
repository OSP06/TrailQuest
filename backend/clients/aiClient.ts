import axios from 'axios';
import { config } from '../config.js';

interface RecommendationRequest {
  userId: string;
  features: any;
  context: {
    location: string;
    preferences: string[];
    recentActivities: string[];
  };
}

interface InteractionLog {
  userId: string;
  activityId: string;
  interactionType: string;
  timestamp: string;
}

export class AIClient {
  private static client = axios.create({
    baseURL: config.aiServiceUrl,
    timeout: 5000
  });

  static async getRecommendations(request: RecommendationRequest) {
    const response = await this.client.post('/recommendations', request);
    return response.data;
  }

  static async logInteraction(log: InteractionLog) {
    await this.client.post('/interactions', log);
  }
}
