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
  Mountain,
  Footprints,
  Compass,
  PlusCircle,
  Thermometer,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapComponent } from "@/components/map-component"
import { LogAdventureDialog } from "@/components/log-adventure-dialog"
import { Badge } from "@/components/ui/badge"

export default function HikingTrackPage() {
  const router = useRouter()
  const [isTracking, setIsTracking] = useState(false)
  const [time, setTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [steps, setSteps] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [elevationGain, setElevationGain] = useState(0)
  const [activeTab, setActiveTab] = useState("stats")
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [terrainType, setTerrainType] = useState("Trail")
  const [currentDirection, setCurrentDirection] = useState("North")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Setup and cleanup timer
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isTracking) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)

        // Simulate distance changes
        if (Math.random() > 0.6) {
          const newDistance = +(distance + 0.01).toFixed(2)
          setDistance(newDistance)
          setSpeed(+(Math.random() * 2 + 1).toFixed(1))
        }

        // Simulate steps
        if (Math.random() > 0.3) {
          setSteps((prev) => prev + Math.floor(Math.random() * 50) + 20)
        }

        // Occasionally change terrain type
        if (Math.random() > 0.95) {
          const terrains = ["Trail", "Rocky", "Forest", "Mountain", "Desert"]
          const randomIndex = Math.floor(Math.random() * terrains.length)
          setTerrainType(terrains[randomIndex])
        }

        // Occasionally change direction
        if (Math.random() > 0.97) {
          const directions = ["North", "East", "South", "West", "Northeast", "Southeast", "Southwest", "Northwest"]
          const randomIndex = Math.floor(Math.random() * directions.length)
          setCurrentDirection(directions[randomIndex])
        }

        // Simulate elevation gain
        if (Math.random() > 0.8) {
          setElevationGain((prev) => +(prev + (Math.random() * 0.5)).toFixed(1))
        }
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isTracking, distance])

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
    setSteps(0)
    setSpeed(0)
    setElevationGain(0)
    setTerrainType("Trail")
  }, [])

  const handleSave = useCallback(() => {
    setIsTracking(false)
    setLogDialogOpen(true)
  }, [])

  const handleBack = useCallback(() => {
    if (isTracking) {
      if (confirm("Are you sure you want to stop tracking and go back?")) {
        setIsTracking(false)
        setTimeout(() => {
          router.push("/hiking")
        }, 100)
      }
    } else {
      router.push("/hiking")
    }
  }, [isTracking, router])

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Calculate calories burned (higher for hiking)
  const caloriesBurned = Math.round((time / 60) * 10)

  return (
    <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Track Hiking</h1>
        <div className="w-9"></div>
      </div>

      {/* Terrain indicators */}
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`gap-1 ${
            terrainType === "Trail"
              ? "border-green-500 text-green-500"
              : terrainType === "Rocky"
                ? "border-yellow-500 text-yellow-500"
                : terrainType === "Mountain"
                  ? "border-orange-500 text-orange-500"
                  : "border-red-500 text-red-500"
          }`}
        >
          <Mountain className="h-3 w-3" />
          <span>Terrain: {terrainType}</span>
        </Badge>

        <Badge variant="outline" className="gap-1">
          <Compass className="h-3 w-3" />
          <span>Direction: {currentDirection}</span>
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="h-[250px] w-full">
            <MapComponent />
            {isTracking && (
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md border">
                <div className="text-sm font-medium flex items-center gap-1">
                  <Footprints className="h-3 w-3 text-green-500" />
                  <span>Hiking in progress...</span>
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
                <Timer className="h-5 w-5 mx-auto mb-2 text-green-500" />
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-mono font-medium">{formatTime(time)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-5 w-5 mx-auto mb-2 text-green-500" />
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-mono font-medium">{distance.toFixed(2)} mi</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Footprints className="h-5 w-5 mx-auto mb-2 text-green-500" />
                <p className="text-xs text-muted-foreground">Speed</p>
                <p className="font-mono font-medium">{speed.toFixed(1)} mph</p>
              </CardContent>
            </Card>
          </div>

          {/* Hiking-specific metrics */}
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Footprints className="h-4 w-4 text-green-500" />
                <span>Hiking Metrics</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Steps</p>
                  <p className="text-lg font-medium">{steps}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Elevation Gain</p>
                  <p className="text-lg font-medium">{elevationGain.toFixed(1)} ft</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              variant={isTracking ? "destructive" : "default"}
              className={`flex-1 gap-2 ${!isTracking ? "bg-green-600 hover:bg-green-700" : ""}`}
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
            <Button className="w-full gap-2 mt-2 bg-green-600 hover:bg-green-700" onClick={() => setLogDialogOpen(true)}>
              <PlusCircle className="h-4 w-4" />
              <span>Log This Hike</span>
            </Button>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Activity Type</p>
                <div className="flex items-center gap-2">
                  <Footprints className="h-4 w-4 text-green-500" />
                  <span>Hiking</span>
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
                  <Thermometer className="h-4 w-4 text-green-500" />
                  <span>72°F, Partly Cloudy</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Trail Conditions</p>
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-green-500" />
                  <span>{terrainType}, Dry</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hiking safety tips */}
          <Card className="border-green-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Hiking Safety Tips</h3>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Bring plenty of water and snacks</li>
                <li>Wear appropriate footwear</li>
                <li>Check weather conditions before heading out</li>
                <li>Stay on marked trails</li>
                <li>Tell someone your hiking plans</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LogAdventureDialog open={logDialogOpen} onOpenChange={setLogDialogOpen} />
    </div>
  )
}
