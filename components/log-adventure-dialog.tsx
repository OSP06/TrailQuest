"use client"

import { useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ImagePlus, MapPin, Mountain, Timer } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface LogAdventureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogAdventureDialog({ open, onOpenChange }: LogAdventureDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [photos, setPhotos] = useState<File[]>([])
  const [location, setLocation] = useState("")
  const [elevation, setElevation] = useState("")
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleSubmit = () => {
    // TODO: Implement submission logic
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Log New Adventure</DialogTitle>
          <DialogDescription>
            Record your hiking adventure details including photos, location, and stats.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date Picker */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Location */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="location"
                placeholder="Trail location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Elevation */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="elevation" className="text-right">
              Elevation
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="elevation"
                placeholder="Elevation gain"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Mountain className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="duration"
                placeholder="Hike duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Timer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photos" className="text-right">
              Photos
            </Label>
            <div className="col-span-3">
              <Input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your adventure..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Log Adventure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
