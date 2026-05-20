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

export default class NebulaScene extends BaseScene {
  private mesh: THREE.Mesh | null = null
  private material: THREE.ShaderMaterial | null = null
  private config: NebulaSceneConfig

  constructor(config: Partial<NebulaSceneConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  create(): THREE.Group {
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

    return this.group
  }

  update(deltaTime: number): void {
    if (this.material) {
      this.material.uniforms.time.value = deltaTime
    }

    // Subtle rotation
    if (this.mesh) {
      this.mesh.rotation.z = deltaTime * 0.02
    }
  }

  dispose(): void {
    if (this.mesh) {
      this.mesh.geometry.dispose()
      if (this.material) {
        this.material.dispose()
      }
    }
  }

  updateConfig(config: Partial<NebulaSceneConfig>): void {
    this.config = { ...this.config, ...config }

    if (this.material) {
      if (config.color1 !== undefined) {
        this.material.uniforms.color1.value = new THREE.Color(config.color1)
      }
      if (config.color2 !== undefined) {
        this.material.uniforms.color2.value = new THREE.Color(config.color2)
      }
      if (config.intensity !== undefined) {
        this.material.uniforms.intensity.value = config.intensity
      }
    }
  }
}
