import { AnimatedLogo } from "@/components/animated-logo"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AnimatedLogo size="lg" animated={true} />
      <div className="mt-8 text-center">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mx-auto"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mx-auto mt-2"></div>
      </div>
    </div>
  )
}

