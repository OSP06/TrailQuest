"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Mountain } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface LogClimbDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogClimbDialog({ open, onOpenChange }: LogClimbDialogProps) {
  const [location, setLocation] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [style, setStyle] = useState("Bouldering")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!location.trim() || !difficulty.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in location and difficulty",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/log-climb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          difficulty,
          style,
          notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to log climb')
      }

      // Reset form
      setLocation("")
      setDifficulty("")
      setStyle("Bouldering")
      setNotes("")

      // Close dialog
      onOpenChange(false)

      // Show success message
      toast({
        title: "Climb logged!",
        description: "Your climb has been recorded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log your climb. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            <span>Log Your Climb</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Where did you climb?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button type="button" variant="outline" size="icon">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Input
                id="difficulty"
                placeholder="V3 / 5.10"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any details about your climb..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Logging..." : "Log Climb"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
