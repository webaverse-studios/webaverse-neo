import m from 'mithril'
//import { throttle } from '@soulofmischief/js-utils'
//import { Game } from '#Models/Game'
import { body, canvas as _canvas } from './style.module.scss'


const _Home = `.${body}`


export default () => {
  let canvas, resizeListener

  return {
    async oncreate({ dom }) {
      // Create and configure the canvas element.
      // We append a canvas element so that mithril does not overwrite it.
      canvas = document.createElement( 'canvas' )
      canvas.classList.add( _canvas )

      // Append the canvas element to the dom.
      dom.appendChild( canvas )

      // Add resize listener.
      //resizeListener = throttle(() => Game.resize(), 250 )
      addEventListener( 'resize', resizeListener )

      // Start the game.
      //await Game.reset()
      //await Game.start( canvas )
    },

    onremove() { removeEventListener( 'resize', resizeListener )},

    view() { return m( _Home )}
  }
}
