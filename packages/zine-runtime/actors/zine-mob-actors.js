import * as THREE from 'three';
import alea from 'alea';
// import metaversefileApi from '../../metaversefile-api.js';

const mobNames = [
  'silkworm-biter.glb',
  'silkworm-bloater.glb',
  'silkworm-queen.glb',
  'silkworm-runner.glb',
  'silkworm-slasher.glb',
  'silkworm.glb',
];
const mobUrls = mobNames.map(name => `https://cdn.jsdelivr.net/gh/webaverse/content@master/mobs/${name}`);

export class PanelRuntimeMobs extends THREE.Object3D {
  constructor({
    candidateLocations,
    n = 1,
    seed = 'mobs',
  }) {
    super();

    const rng = alea(seed);
    
    for (let i = 0; i < n; i++) {
      const candidateLocationIndex = Math.floor(rng() * candidateLocations.length);
      const candidateLocation = candidateLocations.splice(candidateLocationIndex, 1)[0];
      // console.log('mob location', candidateLocation);
      const {
        position, // array[3]
        quaternion, // array[4]
      } = candidateLocation;

      const mobUrlIndex = Math.floor(rng() * mobUrls.length);
      const mobName = mobNames[mobUrlIndex];
      const mobUrl = mobUrls[mobUrlIndex];

      const itemJson = {
        name: mobName,
        modelUrl: mobUrl,
      };

      (async () => {
        const opts = {
          type: 'application/item',
          content: itemJson,
          position,
          quaternion,
          components: [
            {
              key: 'itemMode',
              value: 'static',
            },
          ],
        };
        
        // console.warn('would have created app', opts);
        return;
        
        // const mobApp = await metaversefileApi.createAppAsync(opts);
        // console.log('set mob', mobApp);
        this.add(mobApp);
      })();
    }
  }
}