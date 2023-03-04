import m from 'mithril'
import { NyxEngine } from '@webaverse-studios/engine'
import { throttle } from '@soulofmischief/js-utils'
import { Test } from '../../../scenes/index.js'
import { canvas as _canvas } from './style.module.scss'


// const _Home = `.${body}`
const Canvas = `canvas.${_canvas}`


export default () => {
  let resizeListener

  return {
    async oncreate ({ dom }) {
      // Add resize listener.
      resizeListener = throttle(() => engine.resize(), 250 )
      addEventListener( 'resize', resizeListener )

      // Start the engine. VROOM
      const engine = new NyxEngine({ canvas: dom })
      engine.start()
      engine.load( Test )
    },

    // Remove resize listener.
    onremove () {
      removeEventListener( 'resize', resizeListener )
    },

    view () { return m( Canvas )}
  }
}
