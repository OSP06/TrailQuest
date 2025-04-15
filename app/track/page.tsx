"use client"

import { useState, useEffect, useCallback } from "react"
import { BackButton } from "@/components/back-button"
import { MapComponent } from "@/components/map-component"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Activity {
  id: number
  type: string
  date: string
  duration: number
  distance: number
  elevation: number
  locations: any[]
}

export default function TrackPage() {
  const [activeTab, setActiveTab] = useState("track")
  const [tracking, setTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [activityTypeFilter, setActivityTypeFilter] = useState("all")
  const [elevation, setElevation] = useState(0)
  const [distance, setDistance] = useState(0)
  const [photos, setPhotos] = useState<File[]>([])
  const [timerRunning, setTimerRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

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

  // const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setPhotos([...photos, ...Array.from(e.target.files)])
  //   }
  // }

  useEffect(() => {
    // TODO: Fetch activities from API
    const fetchActivities = async () => {
      try {
        // const response = await fetch('/api/activities')
        // const data = await response.json()
        // setActivities(data)
        setActivities([
          {
            id: 1,
            type: 'hiking',
            date: '2025-04-09',
            duration: 120,
            distance: 5.2,
            elevation: 320,
            locations: [
              { lat: 37.7749, lng: -122.4194 },
              { lat: 37.7759, lng: -122.4184 }
            ]
          },
          {
            id: 2,
            type: 'rock_climbing',
            date: '2025-04-08',
            duration: 90,
            distance: 1.5,
            elevation: 150,
            locations: [
              { lat: 37.7769, lng: -122.4174 }
            ]
          },
          {
            id: 3,
            type: 'kayaking',
            date: '2025-04-07',
            duration: 180,
            distance: 8.7,
            elevation: 0,
            locations: [
              { lat: 37.7779, lng: -122.4164 },
              { lat: 37.7789, lng: -122.4154 }
            ]
          }
        ])
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }
    fetchActivities()
  }, [])

  const filteredActivities = activities.filter(activity => 
    activityTypeFilter === 'all' || activity.type === activityTypeFilter
  )

  const handleCloseModal = useCallback(() => {
    setSelectedActivity(null)
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-4">
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {selectedActivity.type === 'hiking' ? 'Main Hike' : `${selectedActivity.type.replace('_', ' ')} (Side Quest)`}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleCloseModal}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Date:</strong> {selectedActivity.date}</p>
                  <p><strong>Duration:</strong> {selectedActivity.duration} minutes</p>
                  <p><strong>Distance:</strong> {selectedActivity.distance} km</p>
                  <p><strong>Elevation:</strong> {selectedActivity.elevation} m</p>
                </div>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapComponent 
                    locations={selectedActivity.locations} 
                    zoom={selectedActivity.locations.length > 1 ? 12 : 14}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BackButton className="mt-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="hiking">Main Hiking Tracks</SelectItem>
                <SelectItem value="rock_climbing">Rock Climbing</SelectItem>
                <SelectItem value="kayaking">Kayaking</SelectItem>
                <SelectItem value="cliff_jumping">Cliff Jumping</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'hiking' ? 'bg-green-500' : 
                      activity.type === 'rock_climbing' ? 'bg-red-500' :
                      activity.type === 'kayaking' ? 'bg-blue-500' : 'bg-purple-500'
                    }`} />
                    <CardTitle className="capitalize">
                      {activity.type === 'hiking' ? 'Hiking' : activity.type.replace('_', ' ')}
                    </CardTitle>
                  </div>
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary">
                    {activity.date}
                  </span>
                </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <p>Date: {activity.date}</p>
                    <span className="text-sm text-muted-foreground">
                      {activity.type === 'hiking' ? '🚶‍♂️' : 
                      activity.type === 'rock_climbing' ? '🧗‍♀️' :
                      activity.type === 'kayaking' ? '🛶' : '🏄‍♂️'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{activity.duration} min</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium">{activity.distance} km</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Elevation</p>
                      <p className="font-medium">{activity.elevation} m</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    View Details & Map
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="h-[500px] rounded-lg overflow-hidden">
          <MapComponent currentLocation={currentLocation} />
        </div>
      </div>
    </div>
  )
}
