import m from 'mithril'
import { routes } from './routes'


m.route.prefix = ''


export const router = ( root = document.body ) =>
  m.route( root, '/', routes )
