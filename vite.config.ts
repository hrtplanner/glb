import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { threeMinifier } from '@yushijinhun/three-minifier-rollup'
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
  plugins: [
    svelte()
  ],
  ssr: {
    noExternal: ['camera-controls']
  },
  build: {
    rollupOptions: {
      plugins: [
        threeMinifier(),
        resolve({
          dedupe: ['svelte', 'svelte/transition', 'svelte/internal']
        })
      ],
      output: {
        manualChunks: {
          'three': ['three']
        }
      }
    }
  }
})
