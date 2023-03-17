import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm'

import avatarURL from './assets/Scilly.vrm'
import floatingTreeHouseURL from './assets/homespace2.glb'
import islandsURL from './assets/island.glb'

/**
 * Load the geometry for the scene.
 *
 * @param {GLTFLoader} loader - The loader to use.
 * @returns {Promise<{avatar: VRM}>} - The loaded geometry.
 */
export async function loadGeometry(loader) {
  loader.register((parser) => new VRMLoaderPlugin(parser))
  const avatar = (await loader.loadAsync(avatarURL)).userData.vrm,
    floatingTreehouse = await loader.loadAsync(floatingTreeHouseURL),
    islands = await loader.loadAsync(islandsURL)
  return { avatar, floatingTreehouse, islands }
}
