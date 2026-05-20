<template>
  <button
    ref="buttonRef"
    class="menu-button"
    :class="{ active: isOpen }"
    @click="$emit('click')"
    aria-label="打开菜单"
  >
    <span class="menu-button-line"></span>
    <span class="menu-button-line"></span>
    <span class="menu-button-line"></span>
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import gsap from 'gsap'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
defineEmits<{
  click: []
}>()

const buttonRef = ref<HTMLElement>()

watch(() => props.isOpen, (isNowOpen) => {
  if (!buttonRef.value) return
  const lines = buttonRef.value.querySelectorAll('.menu-button-line')

  if (isNowOpen) {
    gsap.to(lines[0], { rotate: 45, y: 8, duration: 0.3 })
    gsap.to(lines[1], { opacity: 0, duration: 0.2 })
    gsap.to(lines[2], { rotate: -45, y: -8, duration: 0.3 })
  } else {
    gsap.to(lines[0], { rotate: 0, y: 0, duration: 0.3 })
    gsap.to(lines[1], { opacity: 1, duration: 0.2 })
    gsap.to(lines[2], { rotate: 0, y: 0, duration: 0.3 })
  }
})
</script>

<style scoped>
.menu-button {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid rgba(78, 222, 234, 0.4);
  background: rgba(10, 14, 23, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(78, 222, 234, 0.2);
  z-index: 1002;
  transition: all 0.3s;
}

.menu-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(78, 222, 234, 0.4);
  border-color: var(--color-neon-cyan);
}

.menu-button.active {
  background: rgba(78, 222, 234, 0.2);
  border-color: var(--color-neon-cyan);
}

.menu-button-line {
  width: 20px;
  height: 2px;
  background-color: var(--color-neon-cyan);
  border-radius: 1px;
  box-shadow: 0 0 5px rgba(78, 222, 234, 0.5);
}

@media (max-width: 768px) {
  .menu-button {
    width: 44px;
    height: 44px;
  }
}
</style>
