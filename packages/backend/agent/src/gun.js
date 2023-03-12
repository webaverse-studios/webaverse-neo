import Gun from 'gun'
import 'gun/lib/promise.js'
import { gunConfig } from '@webaverse-studios/config'


const { peers } = gunConfig


export const
  gun = Gun({ peers }),
  agents = gun.get( 'agents' )
