import m from 'mithril'
import { NyxEngine } from '@webaverse-studios/engine'
import { throttle } from '@soulofmischief/js-utils'
import { Grid } from '../../../scenes/index.js'
import { body, canvas } from './style.module.scss'


const defaultScene = Grid

// Components
const
  _Home = `.${body}`,
  Canvas = `canvas.${canvas}`


export default () => {
  let resizeListener

  return {
    oncreate ({ dom }) {
      // Get canvas element.
      const canvas = dom.querySelector( Canvas )

      // Add resize listener.
      resizeListener = throttle(() => {
        engine.resize()
        //m.redraw()
      }, 250 )

      addEventListener( 'resize', resizeListener )

      // Create engine.
      const engine = new NyxEngine({ canvas, dom })

      // Start the engine. VROOM
      engine.start()
      engine.load( defaultScene )
    },

    // Remove resize listener.
    onremove () {
      removeEventListener( 'resize', resizeListener )
    },

    view () { return m( _Home, m( Canvas ))}
  }
}
