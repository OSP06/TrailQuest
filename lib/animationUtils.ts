"use client"

import { motion } from "framer-motion"
import type { TargetAndTransition, VariantLabels } from "framer-motion"
import { useEffect, useState } from "react"

// Type declarations for Battery Status API
interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>
  }
}

type AnimationTarget = TargetAndTransition | VariantLabels

// Battery/performance aware animation controller
let performanceMode: 'high' | 'medium' | 'low' = 'high'
let frameRate = 60
let frameRateSamples: number[] = []
let lastFrameTime = performance.now()

// Activity types
export type ActivityType = 'hiking' | 'kayaking' | 'rock-climbing' | 'cliff-jumping'

// Activity-specific animation registry
const activityAnimations: Record<ActivityType, AnimationConfig[]> = {
  'hiking': [
    {
      type: 'elevation',
      speed: 0.5,
      colors: ['#2b9348', '#f9c74f', '#f8961e', '#f94144'],
      activityType: 'hiking',
      performanceThreshold: 'medium'
    },
    {
      type: 'path-draw',
      speed: 1.2,
      colors: ['#6366f1'],
      activityType: 'hiking',
      performanceThreshold: 'high'
    }
  ],
  'kayaking': [
    {
      type: 'water-flow',
      speed: 0.8,
      colors: ['#3a86ff', '#48bfe3'],
      activityType: 'kayaking',
      performanceThreshold: 'medium'
    },
    {
      type: 'ripple',
      speed: 1.5,
      colors: ['#3a86ff'],
      activityType: 'kayaking',
      performanceThreshold: 'high'
    }
  ],
  'rock-climbing': [
    {
      type: 'pulse',
      speed: 2,
      colors: ['#f94144', '#f8961e'],
      activityType: 'rock-climbing',
      performanceThreshold: 'high'
    },
    {
      type: 'path-draw',
      speed: 0.7,
      colors: ['#f94144'],
      activityType: 'rock-climbing',
      performanceThreshold: 'medium'
    }
  ],
  'cliff-jumping': [
    {
      type: 'pulse',
      speed: 3,
      colors: ['#2b9348', '#f94144'],
      activityType: 'cliff-jumping',
      performanceThreshold: 'high'
    },
    {
      type: 'elevation',
      speed: 1.2,
      colors: ['#2b9348', '#f9c74f'],
      activityType: 'cliff-jumping',
      performanceThreshold: 'medium'
    }
  ]
}

// Frame rate monitoring
const monitorFrameRate = () => {
  const now = performance.now()
  const delta = now - lastFrameTime
  lastFrameTime = now
  const currentFPS = 1000 / delta
  frameRateSamples.push(currentFPS)
  
  if (frameRateSamples.length > 10) {
    frameRateSamples.shift()
    frameRate = frameRateSamples.reduce((sum, fps) => sum + fps, 0) / frameRateSamples.length
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Check battery status if available
  const nav = navigator as NavigatorWithBattery
  if (nav.getBattery) {
    nav.getBattery().then((battery: BatteryManager) => {
      battery.addEventListener('levelchange', () => {
        performanceMode = battery.level > 0.7 ? 'high' : 
                         battery.level > 0.3 ? 'medium' : 'low'
      })
    })
  }

  // Frame rate monitoring
  requestAnimationFrame(function checkFrameRate() {
    monitorFrameRate()
    requestAnimationFrame(checkFrameRate)
  })
}

export interface AnimationConfig {
  type: 'scale' | 'fade' | 'rotate' | 'pulse' | 'orbit' | 'ripple' | 'path-draw' | 'elevation' | 'water-flow';
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number | 'infinity';
  repeatDelay?: number;
  from?: AnimationTarget;
  to?: AnimationTarget;
  activityType?: ActivityType;
  performanceThreshold?: 'high' | 'medium' | 'low';
  speed?: number;
  colors?: string[];
}

export const registerActivityAnimations = (activity: ActivityType, configs: AnimationConfig[]) => {
  activityAnimations[activity] = configs
}

export const getActivityAnimations = (activity: ActivityType): AnimationConfig[] => {
  return activityAnimations[activity] || []
}

export const getAnimationProps = (config: AnimationConfig, forceEnable = false): {
  initial?: AnimationTarget;
  animate?: AnimationTarget;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
    repeat?: number;
    repeatDelay?: number;
    [key: string]: unknown;
  };
} => {
  const {
    type,
    duration = 0.5,
    delay = 0,
    ease = "easeOut",
    repeat = 0,
    repeatDelay = 0,
    from = {},
    to = {},
    performanceThreshold = 'high'
  } = config

  // Skip animation if performance mode is below threshold
  if (!forceEnable && performanceThreshold === 'high' && performanceMode !== 'high') {
    return {}
  }
  if (!forceEnable && performanceThreshold === 'medium' && performanceMode === 'low') {
    return {}
  }

  // Adjust duration based on frame rate
  const adjustedDuration = frameRate < 30 ? duration * 1.5 : duration

  const baseTransition = {
    duration: adjustedDuration,
    delay,
    ease,
    repeat: repeat === 'infinity' ? Infinity : (repeat || undefined),
    repeatDelay
  }

  const baseProps = {
    initial: typeof from === 'object' ? from : undefined,
    animate: typeof to === 'object' ? to : undefined,
    transition: baseTransition
  }

  switch (type) {
    case 'scale':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { scale: 0, opacity: 0, ...from } : { scale: 0, opacity: 0 },
        animate: typeof to === 'object' ? { scale: 1, opacity: 1, ...to } : { scale: 1, opacity: 1 }
      }
    case 'fade':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { opacity: 0, ...from } : { opacity: 0 },
        animate: typeof to === 'object' ? { opacity: 1, ...to } : { opacity: 1 }
      }
    case 'rotate':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { rotate: 0, ...from } : { rotate: 0 },
        animate: typeof to === 'object' ? { rotate: 360, ...to } : { rotate: 360 },
        transition: {
          ...baseProps.transition,
          ease: 'linear',
          repeat: Infinity
        }
      }
    case 'pulse':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { scale: 0.8, opacity: 1, ...from } : { scale: 0.8, opacity: 1 },
        animate: typeof to === 'object' ? { scale: 1.5, opacity: 0, ...to } : { scale: 1.5, opacity: 0 },
        transition: {
          ...baseProps.transition,
          repeat: repeat === 'infinity' ? Infinity : (repeat || undefined),
          repeatDelay
        }
      }
    case 'orbit':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { rotate: 0, ...from } : { rotate: 0 },
        animate: typeof to === 'object' ? { rotate: 360, ...to } : { rotate: 360 },
        transition: {
          ...baseProps.transition,
          ease: 'linear',
          repeat: Infinity
        }
      }
    case 'ripple':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { scale: 0.5, opacity: 1, ...from } : { scale: 0.5, opacity: 1 },
        animate: typeof to === 'object' ? { scale: 3, opacity: 0, ...to } : { scale: 3, opacity: 0 },
        transition: {
          ...baseTransition,
          repeat: Infinity,
          repeatDelay: 0.5
        }
      }
    case 'path-draw':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { pathLength: 0, ...from } : { pathLength: 0 },
        animate: typeof to === 'object' ? { pathLength: 1, ...to } : { pathLength: 1 },
        transition: {
          ...baseTransition,
          duration: duration * 2
        }
      }
    case 'elevation':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { y: 100, opacity: 0, ...from } : { y: 100, opacity: 0 },
        animate: typeof to === 'object' ? { y: 0, opacity: 1, ...to } : { y: 0, opacity: 1 },
        transition: {
          ...baseTransition,
          staggerChildren: 0.1
        }
      }
    case 'water-flow':
      return {
        ...baseProps,
        initial: typeof from === 'object' ? { x: -100, opacity: 0, ...from } : { x: -100, opacity: 0 },
        animate: typeof to === 'object' ? { x: 100, opacity: 1, ...to } : { x: 100, opacity: 1 },
        transition: {
          ...baseTransition,
          repeat: Infinity,
          repeatType: 'reverse'
        }
      }
    default:
      return baseProps
  }
}

export const createAnimationSequence = (configs: AnimationConfig[]) => {
  return configs.map((config, index) => ({
    ...config,
    delay: config.delay !== undefined ? config.delay : index * 0.1
  }))
}
