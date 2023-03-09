import { BaseScene } from "@webaverse-studios/engine-base/scenes";

import {
  KinematicController,
  BaseKinematicController,
} from "./kinematicController";

/**
 * Base Physics Adapter
 */
abstract class PhysicsAdapter {
  constructor() {}

  /**
   * Construct and return a it new Kinematic Controller
   */
  createKinematicController() {
    return new BaseKinematicController();
  }

  /**
   * Update the physics adapter
   */
  abstract update(): void;

  /**
   * Destroy a character controller
   *
   * @param {KinematicController} controller - controller to destroy
   */
  abstract destroyCharacterController(controller: KinematicController): void;

  /**
   * Display debug information onto the scene
   */
  abstract displayDebugInformation(scene: BaseScene): void;
}

export { KinematicController, PhysicsAdapter };
