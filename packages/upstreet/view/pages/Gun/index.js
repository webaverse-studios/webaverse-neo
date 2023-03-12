import GUN from 'gun'
import { gunConfig } from '@webaverse-studios/config'


const
  { peers } = gunConfig,
  gun = GUN({ peers })
