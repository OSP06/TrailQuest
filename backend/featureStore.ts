import { Redis } from 'ioredis';
import { config } from './config.js';
import { Database } from './database.js';

const redis = new Redis(config.featureStoreUrl);

interface UserFeatures {
  lastActivity?: string;
  lastInteraction?: string;
  activityCount?: number;
  preferenceWeights?: Record<string, number>;
}

export const FeatureStore = {
  async getUserFeatures(userId: string): Promise<UserFeatures> {
    const cached = await redis.get(`user:${userId}:features`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fallback to database if not in cache
    const features = await Database.getUserFeatures(userId);
    await redis.set(
      `user:${userId}:features`,
      JSON.stringify(features),
      'EX', 3600 // Cache for 1 hour
    );
    return features;
  },

  async updateUserFeatures(userId: string, updates: Partial<UserFeatures>) {
    const current = await this.getUserFeatures(userId);
    const updated = { ...current, ...updates };
    await redis.set(
      `user:${userId}:features`,
      JSON.stringify(updated),
      'EX', 3600
    );
  }
};
