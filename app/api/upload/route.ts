import { NextResponse } from 'next/server'
import { uploadFile } from '@/lib/s3'
import { getCurrentUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const postId = formData.get('postId') as string

  if (!file || !postId) {
    return NextResponse.json({ error: 'Missing file or postId' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadFile({
      body: buffer,
      contentType: file.type,
      key: `adventures/${postId}/${Date.now()}-${file.name}`
    })

    if (!result.success) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Save to database
    const image = await prisma.adventureImage.create({
      data: {
        url: result.url,
        postId: parseInt(postId),
        userId: user.id
      }
    })

    return NextResponse.json({ url: result.url, imageId: image.id })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
