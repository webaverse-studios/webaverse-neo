import {Physx} from "../physx.js";
import {Box3, BoxGeometry, Mesh, Object3D, Vector3} from "three";
import {getNextPhysicsId} from "../../../utils/allocator.js";

/**
 * @class PhysicsScene
 */
export class PhysicsScene extends EventTarget {
  /**
   *
   * @param {PhysicsScene} [scene=] - if provided, this scene will be used over creating a new one
   * @param {boolean} [physicsEnabled=] - if false, physics will be disabled for this scene
   */
  constructor(scene, physicsEnabled) {
    super()

    if (!scene || !physicsEnabled) {
      this.scene = Physx.makeScene()
      this.physicsEnabled = true
    } else {
      this.scene = scene
      this.physicsEnabled = physicsEnabled
    }
  }

  destroyCharacterController(characterController) {
    Physx.destroyCharacterControllerPhysics(
      this.scene,
      characterController.characterControllerId
    )
  }

  createCharacterController(
    radius,
    height,
    contactOffset,
    stepOffset,
    position
  ) {
    const physicsId = getNextPhysicsId()
    const characterControllerId =
      Physx.createCharacterControllerPhysics(
        this.scene,
        radius,
        height,
        contactOffset,
        stepOffset,
        position,
        physicsId
      )

    const characterHeight = height + radius * 2
    const physicsObject = new Object3D()
    const {bounds} = this.getGeometryForPhysicsId(physicsId)
    const box = new Box3(
      new Vector3().fromArray(bounds, 0),
      new Vector3().fromArray(bounds, 3)
    )
    const dimensions = new Vector3().subVectors(box.max, box.min)
    const physicsMesh = new Mesh(
      // new CapsuleGeometry(radius, radius, characterHeight),
      new BoxGeometry(dimensions.x, dimensions.y, dimensions.z),
      redAlphaMaterial
    )
    physicsMesh.visible = false
    physicsObject.add(physicsMesh)
    physicsMesh.updateMatrixWorld()
    physicsMesh.geometry.boundingBox = box
    // console.log('character controllers bounds', physicsId, physicsMesh.geometry.boundingBox);
    physicsObject.physicsMesh = physicsMesh
    physicsObject.characterControllerId = characterControllerId
    physicsObject.physicsId = physicsId

    /* const physicsObject = _makePhysicsObject(physicsId, mesh.position, mesh.quaternion, mesh.scale);
    physicsObject.add(physicsMesh);
    physicsMesh.position.set(0, 0, 0);
    physicsMesh.quaternion.set(0, 0, 0, 1);
    physicsMesh.scale.set(1, 1, 1);
    physicsMesh.updateMatrixWorld();
    physicsObject.physicsMesh = physicsMesh;
    characterController.physicsObject = physicsObject;
    console.log('character controllers id', physicsObject); */

    return physicsObject
  }
}
