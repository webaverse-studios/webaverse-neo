import {client} from './client.js'


client.authenticate({
  strategy: 'gun',
  proof: 'test sig',
}).then( result => {
  console.log( 'AUTHENTICATED', result )
  return true
}).catch( error => {
  console.error( 'ERROR', error )
})
