import wasm from 'vite-plugin-wasm'

/** @type {import('vite').UserConfig} */
export default {
  assetsInclude: ['**/*.glb', '**/*.vrm', '**/*.z', '**/*.wasm'],

  server: {
    fs: {
      strict: true,
    },
  },

  worker: {
    format: 'es',
  },

  plugins: [wasm()],
}
