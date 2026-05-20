<template>
  <div ref="container" class="three-background"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import ThreeManager from '@/three/ThreeManager'
import StarfieldScene from '@/three/scenes/StarfieldScene'
import NebulaScene from '@/three/scenes/NebulaScene'
import FragmentField from '@/three/scenes/FragmentField'
import type BaseScene from '@/three/scenes/BaseScene'
import { useAppStore } from '@/stores/app'
import { useFrequencyStore } from '@/stores/frequency'
import { storeToRefs } from 'pinia'

interface Props {
  scene?: BaseScene
}

const props = defineProps<Props>()

const container = ref<HTMLElement>()
const manager = ref<ThreeManager | null>(null)
const route = useRoute()
const appStore = useAppStore()
const frequencyStore = useFrequencyStore()
const { currentPage } = storeToRefs(appStore)
const { currentConfig } = storeToRefs(frequencyStore)

// Get page name from route path
const getPageFromRoute = (path: string): string => {
  const pageMap: Record<string, string> = {
    '/wake-signal': 'wake-signal',
    '/frequency': 'frequency',
    '/fragments': 'fragments',
    '/orbit': 'orbit',
    '/transmission': 'transmission'
  }
  return pageMap[path] || 'wake-signal'
}

// Color schemes for different frequency scenes
const frequencyColorSchemes: Record<string, { color1: string; color2: string; intensity: number }> = {
  'nebula-blue': { color1: '#4a90d9', color2: '#1a3a5f', intensity: 0.6 },
  'rain-city': { color1: '#5c6b7f', color2: '#2d3a4a', intensity: 0.4 },
  'aurora': { color1: '#7cb987', color2: '#3d5a4f', intensity: 0.5 },
  'galaxy-flow': { color1: '#a855f7', color2: '#5a2a8f', intensity: 0.7 }
}

// Scene mapping
const getSceneForPage = (page: string): BaseScene => {
  switch (page) {
    case 'frequency': {
      const sceneType = currentConfig.value?.scene || 'nebula-blue'
      const colors = frequencyColorSchemes[sceneType] || frequencyColorSchemes['nebula-blue']
      return new NebulaScene({
        color1: colors.color1,
        color2: colors.color2,
        intensity: colors.intensity
      })
    }
    case 'fragments':
      return new FragmentField({
        count: 120,
        spread: 60,
        driftSpeed: 0.2,
        fragmentSize: 1.2,
        colors: ['#4edee9', '#e94ed9', '#4ee99d', '#f0e94e']
      })
    default:
      return new StarfieldScene()
  }
}

onMounted(async () => {
  await nextTick()
  if (!container.value) return

  const initManager = () => {
    if (!container.value) return
    if (container.value.clientWidth === 0 || container.value.clientHeight === 0) {
      requestAnimationFrame(initManager)
      return
    }
    manager.value = new ThreeManager(container.value)
    // Use route to determine initial scene
    const initialPage = getPageFromRoute(route.path)
    const scene = props.scene || getSceneForPage(initialPage)
    manager.value.setScene(scene)
    manager.value.start()
  }
  initManager()
})

// Watch for route changes and switch scenes (only if no custom scene prop)
watch(() => route.path, (newPath) => {
  if (manager.value && !props.scene) {
    const page = getPageFromRoute(newPath)
    manager.value.setScene(getSceneForPage(page))
  }
})

// Watch for frequency changes on frequency page
watch([() => route.path, currentConfig], ([path, config]) => {
  const page = getPageFromRoute(path)
  if (page === 'frequency' && manager.value && !props.scene) {
    const sceneType = config?.scene || 'nebula-blue'
    const colors = frequencyColorSchemes[sceneType] || frequencyColorSchemes['nebula-blue']

    // Try to update existing scene if it's a NebulaScene
    const currentScene = manager.value.getScene()
    if (currentScene instanceof NebulaScene) {
      currentScene.updateConfig({
        color1: colors.color1,
        color2: colors.color2,
        intensity: colors.intensity
      })
    } else {
      // Otherwise create a new scene
      const nebulaScene = new NebulaScene(colors)
      manager.value.setScene(nebulaScene)
    }
  }
})

onUnmounted(() => {
  manager.value?.dispose()
  manager.value = null
})
</script>

<style scoped>
.three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.three-background :deep(canvas) {
  display: block;
}
</style>
