import * as THREE from 'three'
import BaseScene from './BaseScene'
import starfieldVertexShader from '@/assets/shaders/starfield.vert.glsl?raw'
import starfieldFragmentShader from '@/assets/shaders/starfield.frag.glsl?raw'

export default class StarfieldScene extends BaseScene {
  private points: THREE.Points | null = null
  private material: THREE.ShaderMaterial | null = null
  private readonly particleCount = 2000

  create(): THREE.Group {
    // Create geometry
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(this.particleCount * 3)

    for (let i = 0; i < this.particleCount * 3; i += 3) {
      // Distribute stars in a sphere
      const radius = 100 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Create shader material
    this.material = new THREE.ShaderMaterial({
      vertexShader: starfieldVertexShader,
      fragmentShader: starfieldFragmentShader,
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    // Create points
    this.points = new THREE.Points(geometry, this.material)
    this.group.add(this.points)

    return this.group
  }

  update(deltaTime: number): void {
    this.time = deltaTime

    if (this.material) {
      this.material.uniforms.time.value = this.time
    }

    // Slow rotation of the entire starfield
    if (this.points) {
      this.points.rotation.y = this.time * 0.01
    }
  }

  dispose(): void {
    if (this.points) {
      this.points.geometry.dispose()
      if (this.material) {
        this.material.dispose()
      }
    }
  }
}
