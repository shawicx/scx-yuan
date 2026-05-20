// src/stores/audio.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  // State
  const isMuted = ref(false)
  const volume = ref(0.7)
  const currentTrack = ref<string | null>(null)

  // Computed
  const effectiveVolume = computed(() => isMuted.value ? 0 : volume.value)

  // Actions
  function setVolume(newVolume: number) {
    volume.value = Math.max(0, Math.min(1, newVolume))
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  function setTrack(trackId: string) {
    currentTrack.value = trackId
  }

  return {
    isMuted,
    volume,
    currentTrack,
    effectiveVolume,
    setVolume,
    toggleMute,
    setTrack
  }
})
