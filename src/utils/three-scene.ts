import * as THREE from 'three'

export interface ThreeSceneResult {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
  cleanup: () => void
}

export function createHeartScene(container: HTMLElement): ThreeSceneResult {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  const heartGeometry = createHeartGeometry()
  const heartMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b9d,
    emissive: 0xff3366,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.4
  })
  const heart = new THREE.Mesh(heartGeometry, heartMaterial)
  scene.add(heart)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xff6b9d, 1, 100)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  camera.position.z = 5

  function animate() {
    requestAnimationFrame(animate)
    heart.rotation.y += 0.01
    const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1
    heart.scale.set(scale, scale, scale)
    renderer.render(scene, camera)
  }
  animate()

  return {
    scene,
    camera,
    renderer,
    cleanup: () => renderer.dispose()
  }
}

function createHeartGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(-0.5, -0.5, -1, 0.2, 0, 1)
  shape.bezierCurveTo(1, 0.2, 0.5, -0.5, 0, 0)

  const extrudeSettings = {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 2
  }
  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}