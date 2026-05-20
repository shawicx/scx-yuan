<!-- src/components/frequency/FrequencyCard.vue -->
<template>
  <Transition name="card-fade" mode="out-in">
    <div :key="currentFrequency" class="frequency-card">
      <div class="card-content">
        <p class="card-text">{{ currentConfig?.text }}</p>
      </div>
      <div class="card-decoration"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useFrequencyStore } from '@/stores/frequency'
import { storeToRefs } from 'pinia'

const frequencyStore = useFrequencyStore()
const { currentFrequency, currentConfig } = storeToRefs(frequencyStore)
</script>

<style scoped>
.frequency-card {
  position: relative;
  max-width: 32rem;
  padding: 3rem;
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-text {
  font-family: var(--font-body);
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 300;
  line-height: 2;
  color: var(--color-text-primary);
  text-align: center;
  white-space: pre-wrap;
}

.card-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, v-bind('currentConfig?.particleColor || "var(--color-neon-cyan)"') 0%, transparent 70%);
  opacity: 0.1;
  filter: blur(40px);
  pointer-events: none;
  transition: background 0.5s ease;
}

/* Card transition */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.6s ease;
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
