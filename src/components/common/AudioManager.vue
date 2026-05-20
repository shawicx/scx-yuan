<!-- src/components/common/AudioManager.vue -->
<template>
  <div class="audio-manager">
    <button
      ref="buttonRef"
      class="audio-toggle"
      :class="{ muted: isMuted }"
      @click="handleToggle"
      aria-label="Toggle audio"
    >
      <svg v-if="!isMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-width="1.5"/>
        <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke-width="1.5"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-width="1.5"/>
        <line x1="23" y1="9" x2="17" y2="15" stroke-width="1.5"/>
        <line x1="17" y1="9" x2="23" y2="15" stroke-width="1.5"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useAudioStore } from '@/stores/audio'
import { storeToRefs } from 'pinia'

const audioStore = useAudioStore()
const { isMuted } = storeToRefs(audioStore)

const buttonRef = ref<HTMLElement>()

const handleToggle = () => {
  audioStore.toggleMute()

  // Animate button press
  if (buttonRef.value) {
    gsap.fromTo(buttonRef.value, { scale: 0.9 }, { scale: 1, duration: 0.2 })
  }
}

onMounted(() => {
  // Fade in button
  if (buttonRef.value) {
    gsap.from(buttonRef.value, {
      opacity: 0,
      y: 10,
      duration: 0.5,
      delay: 5,
      ease: 'power2.out'
    })
  }
})
</script>

<style scoped>
.audio-manager {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
}

.audio-toggle {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 14, 23, 0.8);
  border: 1px solid rgba(232, 238, 245, 0.2);
  border-radius: 50%;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.audio-toggle:hover {
  border-color: var(--color-neon-cyan);
  color: var(--color-text-primary);
}

.audio-toggle.muted {
  opacity: 0.5;
}

.audio-toggle svg {
  width: 20px;
  height: 20px;
}
</style>
