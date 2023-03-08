import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm";

import avatarURL from "./assets/Scilly.vrm";
import gridURL from "./assets/grid.glb";

export async function loadGeometry(loader: GLTFLoader) {
  loader.register((parser) => new VRMLoaderPlugin(parser));

  const avatar: VRM = (await loader.loadAsync(avatarURL)).userData.vrm,
    grid = await loader.loadAsync(gridURL);

  return { avatar, grid };
}
