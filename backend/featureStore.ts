import { Redis } from 'ioredis';
import { config } from './config.js';
import { Database } from './database.js';

const redis = new Redis(config.featureStoreUrl);

interface UserFeatures {
  lastActivity?: string;
  lastInteraction?: string;
  activityCount?: number;
  preferenceWeights?: Record<string, number>;
  xp?: number;
  rewards?: string[];
  achievements?: string[];
  recommendationsAccepted?: number;
  [key: string]: any; // Index signature for dynamic properties
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

  async updateUserFeatures(userId: string, updates: Partial<UserFeatures> | { [key: string]: any }) {
    const current = await this.getUserFeatures(userId);
    let updated = { ...current };

    // Handle MongoDB-style operators
    for (const [key, value] of Object.entries(updates)) {
      if (key.startsWith('$')) {
        if (key === '$inc' && typeof value === 'object') {
          for (const [field, amount] of Object.entries(value)) {
            updated[field] = (updated[field] || 0) + amount;
          }
        } else if (key === '$push' && typeof value === 'object') {
          for (const [field, item] of Object.entries(value)) {
            if (!Array.isArray(updated[field])) {
              updated[field] = [];
            }
            updated[field].push(item);
          }
        }
      } else {
        updated[key] = value;
      }
    }

    await redis.set(
      `user:${userId}:features`,
      JSON.stringify(updated),
      'EX', 3600
    );
  }
};
