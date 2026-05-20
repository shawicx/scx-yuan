<!-- src/scenes/Frequency.vue -->
<template>
  <div class="scene-frequency">
    <ThreeBackground />
    <AudioManager />
    <PageTransition ref="transitionRef" @transition-out="handleTransitionOut" />

    <div class="content">
      <Frequency />
      <button ref="continueBtn" class="continue-btn" @click="handleContinue">
        <span class="btn-text">继续旅程</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import ThreeBackground from '@/components/common/ThreeBackground.vue'
import AudioManager from '@/components/common/AudioManager.vue'
import PageTransition from '@/components/common/PageTransition.vue'
import Frequency from '@/components/frequency/Frequency.vue'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()
const transitionRef = ref<InstanceType<typeof PageTransition>>()
const frequencyRef = ref<HTMLElement>()
const continueBtn = ref<HTMLElement>()

const handleTransitionOut = async () => {
  appStore.setTransitioning(false)
}

const handleContinue = async () => {
  if (!transitionRef.value) return

  appStore.setTransitioning(true)

  const tl = gsap.timeline()

  if (frequencyRef.value) {
    tl.to(frequencyRef.value, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in'
    })
  }

  if (continueBtn.value) {
    tl.to(continueBtn.value, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in'
    }, '-=0.3')
  }

  await transitionRef.value.transitionIn()
  router.push('/fragments')
  appStore.setPage('fragments')
}

onMounted(async () => {
  if (transitionRef.value) {
    await transitionRef.value.transitionOut()
  }

  if (frequencyRef.value) {
    gsap.fromTo(
      frequencyRef.value,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )
  }

  if (continueBtn.value) {
    gsap.fromTo(
      continueBtn.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 1.2 }
    )
  }
})
</script>

<style scoped>
.scene-frequency {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 1;
  gap: 3rem;
  padding: 2rem;
  text-align: center;
}

.frequency-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.continue-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  color: var(--color-text-primary);
  background: transparent;
  border: 1px solid var(--color-neon-cyan);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: auto;
}

.continue-btn:hover {
  background: rgba(78, 222, 234, 0.2);
  box-shadow: 0 0 30px rgba(78, 222, 234, 0.4);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.continue-btn:hover .btn-arrow {
  transform: translateX(5px);
}
</style>
