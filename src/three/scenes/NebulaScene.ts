import * as THREE from 'three'
import BaseScene from './BaseScene'
import nebulaVertexShader from '@/assets/shaders/nebula.vert.glsl?raw'
import nebulaFragmentShader from '@/assets/shaders/nebula.frag.glsl?raw'

export interface NebulaSceneConfig {
  color1: string
  color2: string
  intensity: number
}

const DEFAULT_CONFIG: NebulaSceneConfig = {
  color1: '#2d4a6f',
  color2: '#3d2a5c',
  intensity: 0.8
}

interface BurstParticle {
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  life: number
  maxLife: number
}

export default class NebulaScene extends BaseScene {
  private mesh: THREE.Mesh | null = null
  private material: THREE.ShaderMaterial | null = null
  private config: NebulaSceneConfig
  private burstParticles: BurstParticle[] = []
  private cameraShake: number = 0
  private continuousBurstTimer: number = 0
  private ambientParticles: THREE.Points | null = null
  private flashIntensity: number = 0

  constructor(config: Partial<NebulaSceneConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  create(): THREE.Group {
    // Main nebula plane
    const geometry = new THREE.PlaneGeometry(200, 200, 1, 1)

    this.material = new THREE.ShaderMaterial({
      vertexShader: nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(this.config.color1) },
        color2: { value: new THREE.Color(this.config.color2) },
        intensity: { value: this.config.intensity }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.z = -50
    this.group.add(this.mesh)

    // Create ambient floating particles
    this.createAmbientParticles()

    return this.group
  }

  private createAmbientParticles(): void {
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = Math.random() * 80 + 20
      const angle = Math.random() * Math.PI * 2

      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = Math.sin(angle) * radius
      positions[i3 + 2] = -30 - Math.random() * 40

      sizes[i] = Math.random() * 2 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(this.config.color1) }
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          pos.x += sin(time * 0.5 + position.y * 0.1) * 2.0;
          pos.y += cos(time * 0.3 + position.x * 0.1) * 2.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          float dist = length(position.xy);
          vAlpha = 0.3 + 0.3 * sin(time + dist * 0.1);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = (1.0 - dist * 2.0) * vAlpha;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    this.ambientParticles = new THREE.Points(geometry, material)
    this.group.add(this.ambientParticles)
  }

  update(deltaTime: number): void {
    // Update base material
    if (this.material) {
      this.material.uniforms.time.value = deltaTime

      // Update flash effect
      if (this.flashIntensity > 0) {
        this.flashIntensity *= 0.92
        if (this.flashIntensity < 0.01) {
          this.flashIntensity = 0
        }
        // Apply flash effect on top (non-cumulative)
        this.material.uniforms.intensity.value = this.config.intensity * (1 + this.flashIntensity * 2)
      } else {
        // Ensure intensity returns to base value
        this.material.uniforms.intensity.value = this.config.intensity
      }
    }

    // Update ambient particles
    if (this.ambientParticles) {
      const material = this.ambientParticles.material as THREE.ShaderMaterial
      material.uniforms.time.value = deltaTime
      // Ambient particles also follow color with flash
      const ambientColor = this.material?.uniforms.color1.value || new THREE.Color(this.config.color1)
      material.uniforms.color.value = ambientColor.clone().offsetHSL(0, 0, this.flashIntensity * 0.5)
    }

    // Subtle rotation
    if (this.mesh) {
      this.mesh.rotation.z = deltaTime * 0.02
    }

    // Continuous burst particles
    this.continuousBurstTimer += deltaTime
    if (this.continuousBurstTimer > 1.5) {
      this.continuousBurstTimer = 0
      this.triggerSmallBurst()
    }

    // Update burst particles
    this.updateBurstParticles(deltaTime)

    // Subtle camera shake
    this.updateSubtleCameraShake(deltaTime)
  }

  private createBurstParticle(color: THREE.Color, speed: number = 1): BurstParticle {
    const geometry = new THREE.SphereGeometry(Math.random() * 0.2 + 0.1, 8, 8)
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    })
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      -30
    )

    const angle = Math.random() * Math.PI * 2
    const burstSpeed = (Math.random() * 8 + 4) * speed
    const velocity = new THREE.Vector3(
      Math.cos(angle) * burstSpeed,
      Math.sin(angle) * burstSpeed,
      (Math.random() - 0.5) * 3
    )

    this.group.add(mesh)

    return { mesh, velocity, life: 1, maxLife: 1 }
  }

  private triggerSmallBurst(): void {
    const color = this.material?.uniforms.color1.value || new THREE.Color(this.config.color1)
    for (let i = 0; i < 8; i++) {
      this.burstParticles.push(this.createBurstParticle(color, 0.5))
    }
  }

  private triggerBigBurst(): void {
    const color = this.material?.uniforms.color1.value || new THREE.Color(this.config.color1)
    // More particles for bigger impact
    for (let i = 0; i < 80; i++) {
      this.burstParticles.push(this.createBurstParticle(color, 2.5))
    }
    // Stronger camera shake
    this.cameraShake = 1.5
    // Flash effect
    this.flashIntensity = 1.0
  }

  private updateBurstParticles(deltaTime: number): void {
    const delta = 0.016

    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const particle = this.burstParticles[i]

      particle.mesh.position.add(particle.velocity.clone().multiplyScalar(delta))
      particle.life -= delta * 0.5

      const material = particle.mesh.material as THREE.MeshBasicMaterial
      material.opacity = particle.life * 0.8

      const scale = particle.life
      particle.mesh.scale.setScalar(scale)

      if (particle.life <= 0) {
        this.group.remove(particle.mesh)
        particle.mesh.geometry.dispose()
        particle.mesh.material.dispose()
        this.burstParticles.splice(i, 1)
      }
    }
  }

  private updateSubtleCameraShake(deltaTime: number): void {
    if (this.cameraShake > 0) {
      const shake = this.cameraShake
      this.group.position.x = (Math.random() - 0.5) * shake
      this.group.position.y = (Math.random() - 0.5) * shake
      this.cameraShake *= 0.92
      if (this.cameraShake < 0.01) {
        this.cameraShake = 0
        this.group.position.set(0, 0, 0)
      }
    }
  }

  updateConfig(config: Partial<NebulaSceneConfig>): void {
    const oldColor = this.config.color1
    this.config = { ...this.config, ...config }

    // Trigger big burst on color change
    if (config.color1 && config.color1 !== oldColor) {
      this.triggerBigBurst()
    }

    if (this.material) {
      // Immediately change colors for more obvious effect
      if (config.color1 !== undefined) {
        this.material.uniforms.color1.value.set(config.color1)
      }
      if (config.color2 !== undefined) {
        this.material.uniforms.color2.value.set(config.color2)
      }
      if (config.intensity !== undefined) {
        this.material.uniforms.intensity.value = config.intensity
      }
    }
  }

  dispose(): void {
    for (const particle of this.burstParticles) {
      this.group.remove(particle.mesh)
      particle.mesh.geometry.dispose()
      particle.mesh.material.dispose()
    }
    this.burstParticles = []

    if (this.ambientParticles) {
      this.ambientParticles.geometry.dispose()
      this.ambientParticles.material.dispose()
    }

    if (this.mesh) {
      this.mesh.geometry.dispose()
      if (this.material) {
        this.material.dispose()
      }
    }
  }
}
