import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import cubeURL from './assets/cube.glb'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'

export async function loadGeometry (loader: GLTFLoader) {
  loader.register(parser => new VRMLoaderPlugin(parser))
  return await loader.loadAsync(cubeURL)
}
