import * as THREE from 'three'
import { DomRenderEngine } from './index.js'

export class BackgroundMesh extends THREE.Mesh {
  constructor ({ width, height }) {
    const scaleFactor = DomRenderEngine.getScaleFactor(width, height)
    const worldWidth = width * scaleFactor
    const worldHeight = height * scaleFactor
    const geometry = new THREE.PlaneGeometry(worldWidth, worldHeight)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        opacity: {
          value: 0,
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
          gl_FragColor = vec4(0., 0., 0., opacity);
        }
      `,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    super(geometry, material)

    // this.frustumCulled = false;
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight
  }
}

export default BackgroundMesh
