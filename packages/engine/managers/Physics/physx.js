/**
 * Physx WASM integration.
 */

import {Allocator} from "../../utils/allocator.js";
import {ScratchStack} from "../../utils/scratchStack.js";

/**
 * Physx WASM Module
 *
 * @module Physx
 */
export const Physx = new class C_Physx {
  /**
   * is Physx WASM Module loaded?
   * @type {boolean}
   */
  #loaded = false

  /**
   * Scratch stack for allocating memory for WASM.
   * @type {ScratchStack}
   */
  #scratchStack
  #physxWasm

  /**
   * Initialize Physx WASM Module and wait for it to load.
   */
  waitForLoad = async () => {
    await new Promise(async (resolve, reject) => {
      this.#physxWasm = (await import('../../wasm/physics')).default
      await this.#physxWasm.waitForLoad()
      this.#physxWasm._initialize()

      const scratchStackSize = 8 * 1024 * 1024
      this.#scratchStack = new ScratchStack(this.#physxWasm, scratchStackSize)

      this.#loaded = true
      resolve()
    })
  }

  update() {
    // physx.crosshairMesh.update()
    // physxWorker.update()
  }

  // PhysxWorker

  /**
   * Allocate memory for a typed array.
   * @param constructor
   * @param count
   * @returns {*}
   */
  alloc = (constructor, count) => {
    if (count > 0) {
      const size = constructor.BYTES_PER_ELEMENT * count
      const ptr = this.#physxWasm._doMalloc(size)
      return new constructor(this.#physxWasm.HEAP8.buffer, ptr, count)
    } else {
      return new constructor(this.#physxWasm.HEAP8.buffer, 0, 0)
    }
  }

  free = ptr => {
    this.#physxWasm._doFree(ptr)
  }

  /**
   * Create a physics scene.
   */
  makeScene = () => this.#physxWasm._makePhysics()

  /**
   * Destroy character controller physics
   * @param physics
   * @param {Character} characterController - Character controller to destroy.
   */
  destroyCharacterControllerPhysics = (physics, characterController) => Module._destroyCharacterControllerPhysics(physics, characterController)

  /**
   * Create a character controller physics.
   * @param physics
   * @param {number} radius
   * @param {number} height
   * @param {number} contactOffset
   * @param {number} stepOffset
   * @param {Vector3} position
   * @param {string} id
   */
  createCharacterControllerPhysics = (
    physics,
    radius,
    height,
    contactOffset,
    stepOffset,
    position,
    id
  ) => {
    const allocator = new Allocator(this.#physxWasm)
    const p = allocator.alloc(Float32Array, 3)

    position.toArray(p)

    const zeroMaterial = this.getZeroMaterial(physics)

    console.log(physics,
      radius,
      height,
      contactOffset,
      stepOffset,
      p.byteOffset,
      zeroMaterial,
      id)

    const characterController = this.#physxWasm._createCharacterControllerPhysics(
      physics,
      radius,
      height,
      contactOffset,
      stepOffset,
      p.byteOffset,
      zeroMaterial,
      id
    )
    allocator.freeAll()

    return characterController
  }

  /**
   * Get a zero material for the physics scene.
   * @returns {function(physics): *}
   */
  getZeroMaterial(physics) {
    const zeroMaterialParams = [0, 0, 0]
    return this.createMaterial(physics, zeroMaterialParams)
  }

  /**
   * Add a plane geometry to the physics scene.
   * @param physics
   * @param {Vector3} position - Position representing the position of the plane.
   * @param {Quaternion} quaternion - Quaternion representing the rotation of the plane.
   * @param {number} id - Unique identifier for the geometry.
   * @param dynamic
   */
  addPlaneGeometry = (physics, position, quaternion, id, dynamic) => {
    const allocator = new Allocator(this.#physxWasm)

    const positionArray = allocator.alloc(Float32Array, 3)
    const quaternionArray = allocator.alloc(Float32Array, 4)

    position.toArray(positionArray)
    quaternion.toArray(quaternionArray)

    const materialAddress = this.getDefaultMaterial(physics)
    this.#physxWasm._addPlaneGeometryPhysics(
      physics,
      positionArray.byteOffset,
      quaternionArray.byteOffset,
      id,
      materialAddress,
      +dynamic
    )
    allocator.freeAll()
  }

  /**
   * Get the default material for the physics scene.
   */
  getDefaultMaterial(physics) {
    const defaultMaterialParams = [0.5, 0.5, 0.1]
    return this.createMaterial(physics, defaultMaterialParams)
  }

  /**
   * Create a material for the physics scene.
   * @param physics
   * @param {number[]} materialParams - Array of material parameters.
   */
  createMaterial = (physics, materialParams) => {
    const material = this.#scratchStack.f32.subarray(0, 3)
    material.set(materialParams)

    const materialByteOffset = this.#scratchStack.f32.byteOffset

    return this.#physxWasm._createMaterialPhysics(
      physics,
      materialByteOffset
    )
  }
}
