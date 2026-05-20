// src/components/NeonRose/HeartOutline.ts
import type { HeartPathPoint, Particle, MousePosition } from '@/types/neon-rose'

export class HeartOutline {
  // Named constants for magic numbers
  private static readonly HEART_CENTER_Y_OFFSET = -50
  private static readonly HEART_SCALE_FACTOR = 35
  private static readonly PARTICLE_MIN_SIZE = 2
  private static readonly PARTICLE_MAX_SIZE = 5 // 3 + 2
  private static readonly MOUSE_INTERACTION_RADIUS = 150
  private static readonly MOUSE_REPULSION_FORCE = 0.05
  private static readonly PARTICLE_FLOW_SPEED = 20
  private static readonly PARTICLE_SPACING = 3

  private ctx: CanvasRenderingContext2D
  private points: HeartPathPoint[] = []
  private particles: Particle[] = []
  private readonly particleCount = 100
  private time = 0

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.generateHeartPath(width, height)
    this.initParticles()
  }

  private generateHeartPath(width: number, height: number): void {
    const centerX = width / 2
    const centerY = height / 2 + HeartOutline.HEART_CENTER_Y_OFFSET
    const scale = Math.min(width, height) / HeartOutline.HEART_SCALE_FACTOR

    // Parametric heart equation
    for (let t = 0; t <= Math.PI * 2; t += 0.01) {
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
      this.points.push({
        x: centerX + x * scale,
        y: centerY + y * scale,
        t: t / (Math.PI * 2)
      })
    }
  }

  private initParticles(): void {
    for (let i = 0; i < this.particleCount; i++) {
      const pointIndex = Math.floor(Math.random() * this.points.length)
      const point = this.points[pointIndex]
      this.particles.push({
        x: point.x,
        y: point.y,
        // vx/vy are part of the Particle type contract (used by other components)
        // Set to 0 here since HeartOutline uses path-based animation
        vx: 0,
        vy: 0,
        size: Math.random() * (HeartOutline.PARTICLE_MAX_SIZE - HeartOutline.PARTICLE_MIN_SIZE) + HeartOutline.PARTICLE_MIN_SIZE,
        alpha: Math.random() * 0.5 + 0.5,
        color: Math.random() > 0.3 ? '#ff3366' : '#00ffcc'
      })
    }
  }

  update(mouse: MousePosition): void {
    this.time += 0.01

    // Update particles to flow along heart path
    this.particles.forEach((p, i) => {
      const baseIndex = Math.floor((this.time * HeartOutline.PARTICLE_FLOW_SPEED + i * HeartOutline.PARTICLE_SPACING) % this.points.length)
      const targetPoint = this.points[baseIndex]

      // Smooth movement towards target position
      const dx = targetPoint.x - p.x
      const dy = targetPoint.y - p.y
      p.x += dx * 0.1
      p.y += dy * 0.1

      // Mouse interaction
      const mdx = mouse.x - p.x
      const mdy = mouse.y - p.y
      const dist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (dist < HeartOutline.MOUSE_INTERACTION_RADIUS) {
        const force = (HeartOutline.MOUSE_INTERACTION_RADIUS - dist) / HeartOutline.MOUSE_INTERACTION_RADIUS
        p.x -= mdx * force * HeartOutline.MOUSE_REPULSION_FORCE
        p.y -= mdy * force * HeartOutline.MOUSE_REPULSION_FORCE
      }

      // Pulse alpha
      p.alpha = 0.5 + Math.sin(this.time * 2 + i * 0.1) * 0.3
    })
  }

  render(): void {
    // Draw heart outline glow
    this.ctx.shadowBlur = 20
    this.ctx.shadowColor = '#ff3366'
    this.ctx.strokeStyle = '#ff3366'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.points.forEach((p, i) => {
      if (i === 0) this.ctx.moveTo(p.x, p.y)
      else this.ctx.lineTo(p.x, p.y)
    })
    this.ctx.closePath()
    this.ctx.stroke()

    // Draw inner cyan glow
    this.ctx.shadowColor = '#00ffcc'
    this.ctx.strokeStyle = '#00ffcc'
    this.ctx.lineWidth = 1
    this.ctx.stroke()

    // Draw particles
    this.particles.forEach(p => {
      this.ctx.shadowBlur = 10
      this.ctx.shadowColor = p.color
      this.ctx.fillStyle = p.color
      this.ctx.globalAlpha = p.alpha
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      this.ctx.fill()
    })
    this.ctx.globalAlpha = 1
  }

  resize(width: number, height: number): void {
    this.points = []
    this.particles = []
    this.generateHeartPath(width, height)
    this.initParticles()
  }
}
