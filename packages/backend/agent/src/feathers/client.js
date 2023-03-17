import auth from '@feathersjs/authentication-client'
import { feathers, socketio } from '@feathersjs/client'
import io from 'socket.io-client'
import { feathersConfig } from '@webaverse-studios/config'

const socket = io(feathersConfig.url)

const client = feathers(socket)

client.configure(socketio(socket))
client.configure(auth())

await client
  .authenticate({
    strategy: 'gun',
    proof: 'test sig',
  })
  .then((result) => {
    console.log('AUTHENTICATED', result)
    return true
  })
  .catch((error) => {
    console.error('ERROR', error)
  })

export { client }
