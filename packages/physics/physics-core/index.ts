import { Scene } from "../../engines/engine-core/scenes";

import { KinematicController } from "./models/KinematicController";
import { BaseKinematicController } from "./models/BaseKinematicController";

/**
 * Base Physics Adapter
 */
export abstract class PhysicsAdapter {
  constructor() {}

  /**
   * Construct and return a new Kinematic Controller
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
  abstract displayDebugInformation(scene: Scene): void;
}

export { KinematicController };
