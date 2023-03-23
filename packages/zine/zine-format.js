import { zbdecode, zbencode } from './encoding.js'
import { makeId } from './id-utils.js'
import { ZineStoryboardCompressor } from './zine-compression.js'
import { zineMagicBytes } from './zine-constants.js'

export { zineMagicBytes }

// obj is structured like:
// obj = [
//   [key, value],
//   [key2, [
//     [key3, value3],
//   ]]
// ]

// the methods automatically create intermediate objects
// keyPath is an array of keys

/**
 *getKeyPath
 *
 * @param {object} obj
 * @param {string[]} keyPath
 * @returns {object | undefined} value
 */
function getKeyPath( obj, keyPath ) {
  for ( let i = 0; i < keyPath.length; i++ ) {
    const key = keyPath[i]
    const item = obj.find(( item ) => item[0] === key )

    if ( !item ) {
      return undefined
    }

    obj = item[1]
  }

  return obj
}
/**
 * hasKeyPath
 *
 * @param {object} obj object
 * @param {string[]} keyPath keyPath
 * @returns {boolean} true if keyPath exists
 */
function hasKeyPath( obj, keyPath ) {
  return getKeyPath( obj, keyPath ) !== undefined
}
/**
 * setKeyPath
 *
 * @param {object} obj
 * @param {string[]} keyPath
 * @param {any} value
 */
function setKeyPath( obj, keyPath, value ) {
  // scan down to the parent object
  for ( let i = 0; i < keyPath.length - 1; i++ ) {
    const key = keyPath[i]
    let item = obj.find(( item ) => item[0] === key )
    if ( !item ) {
      item = [key, []]
      obj.push( item )
    }
    obj = item[1]
  }

  // set the value on the parent object
  const key = keyPath[keyPath.length - 1]
  const item = obj.find(( item ) => item[0] === key )
  if ( item ) {
    item[1] = value
  } else {
    obj.push([key, value])
  }
}
/**
 * deleteKeyPath
 *
 * @param {object} obj object
 * @param {string[]} keyPath keyPath
 * @returns {undefined}
 * @throws {void | Error} if key not found
 */
function deleteKeyPath( obj, keyPath ) {
  // scan down to the parent object
  for ( let i = 0; i < keyPath.length - 1; i++ ) {
    const key = keyPath[i]
    const item = obj.find(( item ) => item[0] === key )
    if ( !item ) {
      return undefined
    }
    obj = item[1]
  }

  // delete the value from the parent object
  const key = keyPath[keyPath.length - 1]
  const i = obj.findIndex(( item ) => item[0] === key )
  if ( i !== -1 ) {
    obj.splice( i, 1 )
  } else {
    throw new Error( `key not found': ${keyPath.join( ', ' )}` )
  }
}

//

/**
 * checkEventKeypathPrefix
 *
 * @param {object} e
 * @param {string[]} prefix
 * @returns {boolean} true if e.data.keyPath is a subpath of prefix
 */
function checkEventKeypathPrefix( e, prefix ) {
  return keyPathEquals( prefix, e.data.keyPath.slice( 0, -1 ))
}

/**
 * Checks if a is a subpath of b
 *
 * @param {string[]} a first key path
 * @param {string[]} b second key path
 * @returns {boolean} true if a is a subpath of b
 */
function keyPathEquals( a, b ) {
  return a.length === b.length && a.every(( key, i ) => key === b[i])
}

let compressor = null
const getCompressor = (() => {
  return () => {
    if ( !compressor ) {
      compressor = new ZineStoryboardCompressor()
    }
    return compressor
  }
})()

/**
 * initCompressor
 *
 * @param {object} params params
 * @param {number} params.numWorkers numWorkers
 */
export function initCompressor({ numWorkers } = {}) {
  if ( compressor ) {
    destroyCompressor()
  }
  compressor = new ZineStoryboardCompressor({
    numWorkers,
  })
}
/**
 * destroyCompressor
 */
export function destroyCompressor() {
  if ( compressor ) {
    compressor.destroy()
    compressor = null
  }
}

export class ZineStoryboardBase extends EventTarget {
  constructor() {
    super()

    this.zd = new ZineData()
  }
  prefix = []

  getKeys() {
    return this.zd.getKeys( this.prefix )
  }

  clone() {
    const result = new this.constructor()
    result.loadUncompressed( this.exportUncompressed())
    return result
  }
  clear() {
    this.zd.clear()
  }
  async loadAsync( uint8Array, { decompressKeys } = {}) {
    const compressor = getCompressor()

    this.loadUncompressed( uint8Array )

    await compressor.decompress( this, {
      keys: decompressKeys,
    })
  }
  loadUncompressed( uint8Array ) {
    this.zd.load( uint8Array )
  }
  async exportAsync({ decompressKeys } = {}) {
    const compressor = getCompressor()

    const zineStoryboardClone = this.clone()

    await compressor.compress( zineStoryboardClone, {
      keys: decompressKeys,
    })
    return zineStoryboardClone.exportUncompressed()
  }
  exportUncompressed() {
    return this.zd.toUint8Array()
  }

  mergeUint8Array( uint8Array ) {
    const zdData = zbdecode( uint8Array )
    this.zd.data.push( ...zdData )
  }
}

export class ZineStoryboard extends ZineStoryboardBase {
  constructor() {
    super()
    this.#init()
    this.#listen()
  }
  #panels = []
  #unlisten
  #init() {
    this.#panels = this.getKeys().map(( id ) => {
      const keyPath = this.prefix.concat([id])
      return new ZinePanel( this.zd, keyPath )
    })
  }
  #listen() {
    const onadd = ( e ) => {
      if ( !checkEventKeypathPrefix( e, this.prefix )) {
        return
      }

      const { keyPath } = e.data
      const panel = new ZinePanel( this.zd, keyPath )
      this.#panels.push( panel )

      this.dispatchEvent(
        new MessageEvent( 'paneladd', {
          data: {
            keyPath,
            panel,
          },
        })
      )
    }
    this.zd.addEventListener( 'add', onadd )

    const onremove = ( e ) => {
      if ( !checkEventKeypathPrefix( e, this.prefix )) {
        return
      }

      const { keyPath } = e.data
      const id = keyPath[keyPath.length - 1]
      const index = this.#panels.findIndex(( panel ) => panel.id === id )
      const panel = this.#panels[index]
      panel.destroy()
      this.#panels.splice( index, 1 )

      this.dispatchEvent(
        new MessageEvent( 'panelremove', {
          data: {
            keyPath,
            panel,
          },
        })
      )
    }
    this.zd.addEventListener( 'remove', onremove )

    this.#unlisten = () => {
      this.zd.removeEventListener( 'add', onadd )
      this.zd.removeEventListener( 'remove', onremove )
    }
  }

  getPanels() {
    return this.#panels
  }
  getPanel( index ) {
    return this.#panels[index]
  }
  addPanel() {
    const id = makeId()
    const keyPath = this.prefix.concat([id])
    this.zd.setData( keyPath, [])

    return this.#panels[this.#panels.length - 1]
  }

  removePanel( panel ) {
    const index = this.#panels.indexOf( panel )
    this.removePanelIndex( index )
  }
  removePanelIndex( index ) {
    if ( index !== -1 ) {
      const panel = this.#panels[index]
      const keyPath = this.prefix.concat([panel.id])
      this.zd.deleteData( keyPath )
    } else {
      throw new Error( 'panel not found' )
    }
  }

  destroy() {
    this.#unlisten()
  }
}

export class ZinePanel extends EventTarget {
  constructor( zd, prefix ) {
    super()

    this.zd = zd
    this.prefix = prefix

    this.#init()
    this.#listen()
  }
  get id() {
    return this.prefix[this.prefix.length - 1]
  }
  prefix
  #layers = []
  #unlisten
  #init() {
    const keys = this.getKeys()
    for ( const id of keys ) {
      const keyPath = this.prefix.concat([id])
      const layer = new ZineLayer( this.zd, keyPath )
      this.#addLayer( layer )
    }
  }
  #addLayer( layer ) {
    this.#layers.push( layer )

    const keyPath = layer.prefix
    layer.addEventListener( 'update', ( e ) => {
      this.dispatchEvent(
        new MessageEvent( 'layerupdate', {
          data: {
            keyPath,
            layer,
          },
        })
      )
    })

    this.dispatchEvent(
      new MessageEvent( 'layeradd', {
        data: {
          keyPath,
          layer,
        },
      })
    )
  }
  #removeLayer( layer, index ) {
    layer.destroy()
    this.#layers[index] = undefined

    // shave the tail
    for ( let i = this.#layers.length - 1; i >= 0; i-- ) {
      if ( this.#layers[i] !== undefined ) {
        break
      } else {
        this.#layers.pop()
      }
    }

    const keyPath = layer.prefix
    this.dispatchEvent(
      new MessageEvent( 'layerremove', {
        data: {
          keyPath,
          layer,
        },
      })
    )
  }
  #listen() {
    const onadd = ( e ) => {
      if ( !checkEventKeypathPrefix( e, this.prefix )) {
        return
      }

      const { keyPath } = e.data
      const layer = new ZineLayer( this.zd, keyPath )
      this.#addLayer( layer )
    }
    this.zd.addEventListener( 'add', onadd )

    const onremove = ( e ) => {
      if ( !checkEventKeypathPrefix( e, this.prefix )) return

      const { keyPath } = e.data
      const index = keyPath[0]
      const layer = this.#layers[index]
      this.#removeLayer( layer, index )
    }
    this.zd.addEventListener( 'remove', onremove )

    this.#unlisten = () => {
      this.zd.removeEventListener( 'add', onadd )
      this.zd.removeEventListener( 'remove', onremove )
    }
  }

  getKeys() {
    const keyPath = this.prefix
    return this.zd.getKeys( keyPath )
  }

  getLayers() {
    return this.#layers
  }
  getLayer( index ) {
    return this.#layers[index]
  }
  addLayer() {
    const id = makeId()
    const keyPath = this.prefix.concat([id])
    this.zd.setData( keyPath, [])

    const layer = this.#layers.find(( layer ) => layer.id === id )
    return layer
  }

  destroy() {
    this.#unlisten()
  }
}

class ZineLayer extends EventTarget {
  constructor( zd, prefix ) {
    super()

    this.zd = zd
    this.prefix = prefix
  }

  get id() {
    return this.prefix[this.prefix.length - 1]
  }
  prefix
  getData( key ) {
    const keyPath = this.prefix.concat([key])
    const value = this.zd.getData( keyPath )
    return value
  }
  setData( key, value ) {
    const keyPath = this.prefix.concat([key])
    this.zd.setData( keyPath, value )

    this.dispatchEvent(
      new MessageEvent( 'update', {
        data: {
          key,
          value,
          keyPath,
        },
      })
    )
  }
  getKeys() {
    const keyPath = this.prefix
    return this.zd.getKeys( keyPath )
  }

  matchesSpecs( specs ) {
    const keys = this.getKeys()
    for ( const spec of specs ) {
      if ( !keys.includes( spec )) {
        return false
      }
    }
    return true
  }

  destroy() {
    // nothing
  }
}

export class ZineData extends EventTarget {
  constructor( data = []) {
    super()

    this.data = data
  }

  toUint8Array() {
    return zbencode( this.data )
  }
  static fromUint8Array( uint8Array ) {
    return new ZineData( zbdecode( uint8Array ))
  }

  //

  clear() {
    for ( const [id, panelData] of this.data ) {
      this.dispatchEvent(
        new MessageEvent( 'remove', {
          data: {
            keyPath: [id],
          },
        })
      )
    }
    this.data.length = 0
  }
  load( uint8Array ) {
    if ( this.data.length !== 0 ) {
      throw new Error( 'cannot load into non-empty zine' )
    }

    this.data = zbdecode( uint8Array )
    for ( const [id, panelData] of this.data ) {
      this.dispatchEvent(
        new MessageEvent( 'add', {
          data: {
            keyPath: [id],
          },
        })
      )
    }
  }

  //

  getDatas() {
    return this.data
  }
  getData( key ) {
    const keyPath = [].concat( key )
    return getKeyPath( this.data, keyPath )
  }
  setData( key, value ) {
    const keyPath = [].concat( key )
    const hadKeyPath = hasKeyPath( this.data, keyPath )
    setKeyPath( this.data, keyPath, value )

    if ( !hadKeyPath && keyPath.length <= 2 ) {
      this.dispatchEvent(
        new MessageEvent( 'add', {
          data: {
            keyPath,
          },
        })
      )
    } else {
      this.dispatchEvent(
        new MessageEvent( 'update', {
          data: {
            keyPath,
          },
        })
      )
    }
  }
  deleteData( key ) {
    const keyPath = [].concat( key )
    deleteKeyPath( this.data, keyPath )

    if ( keyPath.length <= 2 ) {
      this.dispatchEvent(
        new MessageEvent( 'remove', {
          data: {
            keyPath,
          },
        })
      )
    } else {
      this.dispatchEvent(
        new MessageEvent( 'update', {
          data: {
            keyPath,
          },
        })
      )
    }
  }
  hasData( key ) {
    return this.getData( key ) !== undefined
  }
  getKeys( key ) {
    let parentData
    if ( key ) {
      parentData = this.getData( key )
    } else {
      parentData = this.data
    }
    return parentData.map(([key]) => key )
  }
}
