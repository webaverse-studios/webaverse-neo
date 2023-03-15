import m from 'mithril'

import { paths } from './paths'
import { routes } from './routes'


m.route.prefix = ''


export const router = ( root = document.body ) =>
  m.route( root, paths.home, routes )
