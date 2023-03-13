import { TracingChannel } from '@webaverse-studios/types'

/**
 * @readonly
 * @enum {TracingChannel}
 */
export const TRACING_CHANNEL = {
  /**
   * Logs a frame number.
   */
  TRACEID_RENDER_FRAME: 'RenderFrame',

  /**
   * Logs a frame time.
   */
  TRACEID_RENDER_FRAME_TIME: 'RenderFrameTime',

  /**
   * Logs basic information about generated render passes.
   */
  TRACEID_RENDER_PASS: 'RenderPass',

  /**
   * Logs additional detail for render passes.
   */
  TRACEID_RENDER_PASS_DETAIL: 'RenderPassDetail',

  /**
   * Logs render actions created by the layer composition.
   * Only executes when the layer composition changes.
   */
  TRACEID_RENDER_ACTION: 'RenderAction',

  /**
   * Logs the allocation of render targets.
   */
  TRACEID_RENDER_TARGET_ALLOC: 'RenderTargetAlloc',

  /**
   * Logs the allocation of textures.
   */
  TRACEID_TEXTURE_ALLOC: 'TextureAlloc',

  /**
   * Logs the creation of shaders.
   */
  TRACEID_SHADER_ALLOC: 'ShaderAlloc',

  /**
   * Logs the compilation time of shaders.
   */
  TRACEID_SHADER_COMPILE: 'ShaderCompile',

  /**
   * Logs the vram use by the textures.
   */
  TRACEID_VRAM_TEXTURE: 'VRAM.Texture',

  /**
   * Logs the vram use by the vertex buffers.
   */
  TRACEID_VRAM_VB: 'VRAM.Vb',

  /**
   * Logs the vram use by the index buffers.,
   */
  TRACEID_VRAM_IB: 'VRAM.Ib',

  /**
   * Logs the creation of bind groups.
   */
  TRACEID_BINDGROUP_ALLOC: 'BindGroupAlloc',

  /**
   * Logs the creation of bind group formats.
   */
  TRACEID_BINDGROUPFORMAT_ALLOC: 'BindGroupFormatAlloc',

  /**
   * Logs the creation of render pipelines. WebBPU only.
   */
  TRACEID_RENDERPIPELINE_ALLOC: 'RenderPipelineAlloc',

  /**
   * Logs the creation of pipeline layouts. WebBPU only.
   */
  TRACEID_PIPELINELAYOUT_ALLOC: 'PipelineLayoutAlloc',
}
