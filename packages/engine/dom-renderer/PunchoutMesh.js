import * as THREE from 'three'
import { DomRenderEngine } from './index.js'

export class PunchoutMesh extends THREE.Mesh {
  constructor ({ width, height }) {
    const scaleFactor = DomRenderEngine.getScaleFactor(width, height)
    const worldWidth = width * scaleFactor
    const worldHeight = height * scaleFactor
    const geometry = new THREE.PlaneBufferGeometry(worldWidth, worldHeight)
    const material = new THREE.ShaderMaterial({
      // color: 0xFFFFFF,
      // side: THREE.DoubleSide,
      // opacity: 0,
      transparent: true,
      blending: THREE.MultiplyBlending,
      uniforms: {
        opacity: {
          value: 1,
          needsUpdate: true
        }
      },
      vertexShader: `\
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `\
        uniform float opacity;

        void main() {
          gl_FragColor = vec4(1., 1., 1., opacity);
        }
      `,
      side: THREE.DoubleSide
      // depthTest: false,
      // depthWrite: false,
    })
    super(geometry, material)

    // this.frustumCulled = false;
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight
  }
}

export default PunchoutMesh
