import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import cubeURL from './assets/cube.glb'


const loader = new GLTFLoader()


let cube = await loader.loadAsync( cubeURL )


export { cube }
