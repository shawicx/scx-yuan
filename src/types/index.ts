export interface PhotoItem {
  src: string
  caption?: string
  date?: string
}

export interface StoryChapter {
  title: string
  content: string
  date: string
}

export interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string
}

export interface SceneMeta {
  title: string
  description: string
  theme: 'light' | 'dark' | 'gradient'
}