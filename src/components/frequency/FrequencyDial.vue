<!-- src/components/frequency/FrequencyDial.vue -->
<template>
  <div class="frequency-dial">
    <div ref="dialRef" class="dial-container">
      <svg class="dial-svg" viewBox="-30 -30 260 260">
        <!-- Outer ring -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="rgba(232, 238, 245, 0.1)"
          stroke-width="2"
        />

        <!-- Frequency markers and labels -->
        <g v-for="(freq, index) in frequencies" :key="freq" class="freq-group">
          <!-- Clickable circle area (invisible) -->
          <circle
            :cx="getMarkerPosition(index).x"
            :cy="getMarkerPosition(index).y"
            r="25"
            fill="transparent"
            class="click-area"
            @click="selectFrequency(index)"
          />

          <!-- Outer tick mark -->
          <line
            :x1="getTickPosition(index, 82).x"
            :y1="getTickPosition(index, 82).y"
            :x2="getTickPosition(index, 90).x"
            :y2="getTickPosition(index, 90).y"
            :class="['marker', { active: index === currentIndex }]"
          />

          <!-- Inner dot -->
          <circle
            :cx="getDotPosition(index).x"
            :cy="getDotPosition(index).y"
            r="4"
            :class="['inner-dot', { active: index === currentIndex }]"
          />

          <!-- Frequency label -->
          <text
            :x="getLabelPosition(index).x"
            :y="getLabelPosition(index).y"
            :class="['freq-label', { active: index === currentIndex }]"
            @click="selectFrequency(index)"
          >
            {{ freq }}
          </text>
        </g>

        <!-- Center circle decoration -->
        <circle
          cx="100"
          cy="100"
          r="35"
          fill="none"
          stroke="rgba(232, 238, 245, 0.05)"
          stroke-width="1"
        />

        <!-- Center display background -->
        <circle
          cx="100"
          cy="100"
          r="28"
          fill="rgba(232, 238, 245, 0.02)"
        />

        <!-- Center frequency display -->
        <text x="100" y="95" text-anchor="middle" class="frequency-value">
          {{ currentFrequency }}
        </text>
        <text x="100" y="115" text-anchor="middle" class="frequency-unit">
          MHz
        </text>
      </svg>
    </div>
    <div class="dial-label">点击调频</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFrequencyStore } from '@/stores/frequency'
import { storeToRefs } from 'pinia'

const frequencyStore = useFrequencyStore()
const { currentFrequency, currentConfig, currentIndex } = storeToRefs(frequencyStore)

const frequencies = [87.8, 91.2, 95.6, 99.0] as const

const centerX = 100
const centerY = 100

// 4个频率位置：上、右、下、左
const angles = [-90, 0, 90, 180] // degrees

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function getMarkerPosition(index: number) {
  const angle = toRadians(angles[index])
  return {
    x: centerX + 90 * Math.cos(angle),
    y: centerY + 90 * Math.sin(angle)
  }
}

function getTickPosition(index: number, radius: number) {
  const angle = toRadians(angles[index])
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

function getDotPosition(index: number) {
  const angle = toRadians(angles[index])
  return {
    x: centerX + 70 * Math.cos(angle),
    y: centerY + 70 * Math.sin(angle)
  }
}

function getLabelPosition(index: number) {
  const angle = toRadians(angles[index])
  const labelRadius = 118
  return {
    x: centerX + labelRadius * Math.cos(angle),
    y: centerY + labelRadius * Math.sin(angle) + 5
  }
}

function selectFrequency(index: number) {
  console.log('Selecting frequency:', frequencies[index])
  frequencyStore.setFrequency(frequencies[index])
}
</script>

<style scoped>
.frequency-dial {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dial-container {
  width: 240px;
  height: 240px;
  user-select: none;
}

.dial-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(77, 238, 234, 0.2));
}

.click-area {
  cursor: pointer;
}

.click-area:hover {
  fill: rgba(255, 255, 255, 0.03);
}

.marker {
  stroke: rgba(232, 238, 245, 0.2);
  stroke-width: 2;
  stroke-linecap: round;
  transition: all 0.3s ease;
}

.marker.active {
  stroke: v-bind('currentConfig?.particleColor || "#4deeea"');
  stroke-width: 3;
  filter: drop-shadow(0 0 6px v-bind('currentConfig?.particleColor || "#4deeea"'));
}

.inner-dot {
  fill: v-bind('currentConfig?.particleColor || "#4deeea"');
  opacity: 0;
  transition: all 0.3s ease;
}

.inner-dot.active {
  opacity: 0.6;
  filter: drop-shadow(0 0 4px v-bind('currentConfig?.particleColor || "#4deeea"'));
}

.freq-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  fill: var(--color-text-muted);
  text-anchor: middle;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
}

.freq-label.active {
  fill: v-bind('currentConfig?.particleColor || "#4deeea"');
  font-size: 0.9rem;
  font-weight: 600;
}

.freq-label:hover {
  fill: var(--color-text-primary);
}

.frequency-value {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 500;
  fill: var(--color-text-primary);
  transition: fill 0.5s ease;
}

.frequency-unit {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  fill: var(--color-text-muted);
  letter-spacing: 0.1em;
}

.dial-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
