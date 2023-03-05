/**
 * ScratchStack is a utility class for allocating memory on the Emscripten heap.
 */
export class ScratchStack {
  constructor(moduleInstance, size) {
    this.ptr = moduleInstance._doMalloc(size)

    this.u8 = new Uint8Array(
      moduleInstance.HEAP8.buffer,
      this.ptr,
      size
    )
    this.u16 = new Uint16Array(
      moduleInstance.HEAP8.buffer,
      this.ptr,
      size / 2
    )
    this.u32 = new Uint32Array(
      moduleInstance.HEAP8.buffer,
      this.ptr,
      size / 4
    )
    this.i8 = new Int8Array(
      moduleInstance.HEAP8.buffer,
      this.ptr,
      size
    )
    this.i16 = new Int16Array(
      moduleInstance.HEAP8.buffer,
      this.ptr,
      size / 2
    )
    this.i32 = new Int32Array(
      moduleInstance.HEAP8.buffer,
      this.ptr,
      size / 4
    )
    this.f32 = new Float32Array(
      moduleInstance.HEAP8.buffer,
      this.ptr,
      size / 4
    )
  }
}
