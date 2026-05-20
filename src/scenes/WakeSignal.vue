<template>
  <div class="wake-signal">
    <ThreeBackground />
    <AudioManager />

    <div class="content">
      <h1 ref="titleRef" class="title">信号已抵达</h1>
      <p ref="subtitleRef" class="subtitle">
        「有些频率，只在对的人靠近时才会被唤醒」
      </p>
      <button ref="buttonRef" class="tune-in-btn" @click="handleTuneIn">
        <span class="btn-text">调频倾听</span>
        <span class="btn-glow"></span>
      </button>
    </div>

    <div ref="overlayRef" class="black-overlay"></div>
    <PageTransition ref="transitionRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import ThreeBackground from '@/components/common/ThreeBackground.vue'
import AudioManager from '@/components/common/AudioManager.vue'
import PageTransition from '@/components/common/PageTransition.vue'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const buttonRef = ref<HTMLElement>()
const overlayRef = ref<HTMLElement>()
const transitionRef = ref<InstanceType<typeof PageTransition>>()

const handleTuneIn = async () => {
  if (!transitionRef.value) return

  appStore.setTransitioning(true)

  // Fade out content
  const tl = gsap.timeline()

  if (titleRef.value && subtitleRef.value) {
    tl.to([titleRef.value, subtitleRef.value], {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in'
    })
  }

  if (buttonRef.value) {
    tl.to(buttonRef.value, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'power2.in'
    }, '-=0.3')
  }

  // Transition overlay
  await transitionRef.value.transitionIn()

  // Navigate
  router.push('/frequency')

  appStore.setPage('frequency')
}

onMounted(() => {
  // Initial black overlay fade-out
  if (overlayRef.value) {
    gsap.to(overlayRef.value, {
      opacity: 0,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })
  }

  // Title animation
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3 }
    )
  }

  // Subtitle animation
  if (subtitleRef.value) {
    gsap.fromTo(
      subtitleRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3.3 }
    )
  }

  // Button animation
  if (buttonRef.value) {
    gsap.fromTo(
      buttonRef.value,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 4 }
    )
  }
})
</script>

<style scoped>
.wake-signal {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 300;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  text-shadow: 0 0 40px rgba(77, 238, 234, 0.3);
}

.subtitle {
  font-family: var(--font-body);
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 300;
  line-height: 1.8;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin-bottom: var(--spacing-lg);
}

.tune-in-btn {
  position: relative;
  padding: 1rem 3rem;
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.2em;
  color: var(--color-text-primary);
  background: transparent;
  border: 1px solid var(--color-neon-cyan);
  cursor: pointer;
  overflow: hidden;
  transition: color 0.3s ease;
}

.tune-in-btn:hover {
  color: var(--color-space-900);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-neon-cyan);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.tune-in-btn:hover .btn-glow {
  transform: scaleX(1);
}

.black-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-space-900);
  z-index: 10;
  pointer-events: none;
}
</style>
