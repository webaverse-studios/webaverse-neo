import m from 'mithril'

import {
  body,
  message,
  role,
  roleCompanion,
  roleUser,
  typingIndicator,
} from './style.module.scss'

const
  // Components
  _Messages = `.${body}`,
  Message = `.${message}`,
  Role = `span.${role}`,
  TypingIndicator = `span.${typingIndicator}`,

  // Role classes
  roleClasses = {
    user: roleUser,
    assistant: roleCompanion,
  }


/**
 * Messages component
 *
 * @returns {object} mithril component
 */
export function Messages() {
  return {
    onupdate( v ) {
      // Scroll to bottom if user is close to bottom.
      const
        { scrollHeight, scrollTop, clientHeight } = v.dom,
        isNearBottom = scrollHeight - scrollTop - clientHeight < 100

      if ( isNearBottom ) v.dom.scrollTop = scrollHeight
    },
    view( v ) {
      return m( _Messages, [
        v.attrs.messages.map( message =>
          !message.isCode && m( Message, [
            m( Role,
              { class: roleClasses[ message.role ]},
              message.role,
            ),
            m( 'span', message.content ),
          ])
        ),

        v.attrs.agentState.isTyping && m(
          TypingIndicator,
          'Agent is typing...',
        ),
      ])
    }
  }
}
