// src/components/NeonRose/RadiatingLines.ts
import * as THREE from 'three'
import type { RadiatingLine } from '@/types/neon-rose'

export class RadiatingLines {
  private scene: THREE.Scene
  private lines: RadiatingLine[] = []
  private lineMeshes: THREE.Line[] = []
  // Reserved for future use: center position
  // private readonly centerX: number
  // private readonly centerY: number
  private time = 0

  // Named constants for configuration and magic numbers
  private static readonly DEFAULT_LINE_COUNT = 50
  private static readonly MIN_LINE_LENGTH = 50
  private static readonly RANDOM_LENGTH_ADD = 100
  private static readonly MIN_MAX_LENGTH = 150
  private static readonly RANDOM_MAX_LENGTH_ADD = 200
  private static readonly MIN_SPEED = 0.01
  private static readonly RANDOM_SPEED_ADD = 0.02
  private static readonly MIN_ALPHA = 0.3
  private static readonly RANDOM_ALPHA_ADD = 0.5
  private static readonly TIME_STEP = 0.016
  private static readonly LENGTH_ANIMATION_AMPLITUDE = 2
  private static readonly LENGTH_ANIMATION_SPEED_MULTIPLIER = 100
  private static readonly FLICKER_SPEED_MULTIPLIER = 3
  private static readonly FLICKER_OFFSET_MULTIPLIER = 0.5
  private static readonly FLICKER_BASE = 0.5
  private static readonly FLICKER_AMPLITUDE = 0.5
  private static readonly COLOR_PURPLE = '#9c27b0'
  private static readonly COLOR_BLUE = '#2196f3'
  private static readonly COLOR_CYAN = '#00bcd4'
  private static readonly GRADIENT_THRESHOLD_1 = 0.33
  private static readonly GRADIENT_THRESHOLD_2 = 0.66

  constructor(scene: THREE.Scene, _width: number, _height: number, count: number = RadiatingLines.DEFAULT_LINE_COUNT) {
    this.scene = scene
    // Center position reserved for future use
    // this.centerX = 0
    // this.centerY = 0
    this.initLines(count)
  }

  private initLines(count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const line: RadiatingLine = {
        angle,
        length: Math.random() * RadiatingLines.RANDOM_LENGTH_ADD + RadiatingLines.MIN_LINE_LENGTH,
        maxLength: Math.random() * RadiatingLines.RANDOM_MAX_LENGTH_ADD + RadiatingLines.MIN_MAX_LENGTH,
        speed: Math.random() * RadiatingLines.RANDOM_SPEED_ADD + RadiatingLines.MIN_SPEED,
        color: this.getGradientColor(angle),
        alpha: Math.random() * RadiatingLines.RANDOM_ALPHA_ADD + RadiatingLines.MIN_ALPHA
      }
      this.lines.push(line)
      this.createLineMesh(line, i)
    }
  }

  private getGradientColor(angle: number): string {
    // Purple to cyan gradient based on angle
    const t = (angle + Math.PI) / (Math.PI * 2)
    if (t < RadiatingLines.GRADIENT_THRESHOLD_1) return RadiatingLines.COLOR_PURPLE
    if (t < RadiatingLines.GRADIENT_THRESHOLD_2) return RadiatingLines.COLOR_BLUE
    return RadiatingLines.COLOR_CYAN
  }

  private createLineMesh(line: RadiatingLine, _index: number): void {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(line.color),
      transparent: true,
      opacity: line.alpha,
      blending: THREE.AdditiveBlending
    })

    // Create geometry with 2 points: origin and endpoint
    const positions = new Float32Array([
      0, 0, 0, // Origin (center)
      Math.cos(line.angle) * line.length,
      Math.sin(line.angle) * line.length,
      0 // Endpoint
    ])

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const lineMesh = new THREE.Line(geometry, material)
    this.scene.add(lineMesh)
    this.lineMeshes.push(lineMesh)
  }

  update(): void {
    this.time += RadiatingLines.TIME_STEP

    this.lines.forEach((line, i) => {
      // Animate line length
      line.length += Math.sin(this.time * line.speed * RadiatingLines.LENGTH_ANIMATION_SPEED_MULTIPLIER + i) * RadiatingLines.LENGTH_ANIMATION_AMPLITUDE
      line.length = Math.max(RadiatingLines.MIN_LINE_LENGTH, Math.min(line.maxLength, line.length))

      // Update alpha for flickering effect
      const mesh = this.lineMeshes[i]
      const material = mesh.material as THREE.LineBasicMaterial
      material.opacity = line.alpha * (
        RadiatingLines.FLICKER_BASE +
        Math.sin(this.time * RadiatingLines.FLICKER_SPEED_MULTIPLIER + i * RadiatingLines.FLICKER_OFFSET_MULTIPLIER) *
        RadiatingLines.FLICKER_AMPLITUDE
      )

      // Update geometry by modifying the position attribute directly
      const positions = mesh.geometry.attributes.position.array as Float32Array
      positions[3] = Math.cos(line.angle) * line.length
      positions[4] = Math.sin(line.angle) * line.length
      positions[5] = 0
      mesh.geometry.attributes.position.needsUpdate = true
    })
  }

  dispose(): void {
    this.lineMeshes.forEach(mesh => {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    })
  }
}
