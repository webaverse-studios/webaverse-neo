import * as THREE from 'three'

import { AppContext } from './app-context.js'
import { App } from './app.js'
import { compilerBaseUrl } from '../engine/endpoints.js'
import { componentTemplates } from '../engine/metaverse-components.js'

let currentAppRender = null
const importFn = new Function( 'u', 'return import(u)' )

const _bindDefaultComponents = ( ctx ) => {
  const app = ctx.useApp()
  currentAppRender = app

  // component handlers
  const componentHandlers = {}
  for ( const { key, value } of app.components ) {
    const componentHandlerTemplate = componentTemplates[key]
    if ( componentHandlerTemplate ) {
      componentHandlers[key] = componentHandlerTemplate( ctx, value )
    }
  }
  app.addEventListener( 'componentupdate', ( e ) => {
    const { key, value } = e

    currentAppRender = app

    const componentHandler = componentHandlers[key]
    if ( !componentHandler && value !== undefined ) {
      const componentHandlerTemplate = componentTemplates[key]
      if ( componentHandlerTemplate ) {
        componentHandlers[key] = componentHandlerTemplate( ctx, value )
      }
    } else if ( componentHandler && value === undefined ) {
      componentHandler.remove()
      delete componentHandlers[key]
    }

    currentAppRender = null
  })

  currentAppRender = null
}

export class ImportManager {
  constructor() {}
  async importUrl( s ) {
    if ( /^[a-zA-Z0-9]+:/.test( s )) {
      s = `${compilerBaseUrl}${s.replace( /^([a-zA-Z0-9]+:\/)\//, '$1' )}`
    } else {
      s = new URL( s.replace( /^\/+/, '' ), compilerBaseUrl ).href
    }

    try {
      const m = await importFn( s )
      return m
    } catch ( err ) {
      console.error( err )
      return null
    }
  }
  createAppInternalFromEngine(
    appSpec = {},
    { engine, onWaitPromise = null } = {}
  ) {
    const {
      contentId = null,
      module = null,
      components = [],
      position = null,
      quaternion = null,
      scale = null,
      parent = null,
      in_front = false,
      app = new App(),
    } = appSpec

    // transform
    const _updateTransform = () => {
      let matrixNeedsUpdate = false
      if ( Array.isArray( position )) {
        app.position.fromArray( position )
        matrixNeedsUpdate = true
      } else if ( position?.isVector3 ) {
        app.position.copy( position )
        matrixNeedsUpdate = true
      }
      if ( Array.isArray( quaternion )) {
        app.quaternion.fromArray( quaternion )
        matrixNeedsUpdate = true
      } else if ( quaternion?.isQuaternion ) {
        app.quaternion.copy( quaternion )
        matrixNeedsUpdate = true
      }
      if ( Array.isArray( scale )) {
        app.scale.fromArray( scale )
        matrixNeedsUpdate = true
      } else if ( scale?.isVector3 ) {
        app.scale.copy( scale )
        matrixNeedsUpdate = true
      }
      if ( in_front ) {
        const localPlayer = playersManager.getLocalPlayer()
        app.position
          .copy( localPlayer.position )
          .add(
            new THREE.Vector3( 0, 0, -1 ).applyQuaternion(
              localPlayer.quaternion
            )
          )
        app.quaternion.copy( localPlayer.quaternion )
        app.scale.setScalar( 1 )
        matrixNeedsUpdate = true
      }
      if ( parent ) {
        parent.add( app )
        matrixNeedsUpdate = true
      }

      if ( matrixNeedsUpdate ) {
        app.updateMatrixWorld()
        app.lastMatrix.copy( app.matrixWorld )
      }
    }
    _updateTransform()

    // components
    const _updateComponents = () => {
      if ( Array.isArray( components )) {
        for ( const { key, value } of components ) {
          app.setComponent( key, value )
        }
      } else if ( typeof components === 'object' && components !== null ) {
        for ( const key in components ) {
          const value = components[key]
          app.setComponent( key, value )
        }
      }
    }
    _updateComponents()

    if ( contentId ) {
      app.contentId = contentId
    }

    // load
    const u = this.getObjectUrl( appSpec )

    if ( u || module ) {
      const p = ( async () => {
        let m
        if ( u ) {
          m = await this.importUrl( u )
        } else {
          m = module
        }
        // console.log('load module', {u, m});
        await this.addModuleFromEngine( app, engine, m )
      })()
      if ( onWaitPromise ) {
        onWaitPromise( p )
      }
    }

    return app
  }
  async createAppAsyncFromEngine( spec, engine ) {
    let p = null
    const app = this.createAppInternalFromEngine( spec, {
      engine,
      onWaitPromise( newP ) {
        p = newP
      },
    })
    if ( p !== null ) {
      await p
    }
    return app
  }

  async addModuleFromEngine( app, engine, m ) {
    if ( !app || !engine || !m ) {
      console.warn( 'addModuleFromEngine missing args', { app, engine, m })
    }

    try {
      app.name =
        m.name ?? ( m.contentId ? m.contentId.match( /([^\/\.]*)$/ )[1] : '' )
    } catch ( error ) {
      console.error( error )
    }
    app.description = m.description ?? ''
    app.appType = m.type ?? ''
    app.contentId = m.contentId ?? ''
    if ( Array.isArray( m.components )) {
      for ( const { key, value } of m.components ) {
        if ( !app.hasComponent( key )) {
          app.setComponent( key, value )
        }
      }
    }
    app.modules.push( m )

    let appContext = null
    let renderSpec = null
    let waitUntilPromise = null
    const _initModule = () => {
      currentAppRender = app

      try {
        const fn = m.default
        if ( typeof fn === 'function' ) {
          appContext = new AppContext({
            engine,
            app,
            waitUntil( p ) {
              waitUntilPromise = p
            },
          })
          renderSpec = fn( appContext )
        } else {
          console.warn( 'module default export is not a function', m )
          return null
        }
      } catch ( err ) {
        console.warn( err )
        return null
      } finally {
        currentAppRender = null
      }
    }
    _initModule()

    if ( waitUntilPromise ) {
      await waitUntilPromise
    }

    if ( renderSpec instanceof THREE.Object3D ) {
      const o = renderSpec
      if ( o !== app ) {
        app.add( o )
        o.updateMatrixWorld()
      }

      _bindDefaultComponents( appContext )

      return app
    } else if (
      renderSpec === false ||
      renderSpec === null ||
      renderSpec === undefined
    ) {
      app.destroy()
      return null
    } else if ( renderSpec === true ) {
      return null
    } else {
      app.destroy()
      console.warn( 'unknown renderSpec:', renderSpec )
      throw new Error( 'unknown renderSpec' )
    }
  }
  getObjectUrl( object, baseUrl = '' ) {
    const { contentId, type, content } = object

    /**
     *
     * @param type
     * @param content
     */
    function typeContentToUrl( type, content ) {
      if ( typeof content === 'object' ) {
        content = JSON.stringify( content )
      }
      const dataUrlPrefix = 'data:' + type + ','
      return dataUrlPrefix + encodeURIComponent( content ) + '.data'
    }

    if ( contentId ) {
      if ( baseUrl ) {
        let u = new URL( contentId, baseUrl ).href
        const baseUrlObj = new URL( baseUrl )
        const baseUrlHost =
          baseUrlObj.protocol + '//' + baseUrlObj.host + '/'
        if ( u.startsWith( baseUrlHost )) {
          u = u.slice( baseUrlHost.length )
        }
        return u
      } else {
        return contentId
      }
    } else if ( type && content ) {
      return typeContentToUrl( type, content )
    } else {
      return null
    }
  }
}
