import * as THREE from 'three';

import metaversefile from 'metaversefile';
const {useApp, useFrame, useCleanup, useLoaders, usePhysics} = metaversefile;

export default e => {
  const app = useApp();
  const physics = usePhysics();

  const srcUrl = ${this.srcUrl};

  const root = app;

  const physicsIds = [];
  const staticPhysicsIds = [];
  e.waitUntil((async () => {
    let o;
    try {
      o = await new Promise((accept, reject) => {
        const {voxLoader} = useLoaders();
        voxLoader.load(srcUrl, accept, function onprogress() {}, reject);
      });
    } catch(err) {
      console.warn(err);
    }

    root.add(o);

    const _addPhysics = async () => {
      const mesh = o;

      let physicsMesh = null;
      let physicsBuffer = null;
        mesh.updateMatrixWorld();
        physicsMesh = physics.convertMeshToPhysicsMesh(mesh);
        physicsMesh.position.copy(mesh.position);
        physicsMesh.quaternion.copy(mesh.quaternion);
        physicsMesh.scale.copy(mesh.scale);

      // }

      if (physicsMesh) {
        root.add(physicsMesh);
        physicsMesh.updateMatrixWorld();
        const physicsId = physics.addGeometry(physicsMesh);
        root.remove(physicsMesh);
        physicsIds.push(physicsId);
        staticPhysicsIds.push(physicsId);
      }
      if (physicsBuffer) {
        const physicsId = physics.addCookedGeometry(physicsBuffer, mesh.position, mesh.quaternion, mesh.scale);
        physicsIds.push(physicsId);
        staticPhysicsIds.push(physicsId);
      }
    };
    if (app.getComponent('physics')) {
      _addPhysics();
    }

    o.traverse(o => {
      if (o.isMesh) {
        o.frustumCulled = false;
      }
    });
  })());

  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
  });

  return root;
};
export const contentId = ${this.contentId};
export const name = ${this.name};
export const description = ${this.description};
export const type = 'vox';
export const components = ${this.components};
