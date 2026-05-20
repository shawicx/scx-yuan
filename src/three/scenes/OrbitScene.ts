import * as THREE from 'three'
import BaseScene from './BaseScene'

export interface OrbitSceneConfig {
  orbitRadius: number
  orbitSpeed: number
  body1Color: string
  body2Color: string
  trailLength: number
}

const DEFAULT_CONFIG: OrbitSceneConfig = {
  orbitRadius: 15,
  orbitSpeed: 0.5,
  body1Color: '#4edee9',
  body2Color: '#e94ed9',
  trailLength: 100
}

export default class OrbitScene extends BaseScene {
  private body1: THREE.Mesh | null = null
  private body2: THREE.Mesh | null = null
  private centerBody: THREE.Mesh | null = null
  private trail1: THREE.Line | null = null
  private trail2: THREE.Line | null = null
  private trail1Positions: Float32Array | null = null
  private trail2Positions: Float32Array | null = null
  private trail1Index = 0
  private trail2Index = 0
  private config: OrbitSceneConfig
  private orbitTime = 0
  private targetSpeed = 0.5
  private currentSpeed = 0.5

  constructor(config: Partial<OrbitSceneConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.targetSpeed = this.config.orbitSpeed
    this.currentSpeed = this.config.orbitSpeed
  }

  create(): THREE.Group {
    // Center body (the anchor)
    const centerGeometry = new THREE.SphereGeometry(2, 32, 32)
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    })
    this.centerBody = new THREE.Mesh(centerGeometry, centerMaterial)
    this.centerBody.position.z = -30
    this.group.add(this.centerBody)

    // Orbiting body 1
    const body1Geometry = new THREE.SphereGeometry(1.2, 32, 32)
    const body1Material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.config.body1Color),
      transparent: true,
      opacity: 0.9
    })
    this.body1 = new THREE.Mesh(body1Geometry, body1Material)
    this.body1.position.z = -30
    this.group.add(this.body1)

    // Orbiting body 2
    const body2Geometry = new THREE.SphereGeometry(1, 32, 32)
    const body2Material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.config.body2Color),
      transparent: true,
      opacity: 0.9
    })
    this.body2 = new THREE.Mesh(body2Geometry, body2Material)
    this.body2.position.z = -30
    this.group.add(this.body2)

    // Initialize trail arrays
    this.trail1Positions = new Float32Array(this.config.trailLength * 3)
    this.trail2Positions = new Float32Array(this.config.trailLength * 3)

    // Create trail geometries
    const trail1Geometry = new THREE.BufferGeometry()
    trail1Geometry.setAttribute('position', new THREE.BufferAttribute(this.trail1Positions, 3))
    const trail1Material = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.config.body1Color),
      transparent: true,
      opacity: 0.5
    })
    this.trail1 = new THREE.Line(trail1Geometry, trail1Material)
    this.trail1.position.z = -30
    this.group.add(this.trail1)

    const trail2Geometry = new THREE.BufferGeometry()
    trail2Geometry.setAttribute('position', new THREE.BufferAttribute(this.trail2Positions, 3))
    const trail2Material = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.config.body2Color),
      transparent: true,
      opacity: 0.5
    })
    this.trail2 = new THREE.Line(trail2Geometry, trail2Material)
    this.trail2.position.z = -30
    this.group.add(this.trail2)

    // Add subtle orbit rings
    const orbitRingGeometry = new THREE.RingGeometry(this.config.orbitRadius - 0.1, this.config.orbitRadius + 0.1, 64)
    const orbitRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    })
    const orbitRing = new THREE.Mesh(orbitRingGeometry, orbitRingMaterial)
    orbitRing.position.z = -30
    this.group.add(orbitRing)

    return this.group
  }

  updateTrail(positions: Float32Array, index: number, pos: THREE.Vector3): number {
    positions[index * 3] = pos.x
    positions[index * 3 + 1] = pos.y
    positions[index * 3 + 2] = pos.z
    return (index + 1) % this.config.trailLength
  }

  update(deltaTime: number): void {
    this.orbitTime += deltaTime * 0.001

    // Smooth speed transition
    this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.05

    // Calculate orbit positions
    const angle1 = this.orbitTime * this.currentSpeed
    const angle2 = this.orbitTime * this.currentSpeed + Math.PI

    const x1 = Math.cos(angle1) * this.config.orbitRadius
    const y1 = Math.sin(angle1) * this.config.orbitRadius

    const x2 = Math.cos(angle2) * this.config.orbitRadius
    const y2 = Math.sin(angle2) * this.config.orbitRadius

    if (this.body1) {
      this.body1.position.set(x1, y1, -30)
      this.trail1Index = this.updateTrail(this.trail1Positions!, this.trail1Index, this.body1.position)
    }

    if (this.body2) {
      this.body2.position.set(x2, y2, -30)
      this.trail2Index = this.updateTrail(this.trail2Positions!, this.trail2Index, this.body2.position)
    }

    // Update trail geometries
    if (this.trail1) {
      this.trail1.geometry.setDrawRange(0, this.config.trailLength)
      this.trail1.geometry.attributes.position.needsUpdate = true
    }

    if (this.trail2) {
      this.trail2.geometry.setDrawRange(0, this.config.trailLength)
      this.trail2.geometry.attributes.position.needsUpdate = true
    }

    // Pulse center body
    if (this.centerBody) {
      const scale = 1 + Math.sin(this.orbitTime * 2) * 0.1
      this.centerBody.scale.setScalar(scale)
    }

    // Rotate entire group slowly
    this.group.rotation.z = this.orbitTime * 0.05
  }

  setOrbitSpeed(speed: number): void {
    this.targetSpeed = speed
  }

  setOrbitRadius(radius: number): void {
    this.config.orbitRadius = radius
  }

  dispose(): void {
    if (this.body1) {
      this.body1.geometry.dispose()
      if (this.body1.material instanceof THREE.Material) {
        this.body1.material.dispose()
      }
    }

    if (this.body2) {
      this.body2.geometry.dispose()
      if (this.body2.material instanceof THREE.Material) {
        this.body2.material.dispose()
      }
    }

    if (this.centerBody) {
      this.centerBody.geometry.dispose()
      if (this.centerBody.material instanceof THREE.Material) {
        this.centerBody.material.dispose()
      }
    }

    if (this.trail1) {
      this.trail1.geometry.dispose()
      if (this.trail1.material instanceof THREE.Material) {
        this.trail1.material.dispose()
      }
    }

    if (this.trail2) {
      this.trail2.geometry.dispose()
      if (this.trail2.material instanceof THREE.Material) {
        this.trail2.material.dispose()
      }
    }
  }
}
