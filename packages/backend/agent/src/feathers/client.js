import auth from '@feathersjs/authentication-client'
import { feathers, socketio } from '@feathersjs/client'
import io from 'socket.io-client'
import { feathersConfig } from '@uwebaverse-studios/config'


const socket = io( feathersConfig.url )


export const client  = feathers( socket )

client.configure( socketio( socket ))
client.configure( auth())
