"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface MapComponentProps {
  currentLocation?: {
    lat: number;
    lng: number;
  } | null;
}

export function MapComponent({ currentLocation: center }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    // This is a placeholder for Leaflet.js integration
    // In a real implementation, you would initialize the map here
    if (mapRef.current) {
      const mapElement = mapRef.current

      // Create a simple placeholder map visualization
      const canvas = document.createElement("canvas")
      canvas.width = mapElement.clientWidth
      canvas.height = mapElement.clientHeight
      mapElement.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Draw a placeholder map
        ctx.fillStyle = "#1a1b26"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw some "terrain" features
        ctx.fillStyle = "#2a2b36"
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const size = 20 + Math.random() * 100
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw some "trails"
        ctx.strokeStyle = "#6366f1"
        ctx.lineWidth = 2
        for (let i = 0; i < 5; i++) {
          const points = []
          const numPoints = 5 + Math.floor(Math.random() * 5)

          for (let j = 0; j < numPoints; j++) {
            points.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
            })
          }

          ctx.beginPath()
          ctx.moveTo(points[0].x, points[0].y)
          for (let j = 1; j < points.length; j++) {
            ctx.lineTo(points[j].x, points[j].y)
          }
          ctx.stroke()
        }

        // Draw some "markers"
        ctx.fillStyle = "#ef4444"
        for (let i = 0; i < 8; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height

          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw "you are here" marker if center is provided
        if (center) {
          // Convert lat/lng to canvas coordinates (simple projection for demo)
          const x = ((center.lng + 180) / 360) * canvas.width
          const y = ((90 - center.lat) / 180) * canvas.height

          ctx.fillStyle = "#22c55e"
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = "#22c55e"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, y, 12, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Handle resize
      const handleResize = () => {
        if (canvas && mapElement) {
          canvas.width = mapElement.clientWidth
          canvas.height = mapElement.clientHeight

          // Redraw the map (simplified for this example)
          if (ctx) {
            ctx.fillStyle = "#1a1b26"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
        }
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
      }
    }
  }, [])

  return (
    <div ref={mapRef} className="h-full w-full bg-muted relative">
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button size="icon" variant="secondary">
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary">
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// These components are used in the map but not imported above
function Button({
  children,
  size = "default",
  variant = "default",
}: {
  children: React.ReactNode
  size?: "default" | "icon"
  variant?: "default" | "secondary"
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
        disabled:pointer-events-none disabled:opacity-50
        ${variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
        ${variant === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : ""}
        ${size === "default" ? "h-10 px-4 py-2 text-sm" : ""}
        ${size === "icon" ? "h-8 w-8 sm:h-9 sm:w-9" : ""}
      `}
    >
      {children}
    </button>
  )
}

function Plus({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function Minus({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  )
}
