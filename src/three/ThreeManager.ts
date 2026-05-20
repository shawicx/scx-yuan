import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import type BaseScene from './scenes/BaseScene'

export default class ThreeManager {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private composer: EffectComposer
  private currentScene: BaseScene | null = null
  private animationId: number | null = null
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0e17)

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    this.camera.position.z = 50

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.renderer.domElement)

    // Post-processing
    this.composer = new EffectComposer(this.renderer)
    this.composer.setSize(container.clientWidth, container.clientHeight)
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.3, // strength
      0.4, // radius
      0.85 // threshold
    )
    this.composer.addPass(bloomPass)

    // Handle resize
    window.addEventListener('resize', this.onResize)
  }

  setScene(scene: BaseScene): void {
    // Remove current scene
    if (this.currentScene) {
      this.currentScene.dispose()
    }

    // Set new scene
    this.currentScene = scene
    const sceneGroup = scene.create()
    this.scene.add(sceneGroup)
  }

  getScene(): BaseScene | null {
    return this.currentScene
  }

  private animate = (time: number): void => {
    this.animationId = requestAnimationFrame(this.animate)

    // Update current scene
    if (this.currentScene) {
      this.currentScene.update(time * 0.001) // Convert to seconds
    }

    // Subtle camera rotation
    this.camera.rotation.z = Math.sin(time * 0.0001) * 0.02

    // Render
    this.composer.render()
  }

  start(): void {
    if (!this.animationId) {
      this.animate(0)
    }
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  private onResize = (): void => {
    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)
  }

  dispose(): void {
    this.stop()
    window.removeEventListener('resize', this.onResize)

    if (this.currentScene) {
      this.currentScene.dispose()
    }

    this.composer.dispose()
    this.renderer.dispose()
    this.container.removeChild(this.renderer.domElement)
  }
}
