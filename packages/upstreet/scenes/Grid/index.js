import {AmbientLight, Color, Fog, PerspectiveCamera, PointLight} from 'three'

import {NyxScene} from "../scene.js";
import {avatar, grid} from "./geometry.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

export class Grid extends NyxScene {

  constructor({canvas}) {
    const
      light1 = new PointLight(0xffffff, 1, 0, 2),
      light2 = new PointLight(0xffffff, 1, 0, 2),
      light3 = new AmbientLight(0xffffff, 2)

    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )


    super({canvas, camera, lights: [light1, light2, light3]})
    this.avatar = avatar.scene

    // rotate to face the camera
    avatar.scene.rotation.y = Math.PI

    const scale = 5

    grid.scene.scale.set(scale, scale, scale)
    grid.scene.position.set(0, 0, 0)
    grid.scene.rotation.set(0, 0, 0)

    // Controls
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )

    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 1.2
    this.controls.panSpeed = 0.8

    this.controls.keys = ['KeyA', 'KeyS', 'KeyD']

    this.scene.add(this.avatar)
    this.scene.add(grid.scene)
    this.scene.add(light1)
    this.scene.add(light2)
    this.scene.add(light3)

    this.update()
  }

  update() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  configureCamera() {
    this.camera.position.y = 2;
    this.camera.position.z = 3;
  }

  configureLights(lights) {
    const [light1, light2] = lights

    light1.position.set(5 * Math.random(), 5 * Math.random(), 10)
    light1.castShadow = true

    light2.position.set(5 * Math.random(), 10 * Math.random(), 10)
    light2.castShadow = true
  }

  configureRenderer(scale = 1) {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setSize(
      innerWidth * scale,
      innerHeight * scale,
      false,
    )
  }

  configureScene() {
    // Configure scene.
    this.scene.background = new Color(0x2a2a2a)
    this.scene.fog = new Fog(0xffffff, 0, 750)
  }
}
