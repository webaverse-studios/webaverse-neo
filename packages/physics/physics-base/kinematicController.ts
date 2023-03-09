import { Vector3 } from "three";

/**
 * Kinematic Controller Class
 */
export abstract class KinematicController {
  /**
   * is the controller grounded?
   */
  readonly grounded: boolean;

  #velocity: Vector3;

  constructor() {
    this.grounded = true;
    this.#velocity = new Vector3();
  }

  /**
   * Velocity of the controller
   */
  get velocity() {
    return this.#velocity;
  }

  /**
   * Set the velocity of the controller
   *
   * @param {Vector3} velocity - velocity to set
   */
  set velocity(velocity: Vector3) {
    this.#velocity = velocity;
  }

  /**
   * Move the kinematic controller in a direction
   *
   * @param {Vector3} direction
   */
  abstract move(direction: Vector3): void;

  /**
   * Destroy the kinematic controller
   */
  abstract destroy(): void;
}

export class BaseKinematicController extends KinematicController {
  move(direction: Vector3): void {
    throw new Error(
      `[BaseKinematicController:move(${direction})] Using the base kinematic controller is not allowed`
    );
  }

  destroy(): void {
    throw new Error(
      "[BaseKinematicController:destroy] Using the base kinematic controller is not allowed."
    );
  }
}
