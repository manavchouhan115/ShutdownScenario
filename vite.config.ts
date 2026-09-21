import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' makes the built files work from any folder, including GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
})
