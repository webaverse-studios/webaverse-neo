import { Debug } from '@webaverse-studios/debug'
import { WWorld } from '../../ecs/bevy-ecs-wasm/pkg/bevy_ecs_wasm'

import '../../ecs/bevy-ecs-wasm/src/runtime/ops/ecs/ecs'

class World {
  #rawWorld
  constructor() {}

  toString() {
    return bevyModJsScriptingOpSync('ecs_world_to_string', this.rid)
  }
}

let world = new WWorld()
Debug.log(world.toString())
Debug.log(world.getComponents())
Debug.log(world.getResources())
