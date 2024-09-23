import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  css: { devSourcemap: true },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  }
})
