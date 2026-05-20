<template>
  <div class="photo-frame" :class="frameClass">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  frameClass?: string
}>()
</script>

<style scoped>
.photo-frame {
  padding: 1rem;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.photo-frame:hover {
  transform: scale(1.05);
}
</style>