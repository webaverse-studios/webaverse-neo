import { World } from '../../ecs/bevy-ecs-wasm/pkg/bevy_ecs_wasm'

import '../../ecs/bevy-ecs-wasm/src/runtime/ops/ecs/ecs'

let world = new World()
console.log(world.toString())
console.log(world.getComponents(), typeof world.getComponents())
console.log(world.getResources(), typeof world.getResources())
