"use client"
import Link from "next/link"
import { ArrowRight, Award, ChevronRight, Droplet, Lock, MapPin, Mountain, Waves, Zap, Crown, Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapComponent } from "@/components/map-component"
import { useUser } from "@clerk/nextjs"

export default function Home() {

  const { isLoaded, user } = useUser()
  
  if (!isLoaded) {
    return (
      <div className="flex">
        <DesktopNavigation />
        <div className="container px-4 sm:px-6 max-w-screen-xl space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-10 flex-1">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 space-y-4">
              <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
              {/* Loading skeletons for other content */}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <DesktopNavigation />
      <div className="container px-4 sm:px-6 max-w-screen-xl space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-10 flex-1">
        <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user?.fullName || 'Adventurer'}</h1>
            <Badge variant="outline" className="gap-1 w-fit">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>Level 12</span>
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total XP</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="text-xl sm:text-2xl font-bold">12,450</div>
                <p className="text-xs text-muted-foreground">+350 this week</p>
                <Progress value={65} className="mt-2 h-1" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-sm font-medium text-muted-foreground">Distance</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="text-xl sm:text-2xl font-bold">248 mi</div>
                <p className="text-xs text-muted-foreground">+12 miles this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-sm font-medium text-muted-foreground">Elevation</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="text-xl sm:text-2xl font-bold">15,200 ft</div>
                <p className="text-xs text-muted-foreground">+850 ft this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="text-xl sm:text-2xl font-bold">8 days</div>
                <p className="text-xs text-muted-foreground">Best: 14 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Challenge */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                Daily Challenge
              </CardTitle>
              <CardDescription>Complete for bonus XP and rewards</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div>
                  <h3 className="font-semibold">Hike 5 miles today</h3>
                  <p className="text-sm text-muted-foreground">2.3 miles completed</p>
                </div>
                <Progress value={46} className="w-full sm:w-24 h-2" />
              </div>
            </CardContent>
            <CardFooter className="px-4 sm:px-6">
              <Link href="/track/tracking_hiking">
                <Button variant="outline" size="sm" className="gap-1">
                  <span>Track Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Hiking Stats */}
          <Card>
            <CardHeader className="px-4 sm:px-6 pb-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Mountain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Hiking Stats
              </CardTitle>
              <CardDescription>Your recent hiking activity</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Recent Hikes</p>
                  <p className="text-xl sm:text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Favorite Trail</p>
                  <p className="text-base sm:text-lg font-medium">Mount Si</p>
                  <p className="text-xs text-muted-foreground">Hiked 5 times</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Next Goal</p>
                  <p className="text-base sm:text-lg font-medium">Summit Seeker</p>
                  <p className="text-xs text-muted-foreground">2 more summits needed</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-4 sm:px-6">
              <Link href="/hiking">
                <Button variant="outline" size="sm" className="gap-1 w-full sm:w-auto">
                  <span>View All Hiking Stats</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Side Quests */}
        <div className="w-full md:w-72 space-y-4">
          <h2 className="text-xl font-semibold">Side Quests</h2>
          <div className="grid gap-3">
            <Link href="/side-quests/kayaking">
              <Card className="transition-all hover:bg-accent/50">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Waves className="h-4 w-4" />
                      <span>Kayaking</span>
                    </CardTitle>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/side-quests/rock-climbing">
              <Card className="transition-all hover:bg-accent/50">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mountain className="h-4 w-4" />
                      <span>Rock Climbing</span>
                    </CardTitle>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/side-quests/cliff-jumping">
              <Card className="transition-all hover:bg-accent/50">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Droplet className="h-4 w-4" />
                      <span>Cliff Jumping</span>
                    </CardTitle>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* Add a quick link to hiking */}
          <Link href="/hiking">
            <Button className="w-full gap-2 mt-4">
              <Mountain className="h-4 w-4" />
              <span>Go Hiking</span>
            </Button>
          </Link>

          {/* Recent Adventures Preview */}
          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium">Recent Adventures</h3>
            <Link href="/adventure-feed">
              <Card className="transition-all hover:bg-accent/50">
                <CardHeader className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-xs text-muted-foreground">2h ago</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <p className="text-sm line-clamp-2">Just completed an amazing hike at Mount Rainier! The views were breathtaking and the weather was perfect.</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Mountain className="h-3 w-3" />
                    <span>Hiking • 8.2 miles</span>
                  </div>
                </CardContent>
                <CardFooter className="px-3 pb-3 pt-0 flex gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>24</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>5</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
            <Link href="/adventure-feed">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all adventures
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold">Nearby Trails</h2>
          <Button variant="ghost" size="sm" className="gap-1 w-full sm:w-auto">
            <MapPin className="h-4 w-4" />
            <span>Change Location</span>
          </Button>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[250px] sm:h-[350px] md:h-[400px] w-full">
              <MapComponent />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Recommendations */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold">Recommendations</h2>
          <Button variant="outline" size="sm" className="gap-1 border-primary/50 text-primary w-full sm:w-auto">
            <Crown className="h-4 w-4" />
            <span>Upgrade to Premium</span>
          </Button>
        </div>

        <Tabs defaultValue="trails">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="trails">Trails</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="trails" className="mt-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2 px-4 sm:px-6">
                  <CardTitle className="text-base">Eagle Peak Trail</CardTitle>
                  <CardDescription>Moderate • 6.2 miles</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 px-4 sm:px-6">
                  <div className="aspect-video w-full rounded-md bg-muted/50 overflow-hidden">
                    <MapComponent />
                  </div>
                </CardContent>
                <CardFooter className="px-4 sm:px-6">
                  <Button size="sm" variant="outline" className="w-full">
                    View Trail
                  </Button>
                </CardFooter>
              </Card>

              {/* Locked Premium Content */}
              <Card className="border-dashed opacity-70">
                <CardHeader className="pb-2 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Hidden Valley Loop</CardTitle>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>Easy • 3.8 miles</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 px-4 sm:px-6">
                  <div className="aspect-video w-full rounded-md bg-muted/50 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="text-center">
                        <Crown className="h-8 w-8 mx-auto text-primary/70" />
                        <p className="text-sm font-medium mt-2">Premium Feature</p>
                      </div>
                    </div>
                    <MapComponent/>
                  </div>
                </CardContent>
                <CardFooter className="px-4 sm:px-6">
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    <Lock className="mr-2 h-3 w-3" />
                    <span>Premium Only</span>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-dashed opacity-70 hidden sm:block lg:hidden">
                <CardHeader className="pb-2 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Sunset Ridge</CardTitle>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>Hard • 8.5 miles</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 px-4 sm:px-6">
                  <div className="aspect-video w-full rounded-md bg-muted/50 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="text-center">
                        <Crown className="h-8 w-8 mx-auto text-primary/70" />
                        <p className="text-sm font-medium mt-2">Premium Feature</p>
                      </div>
                    </div>
                    <MapComponent/>
                  </div>
                </CardContent>
                <CardFooter className="px-4 sm:px-6">
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    <Lock className="mr-2 h-3 w-3" />
                    <span>Premium Only</span>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-dashed opacity-70 lg:block hidden">
                <CardHeader className="pb-2 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Sunset Ridge</CardTitle>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>Hard • 8.5 miles</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 px-4 sm:px-6">
                  <div className="aspect-video w-full rounded-md bg-muted/50 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="text-center">
                        <Crown className="h-8 w-8 mx-auto text-primary/70" />
                        <p className="text-sm font-medium mt-2">Premium Feature</p>
                      </div>
                    </div>
                    <MapComponent/>
                  </div>
                </CardContent>
                <CardFooter className="px-4 sm:px-6">
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    <Lock className="mr-2 h-3 w-3" />
                    <span>Premium Only</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <div className="flex items-center justify-center h-40 border rounded-md">
              <div className="text-center px-4">
                <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Premium feature</p>
                <Button variant="outline" size="sm" className="mt-4 gap-1 border-primary/50 text-primary">
                  <Crown className="h-4 w-4" />
                  <span>Upgrade to Premium</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="groups" className="mt-4">
            <div className="flex items-center justify-center h-40 border rounded-md">
              <div className="text-center px-4">
                <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Premium feature</p>
                <Button variant="outline" size="sm" className="mt-4 gap-1 border-primary/50 text-primary">
                  <Crown className="h-4 w-4" />
                  <span>Upgrade to Premium</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  )
}
