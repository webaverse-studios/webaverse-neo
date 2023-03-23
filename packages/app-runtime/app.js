import * as THREE from 'three'

export class App extends THREE.Object3D {
  constructor() {
    super()

    this.isApp = true
    this.components = []
    this.description = ''
    this.appType = 'none'
    this.modules = []
    this.hasSubApps = false
    this.lastMatrix = new THREE.Matrix4()
  }

  getComponent( key ) {
    const component = this.components.find(
      ( component ) => component.key === key
    )
    return component ? component.value : null
  }

  #setComponentInternal( key, value ) {
    let component = this.components.find(
      ( component ) => component.key === key
    )
    if ( !component ) {
      component = { key, value }
      this.components.push( component )
    }
    component.key = key
    component.value = value
    this.dispatchEvent({
      type: 'componentupdate',
      key,
      value,
    })
  }

  setComponent( key, value = true ) {
    this.#setComponentInternal( key, value )
    this.dispatchEvent({
      type: 'componentsupdate',
      keys: [key],
    })
  }

  setComponents( o ) {
    const keys = Object.keys( o )
    for ( const k of keys ) {
      const v = o[k]
      this.#setComponentInternal( k, v )
    }
    this.dispatchEvent({
      type: 'componentsupdate',
      keys,
    })
  }

  hasComponent( key ) {
    return this.components.some(( component ) => component.key === key )
  }

  removeComponent( key ) {
    const index = this.components.findIndex(
      ( component ) => component.key === key
    )
    if ( index !== -1 ) {
      this.components.splice( index, 1 )
      this.dispatchEvent({
        type: 'componentupdate',
        key,
        value: null,
      })
    }
  }

  get contentId() {
    const contentIdComponent = this.getComponent( 'contentId' )
    return contentIdComponent !== null ? contentIdComponent : ''
  }

  set contentId( contentId ) {
    this.setComponent( 'contentId', contentId + '' )
  }

  get instanceId() {
    const instanceIdComponent = this.getComponent( 'instanceId' )
    return instanceIdComponent !== null ? instanceIdComponent : ''
  }

  set instanceId( instanceId ) {
    this.setComponent( 'instanceId', instanceId + '' )
  }

  getRenderSettings() {
    if ( this.hasSubApps ) {
      return renderSettingsManager.findRenderSettings( this )
    } else {
      return null
    }
  }

  activate({ physicsId = -1 } = {}) {
    this.dispatchEvent({
      type: 'activate',
      physicsId,
    })
  }

  wear() {
    const localPlayer = playersManager.getLocalPlayer()
    localPlayer.wear( this )
  }

  unwear() {
    const localPlayer = playersManager.getLocalPlayer()
    localPlayer.unwear( this )
  }

  use() {
    this.dispatchEvent({
      type: 'use',
      use: true,
    })
  }

  destroy() {
    this.dispatchEvent({
      type: 'destroy',
    })
  }
}
