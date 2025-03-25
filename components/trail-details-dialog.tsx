"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Trail {
  id: number
  name: string
  distance: number
  elevation: number
  difficulty: string
  location: string
  image: string
  averageTime: number
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{trail.name} Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
