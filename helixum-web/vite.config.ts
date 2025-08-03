import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@components': '/src/components',
      '@features': '/src/features',
      '@hooks': '/src/hooks',
      '@lib': '/src/lib',
      '@types': '/src/types',
      '@utils': '/src/utils',
      '@providers': '/src/providers',
      '@layouts': '/src/layouts',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@store': '/src/store',
      '@assets': '/src/assets',
    },
  },
})
