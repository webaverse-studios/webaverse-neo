import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";

import avatarURL from "./assets/Scilly.vrm";

export async function loadGeometry(loader: GLTFLoader) {
  loader.register((parser) => new VRMLoaderPlugin(parser));
  const avatar = (await loader.loadAsync(avatarURL)).userData.vrm;
  return { avatar };
}
