import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import VitePluginWebpCompress from '../src/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Inspect(), VitePluginWebpCompress()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.js'],
  },
})
