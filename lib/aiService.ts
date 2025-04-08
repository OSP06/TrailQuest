import { z } from 'zod'
import { GoogleGenerativeAI, type GenerateContentRequest } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

// Schema validation
const RecommendationSchema = z.object({
  activityType: z.string(),
  confidence: z.number().min(0).max(1),
  reason: z.string()
})

const AnalysisInputSchema = z.object({
  userId: z.string(),
  activities: z.array(z.any()),
  preferences: z.array(z.any())
})

export type Recommendation = z.infer<typeof RecommendationSchema>
type AnalysisInput = z.infer<typeof AnalysisInputSchema>

// Metrics tracking
const metrics = {
  calls: 0,
  successes: 0,
  failures: 0,
  latency: [] as number[],
  // Gamification metrics
  rewardsEarned: 0,
  xpGranted: 0,
  achievementsUnlocked: [] as string[],
  recommendationPerformance: {
    accepted: 0,
    rejected: 0,
    ignored: 0
  }
}

// Error classification
export class AIError extends Error {
  constructor(
    public type: 'validation' | 'timeout' | 'rate_limit' | 'service',
    message: string
  ) {
    super(message)
  }
}

export async function analyzeUserBehavior(
  input: unknown,
  options: { maxRetries?: number, trackRewards?: boolean } = {}
): Promise<Recommendation[]> {
  const startTime = Date.now()
  metrics.calls++

  try {
    // Validate input
    const parsedInput = AnalysisInputSchema.parse(input)

    // Mock implementation with retry logic
    let attempts = 0
    const maxRetries = options.maxRetries ?? 3

    while (attempts <= maxRetries) {
      try {
        // Call Gemini API for personalized recommendations
        const prompt = `
        You are a trail recommendation engine for TrailQuest. 
        Analyze this user data and suggest 2-3 outdoor activities they would enjoy.
        
        User ID: ${parsedInput.userId}
        Recent Activities: ${JSON.stringify(parsedInput.activities)}
        Preferences: ${JSON.stringify(parsedInput.preferences)}
        
        Return recommendations in this exact JSON format:
        [{
          "activityType": string, 
          "confidence": number (0-1),
          "reason": string
        }]
        `
        
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        // Parse and validate the response
        let recommendations
        try {
          recommendations = JSON.parse(text)
        } catch (e) {
          throw new AIError('validation', 'Invalid AI response format')
        }
        
        const validated = RecommendationSchema.array().parse(recommendations)
        metrics.successes++
        metrics.latency.push(Date.now() - startTime)
        
        // Add gamification scoring
        if (options.trackRewards) {
          const xp = Math.floor(Math.random() * 10) + 5 // 5-15 XP per recommendation
          metrics.xpGranted += xp
          metrics.rewardsEarned += 1
          
          // Check for achievements
          if (metrics.rewardsEarned % 5 === 0) {
            const achievement = `Recommendation Expert ${metrics.rewardsEarned / 5}`
            metrics.achievementsUnlocked.push(achievement)
          }
        }
        
        return validated
      } catch (error) {
        attempts++
        if (attempts > maxRetries) {
          throw new AIError('service', 'Max retries exceeded')
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 100 * 2 ** attempts))
      }
    }
  } catch (error) {
    metrics.failures++
    if (error instanceof z.ZodError) {
      throw new AIError('validation', 'Invalid input data')
    }
    throw error
  }
  throw new AIError('service', 'Unexpected error')
}

// Bulk processing
export async function analyzeUserBehaviors(
  inputs: unknown[],
  options: { batchSize?: number } = {}
): Promise<Recommendation[][]> {
  const batchSize = options.batchSize ?? 10
  const results: Recommendation[][] = []

  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(input => analyzeUserBehavior(input))
    )
    results.push(...batchResults)
  }

  return results
}

// Metrics access
export function getMetrics() {
  return {
    ...metrics,
    avgLatency: metrics.latency.length 
      ? metrics.latency.reduce((a, b) => a + b, 0) / metrics.latency.length
      : 0,
    // Gamification stats
    acceptanceRate: metrics.recommendationPerformance.accepted > 0
      ? metrics.recommendationPerformance.accepted / 
        (metrics.recommendationPerformance.accepted + 
         metrics.recommendationPerformance.rejected)
      : 0
  }
}

// Track recommendation interactions
export function trackRecommendationInteraction(
  type: 'accepted' | 'rejected' | 'ignored'
) {
  metrics.recommendationPerformance[type]++
  
  // Grant XP for accepted recommendations
  if (type === 'accepted') {
    const xp = Math.floor(Math.random() * 20) + 10 // 10-30 XP
    metrics.xpGranted += xp
  }
}
