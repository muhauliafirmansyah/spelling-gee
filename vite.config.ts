import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/words/*.svg', 'favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Spelling Gee Alt',
        short_name: 'SpellingGee',
        description: 'Latihan ejaan bahasa Inggris untuk anak Indonesia',
        theme_color: '#58cc02',
        background_color: '#f7f9fa',
        display: 'standalone',
        icons: [
          {
            src: 'assets/words/queen.svg',
            sizes: '256x256',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,json,png,wav,mp3}']
      }
    })
  ],
  define: {
    __BUILD_ID__: JSON.stringify(Date.now().toString())
  },
  base: './'
});

