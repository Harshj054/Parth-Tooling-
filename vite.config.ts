import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
  server: {
    // Don't let the dev watcher choke on large/locked media dropped into the tree.
    watch: {
      ignored: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.mp4'],
    },
  },
})
