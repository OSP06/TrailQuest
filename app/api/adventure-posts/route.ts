import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET() {
  try {
    const posts = await prisma.adventurePost.findMany({
      include: {
        user: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts.map((post: {
      id: number
      description: string
      activityType: string
      location: string
      stats: any
      badges: string[]
      likes: number
      comments: number
      createdAt: Date
      user: {
        name: string
        username: string
        image: string
      }
      images: {
        url: string
      }[]
    }) => ({
      id: post.id,
      user: {
        name: post.user.name,
        username: post.user.username,
        avatar: post.user.image
      },
      timestamp: post.createdAt.toISOString(),
      content: post.description,
      adventure: {
        type: post.activityType,
        location: post.location,
        stats: post.stats,
        badges: post.badges
      },
      images: post.images.map(img => img.url),
      likes: post.likes,
      comments: post.comments,
      liked: false // Will be set based on user's likes
    })))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  try {
    const { title, description, activityType, location, stats } = await request.json()

    const post = await prisma.adventurePost.create({
      data: {
        title,
        description,
        activityType,
        location,
        stats,
        userId: user.id,
        likes: 0,
        comments: 0
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
