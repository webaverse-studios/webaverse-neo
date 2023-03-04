import m from 'mithril'
import { body } from './style.module.scss'
import { lastFrameTime } from '../../lib/mithril.js'

const
  neutral = 'color: gray;',
  low = 'color: forestgreen;',
  medium = 'color: orange;',
  high = 'color: red;',

  _Default = `.${body}`


export function Default() {
  // Track frame time.

  return {
    // Log redraw time.
    onupdate() {
      const
        // Get last frame time.
        now = performance.now(),
        diff = ( now - lastFrameTime ).toFixed( 2 ),

        // Get color.
        color = diff < 16
          ? low
          : diff < 33
            ? medium
            : high

      //eslint-disable-next-line no-console
      console.log( `%c Redraw: %c${diff}ms`, neutral, color )
    },

    /*oncreate() {
      setInterval(() => {
        m.redraw()
      }, 1000 / 60 )
    },*/

    view({ children }) { return m( _Default, [ children ])}
  }
}
