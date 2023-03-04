import {
  AmbientLight,
  Color,
  Fog,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from 'three'

import { wall1 } from './geometry'


export class Test {

  constructor({ canvas }) {
    this.canvas = canvas

    this.cube = wall1.scene.getObjectByName( 'Cube' )
    this.renderer  = new WebGLRenderer({ canvas })

    // Set up camera.
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )

    this.scene = new Scene()

    const { camera, cube, renderer, scene } = this

    const
      light1 = new PointLight( 0xffffff, 1, 0, 2 ),
      light2 = new PointLight( 0xffffff, 1, 0, 2 ),
      light3 = new AmbientLight( 0xffffff, 2 )

    // Configure.
    configureCamera( camera )
    configureLights( light1, light2, light3 )
    configureRenderer( renderer, 0.5 )
    configureScene( scene )

    scene.add( cube )
    scene.add( light1 )
    scene.add( light2 )
    scene.add( light3 )

    this.update()
  }

  update() {
    this.cube.rotation.x += 0.004
    this.cube.rotation.y += 0.004

    this.renderer.render( this.scene, this.camera )
  }

}


function configureCamera( camera ) {
  camera.position.z = 10
}


function configureLights( light1, light2, light3 ) {
  light1.position.set( 5 * Math.random(), 5 * Math.random(), 10 )
  light1.castShadow = true

  light2.position.set( 5 * Math.random(), 10 * Math.random(), 10 )
  light2.castShadow = true
}


function configureRenderer( renderer, scale = 1 ) {
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setSize(
    innerWidth * scale,
    innerHeight * scale,
    false,
  )
}


function configureScene( scene ) {
  // Configure scene.
  scene.background = new Color( 0x2a2a2a )
  scene.fog = new Fog( 0xffffff, 0, 750 )
}
