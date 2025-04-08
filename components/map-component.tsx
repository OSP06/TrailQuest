"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapComponentProps {
  currentLocation?: {
    lat: number;
    lng: number;
  } | null;
  trailPath?: Array<{ lat: number; lng: number }>;
}

export function MapComponent({ currentLocation, trailPath }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Initialize Mapbox
    if (mapContainer.current && !map.current) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: currentLocation || [-122.4194, 37.7749], // Default to San Francisco
        zoom: 12
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserLocation: true
        })
      )

      // Add trail path if provided
      if (trailPath && trailPath.length > 0) {
        map.current.on('load', () => {
          map.current?.addSource('trail', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: trailPath.map(point => [point.lng, point.lat])
              }
            }
          })

          map.current?.addLayer({
            id: 'trail',
            type: 'line',
            source: 'trail',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#6366f1',
              'line-width': 4
            }
          })
        })
      }

      // Add current location marker if provided
      if (currentLocation) {
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat([currentLocation.lng, currentLocation.lat])
          .addTo(map.current)
      }
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [currentLocation, trailPath])

  return <div ref={mapContainer} className="h-full w-full" />
}
