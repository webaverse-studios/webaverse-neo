/* eslint-disable no-console */
import { Tracer } from '../models'

/**
 * Generates a message to be logged.
 *
 * @param id
 * @param {...any} args
 * @returns
 */
function generateMessage( id, ...args ) {
  const instanceId = id ? `[${id}]` : ''
  return [instanceId, ...args]
}

/**
 * Engine debug log system. Note that the logging only executes in the
 * debug build of the engine, and is stripped out in other builds.
 *
 * @ignore
 */
export class Debug {
  /**
   * Set storing already logged messages, to only print each
   * unique message one time.
   *
   * @type {Set<string>}
   * @private
   */
  #loggedMessages = new Set()

  /**
   * Tracer id.
   */
  #instanceId = ''

  /**
   * Creates an instance of Debug.
   *
   * @param {string} id Tracer id.
   */
  constructor( id ) {
    this.#instanceId = id
  }

  /**
   * Assertion error message. If the assertion is false, the error
   * message is written to the log.
   *
   * @param {boolean|object} assertion The assertion to check.
   * @param {...*} args The values to be written to the log.
   */
  static assert( assertion, ...args ) {
    if ( !assertion ) {
      console.error( 'ASSERT FAILED: ', ...args )
    }
  }

  /**
   * Assertion deprecated message. If the assertion is false, the deprecated
   * message is written to the log.
   *
   * @param {boolean|object} assertion The assertion to check.
   * @param {string} message The message to log.
   */
  static assertDeprecated( assertion, message ) {
    if ( !assertion ) {
      Debug.deprecated( message )
    }
  }

  /**
   * Executes a function in debug mode only.
   *
   * @param {Function} func Function to call.
   */
  static call( func ) {
    func()
  }

  /**
   * Deprecated warning message.
   *
   * @param {string} message The message to log.
   */
  static deprecated( message ) {
    if ( !Debug._loggedMessages.has( message )) {
      Debug._loggedMessages.add( message )
      console.warn( 'DEPRECATED: ' + message )
    }
  }

  /**
   * Info message.
   *
   * @param {...*} args The values to be written to the log.
   */
  static log( ...args ) {
    console.log( ...generateMessage( this.#instanceId, ...args ))
  }

  /**
   * Info message logged no more than once.
   *
   * @param {string} message The message to log.
   */
  static logOnce( message ) {
    if ( !Debug._loggedMessages.has( message )) {
      Debug._loggedMessages.add( message )
      console.log( message )
    }
  }

  /**
   * Warning message.
   *
   * @param {...*} args The values to be written to the log.
   */
  static warn( ...args ) {
    console.warn( ...args )
  }

  /**
   * Warning message logged no more than once.
   *
   * @param {string} message The message to log.
   */
  static warnOnce( message ) {
    if ( !Debug._loggedMessages.has( message )) {
      Debug._loggedMessages.add( message )
      console.warn( message )
    }
  }

  /**
   * Error message.
   *
   * @param {...*} args The values to be written to the log.
   */
  static error( ...args ) {
    console.error( ...args )
  }

  /**
   * Error message logged no more than once.
   *
   * @param {string} message The message to log.
   */
  static errorOnce( message ) {
    if ( !Debug._loggedMessages.has( message )) {
      Debug._loggedMessages.add( message )
      console.error( message )
    }
  }

  /**
   * Error in validation of GPU commands, logged no more than once.
   *
   * @param {...string} args The values to be written to the log.
   * Uniqueness of the first parameter is used to determine if the
   * message was already logged out.
   */
  static gpuError( ...args ) {
    if ( !Debug._loggedMessages.has( args[0])) {
      Debug._loggedMessages.add( args[0])
      console.error( `GPU VALIDATION ERROR: `, ...args )
    }
  }

  /**
   * Trace message, which is logged to the console if the tracing for the
   * channel is enabled
   *
   * @param {import('./Tracer.js').TracingChannel} channel The trace channel
   * @param {...*} args The values to be written to the log.
   */
  static trace( channel, ...args ) {
    if ( Tracer.get( channel )) {
      console.groupCollapsed( `${channel.padEnd( 20, ' ' )}|`, ...args )
      if ( Tracer.stack ) {
        console.trace()
      }
      console.groupEnd()
    }
  }
}
