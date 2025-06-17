import { prisma } from '../lib/prisma';

export const Database = {
  async connect() {
    // Connection is handled by Prisma client
  },

  async getUserLocation(userId: number) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { location: true }
    });
    return profile?.location || 'unknown';
  },

  async getUserPreferences(userId: number) {
    const prefs = await prisma.preference.findMany({
      where: { userId },
      select: { key: true, value: true }
    });
    return prefs.map(p => ({ [p.key]: p.value }));
  },

  async getRecentActivities(userId: number) {
    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { type: true, data: true }
    });
    return activities.map(a => ({
      type: a.type,
      ...(a.data as object)
    }));
  },

  async getUserFeatures(userId: number) {
    const [user, profile, activities] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { preferences: true }
      }),
      prisma.userProfile.findUnique({
        where: { userId }
      }),
      prisma.activity.findMany({
        where: { userId }
      })
    ]);

    const preferenceWeights = user?.preferences.reduce((acc, pref) => {
      if (pref.key.startsWith('weight_')) {
        acc[pref.key.replace('weight_', '')] = parseFloat(pref.value);
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      lastActivity: profile?.lastActivityId,
      lastInteraction: profile?.lastInteraction,
      activityCount: activities.length,
      preferenceWeights: preferenceWeights || {}
    };
  },

  async close() {
    // Connection cleanup is handled by Prisma client
  }
};
