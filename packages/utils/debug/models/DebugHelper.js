/**
 * A helper debug functionality.
 *
 * @ignore
 */
export class DebugHelper {
  /**
   * Set a name to the name property of the object. Executes only in the debug
   * build.
   *
   * @param {object} object The object to assign the name to.
   * @param {string} name The name to assign.
   */
  static setName( object, name ) {
    if ( object ) {
      object.name = name
    }
  }

  /**
   * Set a label to the label property of the object. Executes only in the
   * debug build.
   *
   * @param {object} object The object to assign the name to.
   * @param {string} label The label to assign.
   */
  static setLabel( object, label ) {
    if ( object ) {
      object.label = label
    }
  }
}
