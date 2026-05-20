<template>
  <div ref="heartRef" class="heart-beat">
    <slot>❤️</slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { heartbeat } from '../utils/animations'

const heartRef = ref<HTMLElement>()

onMounted(() => {
  if (heartRef.value) {
    heartbeat(heartRef.value)
  }
})
</script>

<style scoped>
.heart-beat {
  display: inline-block;
}
</style>