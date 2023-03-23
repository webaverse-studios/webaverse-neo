import * as THREE from 'three';


const _fetchArrayBuffer = async srcUrl => {
  const res = await fetch(srcUrl);
  if (res.ok) {
    const arrayBuffer = await res.arrayBuffer();
    return arrayBuffer;
  } else {
    throw new Error('failed to load: ' + res.status + ' ' + srcUrl);
  }
};

export default ctx => {
  const {
    useApp,
    useFrame,
    useActivate,
    useCleanup,
    useCamera,
    usePhysics,
    useExport,
    useLoaders,
    useAvatarManager,
    useTempManager,
    useEngine,
  } = ctx;

  const app = useApp();
  const camera = useCamera();
  const physics = usePhysics();
  const loaders = useLoaders();
  const avatarManager = useAvatarManager();
  const tmpManager = useTempManager();
  const engine = useEngine();

  const localVector = tmpManager.get(THREE.Vector3);
  const localVector2 = tmpManager.get(THREE.Vector3);
  const localQuaternion = tmpManager.get(THREE.Quaternion);
  const localMatrix = tmpManager.get(THREE.Matrix4);

  const srcUrl = ${this.srcUrl};
  const quality = app.getComponent('quality') ?? undefined;

  let avatarRenderer = null;
  let physicsIds = [];
  let activateCb = null;
  let frameCb = null;
  ctx.waitUntil((async () => {
    const {
      gltfLoader,
    } = loaders;

    const arrayBuffer = await _fetchArrayBuffer(srcUrl);
    const gltf = await new Promise((accept, reject) => {
      gltfLoader.parse(arrayBuffer, srcUrl, accept, reject);
    });

    const avatarQuality = avatarManager.makeQuality(gltf);
    app.avatarQuality = avatarQuality;
    app.add(avatarQuality.scene);
    avatarQuality.scene.updateMatrixWorld();

    // we don't want to have per-frame bone updates for unworn avatars
    const _disableSkeletonMatrixUpdates = () => {
      avatarQuality.scene.traverse(o => {
        if (o.isBone) {
          o.matrixAutoUpdate = false;
        }
      });
    };
    _disableSkeletonMatrixUpdates();

    // handle wearing
    activateCb = async () => {
      const {
        playersManager,
      } = engine;
      const localPlayer = playersManager.getLocalPlayer();
      localPlayer.setAvatarApp(app);
    };


  })());

  useActivate(() => {
    activateCb && activateCb();
  });


  const _setPhysicsEnabled = enabled => {
    if (enabled) {
      for (const physicsId of physicsIds) {
        physics.disableGeometry(physicsId);
        physics.disableGeometryQueries(physicsId);
      }
    } else {
      for (const physicsId of physicsIds) {
        physics.enableGeometry(physicsId);
        physics.enableGeometryQueries(physicsId);
      }
    }
  };

  // cleanup
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
    physicsIds.length = 0;
  });

  useExport(async (opts) => {
    const {mimeType} = opts;
    if (mimeType === 'image/png+icon') {
      const avatarIconer = useAvatarIconer();
      const {getDefaultCanvas} = avatarIconer;

      const canvas = await getDefaultCanvas(srcUrl, 300, 300);
      let blob;
      try {
        blob = await new Promise((accept, reject) => {
          canvas.toBlob(accept, 'image/png');
        });
      } catch(err) {
        console.warn(err);
      }
      return blob;
    } else {
      return null;
    }
  });

  return app;
};
export const contentId = ${this.contentId};
export const name = ${this.name};
export const description = ${this.description};
export const type = 'vrm';
export const components = ${this.components};
