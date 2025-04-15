"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface Trail {
  id: number
  name: string
  distance: number
  elevation: number
  difficulty: string
  location: string
  // image: string
  averageTime: number
  description?: string
  reward?: string
  progress?: string
  locations?: string[]
}

interface TrailDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trail: Trail | null
}

export function TrailDetailsDialog({ open, onOpenChange, trail }: TrailDetailsDialogProps) {
  if (!trail) {
    return null
  }

  const isQuest = !!trail.description && !!trail.reward

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{trail.name} Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isQuest ? (
            <>
              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm">{trail.description}</p>
              </div>

              {trail.progress && (
                <div className="space-y-2">
                  <Label>Progress</Label>
                  <Input value={trail.progress} readOnly />
                </div>
              )}

              {trail.reward && (
                <div className="space-y-2">
                  <Label>Reward</Label>
                  <Input value={trail.reward} readOnly />
                </div>
              )}

              {trail.locations && trail.locations.length > 0 && (
                <div className="space-y-2">
                  <Label>Completed Locations</Label>
                  <div className="flex flex-wrap gap-2">
                    {trail.locations.map((location, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{location}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Elevation Gain</Label>
                <Input value={`${trail.elevation.toFixed(2)} meters`} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Distance</Label>
                <Input value={`${trail.distance.toFixed(2)} km`} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Average Completion Time</Label>
                <Input value={`${Math.floor(trail.averageTime / 60)} minutes`} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Your Progress</Label>
                <Progress value={50} className="h-2" />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
