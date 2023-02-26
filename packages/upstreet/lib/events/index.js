import { handleLoad } from './handleLoad'
import { handleResize } from './handleResize'


addEventListener( 'load',  handleLoad )
addEventListener( 'resize', handleResize ) // 15 FPS
