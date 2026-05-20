// src/stores/frequency.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface FrequencyConfig {
  frequency: number
  scene: 'nebula-blue' | 'rain-city' | 'aurora' | 'galaxy-flow'
  text: string
  particleColor: string
  bgIntensity: number
}

const FREQUENCIES: Record<number, FrequencyConfig> = {
  87.8: {
    frequency: 87.8,
    scene: 'nebula-blue',
    text: '「你认真听我说话的时候，整个宇宙都安静下来」',
    particleColor: '#4a90d9',
    bgIntensity: 0.6
  },
  91.2: {
    frequency: 91.2,
    scene: 'rain-city',
    text: '「你是我漫长黑夜里，那盏不肯熄灭的灯」',
    particleColor: '#5c6b7f',
    bgIntensity: 0.4
  },
  95.6: {
    frequency: 95.6,
    scene: 'aurora',
    text: '「你一笑，连星光都显得温柔了」',
    particleColor: '#7cb987',
    bgIntensity: 0.5
  },
  99.0: {
    frequency: 99.0,
    scene: 'galaxy-flow',
    text: '「和你并肩时，连风都变得格外温柔」',
    particleColor: '#a855f7',
    bgIntensity: 0.7
  }
}

export const FREQUENCY_VALUES = Object.keys(FREQUENCIES).map(Number).sort((a, b) => a - b)

export const useFrequencyStore = defineStore('frequency', () => {
  // State
  const currentFrequency = ref(87.8)

  // Computed
  const currentConfig = computed(() => FREQUENCIES[currentFrequency.value])
  const currentIndex = computed(() =>
    FREQUENCY_VALUES.findIndex(f => f === currentFrequency.value)
  )

  // Actions
  function setFrequency(frequency: number) {
    // Snap to nearest valid frequency
    const nearest = FREQUENCY_VALUES.reduce((prev, curr) =>
      Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
    )
    currentFrequency.value = nearest
  }

  function nextFrequency() {
    const nextIndex = (currentIndex.value + 1) % FREQUENCY_VALUES.length
    currentFrequency.value = FREQUENCY_VALUES[nextIndex]
  }

  function prevFrequency() {
    const prevIndex = (currentIndex.value - 1 + FREQUENCY_VALUES.length) % FREQUENCY_VALUES.length
    currentFrequency.value = FREQUENCY_VALUES[prevIndex]
  }

  return {
    currentFrequency,
    currentConfig,
    currentIndex,
    setFrequency,
    nextFrequency,
    prevFrequency
  }
})
