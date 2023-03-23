/* eslint-disable max-len */

/**
 * @typedef TracingChannel
 * @property {"RenderFrame"} TRACEID_RENDER_FRAME Logs a frame number.
 * @property {"RenderFrameTime"} TRACEID_RENDER_FRAME_TIME Logs a frame time.
 * @property {"RenderPass"} TRACEID_RENDER_PASS Logs basic information about generated render passes.
 * @property {"RenderPassDetail"} TRACEID_RENDER_PASS_DETAIL Logs additional detail for render passes.
 * @property {"RenderAction"} TRACEID_RENDER_ACTION Logs render actions created by the layer composition. Only executes when the layer composition changes.
 * @property {"RenderTargetAlloc"} TRACEID_RENDER_TARGET_ALLOC Logs the allocation of render targets.
 * @property {"TextureAlloc"} TRACEID_TEXTURE_ALLOC Logs the allocation of textures.
 * @property {"ShaderAlloc"} TRACEID_SHADER_ALLOC Logs the creation of shaders.
 * @property {"ShaderCompile"} TRACEID_SHADER_COMPILE Logs the compilation time of shaders.
 * @property {"VRAM.Texture"} TRACEID_VRAM_TEXTURE Logs the vram use by the textures.
 * @property {"VRAM.Vb"} TRACEID_VRAM_VB Logs the vram use by the vertex buffers.
 * @property {"VRAM.Ib"} TRACEID_VRAM_IB Logs the vram use by the index buffers.
 * @property {"BindGroupAlloc"} TRACEID_BIND_GROUP_ALLOC Logs the allocation of bind groups.
 * @property {"BindGroupFormatAlloc"} TRACEID_BIND_GROUP_FORMAT_ALLOC Logs the allocation of bind group formats.
 * @property {"RenderPipelineAlloc"} TRACEID_RENDER_PIPELINE_ALLOC Logs the allocation of render pipelines.
 * @property {"PipelineLayoutAlloc"} TRACEID_PIPELINE_LAYOUT_ALLOC Logs the allocation of pipeline layouts.
 */

/**
 * @typedef {object} Debug
 * @property {(...args: any[]) => void} log log a message
 * @property {(...args: any[]) => void} warn log a warning
 * @property {(...args: any[]) => void} error log an error
 */

export default {}
