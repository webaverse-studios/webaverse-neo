import avatarURL from './assets/Scilly.vrm'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'


const loader = new GLTFLoader()

loader.register( parser => {
  return new VRMLoaderPlugin( parser )
})


let avatar = ( await loader.loadAsync( avatarURL )).userData.vrm


export { avatar }
