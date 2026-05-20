<template>
  <component
    :is="item.locked ? 'div' : 'router-link'"
    :to="item.locked ? undefined : item.path"
    class="menu-item"
    :class="{ active: isActive, locked: item.locked }"
    @click="handleClick"
  >
    <component :is="iconComponent" class="menu-item-icon" />
    <span class="menu-item-title">{{ item.title }}</span>
    <span v-if="item.locked" class="lock-indicator">🔒</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem } from '@/types/navigation'

interface Props {
  item: MenuItem
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.item.path)

// 图标组件映射
const icons: Record<string, string> = {
  'signal': 'SignalIcon',
  'radio': 'RadioIcon',
  'sparkles': 'SparklesIcon',
  'orbit': 'OrbitIcon',
  'transmit': 'TransmitIcon'
}

// SVG 图标定义
const iconSvg: Record<string, string> = {
  SignalIcon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" /></svg>',
  RadioIcon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>',
  SparklesIcon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>',
  OrbitIcon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 1 0 0-.75H15v-.75h.91a.375.375 0 1 0 0-.75H15v-.75h.91a.375.375 0 1 0 0-.75H15V5.25a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V8a.375.375 0 0 1-.375.375H9a.375.375 0 0 1-.375-.375V5.25a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V8a.375.375 0 0 1-.375.375H3.91a.375.375 0 1 0 0 .75h.91v.75h-.91a.375.375 0 1 0 0 .75h.91v.75h-.91a.375.375 0 1 0 0 .75h.91v.75h-.91a.375.375 0 1 0 0 .75h.91v.75h-.91a.375.375 0 1 0 0 .75h.91v.75h-.91a.375.375 0 1 0 0 .75H4.5a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V15a.375.375 0 0 1 .375-.375h3.75a.375.375 0 0 1 .375.375v3.75a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V15a.375.375 0 0 1 .375-.375h3.75a.375.375 0 0 1 .375.375v3.75a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V15a.375.375 0 0 1 .375-.375h1.09a.375.375 0 1 0 0-.75H15v-.75h.91a.375.375 0 1 0 0-.75H15v-.75h.91a.375.375 0 1 0 0-.75H15v-.75h.91a.375.375 0 1 0 0-.75H15v-.75h.91a.375.375 0 1 0 0-.75Z" /></svg>',
  TransmitIcon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.348 14.651a3.75 3.75 0 0 1 0-5.303m5.304 0a3.75 3.75 0 0 1 0 5.303m-7.425 2.122a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>'
}

const iconComponent = computed(() => {
  const iconName = icons[props.item.icon] || 'HeartIcon'
  const svg = iconSvg[iconName] || iconSvg.HeartIcon

  return {
    template: svg
  }
})

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}

.menu-item:hover {
  background-color: rgba(78, 222, 234, 0.15);
  border-left-color: rgba(78, 222, 234, 0.5);
  box-shadow: inset 0 0 20px rgba(78, 222, 234, 0.1);
}

.menu-item.active {
  color: var(--color-neon-cyan);
  border-left-color: var(--color-neon-cyan);
  background-color: rgba(78, 222, 234, 0.2);
  box-shadow: inset 0 0 30px rgba(78, 222, 234, 0.15);
}

.menu-item.locked {
  opacity: 0.4;
  cursor: not-allowed;
}

.menu-item.locked:hover {
  background-color: transparent;
  border-left-color: transparent;
}

.menu-item-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--color-text-secondary);
  transition: color 0.2s;
}

.menu-item:hover .menu-item-icon {
  color: var(--color-neon-cyan);
}

.menu-item.active .menu-item-icon {
  color: var(--color-neon-cyan);
}

.menu-item-title {
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.lock-indicator {
  margin-left: auto;
  font-size: 0.875rem;
}
</style>
