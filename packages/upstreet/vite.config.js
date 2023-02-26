import gltf from 'vite-plugin-gltf'

import { draco } from '@gltf-transform/functions'

/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 3400,
    fs: {
      strict: true
    }
  },
  worker: {
    format: 'esm'
  },
  plugins: [
    gltf({
      transforms: [draco()]
    })
  ]
}
