import { setViewHeight } from './setViewHeight'
import { router } from '../router'


export const handleLoad = () => {
  // Calculate height.
  setViewHeight()

  // Route app.
  router( document.querySelector( '#root' ))
}
