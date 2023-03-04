import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import wall1URL from './assets/metal-wall-1.glb'


const
  geometry = new BoxGeometry(),
  loader = new GLTFLoader(),
  material = new MeshBasicMaterial(),
  cube = new Mesh( geometry, material )


let wall1 = await loader.loadAsync( wall1URL )


export { cube, wall1 }
