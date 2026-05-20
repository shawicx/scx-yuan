// src/stores/app.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type PageName = 'wake-signal' | 'frequency' | 'fragments' | 'orbit' | 'transmission'

export const useAppStore = defineStore('app', () => {
  // State
  const currentPage = ref<PageName>('wake-signal')
  const isMenuOpen = ref(false)
  const isTransitioning = ref(false)

  // Computed
  const isWakeSignal = computed(() => currentPage.value === 'wake-signal')

  // Actions
  function setPage(page: PageName) {
    currentPage.value = page
  }

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function setTransitioning(value: boolean) {
    isTransitioning.value = value
  }

  return {
    currentPage,
    isMenuOpen,
    isTransitioning,
    isWakeSignal,
    setPage,
    toggleMenu,
    setTransitioning
  }
})
