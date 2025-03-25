export const config = {
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:5001',
  featureStoreUrl: process.env.FEATURE_STORE_URL || 'redis://localhost:6379',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/trailquest'
};
