import { Keyboard } from "./keyboard";

/**
 * The KeyboardEvent is passed into all event callbacks from the {@link Keyboard}. It corresponds
 * to a key press or release.
 */
class CustomKeyboardEvent {
  key: string | null;
  code: string | null;
  location: number | null;
  element: EventTarget | null;
  event: KeyboardEvent | null;

  /**
   * Create a new KeyboardEvent.
   *
   * @param {KeyboardEvent} [event] - The original browser event that was fired.
   * @example
   * var onKeyDown = function (e) {
   *     if (e.key === pc.KEY_SPACE) {
   *         // space key pressed
   *     }
   *     e.event.preventDefault(); // Use original browser event to prevent browser action.
   * };
   * app.keyboard.on("keydown", onKeyDown, this);
   */
  constructor(event?: KeyboardEvent) {
    if (event) {
      /**
       * Value of the key pressed by the user. See the KEY_* constants.
       *
       * @type {number}
       */
      this.key = event.key;

      /**
       * A physical key on the keyboard. See the KEY_CODE_* constants.
       */
      this.code = event.code;

      /**
       * An unsigned long representing the location of the key on the keyboard or other input device.
       */
      this.location = event.location;

      /**
       * The element that fired the keyboard event.
       *
       * @type {Element}
       */
      this.element = event.target;

      /**
       * The original browser event which was fired.
       *
       * @type {KeyboardEvent}
       */
      this.event = event;
    } else {
      this.key = null;
      this.code = null;
      this.event = null;
      this.element = null;
      this.location = null;
    }
  }
}

export { CustomKeyboardEvent };
