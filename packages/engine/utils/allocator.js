/**
 * @class Allocator
 */
export class Allocator {
  /**
   * Create a new empty allocator
   *
   * @param moduleInstance
   */
  constructor(moduleInstance) {
    this.offsets = []
    this.moduleInstance = moduleInstance;
  }

  /**
   * Allocate memory
   * @param {Object} constructor - constructor to allocate memory for
   * @param {number} size - size of the data to allocate
   * @returns {Object}
   */
  alloc(constructor, size) {
    if (size > 0) {
      const offset = this.moduleInstance._doMalloc(
        size * constructor.BYTES_PER_ELEMENT
      )
      const b = new constructor(
        this.moduleInstance.HEAP8.buffer,
        this.moduleInstance.HEAP8.byteOffset + offset,
        size
      )
      b.offset = offset
      this.offsets.push(offset)
      return b
    } else {
      return new constructor(this.moduleInstance.HEAP8.buffer, 0, 0)
    }
  }

  /**
   * Free all allocated memory
   */
  freeAll() {
    for (let i = 0; i < this.offsets.length; i++) {
      this.moduleInstance._doFree(this.offsets[i])
    }
    this.offsets.length = 0
  }
}

export class IdAllocator {
  constructor(maxSize = 100) {
    this.stack = new Uint32Array(maxSize);
    for (let i = 0; i < maxSize; i++) {
      this.stack[i] = i + 1;
    }
    this.stackIndex = 0;
  }

  alloc() {
    if (this.stackIndex < this.stack.length) {
      const index = this.stack[this.stackIndex];
      this.stackIndex++;
      return index;
    } else {
      return -1;
    }
  }

  free(index) {
    this.stackIndex--;
    this.stack[this.stackIndex] = index;
  }
}

const physicsIdAllcator = new IdAllocator();
export const getNextPhysicsId = physicsIdAllcator.alloc.bind(physicsIdAllcator);
