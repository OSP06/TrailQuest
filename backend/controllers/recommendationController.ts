import { RecommendationService } from '../services/recommendationService.js';
import { Request, Response } from 'express';

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const recommendations = await RecommendationService.getForUser(userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

export const logInteraction = async (req: Request, res: Response) => {
  try {
    const { userId, activityId, interactionType } = req.body;
    await RecommendationService.logInteraction(userId, activityId, interactionType);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to log interaction' });
  }
};
