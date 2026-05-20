// src/types/neon-rose.ts

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

export interface HeartPathPoint {
  x: number
  y: number
  t: number // parameter along path (0-1)
}

export interface RoseConfig {
  x: number
  y: number
  size: number
  rotation: number
  petalCount: number
  color: string
  glowColor: string
}

export interface RadiatingLine {
  angle: number
  length: number
  maxLength: number
  speed: number
  color: string
  alpha: number
}

export interface Sparkle {
  x: number
  y: number
  z: number
  size: number
  alpha: number
  twinkleSpeed: number
}

export interface NeonRoseSceneConfig {
  width: number
  height: number
  particleCount: number
  sparkleCount: number
  lineCount: number
}

export interface MousePosition {
  x: number
  y: number
}
