import { router } from '../router'
import { setViewHeight } from './setViewHeight'


export const handleLoad = () => {
  // Calculate height.
  setViewHeight()

  // Route app.
  router( document.querySelector( '#mithril-root' ))
}
