import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://<username>.github.io/fast-cups/ — update this if the
  // GitHub repo is ever renamed.
  base: '/fast-cups/',
})
