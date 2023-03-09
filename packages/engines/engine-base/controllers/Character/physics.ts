import {
  KinematicController,
  PhysicsAdapter,
} from "@webaverse-studios/physics-base";
import { Object3D, Vector3 } from "three";

/**
 * @class Physics Character
 */
export class PhysicsCharacter extends Object3D {
  /**
   * Running physics adapter.
   *
   * @property {PhysicsAdapter}
   */
  physicsAdapter: PhysicsAdapter;

  /**
   * Kinematic controller for the character.
   */
  kinematicController: KinematicController;

  constructor({ physicsAdapter }: { physicsAdapter: PhysicsAdapter }) {
    super();

    this.physicsAdapter = physicsAdapter;
    this.kinematicController = physicsAdapter.createKinematicController();
  }

  update(dir: Vector3) {
    this.kinematicController.move(dir);
  }
}
