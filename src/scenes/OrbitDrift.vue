<template>
  <div class="orbit-drift">
    <ThreeBackground :scene="orbitScene" />
    <AudioManager />
    <PageTransition ref="transitionRef" @transition-out="handleTransitionOut" />

    <div class="content">
      <h1 ref="titleRef" class="title">轨迹漂流</h1>
      <p ref="subtitleRef" class="subtitle">
        「我们就像两颗星，在彼此的轨道上永恒旋转，永不散场」
      </p>

      <div class="orbit-controls">
        <div class="control-group">
          <label class="control-label">旋转速度</label>
          <input
            ref="speedSlider"
            :value="orbitSpeed"
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            class="control-slider"
            @input="handleSpeedChange"
          >
          <span class="control-value">{{ Number(orbitSpeed).toFixed(1) }}x</span>
        </div>

        <div class="control-group">
          <label class="control-label">轨道距离</label>
          <input
            :value="orbitRadius"
            type="range"
            min="5"
            max="25"
            step="1"
            class="control-slider"
            @input="handleRadiusChange"
          >
          <span class="control-value">{{ orbitRadius }}</span>
        </div>
      </div>

      <button ref="continueBtn" class="continue-btn" @click="handleContinue">
        <span class="btn-text">继续旅程</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import ThreeBackground from '@/components/common/ThreeBackground.vue'
import AudioManager from '@/components/common/AudioManager.vue'
import PageTransition from '@/components/common/PageTransition.vue'
import { useAppStore } from '@/stores/app'
import OrbitScene from '@/three/scenes/OrbitScene'

const router = useRouter()
const appStore = useAppStore()

const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const continueBtn = ref<HTMLElement>()
const transitionRef = ref<InstanceType<typeof PageTransition>>()

const orbitSpeed = ref(0.5)
const orbitRadius = ref(15)

const orbitScene = new OrbitScene({
  orbitRadius: orbitRadius.value,
  orbitSpeed: orbitSpeed.value,
  body1Color: '#4edee9',
  body2Color: '#e94ed9',
  trailLength: 100
})

const handleSpeedChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  orbitSpeed.value = parseFloat(target.value)
  orbitScene.setOrbitSpeed(orbitSpeed.value)
}

const handleRadiusChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  orbitRadius.value = parseFloat(target.value)
  orbitScene.setOrbitRadius(orbitRadius.value)
}

const handleContinue = async () => {
  if (!transitionRef.value) return

  appStore.setTransitioning(true)

  const tl = gsap.timeline()

  if (titleRef.value && subtitleRef.value) {
    tl.to([titleRef.value, subtitleRef.value], {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in'
    })
  }

  tl.to('.orbit-controls', {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: 'power2.in'
  }, '-=0.3')

  if (continueBtn.value) {
    tl.to(continueBtn.value, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in'
    }, '-=0.3')
  }

  await transitionRef.value.transitionIn()
  router.push('/transmission')
  appStore.setPage('transmission')
}

const handleTransitionOut = async () => {
  appStore.setTransitioning(false)
}

onMounted(() => {
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )
  }

  if (subtitleRef.value) {
    gsap.fromTo(
      subtitleRef.value,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
    )
  }

  gsap.fromTo(
    '.orbit-controls',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.2 }
  )

  if (continueBtn.value) {
    gsap.fromTo(
      continueBtn.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 1.6 }
    )
  }
})

onUnmounted(() => {
  orbitScene.dispose()
})
</script>

<style scoped>
.orbit-drift {
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
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 300;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  text-shadow: 0 0 40px rgba(78, 222, 233, 0.3);
}

.subtitle {
  font-family: var(--font-body);
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 300;
  line-height: 1.8;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin-bottom: 3rem;
}

.orbit-controls {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 3rem;
  padding: 1rem 1.5rem;
  background: rgba(10, 14, 23, 0.2);
  border: 1px solid rgba(78, 222, 233, 0.15);
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  max-width: 280px;
}

.control-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  min-width: 80px;
  text-align: left;
}

.control-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: rgba(78, 222, 233, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-neon-cyan);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.control-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.control-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-neon-cyan);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.control-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.control-value {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--color-text-primary);
  min-width: 50px;
  text-align: right;
}

.continue-btn {
  position: relative;
  z-index: 10;
  display: inline-flex;
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
  overflow: hidden;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  background: rgba(78, 222, 233, 0.2);
  box-shadow: 0 0 30px rgba(78, 222, 233, 0.4);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.continue-btn:hover .btn-arrow {
  transform: translateX(5px);
}
</style>
