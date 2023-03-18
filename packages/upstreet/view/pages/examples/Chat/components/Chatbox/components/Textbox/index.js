import m from 'mithril'

import config from '@webaverse-studios/config'

import { body, input } from './style.module.scss'
import { client } from '../../../../../../../../lib/feathers-client.js'

const // Components
  _Textbox = `form.${body}`,
  Input = `input.${input}`,
  // Config
  { feathersConfig } = config,
  { api } = feathersConfig

/**
 * Chatbox
 *
 * @returns {object} mithril component
 */
export function Textbox() {
  return {
    view( v ) {
      return m(
        _Textbox,
        {
          onsubmit: ( e ) => onsubmit( e, v.attrs.messages, v.attrs.agentState ),
        },
        [
          // Input
          m( Input, {
            type: 'text',
            name: 'content',
            autocomplete: 'off',
            placeholder: 'Say something...',
            oninput: ( e ) => {
              e.preventDefault()
              e.stopPropagation()

              e.redraw = false
            },
          }),
        ]
      )
    },
  }
}

/**
 *
 * @param e
 * @param messages
 * @param agentState
 */
async function onsubmit( e, messages, agentState ) {
  e.preventDefault()

  const formData = new FormData( e.target ),
    content = formData.get( 'content' )

  // Return if no message.
  if ( !content ) return

  // Clear input.
  e.target.reset()

  const newMessage = { content, role: 'user' }
  messages.push( newMessage )

  // Set agent to typing.
  agentState.isTyping = true
  m.redraw()

  // Get response and end typing state.
  await getResponse( messages )
  agentState.isTyping = false
  m.redraw()
}

/**
 *
 * @param messages
 */
async function getResponse( messages ) {
  /*const newMessage = await fetch(
    `/api/v1/${api.chat}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    },
  )*/

  const { message } = await client.service( api.chat ).create({ messages })

  console.log( messages )

  const newMessage = {
    content: message.content.trim(),
    role: message.role,
  }

  // Check if the new message contains a code block tagged with
  // "webaverse" and if so, mark it as code, replace the content and run the
  // code.

  const
    codeBlockRegex = /```webaverse\n([\s\S]*?)\n```/g,
    codeBlock = codeBlockRegex.exec( newMessage.content )

  if ( codeBlock ) {
    newMessage.content = codeBlock[1]
    newMessage.isCode = true

    // Run the code.
    try {
      // Create a new function from the code block.
      // eslint-disable-next-line no-new-func
      eval( message.content )
    } catch ( error ) {
      console.error( error )
    }
  }

  console.log( 'message:', newMessage )

  messages.push( newMessage )
}
