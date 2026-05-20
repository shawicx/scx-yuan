<template>
  <div ref="textRef" class="text-fade">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { textFadeIn } from '../utils/animations'

const props = defineProps<{
  delay?: number
}>()

const textRef = ref<HTMLElement>()

onMounted(() => {
  if (textRef.value) {
    textFadeIn(textRef.value, props.delay || 0)
  }
})
</script>

<style scoped>
.text-fade {
  opacity: 0;
}
</style>