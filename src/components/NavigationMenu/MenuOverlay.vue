<template>
  <div ref="overlayRef" class="menu-overlay" @click="$emit('click')"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

defineEmits<{
  click: []
}>()

const overlayRef = ref<HTMLElement>()

const show = () => {
  if (!overlayRef.value) return
  gsap.fromTo(
    overlayRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: 'power2.out' }
  )
}

const hide = () => {
  if (!overlayRef.value) return
  gsap.to(overlayRef.value, {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in'
  })
}

defineExpose({ show, hide })
</script>

<style scoped>
.menu-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 1000;
}
</style>
