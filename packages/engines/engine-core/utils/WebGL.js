class WebGL {
  /**
   * @returns {boolean} - Whether WebGL is available or not.
   */
  static isWebGLAvailable() {
    try {
      const canvas = document.createElement( 'canvas' )
      return !!(
        window.WebGLRenderingContext &&
        ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ))
      )
    } catch ( e ) {
      return false
    }
  }

  /**
   * @returns {boolean} - Whether WebGL 2 is available or not.
   */
  static isWebGL2Available() {
    try {
      const canvas = document.createElement( 'canvas' )
      return !!( window.WebGL2RenderingContext && canvas.getContext( 'webgl2' ))
    } catch ( e ) {
      return false
    }
  }

  /**
   * Retreive the error message for WebGL.
   *
   * @returns {HTMLDivElement} - The div with the error message attached.
   */
  static getWebGLErrorMessage() {
    return this.getErrorMessage( 1 )
  }

  /**
   * Retreive the error message for WebGL 2.
   *
   * @returns {HTMLDivElement} - The div with the error message attached.
   */
  static getWebGL2ErrorMessage() {
    return this.getErrorMessage( 2 )
  }

  /**
   *  Retreive the error message based on the version of WebGL.
   *
   * @param {number} version - The version of WebGL to check for.
   * @returns {HTMLDivElement} - The div with the error message attached.
   */
  static getErrorMessage( version ) {
    const names = {
      1: 'WebGL',
      2: 'WebGL 2',
    }

    const contexts = {
      1: window.WebGLRenderingContext,
      2: window.WebGL2RenderingContext,
    }

    let message =
      'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>'

    const element = document.createElement( 'div' )
    element.id = 'webglmessage'
    element.style.fontFamily = 'monospace'
    element.style.fontSize = '13px'
    element.style.fontWeight = 'normal'
    element.style.textAlign = 'center'
    element.style.background = '#fff'
    element.style.color = '#000'
    element.style.padding = '1.5em'
    element.style.width = '400px'
    element.style.margin = '5em auto 0'

    if ( contexts[version] != null ) {
      message = message.replace( '$0', 'graphics card' )
    } else {
      message = message.replace( '$0', 'browser' )
    }

    message = message.replace( '$1', names[version])

    element.innerHTML = message
    return element
  }
}

export default WebGL
