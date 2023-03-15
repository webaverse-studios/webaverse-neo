import { throttle } from '@soulofmischief/js-utils'
import m from 'mithril'

import { setViewHeight } from './setViewHeight'


export const handleResize = throttle(
  () => {
    // Calculate height.
    setViewHeight()

    // Update view.
    m.redraw()
  },

  1000 / 15, // 15 FPS
  { trailing: true },
)
