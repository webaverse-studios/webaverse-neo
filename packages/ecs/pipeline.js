import { pipe } from 'bitecs'

import { renderSystem } from './systems'

export const pipeline = pipe( renderSystem )
