import * as THREE from 'three'

import alea from '../alea.js'

const avatarNames = [
  'ann_liskwitch_v3.1_guilty.vrm',
  'citrine.vrm',
  'Buster_Rabbit_V1.1_Guilty.vrm',
]
const avatarUrls = avatarNames.map(
  ( name ) =>
    `https://cdn.jsdelivr.net/gh/webaverse/content@main/avatars/${name}`
)

export class PanelRuntimeNpcs extends THREE.Object3D {
  constructor({ candidateLocations, n = 1, seed = 'npcs', ctx }) {
    super()

    if ( !ctx ) {
      console.warn( 'missing ctx', { ctx })
    }
    const { useEngine } = ctx
    const engine = useEngine()

    const rng = alea( seed )

    this.locations = []
    this.npcApps = []
    for ( let i = 0; i < n; i++ ) {
      const candidateLocationIndex = Math.floor(
        rng() * candidateLocations.length
      )
      const candidateLocation = candidateLocations.splice(
        candidateLocationIndex,
        1
      )[0]
      const {
        position, // array[3]
        quaternion, // array[4]
      } = candidateLocation

      const position2 = position.slice()
      // position2[1] += 1.5;

      this.locations.push({
        position: position2.slice(),
        quaternion: quaternion.slice(),
      })

      const avatarUrlIndex = Math.floor( rng() * avatarUrls.length )
      const avatarName = avatarNames[avatarUrlIndex]
      const avatarUrl = avatarUrls[avatarUrlIndex]

      const npcJson = {
        name: avatarName,
        avatarUrl,
        voice: 'Mizuki',
        voicePack: 'ShiShi voice pack',
      }

      this.loaded = false
      this.loadPromise = ( async () => {
        const opts = {
          type: 'application/npc',
          content: npcJson,
          position: position2,
          quaternion,
        }

        const npcApp = await engine.createAppAsync( opts )
        this.add( npcApp )
        npcApp.updateMatrixWorld()

        this.npcApps.push( npcApp )

        this.loaded = true
      })()
    }
  }
  async waitForLoad() {
    await this.loadPromise
  }
}
