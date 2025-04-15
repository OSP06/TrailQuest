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
  ArrowUp,
  Thermometer,
  Award,
  Zap,
  PlusCircle,
  AlertTriangle,
  Compass,
  Link
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapComponent } from "@/components/map-component"
import { LogAdventureDialog } from "@/components/log-adventure-dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function RockClimbingTrackPage() {
  const router = useRouter()
  const [isTracking, setIsTracking] = useState(false)
  const [time, setTime] = useState(0)
  const [routeCount, setRouteCount] = useState(0)
  const [currentDifficulty, setCurrentDifficulty] = useState("5.8")
  const [maxDifficulty, setMaxDifficulty] = useState("5.8")
  const [activeTab, setActiveTab] = useState("stats")
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [safetyRating, setSafetyRating] = useState(90)
  const [climbStyle, setClimbStyle] = useState("Top Rope")
  const [styleScore, setStyleScore] = useState(0)
  const [isClimbing, setIsClimbing] = useState(false)

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
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTracking])

  // Simulate climbs when tracking
  useEffect(() => {
    if (isTracking && !isClimbing && Math.random() > 0.95) {
      simulateClimb()
    }
  }, [isTracking, time, isClimbing])

  const simulateClimb = useCallback(() => {
    setIsClimbing(true)
    
    // Randomly select climb difficulty between 5.6-5.12
    const difficulties = ["5.6", "5.7", "5.8", "5.9", "5.10a", "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d", "5.12a"]
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
    setCurrentDifficulty(randomDifficulty)
    
    // Track max difficulty
    const currentNum = parseFloat(randomDifficulty)
    const maxNum = parseFloat(maxDifficulty)
    if (currentNum > maxNum) {
      setMaxDifficulty(randomDifficulty)
    }

    // Randomly select climb style
    const styles = ["Top Rope", "Lead", "Boulder", "Trad"]
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    setClimbStyle(randomStyle)

    // Simulate climb duration (30-300 seconds)
    const climbDuration = Math.floor(Math.random() * 270) + 30

    setTimeout(() => {
      setRouteCount((prev) => prev + 1)
      setIsClimbing(false)
      
      // Calculate style score (1-10)
      const newStyleScore = Math.floor(Math.random() * 10) + 1
      setStyleScore(newStyleScore)
    }, climbDuration * 1000)
  }, [maxDifficulty])

  const handleStartStop = useCallback(() => {
    setIsTracking((prev) => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setIsTracking(false)
    setTime(0)
    setRouteCount(0)
    setCurrentDifficulty("5.8")
    setMaxDifficulty("5.8")
    setStyleScore(0)
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
          router.push("/side-quests/rock-climbing")
        }, 100)
      }
    } else {
      router.push("/side-quests/rock-climbing")
    }
  }, [isTracking, router])

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Calculate calories burned (simplified formula)
  const caloriesBurned = Math.round(routeCount * 200)

  return (
    <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Track Rock Climbing</h1>
        <div className="w-9"></div>
      </div>

      {/* Climb status indicator */}
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`gap-1 ${
            safetyRating > 80
              ? "border-green-500 text-green-500"
              : safetyRating > 60
                ? "border-yellow-500 text-yellow-500"
                : "border-red-500 text-red-500"
          }`}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>Safety: {safetyRating}%</span>
        </Badge>

        <Badge variant="outline" className={`gap-1 ${isClimbing ? "border-amber-500 text-amber-500 animate-pulse" : ""}`}>
                  <Mountain className="h-3 w-3" />
          <span>{isClimbing ? "On Route!" : "Ready to Climb"}</span>
        </Badge>
      </div>

      <Card className="overflow-hidden border-amber-500/20">
        <CardContent className="p-0">
          <div className="h-[250px] w-full">
            <MapComponent />
            {isTracking && (
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md border">
                <div className="text-sm font-medium flex items-center gap-1">
                  <Mountain className="h-3 w-3 text-amber-500" />
                  <span>Rock climbing in progress...</span>
                </div>
              </div>
            )}
            {isClimbing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-amber-500/20 backdrop-blur-sm p-4 rounded-lg border border-amber-500 text-center animate-pulse">
                  <Mountain className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                  <div className="text-xl font-bold text-amber-500">{currentDifficulty} Route!</div>
                  <div className="text-sm text-amber-600">{climbStyle} Style</div>
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
                <Timer className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-mono font-medium">{formatTime(time)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Mountain className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                <p className="text-xs text-muted-foreground">Routes</p>
                <p className="font-mono font-medium">{routeCount}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <ArrowUp className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                <p className="text-xs text-muted-foreground">Max Difficulty</p>
                <p className="font-mono font-medium">{maxDifficulty}</p>
              </CardContent>
            </Card>
          </div>

          {/* Climb-specific metrics */}
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Mountain className="h-4 w-4 text-amber-500" />
                <span>Climb Metrics</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Route</p>
                  <p className="text-lg font-medium">{currentDifficulty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Style Score</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium">{styleScore}/10</p>
                    {styleScore >= 8 && <Award className="h-4 w-4 text-amber-500" />}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Climb Style</p>
                  <p className="text-lg font-medium">{climbStyle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Safety Check</p>
                  <p className="text-lg font-medium">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Style rating */}
          {routeCount > 0 && (
            <Card className="border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>Style Rating</span>
                  </h3>
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3" />
                    <span>+{styleScore * 10} XP</span>
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Beginner</span>
                    <span>Pro</span>
                  </div>
                  <Progress value={styleScore * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {styleScore < 4
                      ? "Keep practicing your technique!"
                      : styleScore < 7
                        ? "Good form, getting better!"
                        : "Excellent technique! You're crushing it!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button
              variant={isTracking ? "destructive" : "default"}
              className={`flex-1 gap-2 ${!isTracking ? "bg-amber-600 hover:bg-amber-700" : ""}`}
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
            <Button className="w-full gap-2 mt-2 bg-amber-600 hover:bg-amber-700" onClick={() => setLogDialogOpen(true)}>
              <PlusCircle className="h-4 w-4" />
              <span>Log This Climb</span>
            </Button>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Activity Type</p>
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-amber-500" />
                  <span>Rock Climbing</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Route Frequency</p>
                <p>{time > 0 ? (routeCount / (time / 60)).toFixed(1) : "0.0"} routes/hour</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Calories</p>
                <p>{caloriesBurned}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Weather</p>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-amber-500" />
                  <span>72°F, Partly Cloudy</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Rock Type</p>
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-amber-500" />
                  <span>Granite</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Wind</p>
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-amber-500" />
                  <span>5 mph NW</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety tips */}
          <Card className="border-amber-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Safety Checklist</span>
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span>Harness properly fitted and doubled back</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span>Knots properly tied and dressed</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span>Belay device properly threaded</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span>Exit route identified and clear</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
