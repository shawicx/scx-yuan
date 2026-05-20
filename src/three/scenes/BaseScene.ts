import * as THREE from 'three'

export default abstract class BaseScene {
  protected group: THREE.Group = new THREE.Group()
  protected time: number = 0

  // Create the scene and return the root group
  abstract create(): THREE.Group

  // Update loop called every frame
  abstract update(deltaTime: number): void

  // Clean up resources
  abstract dispose(): void

  // Get the scene group
  getGroup(): THREE.Group {
    return this.group
  }
}
