interface Trail {
  id: string;
  name: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  coordinates: [number, number][];
  length: number;
  elevationGain: number;
  description?: string;
}

interface Activity {
  id: string;
  type: 'hiking' | 'kayaking' | 'rock-climbing' | 'cliff-jumping';
  trailId: string;
  userId: string;
  startTime: string;
  endTime: string;
  distance: number;
  notes?: string;
}

export interface Profile {
  id: number;
  email: string;
  xp: number;
  level: number;
  profile: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatarUrl?: string;
  };
  achievements: {
    achievement: {
      id: number;
      name: string;
      description: string;
      xpReward: number;
    };
    unlockedAt: string;
  }[];
  recentActivities: Activity[];
}
