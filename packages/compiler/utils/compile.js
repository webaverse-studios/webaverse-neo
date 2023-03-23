import esbuild from 'esbuild'

import '@babel/preset-react' // note: needed the esbuild plugin, but will be tree-shaken by next.js if removed here
import metaversefilePlugin from '../plugins/metaversefilePlugin'

const metaversefilePluginInstance = metaversefilePlugin()

// check if start script
if ( import.meta.url === `file://${process.argv[1]}` ) {
  ( async () => {
    const moduleUrl = process.argv[2]
    if ( !moduleUrl ) {
      throw new Error( 'no module url specified' )
    }
    if ( /^\.\.\//.test( moduleUrl )) {
      throw new Error( 'module url cannot be above current directory' )
    }

    const b = await compile( moduleUrl )
    console.log( b )
  })()
}

/**
 * Proxy the metaversefile plugin to esbuild
 *
 * @type {import('esbuild').Plugin}
 */
const metaversefilePluginProxy = {
  name: 'metaversefile',
  setup( build ) {
    build.onResolve({ filter: /^/ }, async ( args ) => {
      try {
        const path = await metaversefilePluginInstance.resolveId(
          args.path,
          args.importer
        )

        return {
          path,
          namespace: 'metaversefile',
        }
      } catch ( err ) {
        return {
          errors: [
            {
              text: err.stack,
            },
          ],
        }
      }
    })

    build.onLoad({ filter: /^/ }, async ( args ) => {
      try {
        let loadedInstance = await metaversefilePluginInstance.load(
          args.path
        )
        return { contents: loadedInstance.code }
      } catch ( err ) {
        return {
          errors: [
            {
              text: err.stack,
            },
          ],
        }
      }
    })
  },
}

/**
 * Compile a module url
 *
 * @param {string} moduleUrl the module url to compile
 */
async function compile( moduleUrl ) {
  const build = await esbuild.build({
    entryPoints: [moduleUrl],
    bundle: true,
    format: 'esm',
    write: false,
    outdir: 'out',
    plugins: [metaversefilePluginProxy],
  })

  if ( build.outputFiles.length > 0 ) {
    return build.outputFiles[0].contents
  }

  if ( build.errors.length > 0 ) {
    throw new Error( build.errors[0].text )
  }

  throw new Error( 'no output' )
}

export default compile
