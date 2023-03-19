import { Engine } from '../../engine/core/models/Engine'

export const timeSystem = (dt: number, engine: Engine) => {
  const interval = 1000 / engine.fps

  engine.time.delta = dt - engine.time.last
  engine.time.elapsed += engine.time.delta

  if (engine.time.delta >= interval - engine.fpsTolerance) {
    engine.time.last = dt - (engine.time.delta % interval)
  }

  return engine
}
