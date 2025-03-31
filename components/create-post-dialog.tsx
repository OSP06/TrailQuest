"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, MapPin, Mountain, Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [content, setContent] = useState("")
  const [activityType, setActivityType] = useState("Hiking")
  const [location, setLocation] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stats, setStats] = useState<{ [key: string]: string }>({
    distance: "",
    elevation: "",
    time: "",
  })
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      // Create the adventure post
      const postResponse = await fetch('/api/adventure-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${activityType} Adventure`,
          description: content,
          activityType,
          location
        })
      })

      if (!postResponse.ok) {
        throw new Error('Failed to create post')
      }

      const post = await postResponse.json()

      // Upload photos if any
      if (photos.length > 0) {
        for (const photo of photos) {
          const blob = await fetch(photo).then(r => r.blob())
          const formData = new FormData()
          formData.append('file', blob)
          formData.append('postId', post.id)

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image')
          }
        }
      }

      // Reset form
      setContent("")
      setActivityType("Hiking")
      setLocation("")
      setPhotos([])
      setStats({
        distance: "",
        elevation: "",
        time: "",
      })

      // Close dialog
      onOpenChange(false)

      // Show success message
      toast({
        title: "Adventure shared!",
        description: "Your adventure has been posted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share your adventure. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setPhotos((prev) => [...prev, ...newPhotos])
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const updateStat = (key: string, value: string) => {
    setStats((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Get activity-specific stats fields
  const getStatsFields = () => {
    switch (activityType) {
      case "Hiking":
        return (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (mi)</Label>
                <Input
                  id="distance"
                  value={stats.distance}
                  onChange={(e) => updateStat("distance", e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="elevation">Elevation (ft)</Label>
                <Input
                  id="elevation"
                  value={stats.elevation}
                  onChange={(e) => updateStat("elevation", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={stats.time}
                  onChange={(e) => updateStat("time", e.target.value)}
                  placeholder="0h 0m"
                />
              </div>
            </div>
          </>
        )
      case "Rock Climbing":
        return (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={stats.grade || ""}
                  onChange={(e) => updateStat("grade", e.target.value)}
                  placeholder="V3 / 5.10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={stats.style || "Bouldering"} onValueChange={(value) => updateStat("style", value)}>
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bouldering">Bouldering</SelectItem>
                    <SelectItem value="Sport">Sport</SelectItem>
                    <SelectItem value="Trad">Trad</SelectItem>
                    <SelectItem value="Top Rope">Top Rope</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attempts">Attempts</Label>
                <Input
                  id="attempts"
                  value={stats.attempts || ""}
                  onChange={(e) => updateStat("attempts", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </>
        )
      case "Kayaking":
        return (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (mi)</Label>
                <Input
                  id="distance"
                  value={stats.distance}
                  onChange={(e) => updateStat("distance", e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={stats.time}
                  onChange={(e) => updateStat("time", e.target.value)}
                  placeholder="0h 0m"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterCondition">Water Condition</Label>
                <Select
                  value={stats.waterCondition || "Calm"}
                  onValueChange={(value) => updateStat("waterCondition", value)}
                >
                  <SelectTrigger id="waterCondition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Calm">Calm</SelectItem>
                    <SelectItem value="Choppy">Choppy</SelectItem>
                    <SelectItem value="Wavy">Wavy</SelectItem>
                    <SelectItem value="Rough">Rough</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )
      case "Cliff Jumping":
        return (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (ft)</Label>
                <Input
                  id="height"
                  value={stats.height || ""}
                  onChange={(e) => updateStat("height", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jumps">Jumps</Label>
                <Input
                  id="jumps"
                  value={stats.jumps || ""}
                  onChange={(e) => updateStat("jumps", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterTemp">Water Temp (°F)</Label>
                <Input
                  id="waterTemp"
                  value={stats.waterTemp || ""}
                  onChange={(e) => updateStat("waterTemp", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Your Adventure</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 flex-1 overflow-y-auto">
          <Textarea
            placeholder="What was your adventure like? Share the details..."
            className="min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="activity-type">Activity Type</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger id="activity-type">
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hiking">Hiking</SelectItem>
                    <SelectItem value="Rock Climbing">Rock Climbing</SelectItem>
                    <SelectItem value="Kayaking">Kayaking</SelectItem>
                    <SelectItem value="Cliff Jumping">Cliff Jumping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Where was your adventure?"
                    className="flex-1"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Activity-specific stats */}
            <div className="space-y-2">
              <Label>Activity Stats</Label>
              {getStatsFields()}
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Adventure photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer">
                  <Camera className="h-6 w-6 mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Photos</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-2">
              <Label>Badges Earned</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                  <Mountain className="h-3 w-3" />
                  <span>Summit Seeker</span>
                </Badge>
                <Button variant="outline" size="sm" className="h-6 gap-1 text-xs">
                  <Plus className="h-3 w-3" />
                  <span>Add Badge</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? "Sharing..." : "Share Adventure"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
