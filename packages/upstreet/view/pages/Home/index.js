import { throttle } from '@soulofmischief/js-utils'
import m from 'mithril'

import { Debug } from '@webaverse-studios/debug'
import { NyxEngine } from '@webaverse-studios/engine-nyx'

import { body, canvas } from './style.module.scss'
import { Grid } from '../../../scenes/index'

const defaultScene = Grid

// Components
const _Home = `.${body}`,
  Canvas = `canvas.${canvas}`

export default () => {
  let resizeListener

  return {
    async oncreate({ dom }) {
      const t0 = performance.now()

      // Get canvas element.
      const canvas = dom.querySelector( Canvas )

      // Add resize listener.
      resizeListener = throttle(() => {
        engine.resize()
        //m.redraw()
      }, 250 )

      addEventListener( 'resize', resizeListener )

      // Create engine.
      const engine = new NyxEngine({
        canvas,
        root: dom
      })

      // Start the engine. VROOM!!
      await engine.load( defaultScene )
      await engine.start()
      const t1 = performance.now()

      Debug.log( `Engine started in ${t1 - t0}ms.` )
    },

    // Remove resize listener.
    onremove() {
      removeEventListener( 'resize', resizeListener )
    },

    view() {
      return m( _Home, m( Canvas ))
    },
  }
}
