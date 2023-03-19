import { defineQuery, enterQuery } from 'bitecs'
import { SceneComponent } from '../components/Scene'
import { Engine } from '../engine/core/models/Engine'

const sceneQuery = defineQuery([SceneComponent])
const sceneQueryEnter = enterQuery(sceneQuery)

export async function renderSystem(engine: Engine) {
  const entitiesEntered = sceneQueryEnter(engine)
  await Promise.all(
    entitiesEntered.map((id) => {
      const sceneId = SceneComponent.id[id]
      const scene = engine.scenes.get(sceneId)
      console.log(engine.scenes)
      console.log('Scene entered: ', sceneId, scene)
      return scene?.init()
    })
  )

  const entities = sceneQuery(engine)
  engine.stats.begin()
  for (let i = 0; i < entities.length; ++i) {
    const id = entities[i]
    const scene = engine.scenes.get(id)
    if (!scene) {
      console.error('Scene not found: ', id)
      continue
    }

    if (scene.isInitialized) {
      scene.update()
    }
  }
  engine.stats.end()
}
