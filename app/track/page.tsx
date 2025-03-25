"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { MapComponent } from "@/components/map-component"
import { Button } from "@/components/ui/button"
import { Timer } from "@/components/ui/timer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function TrackPage() {
  const [tracking, setTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [elevation, setElevation] = useState(0)
  const [distance, setDistance] = useState(0)
  const [photos, setPhotos] = useState<File[]>([])
  const [timerRunning, setTimerRunning] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (tracking) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setElevation(position.coords.altitude || 0)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
        { enableHighAccuracy: true }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [tracking])

  const handleStartTracking = () => {
    setTracking(true)
    setTimerRunning(true)
    setCurrentLocation(null)
    setElevation(0)
    setDistance(0)
    setPhotos([])
    setTime(0)
  }

  const handleStopTracking = async () => {
    setTracking(false)
    setTimerRunning(false)
    
    // Save the hike data
    const hikeData = {
      startTime: new Date(Date.now() - time * 1000),
      endTime: new Date(),
      duration: time,
      elevation,
      distance,
      photos,
      locations: [] // TODO: Add location tracking
    }

    try {
      // TODO: Implement API call to save hike
      console.log("Saving hike:", hikeData)
    } catch (error) {
      console.error("Error saving hike:", error)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)])
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <BackButton className="mt-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tracking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Location</Label>
              <Input
                value={currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : "Unknown"}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Elevation</Label>
              <Input value={`${elevation.toFixed(2)} meters`} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Distance</Label>
              <Input value={`${distance.toFixed(2)} km`} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Time Elapsed</Label>
              <Timer running={timerRunning} />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleStartTracking} disabled={tracking}>
                Start Tracking
              </Button>
              <Button 
                variant="secondary" 
                disabled={!tracking}
                onClick={handleStopTracking}
              >
                Stop Tracking
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="h-[500px] rounded-lg overflow-hidden">
          <MapComponent currentLocation={currentLocation} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              disabled={!tracking}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(photo)}
                  alt={`Hike photo ${i + 1}`}
                  className="rounded-lg object-cover h-32 w-full"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
