<!-- src/components/frequency/FrequencyDial.vue -->
<template>
  <div class="frequency-dial">
    <div ref="dialRef" class="dial-container">
      <svg class="dial-svg" viewBox="0 0 200 200">
        <!-- Outer ring -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="rgba(232, 238, 245, 0.1)"
          stroke-width="2"
        />
        <!-- Active arc -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          :stroke="currentConfig?.particleColor || 'var(--color-neon-cyan)'"
          stroke-width="3"
          :stroke-dasharray="arcLength"
          :stroke-dashoffset="arcOffset"
          transform="rotate(135 100 100)"
          class="active-arc"
        />
        <!-- Center display -->
        <text x="100" y="95" text-anchor="middle" class="frequency-value">
          {{ currentFrequency }}
        </text>
        <text x="100" y="115" text-anchor="middle" class="frequency-unit">
          MHz
        </text>
      </svg>
    </div>
    <div class="dial-label">拖动调频</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFrequencyStore } from '@/stores/frequency'
import { storeToRefs } from 'pinia'

const frequencyStore = useFrequencyStore()
const { currentFrequency, currentConfig, currentIndex } = storeToRefs(frequencyStore)

const dialRef = ref<HTMLElement>()
const isDragging = ref(false)
const startY = ref(0)

// Arc calculations
const totalArc = 270 // degrees
const circumference = 2 * Math.PI * 90
const arcLength = computed(() => (circumference * totalArc) / 360)
const arcOffset = computed(() => {
  const totalChannels = 4 // Fixed number of frequency channels
  const progress = currentIndex.value / (totalChannels - 1)
  const visibleProgress = (progress * totalArc) / 360
  return circumference * (1 - visibleProgress)
})

const handleStart = (y: number) => {
  isDragging.value = true
  startY.value = y
}

const handleMove = (y: number) => {
  if (!isDragging.value) return

  const deltaY = startY.value - y
  const threshold = 30 // pixels to switch frequency

  if (Math.abs(deltaY) > threshold) {
    if (deltaY > 0) {
      frequencyStore.prevFrequency()
    } else {
      frequencyStore.nextFrequency()
    }
    startY.value = y
  }
}

const handleEnd = () => {
  isDragging.value = false
}

// Mouse events
const onMouseDown = (e: MouseEvent) => handleStart(e.clientY)
const onMouseMove = (e: MouseEvent) => handleMove(e.clientY)
const onMouseUp = () => handleEnd()

// Touch events
const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientY)
const onTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  handleMove(e.touches[0].clientY)
}
const onTouchEnd = () => handleEnd()

onMounted(() => {
  const dial = dialRef.value
  if (dial) {
    dial.addEventListener('mousedown', onMouseDown)
    dial.addEventListener('touchstart', onTouchStart, { passive: false })
  }
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
})

onUnmounted(() => {
  const dial = dialRef.value
  if (dial) {
    dial.removeEventListener('mousedown', onMouseDown)
    dial.removeEventListener('touchstart', onTouchStart)
  }
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
})
</script>

<style scoped>
.frequency-dial {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dial-container {
  width: 200px;
  height: 200px;
  cursor: grab;
  user-select: none;
}

.dial-container:active {
  cursor: grabbing;
}

.dial-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(77, 238, 234, 0.2));
}

.active-arc {
  transition: stroke-dashoffset 0.5s ease, stroke 0.5s ease;
}

.frequency-value {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 400;
  fill: var(--color-text-primary);
}

.frequency-unit {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  fill: var(--color-text-muted);
  letter-spacing: 0.1em;
}

.dial-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
