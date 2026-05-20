import type { StoryChapter, PhotoItem, SceneMeta } from '../types'

export const storyChapters: StoryChapter[] = [
  {
    title: '初遇',
    content: '那一天，阳光正好...',
    date: '2023-03-15'
  },
  {
    title: '相知',
    content: '慢慢地，我们发现了彼此的闪光点',
    date: '2023-05-20'
  }
]

export const photos: PhotoItem[] = [
  {
    src: '/images/photos/photo1.jpg',
    caption: '第一次旅行',
    date: '2023-06-01'
  }
]

export const sceneMeta: Record<string, SceneMeta> = {
  Scene1_Hello: { title: 'Hello', description: '', theme: 'gradient' },
  Scene2_Story: { title: '我们的故事', description: '', theme: 'light' },
  Scene3_Gallery: { title: '回忆', description: '', theme: 'dark' },
  Scene4_Heart3D: { title: '心', description: '', theme: 'gradient' },
  Scene5_End: { title: '永远', description: '', theme: 'light' }
}