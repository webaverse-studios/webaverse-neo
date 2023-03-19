import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.vrm', '**/*.z', '**/*.wasm'],
  plugins: [],
})
