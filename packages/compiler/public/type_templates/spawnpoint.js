import * as THREE from 'three';
const localEuler = new THREE.Euler(0, 0, 0, 'YXZ');

export default ctx => {
  const {
    useApp,
    useLocalPlayer,
    useSpawnManager,
  } = ctx;

  const app = useApp();

  const srcUrl = ${this.srcUrl};
  ctx.waitUntil((async () => {
    const res = await fetch(srcUrl);
    const j = await res.json();
    if (j) {
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3(1, 1, 1);
      if (j.position) {
        position.fromArray(j.position);
      }
      if (j.quaternion) {
        quaternion.fromArray(j.quaternion);
        localEuler.setFromQuaternion(quaternion, 'YXZ');
        localEuler.x = 0;
        localEuler.z = 0;
        quaternion.setFromEuler(localEuler);
      }

      const spawnManager = useSpawnManager();
      spawnManager.setSpawnPoint(position, quaternion);
    }
  })());

  return app;
};
export const contentId = ${this.contentId};
export const name = ${this.name};
export const description = ${this.description};
export const type = 'spawnpoint';
export const components = ${this.components};
