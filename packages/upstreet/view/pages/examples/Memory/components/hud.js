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
            actions: agent.items[key].userData.item_actions,
            state: agent.items[key].userData.state,
          }
        }
      }
      const surroundings = []
      console.log('HUD SURROUNDING', agent.surrounding)
      if (agent.surrounding) {
        for (const object of agent.surrounding) {
          surroundings.push(object.name)
        }
      }
      return m(_HUD, [
        m('span', `Thirst: ${thirst}`),
        m('span', `Hunger: ${hunger}`),
        m('div', `Actions: ${JSON.stringify(agent.actions)}`),
        m('div', `Items: ${JSON.stringify(items)}`),
        m('div', `Plan: ${agent.plan}`),
        m('div', `Action: ${agent.command}`),
        m('div', `Surrounding: ${JSON.stringify(surroundings)}`),
      ])
    },
  }
}
