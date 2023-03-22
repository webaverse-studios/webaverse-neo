import { throttle } from '@soulofmischief/js-utils'
import m from 'mithril'

import { body, canvas } from './style.module.scss'

// Components
const _Home = `.${body}`,
  Canvas = `canvas.${canvas}`

export default () => {
  let resizeListener

  return {
    async oncreate({ dom }) {
      // Get canvas element.
      const canvas = dom.querySelector( Canvas )

      // Add resize listener.
      resizeListener = throttle(() => {
        // engine.resize()
        //m.redraw()
      }, 250 )

      addEventListener( 'resize', resizeListener )
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
