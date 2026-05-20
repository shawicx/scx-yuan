<template>
  <div class="last-transmission">
    <ThreeBackground :scene="transmissionScene" />
    <AudioManager />
    <PageTransition ref="transitionRef" @transition-out="handleTransitionOut" />

    <div class="content">
      <h1 ref="titleRef" class="title">最后的传达</h1>
      <p ref="subtitleRef" class="subtitle">
        「有些话，值得跨越整个宇宙去告诉你」
      </p>

      <div class="transmission-container">
        <div class="message-display">
          <div ref="messageTextRef" class="message-text">{{ currentMessage }}</div>
        </div>

        <button ref="transmitBtn" class="transmit-btn" @click="handleTransmit">
          <span class="btn-icon">✨</span>
          <span class="btn-text">发送信号</span>
        </button>

        <div v-if="transmissionCount > 0" class="transmission-count">
          已发送 {{ transmissionCount }} 道信号
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ThreeBackground from '@/components/common/ThreeBackground.vue'
import AudioManager from '@/components/common/AudioManager.vue'
import PageTransition from '@/components/common/PageTransition.vue'
import { useAppStore } from '@/stores/app'
import TransmissionScene from '@/three/scenes/TransmissionScene'

const appStore = useAppStore()

const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const transmitBtn = ref<HTMLElement>()
const messageTextRef = ref<HTMLElement>()
const transitionRef = ref<InstanceType<typeof PageTransition>>()

const transmissionCount = ref(0)
const currentMessage = ref('等待信号连接...')

const messages = [
  '我想你了，像星星想念夜空',
  '你是我宇宙里最亮的那颗星',
  '无论多远，心总在你身边',
  '跨越星海，只为遇见你',
  '我的思念，光速也追不上',
  '这一生，只愿与你同行'
]

const transmissionScene = new TransmissionScene({
  signalColor: '#4edee9',
  waveSpeed: 2,
  maxDistance: 100
})

const handleTransmit = () => {
  // Trigger visual transmission
  transmissionScene.transmit()

  // Update message
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]
  currentMessage.value = randomMessage

  // Animate message
  if (messageTextRef.value) {
    gsap.fromTo(
      messageTextRef.value,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )
  }

  // Increment counter
  transmissionCount.value++

  // Button pulse animation
  if (transmitBtn.value) {
    gsap.fromTo(
      transmitBtn.value,
      { scale: 0.95 },
      { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
    )
  }
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
    '.transmission-container',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.2 }
  )

  if (transmitBtn.value) {
    gsap.fromTo(
      transmitBtn.value,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 1.6 }
    )
  }

  // Auto-transmit once after initial animation
  setTimeout(() => {
    handleTransmit()
  }, 2500)
})

onUnmounted(() => {
  transmissionScene.dispose()
})
</script>

<style scoped>
.last-transmission {
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

.transmission-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.message-display {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 2rem;
  background: rgba(10, 14, 23, 0.6);
  border: 1px solid rgba(78, 222, 233, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  max-width: 400px;
}

.message-text {
  font-family: var(--font-body);
  font-size: 1.2rem;
  color: var(--color-text-primary);
  text-align: center;
  min-height: 1.5em;
  display: flex;
  align-items: center;
}

.transmit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 3rem;
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.15em;
  color: var(--color-text-primary);
  background: rgba(78, 222, 233, 0.1);
  border: 2px solid var(--color-neon-cyan);
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(78, 222, 233, 0.2);
}

.transmit-btn:hover {
  background: rgba(78, 222, 233, 0.3);
  box-shadow: 0 0 40px rgba(78, 222, 233, 0.5);
  transform: scale(1.05);
}

.transmit-btn:active {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 1.2rem;
}

.transmission-count {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  letter-spacing: 0.1em;
  opacity: 0.7;
}
</style>
