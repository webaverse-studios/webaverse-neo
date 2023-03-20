import { VRMLoaderPlugin } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import cubeURL from './assets/cube.glb'

/**
 * Load the geometry for the scene.
 *
 * @param {GLTFLoader} loader The loader to use.
 * @returns {Promise<import('three/examples/jsm/loaders/GLTFLoader').GLTF>} - The loaded geometry.
 */
export async function loadGeometry( loader ) {
  loader.register(( parser ) => new VRMLoaderPlugin( parser ))
  return await loader.loadAsync( cubeURL )
}
