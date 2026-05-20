// src/components/NeonRose/SparkleParticles.ts
import * as THREE from 'three'
import type { Sparkle } from '@/types/neon-rose'

export class SparkleParticles {
  private static readonly CANVAS_SIZE = 32
  private static readonly STAR_POINTS = 5
  private static readonly STAR_ANGLE_MULTIPLIER = 4
  private static readonly STAR_ANGLE_OFFSET = Math.PI / 2
  private static readonly STAR_CENTER = 16
  private static readonly STAR_RADIUS = 14
  private static readonly PARTICLE_SIZE = 8
  private static readonly PARTICLE_OPACITY = 0.8
  private static readonly TIME_STEP = 0.016
  private static readonly TWINKLE_ALPHA_MIN = 0.3
  private static readonly TWINKLE_ALPHA_AMPLITUDE = 0.7
  private static readonly DRIFT_SPEED = 0.1
  private static readonly DRIFT_OFFSET = 0.01
  private static readonly WIDTH_SPREAD = 1.5
  private static readonly HEIGHT_SPREAD = 1.5
  private static readonly Z_RANGE = 50
  private static readonly Z_OFFSET = 25
  private static readonly MIN_SIZE = 1
  private static readonly SIZE_RANGE = 3
  private static readonly MIN_TWINKLE_SPEED = 1
  private static readonly TWINKLE_SPEED_RANGE = 2

  private scene: THREE.Scene
  private sparkles: Sparkle[] = []
  private points: THREE.Points | null = null
  private readonly count: number
  private time = 0

  constructor(scene: THREE.Scene, width: number, height: number, count: number = 100) {
    this.scene = scene
    this.count = count
    this.initSparkles(width, height)
    this.createPoints()
  }

  private initSparkles(width: number, height: number): void {
    for (let i = 0; i < this.count; i++) {
      this.sparkles.push({
        x: (Math.random() - 0.5) * width * SparkleParticles.WIDTH_SPREAD,
        y: (Math.random() - 0.5) * height * SparkleParticles.HEIGHT_SPREAD,
        z: Math.random() * SparkleParticles.Z_RANGE - SparkleParticles.Z_OFFSET,
        size: Math.random() * SparkleParticles.SIZE_RANGE + SparkleParticles.MIN_SIZE,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * SparkleParticles.TWINKLE_SPEED_RANGE + SparkleParticles.MIN_TWINKLE_SPEED
      })
    }
  }

  private createPoints(): void {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(this.count * 3)
    const sizes = new Float32Array(this.count)
    const alphas = new Float32Array(this.count)

    for (let i = 0; i < this.count; i++) {
      positions[i * 3] = this.sparkles[i].x
      positions[i * 3 + 1] = this.sparkles[i].y
      positions[i * 3 + 2] = this.sparkles[i].z
      sizes[i] = this.sparkles[i].size
      alphas[i] = this.sparkles[i].alpha
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))

    // Create star-shaped texture
    const canvas = document.createElement('canvas')
    canvas.width = SparkleParticles.CANVAS_SIZE
    canvas.height = SparkleParticles.CANVAS_SIZE
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    for (let i = 0; i < SparkleParticles.STAR_POINTS; i++) {
      const angle = (i * SparkleParticles.STAR_ANGLE_MULTIPLIER * Math.PI) / SparkleParticles.STAR_POINTS - SparkleParticles.STAR_ANGLE_OFFSET
      const x = SparkleParticles.STAR_CENTER + Math.cos(angle) * SparkleParticles.STAR_RADIUS
      const y = SparkleParticles.STAR_CENTER + Math.sin(angle) * SparkleParticles.STAR_RADIUS
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: SparkleParticles.PARTICLE_SIZE,
      map: texture,
      transparent: true,
      opacity: SparkleParticles.PARTICLE_OPACITY,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    this.points = new THREE.Points(geometry, material)
    this.scene.add(this.points)
  }

  update(): void {
    this.time += SparkleParticles.TIME_STEP

    if (!this.points) return

    const positions = this.points.geometry.attributes.position.array as Float32Array
    const alphas = this.points.geometry.attributes.alpha.array as Float32Array

    for (let i = 0; i < this.count; i++) {
      // Twinkle effect
      this.sparkles[i].alpha = SparkleParticles.TWINKLE_ALPHA_MIN + Math.sin(this.time * this.sparkles[i].twinkleSpeed + i) * SparkleParticles.TWINKLE_ALPHA_AMPLITUDE
      alphas[i] = this.sparkles[i].alpha

      // Slow drift
      positions[i * 3] += Math.sin(this.time * SparkleParticles.DRIFT_SPEED + i * SparkleParticles.DRIFT_OFFSET) * SparkleParticles.DRIFT_SPEED
      positions[i * 3 + 1] += Math.cos(this.time * SparkleParticles.DRIFT_SPEED + i * SparkleParticles.DRIFT_OFFSET) * SparkleParticles.DRIFT_SPEED
    }

    this.points.geometry.attributes.position.needsUpdate = true
    this.points.geometry.attributes.alpha.needsUpdate = true
  }

  dispose(): void {
    if (this.points) {
      this.scene.remove(this.points)
      this.points.geometry.dispose()
      ;(this.points.material as THREE.Material).dispose()
    }
  }
}
