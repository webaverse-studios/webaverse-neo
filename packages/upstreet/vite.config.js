import strip from '@rollup/plugin-strip'
import wasm from 'vite-plugin-wasm'

import config from '@webaverse-studios/config'

const { upstreetConfig } = config,
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
  assetsInclude: ['**/*.glb', '**/*.vrm', '**/*.z', '**/*.wasm'],

  build: {
    commonjsOptions: {
      include: [/node_modules/, /@webaverse-studios\/config/],
      // transformMixedEsModules: true,
    },
  },

  esbuild: {
    drop: ['console', 'debugger'],
  },

  optimizeDeps: {
    include: ['@webaverse-studios/config'],
  },

  plugins: [
    wasm(),
    // topLevelAwait(),

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
      strict: true,
    },
  },

  worker: {
    format: 'es',
  },
}
