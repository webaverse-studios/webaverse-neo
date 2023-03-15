import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm'

import avatarURL from './assets/Scilly.vrm'
import gridURL from './assets/grid.glb'

/**
 * Load the geometry for the scene.
 *
 * @param {GLTFLoader} loader The loader to use.
 * @returns {Promise<{avatar: VRM}>} - The loaded geometry.
 */
export async function loadGeometry( loader ) {
  loader.register(( parser ) => new VRMLoaderPlugin( parser ))
  const avatar = ( await loader.loadAsync( avatarURL )).userData.vrm,
    grid = await loader.loadAsync( gridURL )
  return { avatar, grid }
}
