import {
  dedup,
  draco,
  prune,
  textureResize,
  textureCompress,
  weld,
  quantize,
} from '@gltf-transform/functions'

import strip from '@rollup/plugin-strip'
import config from '@webaverse-studios/config'
import sharp from 'sharp'
import gltf from 'vite-plugin-gltf'
import wasm from 'vite-plugin-wasm'


const
  { upstreetConfig } = config,
  { port } = upstreetConfig,
  stripFunctions = [
    'Debug.assert',
    'Debug.assertDeprecated',
    'Debug.call',
    'Debug.deprecated',
    'Debug.warn',
    'Debug.warnOnce',
    'Debug.error',
    'Debug.errorOnce',
    'Debug.gpuError',
    'Debug.log',
    'Debug.logOnce',
    'Debug.trace',
    'DebugHelper.setName',
    'DebugHelper.setLabel',
    'DebugGraphics.toString',
    'DebugGraphics.clearGpuMarkers',
    'DebugGraphics.pushGpuMarker',
    'DebugGraphics.popGpuMarker',
  ]


/** @type {import('vite').UserConfig} */
export default {
  esbuild: {
    drop: ['console', 'debugger'],
  },
  plugins: [
    wasm(),
    // topLevelAwait(),
    gltf({
      transforms: [
        // remove unused resources
        prune(),
        weld(),
        quantize(),
        // combine duplicated resources
        dedup(),
        // keep textures under 2048x2048
        textureResize({ size: [2048, 2048] }),
        // optimize images
        textureCompress({ encoder: sharp }),
        // compress mesh geometry
        draco(),
      ],
    }),

    process.env.NODE_ENV != 'development'
      ? strip({
          debugger: true,
          functions: stripFunctions,
        })
      : undefined,
  ],
  server: {
    port,
    fs: {
      strict: true
    }
  },
  worker: {
    format: 'es'
  },

  assetsInclude: ['**/*.glb', '**/*.vrm', '**/*.z', "**/*.wasm"],
}
