"use client"

import { useState } from "react"
import { Award, Heart, MapPin, MessageCircle, MoreHorizontal, Mountain, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdventurePostProps {
  post: {
    id: number
    user: {
      name: string
      username: string
      avatar: string
    }
    timestamp: string
    content: string
    adventure: {
      type: string
      location: string
      stats: {
        [key: string]: string
      }
      badges?: string[]
    }
    images?: string[]
    likes: number
    comments: number
    liked: boolean
  }
  expanded?: boolean
}

export function AdventurePost({ post, expanded = false }: AdventurePostProps) {
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [commentText, setCommentText] = useState("")
  const [showComments, setShowComments] = useState(expanded)

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setLiked(!liked)
  }

  const handleComment = () => {
    if (!commentText.trim()) return

    // In a real app, this would send the comment to an API
    alert(`Comment submitted: ${commentText}`)
    setCommentText("")
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Hiking":
        return <Mountain className="h-4 w-4 text-primary" />
      case "Rock Climbing":
        return <Mountain className="h-4 w-4 text-orange-500" />
      case "Kayaking":
        return <Mountain className="h-4 w-4 text-blue-500" />
      case "Cliff Jumping":
        return <Mountain className="h-4 w-4 text-cyan-500" />
      default:
        return <Mountain className="h-4 w-4" />
    }
  }

  return (
    <Card className="overflow-hidden">
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
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likeCount}</span>
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
            className={`flex-1 gap-1 ${liked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
            <span>Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>

        {/* Comments section */}
        {showComments && (
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
                <Button size="sm" className="self-end" onClick={handleComment} disabled={!commentText.trim()}>
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
  )
}

