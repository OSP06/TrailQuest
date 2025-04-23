"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { ActivityType, getActivityAnimations } from "../lib/animationUtils"
import { flaskApiClient } from "../lib/services/flaskApi"

interface LayerConfig {
  id: string;
  type: 'fill' | 'line' | 'symbol' | 'circle' | 'heatmap';
  source: string;
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  filter?: Array<unknown>;
  minzoom?: number;
  maxzoom?: number;
}

interface AnimationConfig {
  type: 'pulse' | 'ripple' | 'path-draw' | 'elevation' | 'water-flow';
  speed: number;
  colors: string[];
  activityType: ActivityType;
  performanceThreshold?: 'high' | 'medium' | 'low';
}

interface MapComponentProps {
  currentLocation?: {
    lat: number;
    lng: number;
  } | null;
  locations?: Array<{ lat: number; lng: number }>;
  trailPath?: Array<{ lat: number; lng: number }>;
  animations?: AnimationConfig[];
  onAnimationLoad?: () => void;
  activityType?: ActivityType;
  qualityMode?: 'high' | 'balanced' | 'low';
  batteryLevel?: number; // 0-1 scale
  memoryThreshold?: number; // MB available
  zoom?: number; // Initial zoom level
}

export function MapComponent({ 
  currentLocation, 
  trailPath, 
  animations, 
  onAnimationLoad,
  activityType = 'hiking',
  qualityMode = 'balanced',
  batteryLevel,
  memoryThreshold,
  zoom = 12
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const animationFrame = useRef<number | null>(null)
  const layers = useRef<Record<string, LayerConfig>>({})
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [frameRate, setFrameRate] = useState<number>(60);
  const [trails, setTrails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Monitor memory usage
  const monitorMemory = useCallback(() => {
    if ('memory' in performance) {
      // @ts-ignore - memory API not in TypeScript yet
      setMemoryUsage(performance.memory.usedJSHeapSize / (1024 * 1024));
    }
  }, []);

  // Monitor frame rate
  const monitorFrameRate = useCallback(() => {
    let lastTime = performance.now();
    let frames = 0;
    
    const checkFrameRate = () => {
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFrameRate(frames);
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(checkFrameRate);
    };
    
    checkFrameRate();
  }, []);

  // Dynamic layer management
  const manageLayers = useCallback(() => {
    if (!map.current) return;

    // Adjust quality based on battery and memory
    const effectiveQuality = 
      (batteryLevel && batteryLevel < 0.3) || 
      (memoryThreshold && memoryUsage > memoryThreshold * 0.8) ? 
      'low' : qualityMode;

    // Update map quality settings
    map.current.setMaxZoom(effectiveQuality === 'high' ? 22 : 
                        effectiveQuality === 'balanced' ? 18 : 16);
    map.current.setMaxPitch(effectiveQuality === 'high' ? 60 : 
                          effectiveQuality === 'balanced' ? 45 : 30);
  }, [batteryLevel, memoryThreshold, memoryUsage, qualityMode]);

  // Activity-specific implementations
  const addActivityLayers = useCallback((activity: ActivityType) => {
    if (!map.current) return;

    switch(activity) {
      case 'hiking':
        // Elevation gain visualization
        map.current.addLayer({
          id: 'elevation-fill',
          type: 'fill',
          source: 'elevation',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'elevation'],
              0, '#2b9348',
              1000, '#f9c74f',
              2000, '#f8961e',
              3000, '#f94144'
            ],
            'fill-opacity': 0.7
          }
        });

        // Trail difficulty color coding
        map.current.addLayer({
          id: 'trail-difficulty',
          type: 'line',
          source: 'trail',
          paint: {
            'line-color': [
              'match',
              ['get', 'difficulty'],
              'easy', '#2b9348',
              'moderate', '#f9c74f',
              'hard', '#f8961e',
              'expert', '#f94144',
              '#6366f1' // default
            ],
            'line-width': 4
          }
        });
        break;

      case 'kayaking':
        // Water ripple effects
        map.current.addLayer({
          id: 'water-ripples',
          type: 'circle',
          source: 'water',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 5,
              16, 10
            ],
            'circle-color': '#3a86ff',
            'circle-opacity': 0.6,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        // Flow direction indicators
        map.current.addLayer({
          id: 'flow-direction',
          type: 'symbol',
          source: 'water',
          layout: {
            'icon-image': 'arrow',
            'icon-rotate': ['get', 'flow-direction'],
            'icon-size': 0.5
          }
        });
        break;

      case 'rock-climbing':
        // Route visualization
        map.current.addLayer({
          id: 'climbing-route',
          type: 'line',
          source: 'climbing',
          paint: {
            'line-color': '#f94144',
            'line-width': 3,
            'line-dasharray': [2, 2]
          }
        });

        // Wall type styling
        map.current.addLayer({
          id: 'wall-type',
          type: 'fill',
          source: 'climbing',
          paint: {
            'fill-color': [
              'match',
              ['get', 'type'],
              'granite', '#6c757d',
              'limestone', '#adb5bd',
              'sandstone', '#e9c46a',
              'basalt', '#343a40',
              '#ffffff' // default
            ],
            'fill-opacity': 0.5
          }
        });
        break;

      case 'cliff-jumping':
        // Height visualization
        map.current.addLayer({
          id: 'height-indicator',
          type: 'symbol',
          source: 'cliff',
          layout: {
            'text-field': ['get', 'height'],
            'text-font': ['Open Sans Bold'],
            'text-size': 14,
            'text-anchor': 'top',
            'text-offset': [0, 0.5]
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1
          }
        });

        // Safety rating markers
        map.current.addLayer({
          id: 'safety-rating',
          type: 'circle',
          source: 'cliff',
          paint: {
            'circle-color': [
              'match',
              ['get', 'safety'],
              'safe', '#2b9348',
              'caution', '#f9c74f',
              'dangerous', '#f94144',
              '#ffffff' // default
            ],
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
        break;
    }
  }, []);

  const addAnimationLayers = useCallback(() => {
    if (!map.current) return;

    // Get activity-specific animations if none provided
    const activeAnimations = animations || getActivityAnimations(activityType);

    // Apply LOD based on performance
    const lodThreshold = frameRate < 30 ? 0.5 : 1;
    
    activeAnimations.forEach((config) => {
      const layerId = `animation-${config.type}-${Date.now()}`;
      
      // Skip if performance threshold not met
      if (config.performanceThreshold && 
          config.performanceThreshold === 'high' && qualityMode === 'low') {
        return;
      }

      // Add animation layers based on config
      if (config.type === 'pulse') {
        // Pulse animation implementation
      } else if (config.type === 'ripple') {
        // Ripple animation implementation
      } else if (config.type === 'path-draw' && trailPath) {
        // Path drawing animation
      } else if (config.type === 'elevation') {
        // Elevation animation
      } else if (config.type === 'water-flow') {
        // Water flow animation
      }

      // Track active layers
      setActiveLayers(prev => [...prev, layerId]);
    });

    onAnimationLoad?.();
  }, [animations, trailPath, onAnimationLoad, activityType, qualityMode]);

  useEffect(() => {
    // Start performance monitoring
    monitorFrameRate();
    const memInterval = setInterval(monitorMemory, 5000);

    // Initialize Mapbox
    if (mapContainer.current && !map.current) {
      // Performance monitoring
      const perfStart = performance.now();
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

      // Adjust quality settings based on mode
      const qualitySettings = {
        high: {
          antialias: true,
          preserveDrawingBuffer: true,
          maxPitch: 60,
          maxZoom: 22
        },
        balanced: {
          antialias: false,
          preserveDrawingBuffer: false,
          maxPitch: 45,
          maxZoom: 18
        },
        low: {
          antialias: false,
          preserveDrawingBuffer: false,
          maxPitch: 30,
          maxZoom: 16
        }
      };

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: currentLocation || [-122.4194, 37.7749], // Default to San Francisco
        zoom: zoom,
        ...qualitySettings[qualityMode],
        interactive: true,
        attributionControl: false
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
        // Add animation layers if provided
        if (animations) {
          addAnimationLayers();
        }

        // Performance logging
        const perfEnd = performance.now();
        console.log(`Map initialized in ${(perfEnd - perfStart).toFixed(2)}ms`);

        // Add trails from API
        if (trails.length > 0) {
          map.current?.addSource('trails', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: trails.map(trail => ({
                type: 'Feature',
                properties: {
                  name: trail.name,
                  difficulty: trail.difficulty
                },
                geometry: {
                  type: 'LineString',
                  coordinates: trail.coordinates
                }
              }))
            }
          });

          map.current?.addLayer({
            id: 'trails',
            type: 'line',
            source: 'trails',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': [
                'match',
                ['get', 'difficulty'],
                'easy', '#2b9348',
                'moderate', '#f9c74f',
                'hard', '#f8961e',
                'expert', '#f94144',
                '#6366f1' // default
              ],
              'line-width': 4
            }
          });

          // Add trail labels
          map.current?.addLayer({
            id: 'trail-labels',
            type: 'symbol',
            source: 'trails',
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Semibold'],
              'text-size': 12,
              'text-offset': [0, 1],
              'text-anchor': 'top'
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1
            }
          });
        }

        // Add manual trail path if provided
        if (trailPath && trailPath.length > 0) {
          map.current?.addSource('manual-trail', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: trailPath.map(point => [point.lng, point.lat])
              }
            }
          });

          map.current?.addLayer({
            id: 'manual-trail',
            type: 'line',
            source: 'manual-trail',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#6366f1',
              'line-width': 4
            }
          });
        }
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
      clearInterval(memInterval);
    }
  }, [currentLocation, trailPath, qualityMode, batteryLevel, memoryThreshold, monitorFrameRate, monitorMemory])

  useEffect(() => {
    manageLayers();
  }, [qualityMode, batteryLevel, memoryUsage, manageLayers])

  // Fetch trails from Flask API
  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true);
      try {
        const response = await flaskApiClient.getTrails();
        if (response.status === 'success' && response.data) {
          setTrails(response.data);
        } else {
          setError(response.error || 'Failed to fetch trails');
        }
      } catch (err) {
        setError('Network error while fetching trails');
      } finally {
        setLoading(false);
      }
    };

    fetchTrails();
  }, []);

  return <div ref={mapContainer} className="h-full w-full" />
}
