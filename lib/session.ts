import { auth } from '@clerk/nextjs/server'

export async function getCurrentUser(): Promise<{ id: string } | null> {
  const { userId } = await auth()
  return userId ? { id: userId } : null
}
