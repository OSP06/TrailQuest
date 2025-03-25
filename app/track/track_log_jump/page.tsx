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
  Droplet,
  ArrowDown,
  Wind,
  Thermometer,
  Award,
  Zap,
  PlusCircle,
  AlertTriangle,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapComponent } from "@/components/map-component"
import { LogAdventureDialog } from "@/components/log-adventure-dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CliffJumpingTrackPage() {
  const router = useRouter()
  const [isTracking, setIsTracking] = useState(false)
  const [time, setTime] = useState(0)
  const [jumpCount, setJumpCount] = useState(0)
  const [currentHeight, setCurrentHeight] = useState(15)
  const [maxHeight, setMaxHeight] = useState(15)
  const [airTime, setAirTime] = useState(0)
  const [activeTab, setActiveTab] = useState("stats")
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [waterDepth, setWaterDepth] = useState("25 ft")
  const [safetyRating, setSafetyRating] = useState(85)
  const [jumpStyle, setJumpStyle] = useState("Straight")
  const [styleScore, setStyleScore] = useState(0)
  const [isInAir, setIsInAir] = useState(false)
  const [jumpStartTime, setJumpStartTime] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const jumpIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
      }, 1000)
    }

    // Cleanup on unmount or when isTracking changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isTracking])

  // Simulate jumps when tracking
  useEffect(() => {
    if (isTracking && !isInAir && Math.random() > 0.95) {
      // Start a jump
      simulateJump()
    }
  }, [isTracking, time, isInAir])

  const simulateJump = useCallback(() => {
    // Start jump
    setIsInAir(true)
    setJumpStartTime(Date.now())

    // Randomly select jump height between 10-40 feet
    const height = Math.floor(Math.random() * 30) + 10
    setCurrentHeight(height)
    setMaxHeight((prev) => Math.max(prev, height))

    // Randomly select jump style
    const styles = ["Straight", "Pike", "Tuck", "Flip", "Dive", "Cannonball"]
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    setJumpStyle(randomStyle)

    // Calculate air time based on height (simplified physics)
    const calculatedAirTime = Math.sqrt((2 * height) / 32.2) * 1000 // in milliseconds

    // End jump after calculated air time
    setTimeout(() => {
      const actualAirTime = (Date.now() - jumpStartTime) / 1000
      setAirTime(actualAirTime)
      setJumpCount((prev) => prev + 1)
      setIsInAir(false)

      // Calculate style score (1-10)
      const newStyleScore = Math.floor(Math.random() * 10) + 1
      setStyleScore(newStyleScore)
    }, calculatedAirTime)
  }, [jumpStartTime])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (jumpIntervalRef.current) {
        clearInterval(jumpIntervalRef.current)
      }
    }
  }, [])

  const handleStartStop = useCallback(() => {
    setIsTracking((prev) => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setIsTracking(false)
    setTime(0)
    setJumpCount(0)
    setCurrentHeight(15)
    setMaxHeight(15)
    setAirTime(0)
    setStyleScore(0)
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
          router.push("/side-quests/cliff-jumping")
        }, 100)
      }
    } else {
      router.push("/side-quests/cliff-jumping")
    }
  }, [isTracking, router])

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Calculate calories burned (simplified formula)
  const caloriesBurned = Math.round(jumpCount * 15)

  return (
    <div className="container max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Track Cliff Jumping</h1>
        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>

      {/* Jump status indicator */}
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

        <Badge variant="outline" className={`gap-1 ${isInAir ? "border-cyan-500 text-cyan-500 animate-pulse" : ""}`}>
          <Droplet className="h-3 w-3" />
          <span>{isInAir ? "In Air!" : "Ready to Jump"}</span>
        </Badge>
      </div>

      <Card className="overflow-hidden border-cyan-500/20">
        <CardContent className="p-0">
          <div className="h-[250px] w-full">
            <MapComponent />
            {isTracking && (
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md border">
                <div className="text-sm font-medium flex items-center gap-1">
                  <Droplet className="h-3 w-3 text-cyan-500" />
                  <span>Cliff jumping in progress...</span>
                </div>
              </div>
            )}
            {isInAir && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-cyan-500/20 backdrop-blur-sm p-4 rounded-lg border border-cyan-500 text-center animate-bounce">
                  <Droplet className="h-8 w-8 mx-auto text-cyan-500 mb-2" />
                  <div className="text-xl font-bold text-cyan-500">{currentHeight} ft Jump!</div>
                  <div className="text-sm text-cyan-600">{jumpStyle} Style</div>
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
                <Timer className="h-5 w-5 mx-auto mb-2 text-cyan-500" />
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-mono font-medium">{formatTime(time)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Droplet className="h-5 w-5 mx-auto mb-2 text-cyan-500" />
                <p className="text-xs text-muted-foreground">Jumps</p>
                <p className="font-mono font-medium">{jumpCount}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <ArrowDown className="h-5 w-5 mx-auto mb-2 text-cyan-500" />
                <p className="text-xs text-muted-foreground">Max Height</p>
                <p className="font-mono font-medium">{maxHeight} ft</p>
              </CardContent>
            </Card>
          </div>

          {/* Jump-specific metrics */}
          <Card className="bg-cyan-500/5 border-cyan-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Droplet className="h-4 w-4 text-cyan-500" />
                <span>Jump Metrics</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Last Air Time</p>
                  <p className="text-lg font-medium">{airTime.toFixed(2)} sec</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Style Score</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-medium">{styleScore}/10</p>
                    {styleScore >= 8 && <Award className="h-4 w-4 text-amber-500" />}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Style</p>
                  <p className="text-lg font-medium">{jumpStyle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Water Depth</p>
                  <p className="text-lg font-medium">{waterDepth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Style rating */}
          {jumpCount > 0 && (
            <Card className="border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-cyan-500" />
                    <span>Style Rating</span>
                  </h3>
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3" />
                    <span>+{styleScore * 5} XP</span>
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
                      ? "Keep practicing your form!"
                      : styleScore < 7
                        ? "Good technique, getting better!"
                        : "Impressive style! You're a natural!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button
              variant={isTracking ? "destructive" : "default"}
              className={`flex-1 gap-2 ${!isTracking ? "bg-cyan-600 hover:bg-cyan-700" : ""}`}
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
            <Button className="w-full gap-2 mt-2 bg-cyan-600 hover:bg-cyan-700" onClick={() => setLogDialogOpen(true)}>
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
                  <Droplet className="h-4 w-4 text-cyan-500" />
                  <span>Cliff Jumping</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Jump Frequency</p>
                <p>{time > 0 ? (jumpCount / (time / 60)).toFixed(1) : "0.0"} jumps/hour</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Calories</p>
                <p>{caloriesBurned}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Weather</p>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-cyan-500" />
                  <span>75°F, Sunny</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Water Temperature</p>
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-cyan-500" />
                  <span>68°F</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Wind</p>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-cyan-500" />
                  <span>3 mph NE</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Current</p>
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-cyan-500" />
                  <span>Minimal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety tips */}
          <Card className="border-cyan-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-cyan-500" />
                <span>Safety Checklist</span>
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span>Water depth checked (minimum 10ft per 10ft of height)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span>Landing area clear of obstacles</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span>Jumping with a buddy</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <span>Exit route from water identified</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Jump technique tips */}
          <Card className="border-cyan-500/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Jump Technique Tips</h3>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Always jump feet first for your first attempt</li>
                <li>Keep your body straight and arms at your sides</li>
                <li>Look forward, not down</li>
                <li>Exhale through your nose when entering water</li>
                <li>Tuck your chin to your chest for flips</li>
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

