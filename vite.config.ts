import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base — works on Cloudflare Pages (site root) and GitHub Pages (/dailyduel/ subpath)
  base: './',
  plugins: [react(), tailwindcss()],
})
