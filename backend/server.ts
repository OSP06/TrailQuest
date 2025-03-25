import express from 'express';
import { Database } from './database.js';
import { getRecommendations, logInteraction } from './controllers/recommendationController.js';

const app = express();
app.use(express.json());

// Connect to database
Database.connect().then(() => {
  console.log('Connected to database');
});

// Routes
app.get('/api/recommendations/:userId', getRecommendations);
app.post('/api/interactions', logInteraction);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Recommendation service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await Database.close();
  process.exit(0);
});
