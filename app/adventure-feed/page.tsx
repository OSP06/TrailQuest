"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Award,
  ChevronDown,
  Compass,
  Filter,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Mountain,
  PlusCircle,
  Search,
  Share2,
  Waves,
  Droplet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreatePostDialog } from "@/components/create-post-dialog"

// Sample adventure posts data
const adventurePosts = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      username: "trailblazer42",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "2 hours ago",
    content:
      "Just conquered Mount Si today! The views from the top were absolutely breathtaking. Definitely worth the climb. #MountainMonday #TrailQuest",
    adventure: {
      type: "Hiking",
      location: "Mount Si, North Bend, WA",
      stats: {
        distance: "8 miles",
        elevation: "3,150 ft",
        time: "3h 45m",
      },
      badges: ["Summit Seeker"],
    },
    images: ["/placeholder.svg?height=400&width=600"],
    likes: 42,
    comments: 7,
    liked: false,
  },
  {
    id: 2,
    user: {
      name: "Jamie Chen",
      username: "peakseeker",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "Yesterday",
    content:
      "Sent my first V5 at the climbing gym today! Been working on this problem for weeks. The crux move was a tricky heel hook to a sloper. So stoked! #RockClimbing #Bouldering",
    adventure: {
      type: "Rock Climbing",
      location: "Seattle Bouldering Project",
      stats: {
        grade: "V5",
        style: "Bouldering",
        attempts: "12",
      },
      badges: ["Boulder Crusher"],
    },
    images: ["/placeholder.svg?height=400&width=600"],
    likes: 38,
    comments: 5,
    liked: true,
  },
  {
    id: 3,
    user: {
      name: "Taylor Smith",
      username: "hikerpro",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "3 days ago",
    content:
      "Epic day kayaking on Lake Washington! Perfect weather and calm waters. Spotted some seals and even an eagle. Can't wait to go back! #Kayaking #PaddleLife",
    adventure: {
      type: "Kayaking",
      location: "Lake Washington, Seattle, WA",
      stats: {
        distance: "5.2 miles",
        time: "2h 15m",
        waterCondition: "Calm",
      },
      badges: ["Lake Voyager"],
    },
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    likes: 29,
    comments: 3,
    liked: false,
  },
  {
    id: 4,
    user: {
      name: "Jordan Patel",
      username: "trailrunner",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: "1 week ago",
    content:
      "Cliff jumping at Blue Lake today was INSANE! 30ft drop and the water was perfect. Managed to pull off a backflip on the last jump! #CliffJumping #Adrenaline",
    adventure: {
      type: "Cliff Jumping",
      location: "Blue Lake, WA",
      stats: {
        height: "30 ft",
        jumps: "5",
        waterTemp: "68°F",
      },
      badges: ["Adrenaline Seeker"],
    },
    images: ["/placeholder.svg?height=400&width=600"],
    likes: 56,
    comments: 12,
    liked: false,
  },
]

export default function AdventureFeedPage() {
  const router = useRouter()
  const [posts, setPosts] = useState(adventurePosts)
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [expandedComments, setExpandedComments] = useState<number | null>(null)

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        }
        return post
      }),
    )
  }

  const handleComment = (postId: number) => {
    if (!commentText.trim()) return

    // In a real app, this would send the comment to an API
    alert(`Comment submitted: ${commentText}`)
    setCommentText("")
  }

  const toggleComments = (postId: number) => {
    setExpandedComments(expandedComments === postId ? null : postId)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Hiking":
        return <Mountain className="h-4 w-4 text-primary" />
      case "Rock Climbing":
        return <Mountain className="h-4 w-4 text-orange-500" />
      case "Kayaking":
        return <Waves className="h-4 w-4 text-blue-500" />
      case "Cliff Jumping":
        return <Droplet className="h-4 w-4 text-cyan-500" />
      default:
        return <Compass className="h-4 w-4" />
    }
  }

  return (
    <div className="container px-4 sm:px-6 max-w-screen-xl space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Adventure Feed</h1>
          <p className="text-muted-foreground">See what other adventurers are up to</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setCreatePostOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          <span>Share Adventure</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search adventures..." className="pl-9" />
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Feed Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-initial">
            All Adventures
          </TabsTrigger>
          <TabsTrigger value="following" className="flex-1 sm:flex-initial">
            Following
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex-1 sm:flex-initial">
            Nearby
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex-1 sm:flex-initial">
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="px-4 sm:px-6 pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{post.user.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>@{post.user.username}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Follow User</DropdownMenuItem>
                      <DropdownMenuItem>Save Post</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 space-y-3">
                {/* Post content */}
                <p className="text-sm">{post.content}</p>

                {/* Adventure details */}
                <div className="bg-muted/50 rounded-md p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    {getActivityIcon(post.adventure.type)}
                    <span className="font-medium">{post.adventure.type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{post.adventure.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(post.adventure.stats).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                      </Badge>
                    ))}
                  </div>
                  {post.adventure.badges && post.adventure.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {post.adventure.badges.map((badge) => (
                        <Badge key={badge} className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                          <Award className="h-3 w-3" />
                          <span>{badge}</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {post.images.map((image, index) => (
                      <div key={index} className="rounded-md overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Adventure by ${post.user.name}`}
                          className="w-full h-auto object-cover aspect-video"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Interaction stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1">
                    <Heart className={`h-4 w-4 ${post.liked ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 sm:px-6 pt-0 flex flex-col">
                <div className="flex w-full border-t pt-3 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex-1 gap-1 ${post.liked ? "text-red-500" : ""}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 ${post.liked ? "fill-red-500" : ""}`} />
                    <span>Like</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={() => toggleComments(post.id)}>
                    <MessageCircle className="h-4 w-4" />
                    <span>Comment</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>

                {/* Comments section */}
                {expandedComments === post.id && (
                  <div className="w-full mt-3 space-y-3">
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                        <AvatarFallback>YO</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Textarea
                          placeholder="Add a comment..."
                          className="min-h-[40px] flex-1"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Button
                          size="sm"
                          className="self-end"
                          onClick={() => handleComment(post.id)}
                          disabled={!commentText.trim()}
                        >
                          Post
                        </Button>
                      </div>
                    </div>

                    {/* Sample comments */}
                    <div className="space-y-3 pt-2">
                      <div className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Commenter" />
                          <AvatarFallback>CM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-md p-2">
                            <div className="font-medium text-sm">Sarah Hiker</div>
                            <p className="text-sm">Looks amazing! I've been wanting to try that route.</p>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <button className="hover:text-primary">Like</button>
                            <button className="hover:text-primary">Reply</button>
                            <span>2h ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Commenter" />
                          <AvatarFallback>CM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-md p-2">
                            <div className="font-medium text-sm">Mike Climber</div>
                            <p className="text-sm">Great job! What was the weather like?</p>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <button className="hover:text-primary">Like</button>
                            <button className="hover:text-primary">Reply</button>
                            <span>1h ago</span>
                          </div>
                        </div>
                      </div>
                      {post.comments > 2 && (
                        <Button variant="ghost" size="sm" className="text-xs w-full">
                          View all {post.comments} comments
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">Follow more adventurers to see their posts here</p>
          </div>
        </TabsContent>

        <TabsContent value="nearby" className="mt-6">
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">Enable location to see adventures near you</p>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">Trending adventures will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Post Dialog */}
      <CreatePostDialog open={createPostOpen} onOpenChange={setCreatePostOpen} />
    </div>
  )
}

