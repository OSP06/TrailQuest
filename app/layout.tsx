import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TrailQuest - Gamified Hiking & Adventure",
  description: "Track your adventures, earn XP, and compete with friends",
  generator: "v0.dev"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#22c55e"
        }
      }}
      signInFallbackRedirectUrl="/main"
      signUpFallbackRedirectUrl="/onboarding"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
