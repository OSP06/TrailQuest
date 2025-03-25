"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Save,
  Timer,
  Waves,
  Droplet,
  Wind,
  Compass,
  PlusCircle,
  Thermometer,
  Anchor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapComponent } from "@/components/map-component"
import { LogAdventureDialog } from "@/components/log-adventure-dialog"
import { Badge } from "@/components/ui/badge"

export default function KayakingTrackPage() {
  const router = useRouter()
  const [isTracking, setIsTracking] = useState(false)
  const [time, setTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [paddleStrokes, setPaddleStrokes] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [activeTab, setActiveTab] = useState("stats")
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [waterCondition, setWaterCondition] = useState("Calm")
  const [currentDirection, setCurrentDirection] = useState("North")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Setup and cleanup timer
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Only start a new interval if tracking is active
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)

        // Simulate distance changes
        if (Math.random() > 0.6) {
          const newDistance = +(distance + 0.01).toFixed(2)
          setDistance(newDistance)

          // Update speed based on distance
          setSpeed(+(Math.random() * 2 + 1).toFixed(1))
        }

        // Simulate paddle strokes
        if (Math.random() > 0.3) {
          setPaddleStrokes((prev) => prev + Math.floor(Math.random() * 3) + 1)
        }

        // Occasionally change water conditions
        if (Math.random() > 0.95) {
          const conditions = ["Calm", "Choppy", "Wavy", "Rough"]
          const randomIndex = Math.floor(Math.random() * conditions.length)
          setWaterCondition(conditions[randomIndex])
        }

        // Occasionally change current direction
        if (Math.random() > 0.97) {
          const directions = ["North", "East", "South", "West", "Northeast", "Southeast", "Southwest", "Northwest"]
          const randomIndex = Math.floor(Math.random() * directions.length)
          setCurrentDirection(directions[randomIndex])
        }
      }, 1000)
    }

    // Cleanup on unmount or when isTracking changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isTracking, distance])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleStartStop = useCallback(() => {
    setIsTracking((prev) => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setIsTracking(false)
    setTime(0)
    setDistance(0)
    setPaddleStrokes(0)
    setSpeed(0)
    setWaterCondition("Calm")
  }, [])

  const handleSave = useCallback(() => {
    // Save tracking data
    setIsTracking(false)
    setLogDialogOpen(true)
  }, [])

  const handleBack = useCallback(() => {
    if (isTracking) {
      if (confirm("Are you sure you want to stop tracking and go back?")) {
        setIsTracking(false)
        setTimeout(() => {
          router.push("/side-quests/kayaking")
        }, 100)
      }
    } else {
      router.push("/side-quests/kayaking")
    }
  }, [isTracking, router])

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Calculate calories burned (simplified formula)
  const caloriesBurned = Math.round((time / 60) * 7)

  return (
    <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Track Kayaking</h1>
        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>

      {/* Water condition indicator */}
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`gap-1 ${
            waterCondition === "Calm"
              ? "border-green-500 text-green-500"
              : waterCondition === "Choppy"
                ? "border-yellow-500 text-yellow-500"
                : waterCondition === "Wavy"
                  ? "border-orange-500 text-orange-500"
                  : "border-red-500 text-red-500"
          }`}
        >
          <Waves className="h-3 w-3" />
          <span>Water: {waterCondition}</span>
        </Badge>

        <Badge variant="outline" className="gap-1">
          <Compass className="h-3 w-3" />
          <span>Current: {currentDirection}</span>
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="h-[250px] w-full">
            <MapComponent />
            {isTracking && (
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md border">
                <div className="text-sm font-medium flex items-center gap-1">
                  <Waves className="h-3 w-3 text-blue-500" />
                  <span>Kayaking in progress...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Timer className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-mono font-medium">{formatTime(time)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Waves className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-mono font-medium">{distance.toFixed(2)} mi</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Droplet className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                <p className="text-xs text-muted-foreground">Speed</p>
                <p className="font-mono font-medium">{speed.toFixed(1)} mph</p>
              </CardContent>
            </Card>
          </div>

          {/* Kayaking-specific metrics */}
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Waves className="h-4 w-4 text-blue-500" />
                <span>Kayaking Metrics</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paddle Strokes</p>
                  <p className="text-lg font-medium">{paddleStrokes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stroke Rate</p>
                  <p className="text-lg font-medium">{time > 0 ? Math.round(paddleStrokes / (time / 60)) : 0}/min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              variant={isTracking ? "destructive" : "default"}
              className={`flex-1 gap-2 ${!isTracking ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              onClick={handleStartStop}
            >
              {isTracking ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Start</span>
                </>
              )}
            </Button>

            <Button variant="outline" size="icon" onClick={handleReset} disabled={time === 0}>
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={handleSave} disabled={time === 0}>
              <Save className="h-4 w-4" />
            </Button>
          </div>

          {time > 0 && !isTracking && (
            <Button className="w-full gap-2 mt-2 bg-blue-600 hover:bg-blue-700" onClick={() => setLogDialogOpen(true)}>
              <PlusCircle className="h-4 w-4" />
              <span>Log This Adventure</span>
            </Button>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Activity Type</p>
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-blue-500" />
                  <span>Kayaking</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Current Pace</p>
                <p>{distance > 0 ? (time / 60 / distance).toFixed(1) : "0.0"} min/mile</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Calories</p>
                <p>{caloriesBurned}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Weather</p>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-blue-500" />
                  <span>68°F, Partly Cloudy</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Water Temperature</p>
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <span>62°F</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Wind</p>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span>5 mph NW</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Tide</p>
                <div className="flex items-center gap-2">
                  <Anchor className="h-4 w-4 text-blue-500" />
                  <span>Incoming (2.3 ft)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Water safety tips */}
          <Card className="border-blue-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Water Safety Tips</h3>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Always wear a life jacket</li>
                <li>Stay hydrated</li>
                <li>Be aware of changing weather conditions</li>
                <li>Know your limits and skill level</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Adventure Dialog */}
      <LogAdventureDialog open={logDialogOpen} onOpenChange={setLogDialogOpen} />
    </div>
  )
}
