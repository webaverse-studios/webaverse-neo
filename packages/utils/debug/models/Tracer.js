/** @typedef {import('@webaverse-studios/types').TracingChannel} TracingChannel */

/**
 * Log tracing functionality, allowing for tracing of the internal
 * functionality of the engine.
 *
 * Note that the trace logging only takes place in the debug build
 * of the engine and is stripped out in other builds.
 */
export class Tracer {
  /**
   * Set storing the names of enabled trace channels.
   *
   * @type {Set<string>}
   * @private
   */
  static #traceChannels = new Set()

  /**
   * Enable call stack logging for trace calls. Defaults to false.
   *
   * @type {boolean}
   */
  static stack = false

  /**
   * Enable or disable a trace channel.
   *
   * @param {TracingChannel} channel Name of the trace channel. Can be:
   * @param {boolean} enabled New enabled state for the channel.
   *
   * - {@link TRACEID_RENDER_FRAME}
   * - {@link TRACEID_RENDER_FRAME_TIME}
   * - {@link TRACEID_RENDER_PASS}
   * - {@link TRACEID_RENDER_PASS_DETAIL}
   * - {@link TRACEID_RENDER_ACTION}
   * - {@link TRACEID_RENDER_TARGET_ALLOC}
   * - {@link TRACEID_TEXTURE_ALLOC}
   * - {@link TRACEID_SHADER_ALLOC}
   * - {@link TRACEID_SHADER_COMPILE}
   * - {@link TRACEID_VRAM_TEXTURE}
   * - {@link TRACEID_VRAM_VB}
   * - {@link TRACEID_VRAM_IB}
   * - {@link TRACEID_RENDERPIPELINE_ALLOC}
   * - {@link TRACEID_PIPELINELAYOUT_ALLOC}
   */
  static set( channel, enabled = true ) {
    // #if _DEBUG
    if ( enabled ) {
      Tracer._traceChannels.add( channel )
    } else {
      Tracer._traceChannels.delete( channel )
    }
    // #endif
  }

  /**
   * Test if the trace channel is enabled.
   *
   * @param {TracingChannel} channel Name of the trace channel.
   * @returns {boolean} - True if the trace channel is enabled.
   */
  static get( channel ) {
    return Tracer._traceChannels.has( channel )
  }
}
