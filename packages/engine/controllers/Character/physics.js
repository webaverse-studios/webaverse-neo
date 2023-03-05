/**
 * This is the character physics implementation.
 * This sets up and ticks the physics loop for our local character.
 */

import {Quaternion, Vector3} from "three";

/**
 * @class CharacterPhysics
 */
export class CharacterPhysics {
  /**
   * create character physics
   *
   * @param {BaseCharacter} character
   */
  constructor(character) {
    this.character = character;
    this.engine = character.engine;

    this.targetVelocity = new Vector3(); // note: set by user input ( WASD ).
    this.lastTargetVelocity = new Vector3(); // note: targetVelocity of last frame.
    this.wantVelocity = new Vector3(); // note: damped lastTargetVelocity ( mainly used for smooth animation transition ).

    this.velocity = new Vector3(); // after moveCharacterController, the result actual velocity.
    this.targetMoveDistancePerFrame = new Vector3(); // note: see velocity.
    this.lastTargetMoveDistancePerFrame = new Vector3(); // note: see velocity.
    this.wantMoveDistancePerFrame = new Vector3(); // note: see velocity.

    this.grounded = null;

    this.targetCameraQuaternion = new Quaternion();
  }

  /**
   * Load character controller
   *
   * @param {number} characterWidth - character width
   * @param {number} characterHeight - character height
   */
  loadCharacterController(characterWidth, characterHeight) {
    this.characterHeight = characterHeight;

    this.capsuleWidth = characterWidth / 2;
    this.capsuleHeight = characterHeight - characterWidth;

    const contactOffset = 0.01 * this.capsuleHeight;
    const stepOffset = 0.1 * this.capsuleHeight;

    const position = this.character.position.clone();
    const physicsScene = this.engine.physicsManager.getScene();
    if (this.characterController) {
      physicsScene.destroyCharacterController(this.characterController);
      this.characterController = null;
    }

    this.characterController = physicsScene.createCharacterController(
      this.capsuleWidth,
      this.capsuleHeight,
      contactOffset,
      stepOffset,
      position
    );
  }
}
