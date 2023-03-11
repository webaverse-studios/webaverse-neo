import {
  TRACEID_PIPELINELAYOUT_ALLOC,
  TRACEID_RENDERPIPELINE_ALLOC,
  TRACEID_RENDER_ACTION,
  TRACEID_RENDER_FRAME,
  TRACEID_RENDER_FRAME_TIME,
  TRACEID_RENDER_PASS,
  TRACEID_RENDER_PASS_DETAIL,
  TRACEID_RENDER_TARGET_ALLOC,
  TRACEID_SHADER_ALLOC,
  TRACEID_SHADER_COMPILE,
  TRACEID_TEXTURE_ALLOC,
  TRACEID_VRAM_IB,
  TRACEID_VRAM_TEXTURE,
  TRACEID_VRAM_VB,
} from "./tracing-constants";

export type TracingChannel =
  | typeof TRACEID_RENDER_FRAME
  | typeof TRACEID_RENDER_FRAME_TIME
  | typeof TRACEID_RENDER_PASS
  | typeof TRACEID_RENDER_PASS_DETAIL
  | typeof TRACEID_RENDER_ACTION
  | typeof TRACEID_RENDER_TARGET_ALLOC
  | typeof TRACEID_TEXTURE_ALLOC
  | typeof TRACEID_SHADER_ALLOC
  | typeof TRACEID_SHADER_COMPILE
  | typeof TRACEID_VRAM_TEXTURE
  | typeof TRACEID_VRAM_VB
  | typeof TRACEID_VRAM_IB
  | typeof TRACEID_RENDERPIPELINE_ALLOC
  | typeof TRACEID_PIPELINELAYOUT_ALLOC;

/**
 * Log tracing functionality, allowing for tracing of the internal functionality of the engine.
 * Note that the trace logging only takes place in the debug build of the engine and is stripped
 * out in other builds.
 */
class Tracing {
  /**
   * Set storing the names of enabled trace channels.
   *
   * @type {Set<string>}
   * @private
   */
  private static _traceChannels: Set<string> = new Set();

  /**
   * Enable call stack logging for trace calls. Defaults to false.
   *
   * @type {boolean}
   */
  static stack: boolean = false;

  /**
   * Enable or disable a trace channel.
   *
   * @param {string} channel - Name of the trace channel. Can be:
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
   *
   * @param {boolean} enabled - New enabled state for the channel.
   */
  static set(channel: TracingChannel, enabled: boolean = true) {
    // #if _DEBUG
    if (enabled) {
      Tracing._traceChannels.add(channel);
    } else {
      Tracing._traceChannels.delete(channel);
    }
    // #endif
  }

  /**
   * Test if the trace channel is enabled.
   *
   * @param {TracingChannel} channel - Name of the trace channel.
   * @returns {boolean} - True if the trace channel is enabled.
   */
  static get(channel: TracingChannel): boolean {
    return Tracing._traceChannels.has(channel);
  }
}

export { Tracing };
