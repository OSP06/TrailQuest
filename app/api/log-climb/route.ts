import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  try {
    const { location, difficulty, notes } = await request.json()

    // Create new activity log
    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'rock_climbing',
        data: {
          location,
          difficulty,
          notes
        }
      }
    })

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Error logging climb:', error)
    return NextResponse.json(
      { 
        error: 'Failed to log climb',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
