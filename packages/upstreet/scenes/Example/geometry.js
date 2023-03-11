import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import cubeURL from './assets/cube.glb'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'

/**
 * Load the geometry for the scene.
 *
 * @param {GLTFLoader} loader - The loader to use.
 * @returns {Promise<{avatar: VRM}>} - The loaded geometry.
 */
export async function loadGeometry(loader) {
  loader.register(parser => new VRMLoaderPlugin(parser))
  return await loader.loadAsync(cubeURL)
}
