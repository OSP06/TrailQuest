import { MongoClient, ObjectId } from 'mongodb';
import { config } from './config.js';

let client: MongoClient;

const toObjectId = (id: string) => new ObjectId(id);

export const Database = {
  async connect() {
    client = await MongoClient.connect(config.databaseUrl);
  },

  async getUserLocation(userId: string) {
    const db = client.db();
    const user = await db.collection('users').findOne({ _id: toObjectId(userId) });
    return user?.location || 'unknown';
  },

  async getUserPreferences(userId: string) {
    const db = client.db();
    const user = await db.collection('users').findOne({ _id: toObjectId(userId) });
    return user?.preferences || [];
  },

  async getRecentActivities(userId: string) {
    const db = client.db();
    const activities = await db.collection('activities')
      .find({ userId: toObjectId(userId) })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();
    return activities.map(a => a.activityId);
  },

  async getUserFeatures(userId: string) {
    const db = client.db();
    const user = await db.collection('users').findOne({ _id: toObjectId(userId) });
    return {
      lastActivity: user?.lastActivity,
      lastInteraction: user?.lastInteraction,
      activityCount: user?.activities?.length || 0,
      preferenceWeights: user?.preferenceWeights || {}
    };
  },

  async close() {
    await client.close();
  }
};
