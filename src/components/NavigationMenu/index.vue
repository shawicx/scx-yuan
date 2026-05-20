<template>
  <div class="navigation-menu">
    <MenuButton :is-open="isOpen" @click="toggle" />
    <MenuOverlay
      v-if="isOpen"
      ref="overlayRef"
      @click="close"
    />
    <MenuPanel
      v-if="isOpen"
      ref="panelRef"
      :items="menuItems"
      :is-open="isOpen"
      @close="close"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import MenuButton from './MenuButton.vue'
import MenuOverlay from './MenuOverlay.vue'
import MenuPanel from './MenuPanel.vue'
import { menuItems } from '@/types/navigation'

const isOpen = ref(false)
const overlayRef = ref<InstanceType<typeof MenuOverlay>>()
const panelRef = ref<InstanceType<typeof MenuPanel>>()

const open = () => {
  isOpen.value = true
  nextTick(() => {
    overlayRef.value?.show()
    panelRef.value?.open()
  })
}

const close = () => {
  overlayRef.value?.hide()
  panelRef.value?.close()
  setTimeout(() => {
    isOpen.value = false
  }, 300)
}

const toggle = () => {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.navigation-menu {
  position: relative;
}
</style>
