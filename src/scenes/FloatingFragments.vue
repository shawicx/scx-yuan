<template>
  <div class="floating-fragments">
    <ThreeBackground :scene="fragmentField" />
    <AudioManager />
    <PageTransition ref="transitionRef" @transition-out="handleTransitionOut" />

    <div class="content">
      <h1 ref="titleRef" class="title">漂浮的碎片</h1>
      <p ref="subtitleRef" class="subtitle">
        「那些关于你的记忆，像星光碎片般漂浮，靠近时又悄悄聚拢」
      </p>

      <div ref="fragmentsRef" class="fragments-container">
        <div
          v-for="(fragment, index) in textFragments"
          :key="index"
          ref="fragmentRefs"
          class="text-fragment"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          {{ fragment }}
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
import FragmentField from '@/three/scenes/FragmentField'

const router = useRouter()
const appStore = useAppStore()

const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const fragmentsRef = ref<HTMLElement>()
const continueBtn = ref<HTMLElement>()
const fragmentRefs = ref<HTMLElement[]>([])
const transitionRef = ref<InstanceType<typeof PageTransition>>()

const fragmentField = new FragmentField({
  count: 120,
  spread: 60,
  driftSpeed: 0.2,
  fragmentSize: 1.2,
  colors: ['#4edee9', '#e94ed9', '#4ee99d', '#f0e94e']
})

const textFragments = [
  '那场未曾散场的日落',
  '你眼里的星光',
  '街角咖啡店的窗',
  '未曾说出口的喜欢',
  '星空下许过的愿',
  '时间写给我们的诗'
]

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

  if (fragmentsRef.value) {
    tl.to(fragmentsRef.value, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in'
    }, '-=0.3')
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
  router.push('/orbit')
  appStore.setPage('orbit')
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

  if (fragmentRefs.value.length > 0) {
    gsap.fromTo(
      fragmentRefs.value,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 1.2
      }
    )
  }

  if (continueBtn.value) {
    gsap.fromTo(
      continueBtn.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 2 }
    )
  }
})

onUnmounted(() => {
  fragmentField.dispose()
})
</script>

<style scoped>
.floating-fragments {
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
  text-shadow: 0 0 40px rgba(233, 78, 217, 0.3);
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

.fragments-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 2rem;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.text-fragment {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text-secondary);
  padding: 0.5rem 1rem;
  background: rgba(78, 222, 233, 0.1);
  border: 1px solid rgba(78, 222, 233, 0.3);
  border-radius: 20px;
  white-space: nowrap;
  animation: fragmentFloat 4s ease-in-out infinite;
}

@keyframes fragmentFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
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
  border: 1px solid var(--color-neon-pink);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  background: rgba(233, 78, 217, 0.2);
  box-shadow: 0 0 30px rgba(233, 78, 217, 0.4);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.continue-btn:hover .btn-arrow {
  transform: translateX(5px);
}
</style>
