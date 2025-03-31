import { Recommendation } from './aiService'

export async function fetchRecommendations(): Promise<Recommendation[]> {
  const res = await fetch('/api/recommendations')
  if (!res.ok) {
    throw new Error('Failed to fetch recommendations')
  }
  const data = await res.json()
  return data.items || [] // Return empty array if no items
}
