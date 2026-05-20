<!-- src/components/common/PageTransition.vue -->
<template>
  <div class="page-transition">
    <div ref="overlayRef" class="transition-overlay">
      <div class="noise-overlay"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits<{
  transitionOut: []
}>()

const overlayRef = ref<HTMLElement>()

defineExpose({
  async transitionIn() {
    if (!overlayRef.value) return

    await gsap.to(overlayRef.value, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    })
  },

  async transitionOut() {
    if (!overlayRef.value) return

    await gsap.to(overlayRef.value, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })

    emit('transitionOut')
  }
})
</script>

<style scoped>
.page-transition {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.transition-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-space-900);
  opacity: 0;
}

.noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.05;
}
</style>
