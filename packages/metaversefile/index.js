export class Metaversefile extends EventTarget {
  static _instanceCache

  /**
   * Get the singleton instance of Metaversefile
   *
   * @type {Metaversefile}
   */
  static get instance() {
    if ( !this._instanceCache ) {
      this._instanceCache = new this()
    }

    return this._instanceCache
  }

  /**
   * Set api of Metaversefile
   *
   * @param {object} obj api object
   */
  setApi( obj ) {
    for ( const key in obj ) {
      Object.defineProperty( this, key, {
        value: obj[key],
      })
    }

    Object.freeze( this )
  }
}
