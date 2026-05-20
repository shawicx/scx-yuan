# Midnight Orbit

> A frequency only opened at night.
> 「有些信号，只会在深夜被接收到。」

A cinematic, immersive web experience built with Vue 3 and Three.js.

## Development

```bash
pnpm install
pnpm run dev
```

Visit http://localhost:5173

## Pages

- `/wake-signal` - Opening page with starfield entrance
- `/frequency` - FM dialer (coming soon)
- `/fragments` - Floating memory fragments (coming soon)
- `/orbit` - Orbit drift visualization (coming soon)
- `/transmission` - Ending page (coming soon)

## Build

```bash
pnpm run build
```

Build output in `dist/` directory.

## Project Structure

- `src/scenes/` - Page components
- `src/three/` - Three.js scenes and manager
- `src/components/common/` - Shared components
- `src/assets/shaders/` - GLSL shaders

## Tech Stack

- Vue 3 + TypeScript
- Three.js
- GSAP
- Vite
