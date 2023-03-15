import GUN from 'gun'

import config from '@webaverse-studios/config'

const { peers } = config.gunConfig,
  _gun = GUN({ peers })
