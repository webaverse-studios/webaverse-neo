import { VRMLoaderPlugin } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import avatarURL from './assets/Scilly.vrm'
import gridURL from './assets/grid.glb'


const loader = new GLTFLoader()

loader.register( parser => {
  return new VRMLoaderPlugin( parser )
})


const
  avatar = (
    await loader.loadAsync( avatarURL )
  ).userData.vrm,

  grid = await loader.loadAsync( gridURL )


export { avatar, grid }
