// src/components/NeonRose/RoseCluster.ts
import type { RoseConfig, MousePosition } from '@/types/neon-rose'

// Track original positions to fix drift bug
interface RoseWithOriginal extends RoseConfig {
  originalX: number
  originalY: number
}

export class RoseCluster {
  // Named constants for magic numbers
  private static readonly ANIMATION_TIME_STEP = 0.005
  private static readonly FLOAT_AMPLITUDE = 0.3
  private static readonly FLOAT_SPACING = 0.5
  private static readonly ROTATION_SPEED = 0.5
  private static readonly ROTATION_AMPLITUDE = 0.002
  private static readonly MOUSE_INTERACTION_RADIUS = 100
  private static readonly MOUSE_REPULSION_FORCE = 0.02
  private static readonly CLUSTER_SPREAD = 60
  private static readonly MIN_ROSE_SIZE = 15
  private static readonly MAX_ROSE_SIZE_ADD = 20
  private static readonly MIN_PETAL_COUNT = 5
  private static readonly MAX_PETAL_COUNT_ADD = 3
  private static readonly GLOW_BLUR = 15
  private static readonly LAYER_SIZE_REDUCTION = 0.2
  private static readonly PETAL_CONTROL_POINTS = [0.5, 0.3, 0.8, 0.6] as const
  private static readonly LAYER_ALPHA_BASE = 0.6
  private static readonly LAYER_ALPHA_REDUCTION = 0.15
  private static readonly CENTER_GLOW_RATIO = 0.2

  private ctx: CanvasRenderingContext2D
  private roses: RoseWithOriginal[] = []
  private time = 0

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.initRoses(width, height)
  }

  private initRoses(width: number, height: number): void {
    const centerX = width / 2
    const centerY = height / 2

    // Create rose clusters around the heart
    const clusters = [
      { x: centerX - 100, y: centerY - 80, count: 4 },
      { x: centerX + 100, y: centerY - 80, count: 3 },
      { x: centerX, y: centerY + 100, count: 5 },
      { x: centerX - 80, y: centerY + 50, count: 2 },
      { x: centerX + 80, y: centerY + 50, count: 2 }
    ]

    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        const originalX = cluster.x + (Math.random() - 0.5) * RoseCluster.CLUSTER_SPREAD
        const originalY = cluster.y + (Math.random() - 0.5) * RoseCluster.CLUSTER_SPREAD

        this.roses.push({
          x: originalX,
          y: originalY,
          originalX,
          originalY,
          size: Math.random() * RoseCluster.MAX_ROSE_SIZE_ADD + RoseCluster.MIN_ROSE_SIZE,
          rotation: Math.random() * Math.PI * 2,
          petalCount: Math.floor(Math.random() * RoseCluster.MAX_PETAL_COUNT_ADD) + RoseCluster.MIN_PETAL_COUNT,
          color: '#ff1744',
          glowColor: '#ff80ab'
        })
      }
    })
  }

  private drawRose(rose: RoseConfig): void {
    this.ctx.save()
    this.ctx.translate(rose.x, rose.y)
    this.ctx.rotate(rose.rotation)

    // Glow effect
    this.ctx.shadowBlur = RoseCluster.GLOW_BLUR
    this.ctx.shadowColor = rose.glowColor

    // Draw petals layer by layer
    for (let layer = 0; layer < 3; layer++) {
      const layerSize = rose.size * (1 - layer * RoseCluster.LAYER_SIZE_REDUCTION)
      const layerRotation = layer * Math.PI / rose.petalCount

      for (let i = 0; i < rose.petalCount; i++) {
        const angle = (i / rose.petalCount) * Math.PI * 2 + layerRotation
        this.ctx.save()
        this.ctx.rotate(angle)

        // Draw petal using bezier curves
        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.bezierCurveTo(
          layerSize * RoseCluster.PETAL_CONTROL_POINTS[0],
          -layerSize * RoseCluster.PETAL_CONTROL_POINTS[1],
          layerSize * RoseCluster.PETAL_CONTROL_POINTS[2],
          -layerSize * RoseCluster.PETAL_CONTROL_POINTS[3],
          layerSize, 0
        )
        this.ctx.bezierCurveTo(
          layerSize * RoseCluster.PETAL_CONTROL_POINTS[2],
          layerSize * RoseCluster.PETAL_CONTROL_POINTS[3],
          layerSize * RoseCluster.PETAL_CONTROL_POINTS[0],
          layerSize * RoseCluster.PETAL_CONTROL_POINTS[1],
          0, 0
        )

        const alpha = RoseCluster.LAYER_ALPHA_BASE - layer * RoseCluster.LAYER_ALPHA_REDUCTION
        this.ctx.fillStyle = `rgba(255, 23, 68, ${alpha})`
        this.ctx.fill()
        this.ctx.restore()
      }
    }

    // Center glow
    this.ctx.beginPath()
    this.ctx.arc(0, 0, rose.size * RoseCluster.CENTER_GLOW_RATIO, 0, Math.PI * 2)
    this.ctx.fillStyle = 'rgba(255, 128, 171, 0.8)'
    this.ctx.fill()

    this.ctx.restore()
  }

  update(mouse: MousePosition): void {
    this.time += RoseCluster.ANIMATION_TIME_STEP

    // Animate roses - gentle float around original position
    this.roses.forEach((rose, i) => {
      // Calculate base position with floating animation
      const floatOffsetY = Math.sin(this.time + i * RoseCluster.FLOAT_SPACING) * RoseCluster.FLOAT_AMPLITUDE

      // Apply mouse interaction with return-to-original behavior
      const dx = mouse.x - rose.x
      const dy = mouse.y - rose.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < RoseCluster.MOUSE_INTERACTION_RADIUS) {
        // Mouse is near - apply repulsion
        const force = (RoseCluster.MOUSE_INTERACTION_RADIUS - dist) / RoseCluster.MOUSE_INTERACTION_RADIUS
        rose.x -= dx * force * RoseCluster.MOUSE_REPULSION_FORCE
        rose.y -= dy * force * RoseCluster.MOUSE_REPULSION_FORCE
      } else {
        // Mouse is far - return to original position with float offset
        const returnDx = rose.originalX - rose.x
        const returnDy = (rose.originalY + floatOffsetY) - rose.y
        rose.x += returnDx * 0.05
        rose.y += returnDy * 0.05
      }

      // Apply gentle rotation
      rose.rotation += Math.sin(this.time * RoseCluster.ROTATION_SPEED + i) * RoseCluster.ROTATION_AMPLITUDE
    })
  }

  render(): void {
    this.roses.forEach(rose => this.drawRose(rose))
  }

  resize(width: number, height: number): void {
    this.roses = []
    this.initRoses(width, height)
  }
}
