import { Check, Crown, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PremiumPage() {
  // Premium features
  const features = [
    {
      title: "Hidden Trails",
      description: "Discover secret trails and hidden gems not available to regular users.",
      icon: "🗺️",
    },
    {
      title: "Advanced Performance Analytics",
      description: "Get detailed insights into your hiking performance with ML-based trend analysis.",
      icon: "📊",
    },
    {
      title: "Offline Mode",
      description: "Track and log your adventures even without internet connection.",
      icon: "📱",
    },
    {
      title: "Custom Challenges",
      description: "Create personalized challenges for yourself and friends.",
      icon: "🏆",
    },
    {
      title: "Priority Support",
      description: "Get faster responses from our dedicated support team.",
      icon: "🛟",
    },
    {
      title: "Ad-Free Experience",
      description: "Enjoy TrailQuest without any advertisements.",
      icon: "✨",
    },
  ]

  // Pricing plans
  const plans = [
    {
      name: "Monthly",
      price: "$9.99",
      period: "per month",
      features: ["All premium features", "Cancel anytime", "14-day free trial"],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Annual",
      price: "$79.99",
      period: "per year",
      features: ["All premium features", "Save 33% ($40)", "30-day free trial", "Priority support"],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Lifetime",
      price: "$249.99",
      period: "one-time payment",
      features: ["All premium features forever", "All future updates", "VIP support", "Early access to new features"],
      cta: "Purchase",
      popular: false,
    },
  ]

  return (
    <div className="container max-w-screen-xl space-y-8 py-6 md:py-10">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <Crown className="h-4 w-4" />
          <span>Premium Membership</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Elevate Your Adventure</h1>
        <p className="mx-auto mt-2 max-w-[700px] text-muted-foreground">
          Unlock exclusive features and take your hiking experience to new heights with TrailQuest Premium.
        </p>
      </div>

      {/* Premium Features */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="border-primary/10 bg-primary/5">
            <CardHeader>
              <div className="text-3xl">{feature.icon}</div>
              <CardTitle className="mt-2">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Plans */}
      <div className="mt-16 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <p className="mt-2 text-muted-foreground">Select the plan that works best for you</p>
        </div>

        <Tabs defaultValue="subscription" className="mx-auto max-w-[800px]">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="subscription" className="mt-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative overflow-hidden ${plan.popular ? "border-primary shadow-md" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute right-0 top-0 bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground"> {plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className={`w-full ${plan.popular ? "bg-primary" : ""}`}>{plan.cta}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium">Feature</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">Free</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3">Basic Tracking</td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Adventure Log</td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Basic Stats</td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Hidden Trails</td>
                        <td className="px-4 py-3 text-center">
                          <Lock className="mx-auto h-4 w-4 text-muted-foreground" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Advanced Analytics</td>
                        <td className="px-4 py-3 text-center">
                          <Lock className="mx-auto h-4 w-4 text-muted-foreground" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Offline Mode</td>
                        <td className="px-4 py-3 text-center">
                          <Lock className="mx-auto h-4 w-4 text-muted-foreground" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Custom Challenges</td>
                        <td className="px-4 py-3 text-center">
                          <Lock className="mx-auto h-4 w-4 text-muted-foreground" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Ad-Free Experience</td>
                        <td className="px-4 py-3 text-center">
                          <Lock className="mx-auto h-4 w-4 text-muted-foreground" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Testimonials */}
      <div className="mt-16 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">What Premium Users Say</h2>
          <p className="mt-2 text-muted-foreground">Hear from our community of adventurers</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted">
                  <img src="/placeholder.svg?height=48&width=48" alt="User" className="h-full w-full rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Alex Johnson</p>
                  <p className="text-sm text-muted-foreground">Premium user for 1 year</p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                "The hidden trails feature has completely changed how I explore. I've discovered amazing spots I never
                knew existed!"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted">
                  <img src="/placeholder.svg?height=48&width=48" alt="User" className="h-full w-full rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Jamie Chen</p>
                  <p className="text-sm text-muted-foreground">Premium user for 6 months</p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                "The offline mode is a game-changer for remote hikes. I can track everything even when there's no
                signal."
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted">
                  <img src="/placeholder.svg?height=48&width=48" alt="User" className="h-full w-full rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Taylor Smith</p>
                  <p className="text-sm text-muted-foreground">Premium user for 2 years</p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                "The advanced analytics helped me improve my hiking endurance. I can see my progress over time and it's
                really motivating."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <Crown className="mx-auto h-12 w-12" />
            <h2 className="mt-4 text-2xl font-bold">Ready to Upgrade Your Adventure?</h2>
            <p className="mx-auto mt-2 max-w-[600px]">
              Join thousands of premium users who are discovering new trails, tracking their progress, and taking their
              hiking experience to the next level.
            </p>
            <Button className="mt-6 bg-background text-foreground hover:bg-background/90" size="lg">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

