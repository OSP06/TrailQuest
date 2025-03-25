"use client"

import { SignIn } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { AnimatedLogo } from "@/components/animated-logo"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false)

  const handleLogoAnimationComplete = () => {
    setLogoAnimationComplete(true)
  }

  const handleSkipLogin = () => {
    router.push("/main")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and title */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <AnimatedLogo size="lg" animated={true} onAnimationComplete={handleLogoAnimationComplete} className="mb-4" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: logoAnimationComplete ? 1 : 0, y: logoAnimationComplete ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">TrailQuest</h1>
            <p className="text-gray-600 dark:text-gray-400">Your adventure starts here</p>
          </motion.div>
        </div>

        {/* Clerk SignIn component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: logoAnimationComplete ? 1 : 0, y: logoAnimationComplete ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SignIn 
            afterSignInUrl="/main"
            afterSignUpUrl="/main"
            signUpUrl="/sign-up"
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "border-0 shadow-none",
                headerTitle: "text-xl font-semibold text-gray-900 dark:text-white",
                headerSubtitle: "text-gray-600 dark:text-gray-400",
                socialButtonsBlockButton: "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700",
                formFieldInput: "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
                footerActionText: "text-gray-600 dark:text-gray-400",
                footerActionLink: "text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              }
            }}
          />
        </motion.div>
        
        {/* Bypass authentication button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: logoAnimationComplete ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-4"
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white border-0"
            onClick={handleSkipLogin}
          >
            <span>Skip Login (Enter Dashboard)</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: logoAnimationComplete ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8"
        >
          <p>
            By signing up, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
