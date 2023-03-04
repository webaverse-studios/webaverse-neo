import m from 'mithril'
import stream from 'mithril/stream'
import GUN from 'gun'
import 'gun/sea'


// Import SEA library.
const sea = GUN.SEA


export default () => {
  let
    // Create streams.
    inputText     = stream( 'Hello World' ),
    encryptedText = stream(''),
    decryptedText = stream( inputText())

  return {
    async oninit() {
      await configureStreams({ inputText, encryptedText, decryptedText })
    },

    view() {
      return m( '', [
        /* Heading */
        m( 'h1', 'SEA Example' ),

        /* Input */
        m( 'input', {
          type: 'text',
          value: inputText(),
          oninput: e => inputText( e.target.value ),
        }),

        /* Output */
        m( '', [ 'Encrypted: ', encryptedText()]),
        m( '', [ 'Decrypted: ', m( 'b', decryptedText())]),
      ])
    }
  }
}


async function configureStreams({ inputText, encryptedText, decryptedText }) {
  const
    // Create accounts.
    alice = await sea.pair(),
    bob = await sea.pair()


  console.log( 'ALICE:', alice )

  // Encrypt text.
  inputText.map( async text =>
    encryptedText(
      await sea.encrypt(
        text,
        await sea.secret( bob.epub, alice )
      )
    )
  )

  // Decrypt text.
  encryptedText.map( async text =>
    decryptedText(
      await sea.decrypt(
        text,
        await sea.secret( alice.epub, bob )
      )
    )
  )

  decryptedText.map( text => m.redraw())
}
