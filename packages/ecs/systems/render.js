import { defineQuery, enterQuery } from 'bitecs'

import { Debug } from '@webaverse-studios/debug'
import { Engine } from '@webaverse-studios/engine-core'

import { SceneComponent } from '../components/Scene'

const sceneQuery = defineQuery([SceneComponent])
const sceneQueryEnter = enterQuery( sceneQuery )

/**
 * Renders the scene.
 *
 * @param {Engine} engine The engine instance.
 */
export async function renderSystem( engine ) {
  const entitiesEntered = sceneQueryEnter( engine )
  const initializedScenes = await Promise.all(
    entitiesEntered.map( async ( id ) => {
      const sceneId = SceneComponent.id[id]
      const scene = engine.scenes.get( sceneId )
      if ( !scene ) {
        Debug.error( 'Scene not found: ', sceneId )
        return
      }

      await scene?.init()
      return scene
    })
  )

  initializedScenes.forEach(( scene ) => {
    if ( scene ) {
      scene._initialized = true
    }
  })

  const entities = sceneQuery( engine )
  engine.stats.begin()
  for ( let i = 0; i < entities.length; ++i ) {
    const id = entities[i]
    const scene = engine.scenes.get( id )
    if ( !scene ) {
      console.error( 'Scene not found: ', id )
      continue
    }

    if ( scene._initialized ) {
      scene.update()
    }
  }
  engine.stats.end()

  return engine
}
