import gltf from 'vite-plugin-gltf'

import {draco} from '@gltf-transform/functions'
import wasm from 'vite-plugin-wasm'

/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 3400,
    fs: {
      strict: true
    }
  },
  worker: {
    format: 'es'
  },
  plugins: [
    wasm(),
    gltf({
      transforms: [draco()]
    })
  ],
  assetsInclude: ['**/*.glb', '**/*.vrm', '**/*.z', "**/*.wasm"]
}
