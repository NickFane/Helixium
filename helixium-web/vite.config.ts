import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
  }), react(), tsconfigPaths({
    loose: true,
  })],
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
