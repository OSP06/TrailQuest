import { Award, Globe, MapPin, Mountain, Search, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LeaderboardPage() {
  // Sample leaderboard data
  const users = [
    {
      id: 1,
      name: "Alex Johnson",
      username: "trailblazer42",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 24,
      xp: 24850,
      miles: 342,
      elevation: 28500,
      rank: 1,
      badges: ["Summit Master", "Ultra Hiker"],
    },
    {
      id: 2,
      name: "Sam Rivera",
      username: "mountaingoat",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 22,
      xp: 22340,
      miles: 315,
      elevation: 26200,
      rank: 2,
      badges: ["Trail Legend", "Elevation King"],
    },
    {
      id: 3,
      name: "Jamie Chen",
      username: "peakseeker",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 20,
      xp: 20120,
      miles: 298,
      elevation: 24800,
      rank: 3,
      badges: ["Distance Demon"],
    },
    {
      id: 4,
      name: "Taylor Smith",
      username: "hikerpro",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 18,
      xp: 18650,
      miles: 276,
      elevation: 22100,
      rank: 4,
      badges: ["Weekend Warrior"],
    },
    {
      id: 5,
      name: "Jordan Patel",
      username: "trailrunner",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 16,
      xp: 16200,
      miles: 245,
      elevation: 19500,
      rank: 5,
      badges: ["Early Bird"],
    },
    {
      id: 6,
      name: "You",
      username: "trailblazer",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 12,
      xp: 12450,
      miles: 248,
      elevation: 15200,
      rank: 12,
      badges: ["Summit Seeker"],
      isCurrentUser: true,
    },
  ]

  return (
    <div className="container px-4 sm:px-6 max-w-screen-xl space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other adventurers</p>
      </div>

      {/* Leaderboard Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Rank</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold">#12</div>
            <p className="text-xs text-muted-foreground">Top 5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">XP to Next Rank</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold">1,250 XP</div>
            <p className="text-xs text-muted-foreground">To reach #11</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Change</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold text-green-500">↑ 3</div>
            <p className="text-xs text-muted-foreground">Moved up 3 positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Competitors</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold">2,458</div>
            <p className="text-xs text-muted-foreground">Active this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="global">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="global" className="flex-1 sm:flex-initial gap-1">
              <Globe className="h-4 w-4" />
              <span>Global</span>
            </TabsTrigger>
            <TabsTrigger value="local" className="flex-1 sm:flex-initial gap-1">
              <MapPin className="h-4 w-4" />
              <span>Local</span>
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex-1 sm:flex-initial gap-1">
              <Users className="h-4 w-4" />
              <span>Friends</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Find user..." className="pl-9 w-full sm:w-[200px]" />
            </div>
            <Select defaultValue="xp">
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xp">XP</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="elevation">Elevation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="global" className="mt-6">
          <Card>
            <CardHeader className="pb-0 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">Global Rankings</CardTitle>
              <CardDescription>Based on total XP earned</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                        Level
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">XP</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground hidden sm:table-cell">
                        Miles
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground hidden lg:table-cell">
                        Elevation
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                        Badges
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className={`border-b ${user.isCurrentUser ? "bg-muted/50" : ""}`}>
                        <td className="px-4 py-3 text-sm">
                          {user.rank <= 3 ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Award
                                className={`h-4 w-4 ${
                                  user.rank === 1
                                    ? "text-yellow-500"
                                    : user.rank === 2
                                      ? "text-gray-400"
                                      : "text-amber-700"
                                }`}
                              />
                            </div>
                          ) : (
                            <span>{user.rank}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="outline" className="gap-1">
                            <Mountain className="h-3 w-3" />
                            <span>Lvl {user.level}</span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">{user.xp.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right hidden sm:table-cell">{user.miles}</td>
                        <td className="px-4 py-3 text-right hidden lg:table-cell">
                          {user.elevation.toLocaleString()} ft
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {user.badges.map((badge) => (
                              <Badge key={badge} variant="secondary" className="gap-1">
                                <Award className="h-3 w-3" />
                                <span>{badge}</span>
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="mt-6">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">Local Rankings</CardTitle>
              <CardDescription>Hikers in your area (25 mile radius)</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40 px-4 sm:px-6">
              <p className="text-muted-foreground">Local leaderboard data</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">Friends Rankings</CardTitle>
              <CardDescription>See how you compare to your friends</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40 px-4 sm:px-6">
              <p className="text-muted-foreground">Friends leaderboard data</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

