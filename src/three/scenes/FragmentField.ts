import * as THREE from 'three'
import BaseScene from './BaseScene'

export interface FragmentFieldConfig {
  count: number
  spread: number
  driftSpeed: number
  fragmentSize: number
  colors: string[]
}

const DEFAULT_CONFIG: FragmentFieldConfig = {
  count: 150,
  spread: 80,
  driftSpeed: 0.3,
  fragmentSize: 1.5,
  colors: ['#4edee9', '#e94ed9', '#4ee99d', '#e9e94e']
}

interface Fragment {
  mesh: THREE.Mesh
  basePos: THREE.Vector3
  velocity: THREE.Vector3
  rotationSpeed: THREE.Vector3
}

export default class FragmentField extends BaseScene {
  private fragments: Fragment[] = []
  private material: THREE.MeshBasicMaterial | null = null
  private config: FragmentFieldConfig
  private mousePos = new THREE.Vector2()
  private targetMousePos = new THREE.Vector2()

  constructor(config: Partial<FragmentFieldConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  create(): THREE.Group {
    // Create shared material for all fragments
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    })

    // Create fragments
    for (let i = 0; i < this.config.count; i++) {
      const fragment = this.createFragment(i)
      this.fragments.push(fragment)
      this.group.add(fragment.mesh)
    }

    // Listen for mouse movement
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('touchmove', this.onTouchMove)

    return this.group
  }

  private createFragment(index: number): Fragment {
    // Random geometry type
    const geometries = [
      new THREE.PlaneGeometry(this.config.fragmentSize, this.config.fragmentSize),
      new THREE.PlaneGeometry(this.config.fragmentSize * 1.5, this.config.fragmentSize * 0.5),
      new THREE.CircleGeometry(this.config.fragmentSize * 0.6, 6)
    ]
    const geometry = geometries[Math.floor(Math.random() * geometries.length)]

    const material = this.material!.clone()
    const colorHex = this.config.colors[index % this.config.colors.length]
    material.color = new THREE.Color(colorHex)
    material.opacity = 0.3 + Math.random() * 0.5

    const mesh = new THREE.Mesh(geometry, material)

    // Random position in spread
    const basePos = new THREE.Vector3(
      (Math.random() - 0.5) * this.config.spread,
      (Math.random() - 0.5) * this.config.spread,
      (Math.random() - 0.5) * 40 - 20
    )

    mesh.position.copy(basePos)

    // Random rotation
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )

    // Random velocity for drifting
    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * this.config.driftSpeed,
      (Math.random() - 0.5) * this.config.driftSpeed,
      (Math.random() - 0.5) * this.config.driftSpeed * 0.5
    )

    // Rotation speed
    const rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    )

    return { mesh, basePos, velocity, rotationSpeed }
  }

  private onMouseMove = (e: MouseEvent): void => {
    this.targetMousePos.x = (e.clientX / window.innerWidth) * 2 - 1
    this.targetMousePos.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  private onTouchMove = (e: TouchEvent): void => {
    if (e.touches.length > 0) {
      this.targetMousePos.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
      this.targetMousePos.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
    }
  }

  update(deltaTime: number): void {
    // Smooth mouse following
    this.mousePos.lerp(this.targetMousePos, 0.05)

    const mouseWorldPos = new THREE.Vector3(
      this.mousePos.x * this.config.spread * 0.5,
      this.mousePos.y * this.config.spread * 0.5,
      0
    )

    for (const fragment of this.fragments) {
      // Apply velocity drift
      fragment.mesh.position.add(fragment.velocity)

      // Rotate fragment
      fragment.mesh.rotation.x += fragment.rotationSpeed.x
      fragment.mesh.rotation.y += fragment.rotationSpeed.y
      fragment.mesh.rotation.z += fragment.rotationSpeed.z

      // Mouse attraction - fragments are gently pulled toward cursor
      const distToMouse = fragment.mesh.position.distanceTo(mouseWorldPos)
      if (distToMouse < 25) {
        const attractionStrength = (1 - distToMouse / 25) * 0.3
        const direction = new THREE.Vector3()
          .subVectors(mouseWorldPos, fragment.mesh.position)
          .normalize()
        fragment.mesh.position.add(direction.multiplyScalar(attractionStrength))
      }

      // Wrap around boundaries
      const halfSpread = this.config.spread / 2
      if (fragment.mesh.position.x > halfSpread) fragment.mesh.position.x = -halfSpread
      if (fragment.mesh.position.x < -halfSpread) fragment.mesh.position.x = halfSpread
      if (fragment.mesh.position.y > halfSpread) fragment.mesh.position.y = -halfSpread
      if (fragment.mesh.position.y < -halfSpread) fragment.mesh.position.y = halfSpread

      // Gentle float animation
      fragment.mesh.position.z += Math.sin(deltaTime + fragment.mesh.position.x) * 0.01
    }
  }

  dispose(): void {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('touchmove', this.onTouchMove)

    for (const fragment of this.fragments) {
      fragment.mesh.geometry.dispose()
      if (fragment.mesh.material instanceof THREE.Material) {
        fragment.mesh.material.dispose()
      }
    }

    if (this.material) {
      this.material.dispose()
    }
  }

  setGatherState(gathered: boolean): void {
    const targetSpread = gathered ? 0.1 : 1
    for (const fragment of this.fragments) {
      fragment.basePos.multiplyScalar(targetSpread)
    }
  }
}
