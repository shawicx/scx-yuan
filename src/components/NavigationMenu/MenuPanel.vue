<template>
  <div ref="panelRef" class="menu-panel">
    <button class="close-button" @click="$emit('close')" aria-label="关闭菜单">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="close-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
    <nav class="menu-nav" aria-label="主导航">
      <MenuItem
        v-for="(item, index) in items"
        :key="item.path"
        :item="item"
        :style="{ opacity: 0, transform: 'translateX(20px)' }"
        :ref="(el: any) => setItemRef(el, index)"
        @click="$emit('close')"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import gsap from 'gsap'
import MenuItem from './MenuItem.vue'
import type { MenuItem as MenuItemType } from '@/types/navigation'

interface Props {
  items: MenuItemType[]
  isOpen: boolean
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLElement>()
const itemRefs: (HTMLElement | null)[] = []

const setItemRef = (el: any, index: number) => {
  if (el) {
    itemRefs[index] = el.$el || el
  }
}

const open = () => {
  if (!panelRef.value) return

  gsap.fromTo(
    panelRef.value,
    { x: '100%' },
    {
      x: '0%',
      duration: 0.4,
      ease: 'back.out(1.7)'
    }
  )

  itemRefs.forEach((item, index) => {
    if (item) {
      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        delay: 0.2 + index * 0.05,
        ease: 'power2.out'
      })
    }
  })
}

const close = () => {
  if (!panelRef.value) return

  gsap.to(panelRef.value, {
    x: '100%',
    duration: 0.3,
    ease: 'power2.in'
  })
}

watchEffect(() => {
  if (props.isOpen) {
    open()
  } else {
    close()
  }
})

defineExpose({ open, close })
</script>

<style scoped>
.menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: rgba(10, 14, 23, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: -4px 0 20px rgba(78, 222, 234, 0.2);
  border-left: 1px solid rgba(78, 222, 234, 0.3);
  transform: translateX(100%);
  z-index: 1001;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(78, 222, 234, 0.3);
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
  color: var(--color-neon-cyan);
}

.close-button:hover {
  background-color: rgba(78, 222, 234, 0.2);
  box-shadow: 0 0 15px rgba(78, 222, 234, 0.4);
}

.close-icon {
  width: 24px;
  height: 24px;
  color: var(--color-neon-cyan);
}

.menu-nav {
  padding-top: 4rem;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .menu-panel {
    width: 80vw;
    max-width: 300px;
  }
}
</style>
