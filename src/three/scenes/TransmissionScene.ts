import * as THREE from 'three'
import BaseScene from './BaseScene'

export interface TransmissionSceneConfig {
  signalColor: string
  waveSpeed: number
  maxDistance: number
}

const DEFAULT_CONFIG: TransmissionSceneConfig = {
  signalColor: '#4edee9',
  waveSpeed: 2,
  maxDistance: 100
}

interface Wave {
  mesh: THREE.Mesh
  progress: number
  active: boolean
}

export default class TransmissionScene extends BaseScene {
  private waves: Wave[] = []
  private maxWaves = 5
  private config: TransmissionSceneConfig
  private transmissionTime = 0
  private transmitting = false
  private sourceLight: THREE.PointLight | null = null
  private sourceMesh: THREE.Mesh | null = null

  constructor(config: Partial<TransmissionSceneConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  create(): THREE.Group {
    // Source point (transmitter)
    const sourceGeometry = new THREE.SphereGeometry(1.5, 32, 32)
    const sourceMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.config.signalColor)
    })
    this.sourceMesh = new THREE.Mesh(sourceGeometry, sourceMaterial)
    this.sourceMesh.position.z = -30
    this.group.add(this.sourceMesh)

    // Point light at source
    this.sourceLight = new THREE.PointLight(
      new THREE.Color(this.config.signalColor),
      1,
      50
    )
    this.sourceLight.position.z = -30
    this.group.add(this.sourceLight)

    // Create wave pool
    for (let i = 0; i < this.maxWaves; i++) {
      const wave = this.createWave()
      wave.active = false
      wave.mesh.visible = false
      this.waves.push(wave)
      this.group.add(wave.mesh)
    }

    return this.group
  }

  private createWave(): Wave {
    const geometry = new THREE.RingGeometry(0.1, 0.5, 64)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.config.signalColor),
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = -30
    mesh.visible = false

    return {
      mesh,
      progress: 0,
      active: false
    }
  }

  transmit(): void {
    if (this.transmitting) return

    // Find inactive wave and activate it
    const inactiveWave = this.waves.find(w => !w.active)
    if (inactiveWave) {
      inactiveWave.active = true
      inactiveWave.progress = 0
      inactiveWave.mesh.visible = true
      inactiveWave.mesh.scale.setScalar(1)
      const mat = inactiveWave.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0.8
    }

    // Pulse source
    if (this.sourceMesh && this.sourceLight) {
      gsap.to(this.sourceMesh.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      })

      gsap.to(this.sourceLight, {
        intensity: 2,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      })
    }
  }

  update(deltaTime: number): void {
    this.transmissionTime += deltaTime * 0.001

    // Animate source (gentle pulsing)
    if (this.sourceMesh) {
      const pulse = 1 + Math.sin(this.transmissionTime * 3) * 0.1
      this.sourceMesh.scale.setScalar(pulse)
    }

    // Update waves
    for (const wave of this.waves) {
      if (!wave.active) continue

      wave.progress += deltaTime * 0.001 * this.config.waveSpeed

      const scale = 1 + wave.progress * this.config.maxDistance
      wave.mesh.scale.setScalar(scale)

      // Fade out as it expands
      const opacity = 0.8 * (1 - wave.progress)
      const mat = wave.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = opacity

      // Deactivate when fully faded
      if (wave.progress >= 1) {
        wave.active = false
        wave.mesh.visible = false
      }
    }

    // Slow rotation
    this.group.rotation.z = this.transmissionTime * 0.02
  }

  setTransmitting(value: boolean): void {
    this.transmitting = value
    if (value) {
      // Auto transmit every 2 seconds
      this.transmitInterval = setInterval(() => {
        this.transmit()
      }, 2000)
    } else {
      if (this.transmitInterval) {
        clearInterval(this.transmitInterval)
        this.transmitInterval = null
      }
    }
  }

  private transmitInterval: number | null = null

  dispose(): void {
    if (this.transmitInterval) {
      clearInterval(this.transmitInterval)
    }

    for (const wave of this.waves) {
      wave.mesh.geometry.dispose()
      if (wave.mesh.material instanceof THREE.Material) {
        wave.mesh.material.dispose()
      }
    }

    if (this.sourceMesh) {
      this.sourceMesh.geometry.dispose()
      if (this.sourceMesh.material instanceof THREE.Material) {
        this.sourceMesh.material.dispose()
      }
    }

    if (this.sourceLight) {
      this.sourceLight.dispose()
    }
  }
}

// Import gsap for animations
import gsap from 'gsap'
