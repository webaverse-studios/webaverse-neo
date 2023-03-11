import feathers from "@feathersjs/client"
import auth from "@feathersjs/authentication-client"
import io from "socket.io-client"

const socket = io('http://localhost:3030')
const feathersClient = feathers(socket);
feathersClient.configure(feathers.socketio(socket))
feathersClient.configure(auth())

// TODO: Use correct auth strategy and reenable authentication.
/*feathersClient.authenticate({
  strategy: 'local',
  email: 'admin',
  password: 'admin'
}).then((result) => {
  console.log('AUTHENTICATED', result)
}).catch((error) => {
  console.error('ERROR', error)
})*/

export {feathersClient}
