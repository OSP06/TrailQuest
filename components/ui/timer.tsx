"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

interface TimerProps {
  running: boolean
}

export function Timer({ running }: TimerProps) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (running) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    } else if (!running && time !== 0) {
      clearInterval(interval!)
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [running])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="font-mono">
      <Input 
        value={formatTime(time)}
        readOnly
        className="w-full"
      />
    </div>
  )
}
