import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Scene } from '@webaverse-studios/engine-nyx'
import { RapierPhysicsAdapter } from '@webaverse-studios/physics-rapier'

export class OrbitControlsScene extends Scene {
  /** @type {OrbitControls} */
  controls

  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {RapierPhysicsAdapter} physicsAdapter
   */
  constructor({ canvas, physicsAdapter }) {
    super({ canvas, physicsAdapter })

    this._scene.background = new Color(0xcccccc)
    this._scene.fog = new FogExp2(0xcccccc, 0.002)

    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(window.innerWidth, window.innerHeight)

    // Set up camera.
    this._camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    this._camera.position.set(400, 200, 0)

    this.controls = new OrbitControls(this._camera, this._renderer.domElement)
    this.controls.listenToKeyEvents(window) // optional

    // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05

    this.controls.screenSpacePanning = false

    this.controls.minDistance = 100
    this.controls.maxDistance = 500

    this.controls.maxPolarAngle = Math.PI / 2

    const geometry = new CylinderGeometry(0, 10, 30, 4, 1)
    const material = new MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
    })

    for (let i = 0; i < 500; i++) {
      const mesh = new Mesh(geometry, material)
      mesh.position.x = Math.random() * 1600 - 800
      mesh.position.y = 0
      mesh.position.z = Math.random() * 1600 - 800
      mesh.updateMatrix()
      mesh.matrixAutoUpdate = false
      this._scene.add(mesh)
    }

    const dirLight1 = new DirectionalLight(0xffffff)
    dirLight1.position.set(1, 1, 1)
    this._scene.add(dirLight1)

    const dirLight2 = new DirectionalLight(0x002288)
    dirLight2.position.set(-1, -1, -1)
    this._scene.add(dirLight2)

    const ambientLight = new AmbientLight(0x222222)
    this._scene.add(ambientLight)

    this.update()
  }

  update() {
    this.controls.update()
    this._renderer.render(this._scene, this._camera)
  }
}
