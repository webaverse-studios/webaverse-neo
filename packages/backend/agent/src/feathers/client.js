import auth from '@feathersjs/authentication-client'
import { feathers, socketio } from '@feathersjs/client'
import io from 'socket.io-client'
import { feathersConfig } from '@webaverse-studios/config'

const socket = io(feathersConfig.url)

const client = feathers(socket)

client.configure(socketio(socket))
client.configure(auth())
client
  .authenticate({
    strategy: 'local',
    email: 'admin',
    password: 'admin',
  })
  .then((result) => {
    console.log('authenticated', result)
  })
  .catch((err) => {
    console.log('error', err)
  })

export { client }
