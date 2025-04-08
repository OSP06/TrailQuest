import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await prisma.user.findUnique({
      where: { id: parseInt(user.id) },
      include: {
        profile: true,
        achievements: {
          include: {
            achievement: true
          }
        },
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      xp: profile.xp,
      level: profile.level,
      profile: profile.profile,
      achievements: profile.achievements,
      recentActivities: profile.activities
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
