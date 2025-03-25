"use client"

import { useState } from "react"
import { Award, Calendar, Filter, Mountain, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogAdventureDialog } from "../../components/log-adventure-dialog"

export default function AdventureLogPage() {
  // Add this state for the dialog
  const [logDialogOpen, setLogDialogOpen] = useState(false)

  // Sample adventure data
  const adventures = [
    {
      id: 1,
      title: "Mount Rainier Summit",
      date: "May 15, 2023",
      distance: "12.5 miles",
      elevation: "5,400 ft",
      difficulty: "Hard",
      description: "Reached the summit of Mount Rainier. Incredible views from the top!",
      images: ["/placeholder.svg?height=200&width=400"],
      badges: ["Summit Seeker", "5000+ Elevation"],
    },
    {
      id: 2,
      title: "Cascade Loop Trail",
      date: "April 22, 2023",
      distance: "8.2 miles",
      elevation: "1,200 ft",
      difficulty: "Moderate",
      description: "Beautiful spring hike with wildflowers blooming everywhere.",
      images: ["/placeholder.svg?height=200&width=400"],
      badges: ["Trail Explorer"],
    },
    {
      id: 3,
      title: "Lake Serene",
      date: "March 10, 2023",
      distance: "7.5 miles",
      elevation: "2,000 ft",
      difficulty: "Moderate",
      description: "Hiked to Lake Serene. Still some snow on the trail but the lake was partially thawed.",
      images: ["/placeholder.svg?height=200&width=400"],
      badges: ["Winter Warrior"],
    },
  ]

  return (
    <div className="container px-4 sm:px-6 max-w-screen-xl space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Adventure Log</h1>
          <p className="text-muted-foreground">Track and view your hiking adventures</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setLogDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Log New Adventure</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search adventures..." className="pl-9" />
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="sm:hidden flex-1 gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Adventure Badges */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold">Your Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge className="gap-1 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">
            <Award className="h-3 w-3" />
            <span>Summit Seeker</span>
          </Badge>
          <Badge className="gap-1 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
            <Award className="h-3 w-3" />
            <span>Trail Explorer</span>
          </Badge>
          <Badge className="gap-1 bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30">
            <Award className="h-3 w-3" />
            <span>Winter Warrior</span>
          </Badge>
          <Badge className="gap-1 bg-green-500/20 text-green-500 hover:bg-green-500/30">
            <Award className="h-3 w-3" />
            <span>5000+ Elevation</span>
          </Badge>
          <Badge className="gap-1 bg-muted text-muted-foreground hover:bg-muted/80">
            <Award className="h-3 w-3" />
            <span>10+ More</span>
          </Badge>
        </div>
      </div>

      {/* Adventure Timeline */}
      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-initial">
              All Adventures
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex-1 sm:flex-initial">
              Recent
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1 sm:flex-initial">
              Favorites
            </TabsTrigger>
          </TabsList>
          <div className="mt-2 sm:mt-0">
            <Select defaultValue="newest">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="distance">Distance (High to Low)</SelectItem>
                <SelectItem value="elevation">Elevation (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6 space-y-6">
          {adventures.map((adventure) => (
            <Card key={adventure.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-48 md:h-auto">
                  <img
                    src={adventure.images[0] || "/placeholder.svg"}
                    alt={adventure.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader className="px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <CardTitle className="text-lg sm:text-xl">{adventure.title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {adventure.date}
                      </div>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="gap-1">
                          <Mountain className="h-3 w-3" />
                          {adventure.distance}
                        </Badge>
                        <Badge variant="outline">{adventure.elevation}</Badge>
                        <Badge
                          variant="outline"
                          className={
                            adventure.difficulty === "Easy"
                              ? "border-green-500 text-green-500"
                              : adventure.difficulty === "Moderate"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-red-500 text-red-500"
                          }
                        >
                          {adventure.difficulty}
                        </Badge>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <p className="text-sm">{adventure.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {adventure.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="gap-1">
                          <Award className="h-3 w-3" />
                          <span>{badge}</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 px-4 sm:px-6">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Share
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">Showing only recent adventures</p>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">Showing only favorite adventures</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add the LogAdventureDialog at the end of the component */}
      <LogAdventureDialog open={logDialogOpen} onOpenChange={setLogDialogOpen} />
    </div>
  )
}
