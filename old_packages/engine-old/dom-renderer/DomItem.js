import * as THREE from 'three'
import easing from '../easing.js'
import physicsManager from '../physics/physics-manager.js'

import BackgroundMesh from './BackgroundMesh.js'
import PunchoutMesh from './PunchoutMesh.js'

const cubicBezier = easing(0, 1, 0, 1)

export class DomItem extends THREE.Object3D {
  constructor (position, quaternion, scale, width, height, worldWidth, render) {
    super()

    this.name = 'domNode'

    this.position.copy(position)
    this.quaternion.copy(quaternion)
    this.scale.copy(scale)

    this.width = width
    this.height = height
    this.worldWidth = worldWidth
    this.render = render

    this.enabled = false
    this.value = 0
    this.animation = null

    const floatNode = new THREE.Object3D()
    floatNode.name = 'domRendererFloatNode'
    this.add(floatNode)
    this.floatNode = floatNode

    const innerNode = new THREE.Object3D()
    innerNode.name = 'domRendererInnerNode'
    floatNode.add(innerNode)
    this.innerNode = innerNode

    const backgroundMesh = new BackgroundMesh({
      width,
      height
    })
    backgroundMesh.name = 'domRendererBackgroundNode'
    this.backgroundMesh = backgroundMesh
    innerNode.add(backgroundMesh)

    const punchoutMesh = new PunchoutMesh({
      width,
      height
    })
    punchoutMesh.name = 'domRendererPunchoutNode'
    this.punchoutMesh = punchoutMesh
    innerNode.add(punchoutMesh)

    const p = position
    const q = quaternion
    const hs = new THREE.Vector3(
      punchoutMesh.worldWidth,
      punchoutMesh.worldHeight,
      0.01
    ).multiplyScalar(0.5)
    const dynamic = false
    const physicsScene = physicsManager.getScene()
    const physicsObject = physicsScene.addBoxGeometry(p, q, hs, dynamic)
    physicsScene.disableActor(physicsObject)
    physicsScene.disableGeometryQueries(physicsObject)
    this.physicsObject = physicsObject
  }

  startAnimation (enabled, startTime, endTime) {
    this.enabled = enabled

    const startValue = this.value
    const endValue = enabled ? 1 : 0
    this.animation = {
      startTime,
      endTime,
      startValue,
      endValue
    }
  }

  update (timestamp) {
    if (this.animation) {
      const { startTime, endTime, startValue, endValue } = this.animation
      let factor = Math.min(
        Math.max((timestamp - startTime) / (endTime - startTime), 0),
        1
      )
      factor = cubicBezier(factor)
      if (factor < 1) {
        this.value = startValue + (endValue - startValue) * factor
      } else {
        this.value = endValue
        this.animation = null
      }
    } else {
      this.value = this.enabled ? 1 : 0
    }

    if (this.value > 0) {
      const w = this.value
      const shiftOffset = ((1 - w) * this.worldWidth) / 2
      this.innerNode.position.x = -shiftOffset
      this.innerNode.scale.set(w, 1, 1)
      this.innerNode.updateMatrixWorld()

      this.backgroundMesh.material.uniforms.opacity.value = this.value
      this.backgroundMesh.material.uniforms.opacity.needsUpdate = true

      this.punchoutMesh.material.uniforms.opacity.value = 1 - this.value
      this.punchoutMesh.material.uniforms.opacity.needsUpdate = true

      this.physicsObject.position.setFromMatrixPosition(
        this.innerNode.matrixWorld
      )
      this.physicsObject.quaternion.setFromRotationMatrix(
        this.innerNode.matrixWorld
      )
      this.physicsObject.updateMatrixWorld()
      const physicsScene = physicsManager.getScene()
      physicsScene.setTransform(this.physicsObject)

      // this.visible = true;
    } else {
      // this.visible = false;
    }
  }

  onBeforeRaycast () {
    if (this.enabled) {
      const physicsScene = physicsManager.getScene()
      physicsScene.enableActor(this.physicsObject)
      physicsScene.enableGeometryQueries(this.physicsObject)
    }
  }

  onAfterRaycast () {
    if (this.enabled) {
      const physicsScene = physicsManager.getScene()
      physicsScene.disableActor(this.physicsObject)
      physicsScene.disableGeometryQueries(this.physicsObject)
    }
  }

  destroy () {
    const physicsScene = physicsManager.getScene()
    physicsScene.enableActor(this.physicsObject)
    physicsScene.removeGeometry(this.physicsObject)
  }
}

export default DomItem
