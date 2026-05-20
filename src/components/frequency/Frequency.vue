<!-- src/components/frequency/Frequency.vue -->
<template>
  <div class="frequency-page">
    <FrequencyDial />
    <FrequencyCard />
  </div>
</template>

<script setup lang="ts">
import FrequencyDial from './FrequencyDial.vue'
import FrequencyCard from './FrequencyCard.vue'
</script>

<style scoped>
.frequency-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
