import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm'

import avatarURL from './assets/Scilly.vrm'
import gridURL from './assets/grid.glb'
import emptyBottleURL from './assets/Bottle.gltf'
import fullBottleURL from './assets/Carafe_with_stopper.gltf'
import npcURL from './assets/npc.vrm'
import monsterURL from './assets/Monster_03_GLTF.gltf'
import swordURL from './assets/CYBERPUNK_KATANA.gltf'

/**
 * Load the geometry for the scene.
 *
 * @param {GLTFLoader} loader The loader to use.
 * @returns {Promise<{avatar: VRM}>} - The loaded geometry.
 */
export async function loadGeometry(loader) {
  loader.register((parser) => new VRMLoaderPlugin(parser))
  const avatar = (await loader.loadAsync(avatarURL)).userData.vrm,
    grid = await loader.loadAsync(gridURL),
    emptyBottle = await loader.loadAsync(emptyBottleURL),
    fullBottle = await loader.loadAsync(fullBottleURL),
    npc = (await loader.loadAsync(npcURL)).userData.vrm,
    monster = await loader.loadAsync(monsterURL),
    sword = await loader.loadAsync(swordURL)
  return { avatar, grid, emptyBottle, fullBottle, npc, monster, sword }
}
