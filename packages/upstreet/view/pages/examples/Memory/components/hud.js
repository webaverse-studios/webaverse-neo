import m from 'mithril'
import { hud } from '../style.module.scss'

const _HUD = `.${hud}`

export function HUD() {
  return {
    view(vnode) {
      const agent = vnode.attrs.agent ?? {}

      console.log('HUD', agent)
      const thirst = agent.thirst ?? -1
      const hunger = agent.hunger ?? -1
      const items = {}
      if (agent.items) {
        for (const key in agent.items) {
          items[key] = {
            actions: agent.items[key].userData.actions,
          }
        }
      }
      return m(_HUD, [
        m('span', `Thirst: ${thirst}`),
        m('span', `Hunger: ${hunger}`),
        m('div', `Actions: ${agent.actions}`),
        m('div', `Items: ${JSON.stringify(items)}`),
      ])
    },
  }
}
