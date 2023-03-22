import m from 'mithril'
import { NyxEngine } from '@webaverse-studios/engine-nyx'
import { throttle } from '@soulofmischief/js-utils'
import { Grid } from '../../../../scenes/index'
import { body, canvas, agentview } from './style.module.scss'
import { HUD } from './components/hud'

import { Agent } from '@webaverse-studios/backend-agent'

const defaultScene = Grid

// Components
const _Home = `.${body}`,
  Canvas = `canvas.${canvas}`,
  AgentView = `canvas.${agentview}`

export default () => {
  let resizeListener
  let agent

  return {
    async oncreate({ dom }) {
      const t0 = performance.now()

      // Get canvas element.
      const canvas = dom.querySelector(Canvas)
      const agentView = dom.querySelector(AgentView)

      // Add resize listener.
      resizeListener = throttle(() => {
        engine.resize()
        //m.redraw()
      }, 250)

      addEventListener('resize', resizeListener)

      // Create engine.
      const engine = new NyxEngine({ canvas, dom })

      // Start the engine. VROOM!!
      await engine.load(defaultScene)
      await engine.start()
      const t1 = performance.now()

      agent = new Agent({ engine, canvas: agentView })
      console.log(`Engine started in ${t1 - t0}ms.`)
      m.redraw()
    },

    // Remove resize listener.
    onremove() {
      removeEventListener('resize', resizeListener)
    },

    view() {
      console.log('VIEW', agent)
      return m(_Home, m(Canvas), m(AgentView), m(HUD, { agent }))
    },
  }
}
