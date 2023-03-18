import m from 'mithril'

import { Messages } from './components/Messages/index.js'
import { Textbox } from './components/Textbox/index.js'
import { body } from './style.module.scss'

const _Chatbox = `.${body}`

/**
 * Chatbox
 *
 * @returns {object} mithril component
 */
export function Chatbox() {
  const messages = [],
    agentState = {
      isTyping: false,
    }

  return {
    view( vnode ) {
      return m( _Chatbox, [
        m( Messages, { agentState, messages }),
        m( Textbox, { agentState, messages, engine: vnode.attrs.engine }),
      ])
    },
  }
}
