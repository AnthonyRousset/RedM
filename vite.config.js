import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: './html',
  base: './',
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  plugins: [vue()],
});
