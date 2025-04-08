import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface DeviceMotion {
  acceleration: { x: number; y: number; z: number }
  rotation: { alpha: number; beta: number; gamma: number }
  interval: number
}

export async function getDeviceMotion(userId: number): Promise<DeviceMotion | null> {
  try {
    const device = await prisma.device.findUnique({
      where: { userId },
      select: {
        motionData: true,
        lastUpdated: true
      }
    })

    if (!device || !device.motionData) {
      return null
    }

    // Return parsed motion data if recent (within 5 minutes)
    if (device.lastUpdated && 
        Date.now() - device.lastUpdated.getTime() < 300000) {
      return JSON.parse(device.motionData) as DeviceMotion
    }

    return null
  } catch (error) {
    console.error('Error getting device motion:', error)
    return null
  }
}

export function validateMotionData(motion: DeviceMotion): boolean {
  // Check for reasonable acceleration values (in m/s^2)
  const { acceleration } = motion
  if (Math.abs(acceleration.x) > 20 || 
      Math.abs(acceleration.y) > 20 || 
      Math.abs(acceleration.z) > 30) {
    return false // Unrealistic values
  }

  // Check for reasonable rotation rates (in degrees/second)
  const { rotation } = motion
  if (Math.abs(rotation.alpha) > 720 || 
      Math.abs(rotation.beta) > 720 || 
      Math.abs(rotation.gamma) > 720) {
    return false // Spinning too fast
  }

  return true
}
