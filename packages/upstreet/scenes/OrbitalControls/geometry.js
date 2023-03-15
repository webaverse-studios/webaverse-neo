import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import avatarURL from './assets/Scilly.vrm'

/**
 * Load the geometry for the scene.
 *
 * @param {GLTFLoader} loader The loader to use.
 * @returns {Promise<{avatar: VRM}>} - The loaded geometry.
 */
export async function loadGeometry( loader ) {
  loader.register(( parser ) => new VRMLoaderPlugin( parser ))
  const avatar = ( await loader.loadAsync( avatarURL )).userData.vrm
  return { avatar }
}
