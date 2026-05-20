import gsap from 'gsap'

export function textFadeIn(element: HTMLElement | string, delay = 0) {
  gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.5, delay, ease: 'power3.out' }
  )
}

export function heartbeat(element: HTMLElement) {
  gsap.to(element, {
    scale: 1.1,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
}

export function stackPhotos(photos: HTMLElement[]) {
  photos.forEach((photo, i) => {
    gsap.fromTo(
      photo,
      { opacity: 0, rotation: -10 + Math.random() * 20, scale: 0.8 },
      {
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 1,
        delay: i * 0.2,
        ease: 'back.out(1.7)'
      }
    )
  })
}