"use client"
import { useRouter } from "next/navigation"
import { Award, ChevronRight, Filter, MapPin, Search, Waves } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapComponent } from "@/components/map-component"

export default function KayakingQuestPage() {
  const router = useRouter()
  // Sample kayaking quests
  const quests = [
    {
      id: 1,
      title: "River Explorer",
      description: "Kayak 3 different rivers in your region",
      progress: 1,
      total: 3,
      reward: "400 XP + River Explorer Badge",
      locations: ["Cedar River"],
    },
    {
      id: 2,
      title: "Lake Voyager",
      description: "Kayak on 5 different lakes",
      progress: 2,
      total: 5,
      reward: "500 XP + Lake Voyager Badge",
      locations: ["Lake Washington", "Lake Sammamish"],
    },
  ]

  // Sample kayaking locations
  const locations = [
    {
      id: 1,
      name: "Lake Union",
      type: "Lake",
      difficulty: "Easy",
      features: ["Rentals Available", "Parking", "Restrooms"],
      location: "Seattle, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      name: "Snoqualmie River",
      type: "River",
      difficulty: "Moderate",
      features: ["Rapids", "Scenic Views"],
      location: "Fall City, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      name: "Puget Sound",
      type: "Ocean/Bay",
      difficulty: "Moderate-Hard",
      features: ["Wildlife", "Island Access"],
      location: "Seattle, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="container max-w-screen-xl space-y-8 py-6 md:py-10 relative">
      <BackButton className="mt-4" path="/main" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kayaking Quests</h1>
          <p className="text-muted-foreground">Complete quests to earn XP and badges</p>
        </div>
        <Button className="gap-2" onClick={() => router.push("/track/tracking_kayaking")}>
          <Waves className="h-4 w-4" />
          <span>Start Kayaking</span>
        </Button>
      </div>

      {/* Active Quests */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Quests</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quests.map((quest) => (
            <Card key={quest.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  {quest.title}
                </CardTitle>
                <CardDescription>{quest.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Kayaking Locations Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nearby Kayaking Spots</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[400px] w-full">
              <MapComponent />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Locations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recommended Spots</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search locations..." className="pl-9 w-[200px]" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id}>
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{location.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{location.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">{location.type}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      location.difficulty === "Easy"
                        ? "border-green-500 text-green-500"
                        : location.difficulty === "Moderate"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-red-500 text-red-500"
                    }
                  >
                    {location.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {location.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Start Tracking
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips and Safety */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Kayaking Tips & Safety</h2>
        <Card>
          <CardHeader>
            <CardTitle>Essential Safety Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Before You Go</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Check weather conditions</li>
                  <li>Inform someone of your plans</li>
                  <li>Bring proper safety equipment</li>
                  <li>Know your skill level</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">On the Water</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Always wear a life jacket</li>
                  <li>Stay hydrated</li>
                  <li>Be aware of changing conditions</li>
                  <li>Know how to self-rescue</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View Full Safety Guide
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
