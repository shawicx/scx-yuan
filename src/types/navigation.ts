export interface MenuItem {
  path: string
  title: string
  icon: string
  locked?: boolean
}

export const menuItems: MenuItem[] = [
  { path: '/wake-signal', title: '01 · 唤醒', icon: 'signal' },
  { path: '/frequency', title: '02 · 频率', icon: 'radio' },
  { path: '/fragments', title: '03 · 碎片', icon: 'sparkles' },
  { path: '/orbit', title: '04 · 轨迹', icon: 'orbit' },
  { path: '/transmission', title: '05 · 传达', icon: 'transmit' }
]
