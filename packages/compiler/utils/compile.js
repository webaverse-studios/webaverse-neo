import esbuild from 'esbuild'

import '@babel/preset-react' // note: needed the esbuild plugin, but will be tree-shaken by next.js if removed here
import metaversefilePlugin from '../plugins/metaversefilePlugin'

const metaversefilePluginInstance = metaversefilePlugin()

const metaversefilePluginProxy = {
  name: 'metaversefile',
  setup( build ) {
    build.onResolve({ filter: /^/ }, async ( args ) => {
      try {
        const p = await metaversefilePluginInstance.resolveId(
          args.path,
          args.importer
        )
        return {
          path: p,
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
        let c = await metaversefilePluginInstance.load( args.path )
        c = c.code
        return {
          contents: c,
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
    plugins: [metaversefilePluginProxy],
    write: false,
    outdir: 'out',
  })

  if ( build.outputFiles.length > 0 ) {
    return build.outputFiles[0].contents
  } else if ( build.errors.length > 0 ) {
    throw new Error( build.errors[0].text )
  } else {
    throw new Error( 'no output' )
  }
}
export default compile

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
    // eslint-disable-next-line no-console
    console.log( b )
  })()
}
