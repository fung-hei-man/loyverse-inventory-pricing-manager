import { fileURLToPath, URL } from 'node:url'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "fix-node-globals-polyfill",
      setup(build) {
        build.onResolve({ filter: /util\.js/ }, ({ path }) => ({ path }));
      },
    },
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        nodePolyfills(),
      ],
    },
  },
  server: {
    proxy: {
      '/loyverse': {
        target: 'https://api.loyverse.com/v1.0',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/loyverse/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[LoyverseProxy] proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Authorization', req.headers.authorization);
            console.log('[LoyverseProxy] Sending request to: ', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('[LoyverseProxy] Received response from: ', proxyRes.statusCode, req.url);
          });
        },
      },
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/variables.scss";`
      }
    }
  }
})
