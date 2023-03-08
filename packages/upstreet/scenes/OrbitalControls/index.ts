import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera
} from 'three'

import { NyxScene } from '../nyx-scene'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class OrbitControlsScene extends NyxScene {
  controls: any

  constructor ({ canvas }: { canvas: HTMLCanvasElement }) {
    super({ canvas })

    this.scene.background = new Color(0xcccccc)
    this.scene.fog = new FogExp2(0xcccccc, 0.002)

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    // Set up camera.
    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    this.camera.position.set(400, 200, 0)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.listenToKeyEvents(window) // optional

    this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05

    this.controls.screenSpacePanning = false

    this.controls.minDistance = 100
    this.controls.maxDistance = 500

    this.controls.maxPolarAngle = Math.PI / 2

    const geometry = new CylinderGeometry(0, 10, 30, 4, 1)
    const material = new MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true
    })

    for (let i = 0; i < 500; i++) {
      const mesh = new Mesh(geometry, material)
      mesh.position.x = Math.random() * 1600 - 800
      mesh.position.y = 0
      mesh.position.z = Math.random() * 1600 - 800
      mesh.updateMatrix()
      mesh.matrixAutoUpdate = false
      this.scene.add(mesh)
    }

    const dirLight1 = new DirectionalLight(0xffffff)
    dirLight1.position.set(1, 1, 1)
    this.scene.add(dirLight1)

    const dirLight2 = new DirectionalLight(0x002288)
    dirLight2.position.set(-1, -1, -1)
    this.scene.add(dirLight2)

    const ambientLight = new AmbientLight(0x222222)
    this.scene.add(ambientLight)

    this.update()
  }

  update () {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  async init (): Promise<void> {
    console.log('Test Scene init')
  }
}
