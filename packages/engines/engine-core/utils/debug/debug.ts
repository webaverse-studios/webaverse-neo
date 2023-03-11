import { Tracing, TracingChannel } from "./tracing";

/**
 * Engine debug log system. Note that the logging only executes in the
 * debug build of the engine, and is stripped out in other builds.
 *
 * @ignore
 */
class Debug {
  /**
   * Set storing already logged messages, to only print each unique message one time.
   *
   * @type {Set<string>}
   * @private
   */
  private static _loggedMessages: Set<string> = new Set();

  /**
   * Deprecated warning message.
   *
   * @param {string} message - The message to log.
   */
  static deprecated(message: string) {
    if (!Debug._loggedMessages.has(message)) {
      Debug._loggedMessages.add(message);
      console.warn("DEPRECATED: " + message);
    }
  }

  /**
   * Assertion deprecated message. If the assertion is false, the deprecated message is written to the log.
   *
   * @param {boolean|object} assertion - The assertion to check.
   * @param {string} message - The message to log.
   */
  static assertDeprecated(assertion: boolean | object, message: string) {
    if (!assertion) {
      Debug.deprecated(message);
    }
  }

  /**
   * Assertion error message. If the assertion is false, the error message is written to the log.
   *
   * @param {boolean|object} assertion - The assertion to check.
   * @param {...*} args - The values to be written to the log.
   */
  static assert(assertion: boolean | object, ...args: any[]) {
    if (!assertion) {
      console.error("ASSERT FAILED: ", ...args);
    }
  }

  /**
   * Executes a function in debug mode only.
   *
   * @param {Function} func - Function to call.
   */
  static call(func: Function) {
    func();
  }

  /**
   * Info message.
   *
   * @param {...*} args - The values to be written to the log.
   */
  static log(...args: any[]) {
    console.log(...args);
  }

  /**
   * Info message logged no more than once.
   *
   * @param {string} message - The message to log.
   */
  static logOnce(message: string) {
    if (!Debug._loggedMessages.has(message)) {
      Debug._loggedMessages.add(message);
      console.log(message);
    }
  }

  /**
   * Warning message.
   *
   * @param {...*} args - The values to be written to the log.
   */
  static warn(...args: any[]) {
    console.warn(...args);
  }

  /**
   * Warning message logged no more than once.
   *
   * @param {string} message - The message to log.
   */
  static warnOnce(message: string) {
    if (!Debug._loggedMessages.has(message)) {
      Debug._loggedMessages.add(message);
      console.warn(message);
    }
  }

  /**
   * Error message.
   *
   * @param {...*} args - The values to be written to the log.
   */
  static error(...args: any[]) {
    console.error(...args);
  }

  /**
   * Error message logged no more than once.
   *
   * @param {string} message - The message to log.
   */
  static errorOnce(message: string) {
    if (!Debug._loggedMessages.has(message)) {
      Debug._loggedMessages.add(message);
      console.error(message);
    }
  }

  /**
   * Error in validation of GPU commands, logged no more than once.
   *
   * @param {...*} args - The values to be written to the log. Uniqueness of the first parameter
   * is used to determine if the message was already logged out.
   */
  static gpuError(...args: string[]) {
    if (!Debug._loggedMessages.has(args[0])) {
      Debug._loggedMessages.add(args[0]);
      console.error(`GPU VALIDATION ERROR: `, ...args);
    }
  }

  /**
   * Trace message, which is logged to the console if the tracing for the channel is enabled
   *
   * @param {string} channel - The trace channel
   * @param {...*} args - The values to be written to the log.
   */
  static trace(channel: TracingChannel, ...args: any[]) {
    if (Tracing.get(channel)) {
      console.groupCollapsed(`${channel.padEnd(20, " ")}|`, ...args);
      if (Tracing.stack) {
        console.trace();
      }
      console.groupEnd();
    }
  }
}

/**
 * A helper debug functionality.
 *
 * @ignore
 */
class DebugHelper {
  /**
   * Set a name to the name property of the object. Executes only in the debug build.
   *
   * @param {object} object - The object to assign the name to.
   * @param {string} name - The name to assign.
   */
  static setName(
    object: Record<string | number | symbol, string>,
    name: string
  ) {
    if (object) {
      object.name = name;
    }
  }

  /**
   * Set a label to the label property of the object. Executes only in the debug build.
   *
   * @param {object} object - The object to assign the name to.
   * @param {string} label - The label to assign.
   */
  static setLabel(
    object: Record<string | number | symbol, string>,
    label: string
  ) {
    if (object) {
      object.label = label;
    }
  }
}

export { Debug, DebugHelper };
