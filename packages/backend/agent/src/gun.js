import Gun from 'gun'
import 'gun/lib/promise.js'
import config from '@webaverse-studios/config'


const { peers } = config.gunConfig


export const
  gun = Gun({ peers }),
  agents = gun.get( 'agents' )
