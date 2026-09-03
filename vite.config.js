import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Root user page (yuuki-burleigh.github.io) serves from "/", not a repo subpath.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
