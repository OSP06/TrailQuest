"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BackButton } from "@/components/back-button"
import {
  Award,
  Calendar,
  ChevronRight,
  Clock,
  Cloud,
  Compass,
  Edit,
  Flag,
  Heart,
  MapPin,
  Moon,
  Mountain,
  Settings,
  Share2,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  Wind,
  Zap,
  Tent,
  Footprints,
  Flame,
  Droplet,
  Trees,
  Sunrise,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CartoonBadge } from "@/components/cartoon-badge"
import { RewardCardCartoon } from "@/components/reward-card-cartoon"
import { XPProgress } from "@/components/xp-progress"
import { ConfettiCelebration } from "@/components/confetti-celebration"
import { AchievementToast } from "@/components/achievement-toast"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("stats")
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeReward, setActiveReward] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastData, setToastData] = useState({
    title: "",
    description: "",
    type: "badge",
    color: "",
  })

  // Sample profile data
  const profile = {
    name: "Trail Blazer",
    username: "trailblazer",
    avatar: "/placeholder.svg?height=100&width=100",
    level: 12,
    xp: 12450,
    xpToNextLevel: 15000,
    joinDate: "March 2023",
    location: "Seattle, WA",
    bio: "Avid hiker and nature enthusiast. Always seeking the next summit!",
    stats: {
      totalHikes: 48,
      totalDistance: 248,
      totalElevation: 15200,
      longestHike: 15.3,
      highestElevation: 4392,
      averagePace: "2.4 mph",
      totalTime: "103 hours",
    },
    badges: [
      {
        id: "summit-seeker",
        name: "Summit Seeker",
        description: "Reached 5 mountain summits",
        unlocked: true,
        icon: <Flag className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      },
      {
        id: "trail-explorer",
        name: "Trail Explorer",
        description: "Hiked 25 different trails",
        unlocked: true,
        icon: <Compass className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-emerald-500 to-green-600",
      },
      {
        id: "winter-warrior",
        name: "Winter Warrior",
        description: "Completed 5 winter hikes",
        unlocked: true,
        icon: <Wind className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
      },
      {
        id: "elevation-master",
        name: "5000+ Elevation",
        description: "Gained over 5000 ft elevation",
        unlocked: true,
        icon: <Mountain className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      },
      {
        id: "century-club",
        name: "Century Club",
        description: "Hiked over 100 miles total",
        unlocked: true,
        icon: <Trophy className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-yellow-400 to-amber-500",
      },
      {
        id: "night-owl",
        name: "Night Owl",
        description: "Completed a night hike",
        unlocked: false,
        icon: <Moon className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
      },
      {
        id: "speed-demon",
        name: "Speed Demon",
        description: "Maintained 4+ mph pace",
        unlocked: false,
        icon: <Zap className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-red-500 to-pink-600",
      },
      {
        id: "wilderness-survivor",
        name: "Wilderness Survivor",
        description: "Multi-day backpacking trip",
        unlocked: false,
        icon: <Tent className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
      },
      {
        id: "early-bird",
        name: "Early Bird",
        description: "Sunrise hike completed",
        unlocked: true,
        icon: <Sunrise className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
      },
      {
        id: "forest-friend",
        name: "Forest Friend",
        description: "Hiked 10 forest trails",
        unlocked: true,
        icon: <Trees className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-green-500 to-teal-600",
      },
      {
        id: "waterfall-wanderer",
        name: "Waterfall Wanderer",
        description: "Discovered 5 waterfalls",
        unlocked: false,
        icon: <Droplet className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-blue-400 to-cyan-500",
      },
      {
        id: "campfire-cook",
        name: "Campfire Cook",
        description: "Cooked 5 meals outdoors",
        unlocked: false,
        icon: <Flame className="h-10 w-10 text-white" />,
        bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
      },
    ],
    rewards: [
      {
        id: "premium-maps",
        name: "Premium Trail Maps",
        description: "Access to detailed trail maps with elevation profiles",
        unlocked: true,
        icon: <MapPin className="h-6 w-6 text-amber-500" />,
        bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
      },
      {
        id: "custom-badges",
        name: "Custom Badges",
        description: "Create your own achievement badges to share",
        unlocked: true,
        icon: <Sparkles className="h-6 w-6 text-amber-500" />,
        bgColor: "bg-gradient-to-br from-amber-400 to-yellow-500",
      },
      {
        id: "trail-recommendations",
        name: "Trail Recommendations",
        description: "Personalized trail recommendations for you",
        unlocked: true,
        icon: <Heart className="h-6 w-6 text-amber-500" />,
        bgColor: "bg-gradient-to-br from-pink-500 to-rose-600",
      },
      {
        id: "adventure-planner",
        name: "Adventure Planner",
        description: "Plan multi-day hiking trips with itineraries",
        unlocked: false,
        icon: <Calendar className="h-6 w-6 text-amber-500" />,
        bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
      },
      {
        id: "weather-alerts",
        name: "Weather Alerts",
        description: "Real-time weather alerts for your trails",
        unlocked: false,
        icon: <Cloud className="h-6 w-6 text-amber-500" />,
        bgColor: "bg-gradient-to-br from-sky-500 to-blue-600",
      },
      {
        id: "group-challenges",
        name: "Group Challenges",
        description: "Create and join group hiking challenges",
        unlocked: false,
        icon: <Users className="h-6 w-6 text-amber-500" />,
        bgColor: "bg-gradient-to-br from-violet-500 to-purple-600",
      },
    ],
    devices: [
      { name: "iPhone 13", type: "Smartphone", lastSync: "Today, 2:45 PM" },
      { name: "Garmin Fenix 7", type: "GPS Watch", lastSync: "Today, 2:45 PM" },
    ],
  }

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  // Simulate unlocking a badge
  const unlockBadge = (badge) => {
    if (!badge.unlocked) {
      setShowConfetti(true)

      setToastData({
        title: "Badge Unlocked!",
        description: `You've earned the ${badge.name} badge!`,
        type: "badge",
        color: badge.bgColor,
      })
      setShowToast(true)
    }
  }

  // Simulate using a reward
  useEffect(() => {
    if (activeReward) {
      if (activeReward.unlocked) {
        setToastData({
          title: "Reward Activated",
          description: `You're now using ${activeReward.name}`,
          type: "reward",
          color: activeReward.bgColor,
        })
        setShowToast(true)
      }
      setActiveReward(null)
    }
  }, [activeReward])

  const useReward = (reward) => {
    setActiveReward(reward)
  }

  // Simulate upgrading to premium
  const upgradeToPremium = () => {
    setToastData({
      title: "Premium Required",
      description: "Upgrade to TrailQuest Premium to unlock this reward",
      type: "reward",
      color: "bg-gradient-to-r from-purple-500 to-indigo-500",
    })
    setShowToast(true)
  }

  // Handle toast close
  const handleToastClose = () => {
    setShowToast(false)
  }

  // Handle confetti complete
  const handleConfettiComplete = () => {
    setShowConfetti(false)
  }

  return (
    <div className="container px-4 sm:px-6 max-w-screen-xl space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-10 relative">
      {/* Confetti celebration */}
      <ConfettiCelebration active={showConfetti} onComplete={handleConfettiComplete} />

      {/* Achievement toast */}
      {showToast && (
        <AchievementToast
          title={toastData.title}
          description={toastData.description}
          type={toastData.type}
          color={toastData.color}
          onClose={handleToastClose}
        />
      )}

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Profile Card */}
        <Card className="w-full md:w-80">
          <CardHeader className="text-center px-4 sm:px-6">
            <motion.div
              className="mx-auto mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-amber-500">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </motion.div>
            <CardTitle className="text-xl">{profile.name}</CardTitle>
            <CardDescription>@{profile.username}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <XPProgress
              level={profile.level}
              currentXP={profile.xp}
              requiredXP={profile.xpToNextLevel}
              showAnimation={false}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {profile.joinDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm">{profile.bio}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between px-4 sm:px-6">
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </CardFooter>
        </Card>

        {/* Stats and Badges */}
        <div className="flex-1 space-y-6">
          <Tabs defaultValue="stats" onValueChange={handleTabChange}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="stats" className="flex-1 sm:flex-initial gap-1">
                <Mountain className="h-4 w-4" />
                <span>Stats</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex-1 sm:flex-initial gap-1">
                <Award className="h-4 w-4" />
                <span>Badges</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1 sm:flex-initial gap-1">
                <Trophy className="h-4 w-4" />
                <span>Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="devices" className="flex-1 sm:flex-initial gap-1">
                <Smartphone className="h-4 w-4" />
                <span>Devices</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Hiking Statistics</CardTitle>
                  <CardDescription>Your lifetime hiking achievements</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Hikes</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">{profile.stats.totalHikes}</p>
                    </motion.div>
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2">
                        <Footprints className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Distance</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">{profile.stats.totalDistance} mi</p>
                    </motion.div>
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="flex items-center gap-2">
                        <Mountain className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Elevation</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">
                        {profile.stats.totalElevation.toLocaleString()} ft
                      </p>
                    </motion.div>
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Longest Hike</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">{profile.stats.longestHike} mi</p>
                    </motion.div>
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <div className="flex items-center gap-2">
                        <Mountain className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Highest Elevation</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">
                        {profile.stats.highestElevation.toLocaleString()} ft
                      </p>
                    </motion.div>
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Time</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">{profile.stats.totalTime}</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Performance Trends</CardTitle>
                  <CardDescription>Your hiking performance over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] sm:h-[300px] flex items-center justify-center px-4 sm:px-6">
                  <p className="text-muted-foreground">Performance chart placeholder</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Achievement Badges</CardTitle>
                  <CardDescription>Unlock badges by completing specific challenges</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 py-4">
                    {profile.badges.map((badge) => (
                      <CartoonBadge key={badge.id} {...badge} onClick={() => unlockBadge(badge)} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Unlocked Rewards</CardTitle>
                  <CardDescription>Special features and perks you've earned</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {profile.rewards.map((reward) => {
                      const handleUseReward = () => {
                        if (!reward.unlocked) {
                          upgradeToPremium()
                          return
                        }
                        useReward(reward)
                      }

                      return (
                        <RewardCardCartoon
                          key={reward.id}
                          {...reward}
                          onUse={handleUseReward}
                          onUpgrade={upgradeToPremium}
                        />
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="mt-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Connected Devices</CardTitle>
                  <CardDescription>Manage your connected tracking devices</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-4">
                    {profile.devices.map((device, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 last:border-0 last:pb-0 gap-3 sm:gap-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.2 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-xs text-muted-foreground">{device.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-muted-foreground">Last synced</p>
                            <p className="text-sm">{device.lastSync}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="hidden sm:flex">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" className="w-full sm:hidden">
                            <span>Manage Device</span>
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-4 sm:px-6">
                  <Button variant="outline" size="sm" className="gap-1 w-full sm:w-auto">
                    <span>Connect New Device</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
