"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { Award, ChevronRight, Filter, MapPin, Mountain, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapComponent } from "@/components/map-component"
import { LogAdventureDialog } from "@/components/log-adventure-dialog"
import { TrailDetailsDialog } from "@/components/trail-details-dialog"

export default function HikingQuestPage() {
  const router = useRouter()
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  interface Trail {
    id: number
    name: string
    distance: number
    elevation: number
    difficulty: string
    location: string
    image: string
    averageTime: number
    description?: string
    reward?: string
    progress?: string
    locations?: string[]
  }

  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)
  
  // Sample hiking quests
  const quests = [
    {
      id: 1,
      title: "Summit Seeker",
      description: "Reach the summit of 5 different mountains",
      progress: 3,
      total: 5,
      reward: "500 XP + Summit Seeker Badge",
      locations: ["Mount Rainier", "Mount Si", "Tiger Mountain"],
    },
    {
      id: 2,
      title: "Trail Explorer",
      description: "Hike 10 different trails in your region",
      progress: 7,
      total: 10,
      reward: "750 XP + Trail Explorer Badge",
      locations: [
        "Cascade Loop",
        "Lake Serene",
        "Wallace Falls",
        "Twin Falls",
        "Rattlesnake Ledge",
        "Poo Poo Point",
        "Snow Lake",
      ],
    },
    {
      id: 3,
      title: "Elevation Master",
      description: "Gain a total of 10,000 ft elevation",
      progress: 6500,
      total: 10000,
      reward: "1000 XP + Elevation Master Badge",
      locations: [],
    },
  ]

  // Sample nearby trails
  const trails = [
    {
      id: 1,
      name: "Mount Si",
      distance: 8.0,
      elevation: 3150,
      difficulty: "Moderate",
      location: "North Bend, WA",
      image: "/placeholder.svg?height=200&width=400",
      averageTime: 240 // minutes
    },
    {
      id: 2,
      name: "Rattlesnake Ledge",
      distance: 4.0,
      elevation: 1160,
      difficulty: "Easy",
      location: "North Bend, WA",
      image: "/placeholder.svg?height=200&width=400",
      averageTime: 120 // minutes
    },
    {
      id: 3,
      name: "Mailbox Peak",
      distance: 9.4,
      elevation: 4000,
      difficulty: "Hard",
      location: "North Bend, WA",
      image: "/placeholder.svg?height=200&width=400",
      averageTime: 360 // minutes
    },
  ]

  return (
    <div className="container px-4 sm:px-6 max-w-screen-xl space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hiking</h1>
          <p className="text-muted-foreground">Discover trails, track your progress, and earn rewards</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => router.push('/track/tracking_hiking')}>
          <Mountain className="h-4 w-4" />
          <span>Start Hiking</span>
        </Button>
      </div>

      <LogAdventureDialog open={logDialogOpen} onOpenChange={setLogDialogOpen} />
      <TrailDetailsDialog 
        open={!!selectedTrail}
        onOpenChange={(open) => !open && setSelectedTrail(null)}
        trail={selectedTrail}
      />

      {/* Active Quests */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Active Quests</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {quests.map((quest) => (
            <Card key={quest.id}>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  {quest.title}
                </CardTitle>
                <CardDescription>{quest.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {quest.progress} / {quest.total}
                    </span>
                  </div>
                  <Progress value={(quest.progress / quest.total) * 100} className="h-2" />
                </div>

                {quest.locations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Completed:</p>
                    <div className="flex flex-wrap gap-2">
                      {quest.locations.map((location, index) => (
                        <Badge key={index} variant="outline" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{location}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-md bg-muted p-2 text-sm">
                  <span className="font-medium">Reward:</span> {quest.reward}
                </div>
              </CardContent>
              <CardFooter className="px-4 sm:px-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-1"
                  onClick={() => setSelectedTrail({
                    id: quest.id,
                    name: quest.title,
                    distance: 0,
                    elevation: 0,
                    difficulty: "",
                    location: "",
                    image: "/placeholder.svg",
                    averageTime: 0,
                    description: quest.description,
                    reward: quest.reward,
                    progress: `${quest.progress}/${quest.total}`,
                    locations: quest.locations
                  })}
                >
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Nearby Trails Map */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Nearby Trails</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[250px] sm:h-[350px] md:h-[400px] w-full">
              <MapComponent />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Trails */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold">Recommended Trails</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search trails..." className="pl-9 w-full sm:w-[200px]" />
            </div>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="sm:hidden gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {trails.map((trail) => (
            <Card key={trail.id}>
              <div className="aspect-video w-full overflow-hidden">
                <MapComponent />
              </div>
              <CardHeader className="pb-2 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">{trail.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{trail.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 px-4 sm:px-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{trail.distance} miles</Badge>
                  <Badge variant="outline">{trail.elevation} ft</Badge>
                  <Badge
                    variant="outline"
                    className={
                      trail.difficulty === "Easy"
                        ? "border-green-500 text-green-500"
                        : trail.difficulty === "Moderate"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-red-500 text-red-500"
                    }
                  >
                    {trail.difficulty}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 px-4 sm:px-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedTrail(trail)}
                >
                  View Trail
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => router.push('/track/tracking_hiking')}
                >
                  Start Hike
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Quests */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Completed Quests</h2>
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Winter Warrior</CardTitle>
            <CardDescription>Complete 5 hikes during winter months (Dec-Feb)</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Completed on January 15, 2023</p>
                <p className="text-sm text-muted-foreground">Reward: 750 XP + Winter Warrior Badge</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
