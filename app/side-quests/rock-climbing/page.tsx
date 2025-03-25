import { Award, ChevronRight, Filter, MapPin, Mountain, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapComponent } from "@/components/map-component"

export default function RockClimbingQuestPage() {
  // Sample rock climbing quests
  const quests = [
    {
      id: 1,
      title: "Boulder Crusher",
      description: "Complete 10 boulder problems of any grade",
      progress: 4,
      total: 10,
      reward: "450 XP + Boulder Crusher Badge",
      locations: ["Index", "Leavenworth", "Little Si", "Exit 38"],
    },
    {
      id: 2,
      title: "Route Master",
      description: "Climb 5 different sport routes",
      progress: 2,
      total: 5,
      reward: "500 XP + Route Master Badge",
      locations: ["Index - Lower Town Wall", "Exit 38 - Deception Crags"],
    },
  ]

  // Sample climbing locations
  const locations = [
    {
      id: 1,
      name: "Index",
      type: "Sport & Trad",
      difficulty: "Moderate-Hard",
      features: ["Granite", "Multi-pitch", "Classic Routes"],
      location: "Index, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      name: "Leavenworth",
      type: "Bouldering",
      difficulty: "All Levels",
      features: ["Granite", "Many Problems", "Scenic"],
      location: "Leavenworth, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      name: "Exit 38",
      type: "Sport",
      difficulty: "Beginner-Intermediate",
      features: ["Sandstone", "Easy Access", "Good for Beginners"],
      location: "North Bend, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="container max-w-screen-xl space-y-8 py-6 md:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rock Climbing Quests</h1>
          <p className="text-muted-foreground">Complete quests to earn XP and badges</p>
        </div>
        <Button className="gap-2">
          <Mountain className="h-4 w-4" />
          <span>Log Climb</span>
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
                    <p className="text-sm font-medium">Completed at:</p>
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

      {/* Climbing Locations Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Climbing Areas</h2>
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
          <h2 className="text-xl font-semibold">Popular Climbing Spots</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search areas..." className="pl-9 w-[200px]" />
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
                      location.difficulty.includes("Beginner")
                        ? "border-green-500 text-green-500"
                        : location.difficulty.includes("Intermediate")
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
                  View Routes
                </Button>
                <Button variant="outline" size="sm">
                  Log Climb
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Climbing Grades */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Climbing Grades Reference</h2>
        <Card>
          <CardHeader>
            <CardTitle>Grading Systems</CardTitle>
            <CardDescription>Reference for common climbing grade conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Bouldering (V Scale)</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">V0-V2:</span> Beginner
                  </p>
                  <p>
                    <span className="font-medium">V3-V5:</span> Intermediate
                  </p>
                  <p>
                    <span className="font-medium">V6-V8:</span> Advanced
                  </p>
                  <p>
                    <span className="font-medium">V9+:</span> Expert
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Sport/Trad (YDS)</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">5.5-5.8:</span> Beginner
                  </p>
                  <p>
                    <span className="font-medium">5.9-5.10:</span> Intermediate
                  </p>
                  <p>
                    <span className="font-medium">5.11-5.12:</span> Advanced
                  </p>
                  <p>
                    <span className="font-medium">5.13+:</span> Expert
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

