import { Award, ChevronRight, Filter, MapPin, Droplet, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapComponent } from "@/components/map-component"

export default function CliffJumpingQuestPage() {
  // Sample cliff jumping quests
  const quests = [
    {
      id: 1,
      title: "Adrenaline Seeker",
      description: "Jump from 5 different cliff locations",
      progress: 2,
      total: 5,
      reward: "600 XP + Adrenaline Seeker Badge",
      locations: ["Blue Lake Cliff", "Emerald Cove"],
    },
    {
      id: 2,
      title: "Height Master",
      description: "Complete a jump from a 30+ foot cliff",
      progress: 0,
      total: 1,
      reward: "800 XP + Height Master Badge",
      locations: [],
    },
  ]

  // Sample cliff jumping locations
  const locations = [
    {
      id: 1,
      name: "Blue Lake Cliff",
      height: "20 ft",
      difficulty: "Moderate",
      features: ["Deep Water", "Clear Landing", "Popular Spot"],
      location: "Blue Lake, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      name: "Emerald Cove",
      height: "15 ft",
      difficulty: "Easy",
      features: ["Beginner Friendly", "Multiple Heights", "Scenic Views"],
      location: "Emerald Cove, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      name: "Thunder Rock",
      height: "35 ft",
      difficulty: "Hard",
      features: ["Advanced Only", "Deep Water", "Remote Location"],
      location: "Thunder Bay, WA",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="container px-4 sm:px-6 max-w-screen-xl space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cliff Jumping Quests</h1>
          <p className="text-muted-foreground">Complete quests to earn XP and badges</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Droplet className="h-4 w-4" />
          <span>Log Jump</span>
        </Button>
      </div>

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
              <CardFooter className="px-4 sm:px-6">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Cliff Jumping Locations Map */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Jumping Spots</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[250px] sm:h-[350px] md:h-[400px] w-full">
              <MapComponent />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Locations */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold">Popular Jumping Spots</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search spots..." className="pl-9 w-full sm:w-[200px]" />
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
          {locations.map((location) => (
            <Card key={location.id}>
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-2 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">{location.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{location.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 px-4 sm:px-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{location.height}</Badge>
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
                <div className="flex flex-wrap gap-1 mt-2">
                  {location.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 px-4 sm:px-6">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Log Jump
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety Guidelines */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Safety Guidelines</h2>
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Essential Safety Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Before You Jump</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Always check water depth before jumping</li>
                  <li>Scout the landing area for obstacles</li>
                  <li>Never jump alone</li>
                  <li>Know your skill level</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">During the Jump</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Jump feet first for your first attempt</li>
                  <li>Keep your body straight and arms at your sides</li>
                  <li>Look forward, not down</li>
                  <li>Exhale through your nose when entering water</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-4 sm:px-6">
            <Button variant="outline" size="sm">
              View Full Safety Guide
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

