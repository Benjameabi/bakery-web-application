import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'motion': ['motion/react'],
          'icons': ['@fortawesome/react-fontawesome', '@fortawesome/free-brands-svg-icons', '@fortawesome/free-solid-svg-icons']
        }
      }
    }
  }
})

