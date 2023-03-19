import { createWorld, addEntity, addComponent, pipe } from 'bitecs'
import { Engine } from '../engine/core/models/Engine'
import { Grid } from '../upstreet/scenes/Grid'
import { SceneComponent } from './components/Scene'
import { pipeline } from './pipeline'
import { timeSystem } from './systems'

///////////////////////////////////////////////////////
// Engine Setup / World Setup
///////////////////////////////////////////////////////

var last = 0
var shouldAddScene = false

async function startLoop() {
  let canvas = document.querySelector('canvas')!
  const engine = new Engine({ dom: document.body, canvas })
  engine.load(Grid)
  engine.start()

  const world = createWorld(engine)
  const eid = addEntity(world)

  function renderLoop(dt: number) {
    requestAnimationFrame(renderLoop)
    timeSystem(dt, engine)

    if (engine.time.last > last) {
      last = engine.time.last
      pipeline(engine)

      if (!shouldAddScene) {
        shouldAddScene = true
        addComponent(world, SceneComponent, eid)
        SceneComponent.id[eid] = 0
      }
    }
  }

  renderLoop(0)
}

await startLoop()
