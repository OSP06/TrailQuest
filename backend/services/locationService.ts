import { PrismaClient } from '@prisma/client'
import { haversineDistance } from '../../lib/utils'
import { getDeviceMotion, validateMotionData, DeviceMotion } from './deviceService'

const prisma = new PrismaClient()

// Track user location history in memory and persisted storage
const locationHistory = new Map<number, Array<{
  lat: number
  lng: number 
  timestamp: Date
  elevation?: number
  speed?: number
  accuracy?: number
  source?: 'gps' | 'network' | 'manual'
  isOffline?: boolean
  motionData?: DeviceMotion
}>>()

// Offline queue for pending verifications
const offlineQueue = new Map<number, Array<{
  location: { lat: number; lng: number }
  timestamp: Date
  metadata: any
}>>()

export async function verifyLocation(
  userId: number,
  currentLocation: { lat: number; lng: number; accuracy?: number },
  options: {
    interval?: number // Minutes between checks (default 5)
    requireMovement?: boolean
    minSpeed?: number // km/h
    maxSpeed?: number // km/h 
    checkElevation?: boolean
    requireMotion?: boolean
    isOffline?: boolean
  } = {}
): Promise<number> {
  try {
    const now = new Date()
    const interval = options.interval ?? 5 // Default 5 minute intervals
    
    // Handle offline mode
    if (options.isOffline) {
      if (!offlineQueue.has(userId)) {
        offlineQueue.set(userId, [])
      }
      offlineQueue.get(userId)!.push({
        location: currentLocation,
        timestamp: now,
        metadata: {
          accuracy: currentLocation.accuracy,
          source: 'gps'
        }
      })
      return 0.7 // Provisional score for offline data
    }

    // Process any pending offline data
    if (offlineQueue.has(userId) && offlineQueue.get(userId)!.length > 0) {
      const pending = offlineQueue.get(userId)!
      for (const entry of pending) {
        await processLocation(userId, entry.location, {
          ...options,
          timestamp: entry.timestamp,
          metadata: entry.metadata
        })
      }
      offlineQueue.set(userId, [])
    }

    // Process current location
    return processLocation(userId, currentLocation, {
      ...options,
      timestamp: now,
      metadata: {
        accuracy: currentLocation.accuracy,
        source: 'gps'
      }
    })
  } catch (error) {
    console.error('Error verifying location:', error)
    return 0.3 // Default low score on error
  }
}

async function processLocation(
  userId: number,
  location: { lat: number; lng: number; accuracy?: number },
  options: {
    interval?: number
    requireMovement?: boolean
    minSpeed?: number
    maxSpeed?: number
    checkElevation?: boolean
    requireMotion?: boolean
    timestamp: Date
    metadata: any
  }
): Promise<number> {
  try {
    // Initialize user's location history if needed
    if (!locationHistory.has(userId)) {
      locationHistory.set(userId, [])
    }
    const history = locationHistory.get(userId)!

    // Add current location to history with metadata
    history.push({
      lat: location.lat,
      lng: location.lng,
      timestamp: options.timestamp,
      accuracy: location.accuracy,
      source: options.metadata.source,
      isOffline: options.metadata.isOffline,
      motionData: options.requireMotion ? (await getDeviceMotion(userId)) ?? undefined : undefined
    })

    // Clean up old entries (keep last 24 hours)
    const cutoff = new Date(options.timestamp.getTime() - 1000 * 60 * 60 * 24)
    locationHistory.set(userId, history.filter(entry => entry.timestamp > cutoff))

    // Check movement requirements if enabled
    if (options.requireMovement && history.length > 1) {
      const lastEntry = history[history.length - 2]
      const distance = haversineDistance(
        lastEntry.lat,
        lastEntry.lng,
        location.lat,
        location.lng
      )
      const timeDiffHours = (options.timestamp.getTime() - lastEntry.timestamp.getTime()) / (1000 * 60 * 60)
      const speed = distance / timeDiffHours

      // Validate speed
      if (options.minSpeed !== undefined && speed < options.minSpeed) {
        return 0.2 // Too slow - possible cheating
      }
      if (options.maxSpeed !== undefined && speed > options.maxSpeed) {
        return 0.2 // Too fast - possible cheating
      }

      // Validate motion data if required
      if (options.requireMotion && history[history.length - 1].motionData) {
        if (!validateMotionData(history[history.length - 1].motionData!)) {
          return 0.2 // Invalid motion data
        }
      }
    }

    // Verify against known locations from database
    const activities = await prisma.activity.findMany({
      where: { 
        userId,
        locationId: { not: null },
        timestamp: { 
          gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // Last 7 days
        }
      },
      include: { location: true }
    })

    if (activities.length === 0) {
      return 0.5 // Default score if no recent activities
    }

    // Calculate average distance to known locations
    let totalDistance = 0
    let validLocations = 0

    for (const activity of activities) {
      if (activity.location) {
        const distance = haversineDistance(
        location.lat,
        location.lng,
        activity.location.latitude,
        activity.location.longitude
        )
        totalDistance += distance
        validLocations++
      }
    }

    if (validLocations === 0) {
      return 0.5
    }

    const avgDistance = totalDistance / validLocations
    // Score ranges from 1 (very close) to 0 (very far)
    // 1km = 0.1 score reduction
    return Math.max(0, 1 - (avgDistance / 10000))
  } catch (error) {
    console.error('Error verifying location:', error)
    return 0.3 // Default low score on error
  }
}
