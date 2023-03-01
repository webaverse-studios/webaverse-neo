import m from 'mithril'
import { WebaverseEngine } from '@webaverse-studios/engine'
//import { throttle } from '@soulofmischief/js-utils'
//import { Game } from '#Models/Game'
import { canvas as _canvas } from './style.module.scss'

// const _Home = `.${body}`

export default () => {
  let resizeListener

  return {
    async oncreate ({ dom }) {
      // Create and configure the canvas element.
      // We append a canvas element so that mithril does not overwrite it.
      // canvas = document.createElement( 'canvas' )
      // canvas.classList.add( _canvas )

      // Append the canvas element to the dom.
      // dom.appendChild( canvas )


      // Add resize listener.
      //resizeListener = throttle(() => Game.resize(), 250 )
      addEventListener( 'resize', resizeListener )

      // Start the engine.
      new WebaverseEngine({ canvas:dom })

      //await Game.reset()
      //await Game.start( canvas )
    },

    onremove () {
      removeEventListener( 'resize', resizeListener )
    },

    view () {
      return m( 'canvas', {class: `.${_canvas}`})
    }
  }
}
