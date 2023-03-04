import Module from './public/dc.module.js'
import {Allocator} from './geometry-util.js';
import {makePromise} from './util.js';
import {defaultChunkSize} from './constants.js';

//

const cbs = new Map();

//

const align = (v, N) => {
  const r = v % N;
  return r === 0 ? v : v - r + N;
};
const align4 = v => align(v, 4);

//

const w = {};

w.waitForLoad = Module.waitForLoad;

w.free = address => {
  Module._doFree(address);
};

let chunkSize = defaultChunkSize;
w.initialize = (newChunkSize, seed) => {
  Module._initialize(newChunkSize, seed);
  chunkSize = newChunkSize;
};

w.createInstance = () => Module._createInstance();
w.destroyInstance = instance => Module._destroyInstance(instance);

//

const _parseTrackerUpdate = bufferAddress => {
  const dataView = new DataView(Module.HEAPU8.buffer, bufferAddress);
  let index = 0;
  const numSwaps = dataView.getInt32(index, true);
  index += Int32Array.BYTES_PER_ELEMENT;

  const _parseNode = () => {
    const min = new Int32Array(Module.HEAPU8.buffer, bufferAddress + index, 3).slice();
    index += Int32Array.BYTES_PER_ELEMENT * 3;
    const lod = dataView.getInt32(index, true);
    index += Int32Array.BYTES_PER_ELEMENT;
    
    return {
      min,
      lod,
    };
  };
  const _parseSwap = () => {
    const numOldNodes = dataView.getInt32(index, true);
    index += Int32Array.BYTES_PER_ELEMENT;

    const oldNodes = Array(numOldNodes);
    for (let i = 0; i < numOldNodes; i++) {
      oldNodes[i] = _parseNode();
    }

    const numNewNodes = dataView.getUint32(index, true);
    index += Uint32Array.BYTES_PER_ELEMENT;
    
    const newNodes = Array(numNewNodes);
    for (let i = 0; i < numNewNodes; i++) {
      newNodes[i] = _parseNode();
    }
  };
  const _parseSwaps = () => {
    const numSwaps = dataView.getInt32(index, true);
    index += Int32Array.BYTES_PER_ELEMENT;

    const swaps = Array(numSwaps);
    for (let i = 0; i < numSwaps; i++) {
      swaps[i] = _parseSwap();
    }
  };
  /* const _parseTrackerTask = () => {
    const id = dataView.getInt32(index, true);
    index += Int32Array.BYTES_PER_ELEMENT;
    const type = dataView.getInt32(index, true);
    index += Int32Array.BYTES_PER_ELEMENT;
    const min = new Int32Array(Module.HEAPU8.buffer, bufferAddress + index, 3).slice();
    index += Int32Array.BYTES_PER_ELEMENT * 3;
    const size = dataView.getInt32(index, true);
    index += Int32Array.BYTES_PER_ELEMENT;
    const isLeaf = !!dataView.getInt32(index, true);
    index += Int32Array.BYTES_PER_ELEMENT;
    const lodArray = new Int32Array(Module.HEAPU8.buffer, bufferAddress + index, 8).slice();
    index += Int32Array.BYTES_PER_ELEMENT * 8;
    
    const numOldNodes = dataView.getUint32(index, true);
    index += Uint32Array.BYTES_PER_ELEMENT;
    const oldNodes = Array(numOldNodes);
    for (let i = 0; i < numOldNodes; i++) {
      oldNodes[i] = _parseNode();
    }

    const numNewNodes = dataView.getUint32(index, true);
    index += Uint32Array.BYTES_PER_ELEMENT;
    const newNodes = Array(numNewNodes);
    for (let i = 0; i < numNewNodes; i++) {
      newNodes[i] = _parseNode();
    }

    return {
      id,
      type,
      min,
      size,
      isLeaf,
      lodArray,
      oldNodes,
      newNodes,
    };
  }; */

  const swaps = Array(numSwaps);
  for (let i = 0; i < numSwaps; i++) {
    swaps[i] = _parseSwaps();
  }

  return {
    // currentCoord,
    // oldTasks,
    // newTasks,
    swaps,
  };
};
w.createTracker = (inst, lod, minLodRange, trackY) => {
  const result = Module._createTracker(inst, lod, minLodRange, trackY);
  return result;
};
w.destroyTracker = (inst, tracker) => Module._destroyTracker(inst, tracker);
w.trackerUpdateAsync = async (inst, taskId, tracker, position, priority) => {
  const allocator = new Allocator(Module);

  const positionArray = allocator.alloc(Float32Array, 3);
  positionArray.set(position);

  Module._trackerUpdateAsync(
    inst,
    taskId,
    tracker,
    positionArray.byteOffset,
    priority
  );
  const p = makePromise();
  cbs.set(taskId, p);

  allocator.freeAll();

  const outputBufferOffset = await p;
  const result = _parseTrackerUpdate(outputBufferOffset);
  return result;
};

//

/* const cubeDamage = damageFn => (
  inst,
  x, y, z,
  qx, qy, qz, qw,
  sx, sy, sz,
) => {
  const allocator = new Allocator(Module);

  try {
    let numPositions = 8;
    const positionsTypedArray = allocator.alloc(Float32Array, numPositions * 3);
    const numPositionsTypedArray = allocator.alloc(Uint32Array, 1);
    numPositionsTypedArray[0] = numPositions;
    const lod = 1;
    const gridPoints = chunkSize + 3 + lod;
    const damageBufferSize = gridPoints * gridPoints * gridPoints;
    const damageBuffersTypedArray = allocator.alloc(Float32Array, numPositions * gridPoints * gridPoints * gridPoints);

    const drew = damageFn(
      inst,
      x, y, z,
      qx, qy, qz, qw,
      sx, sy, sz,
      positionsTypedArray.byteOffset,
      numPositionsTypedArray.byteOffset,
      damageBuffersTypedArray.byteOffset,
    );

    if (drew) {
      numPositions = numPositionsTypedArray[0];
      const chunks = Array(numPositions);
      for (let i = 0; i < numPositions; i++) {
        const position = positionsTypedArray.slice(i * 3, i * 3 + 3);
        const damageBuffer = damageBuffersTypedArray.slice(i * damageBufferSize, i * damageBufferSize + damageBufferSize);
        chunks[i] = {
          position,
          damageBuffer,
        };
      }
      return chunks;
    } else {
      return null;
    }
  } finally {
    allocator.freeAll();
  }
};
w.drawCubeDamage = function() {
  return cubeDamage(Module._drawCubeDamage.bind(Module)).apply(this, arguments);
};
w.eraseCubeDamage = function() {
  return cubeDamage(Module._eraseCubeDamage.bind(Module)).apply(this, arguments);
}; */

w.setClipRange = function(inst, range) {
  Module._setClipRange(
    inst,
    range[0][0], range[0][1],
    range[1][0], range[1][1],
  );
};

/* const sphereDamage = damageFn => (
  inst,
  x, y, z,
  radius,
) => {
  const allocator = new Allocator(Module);

  try {
    let numPositions = 8;
    const positionsTypedArray = allocator.alloc(Float32Array, numPositions * 3);
    const numPositionsTypedArray = allocator.alloc(Uint32Array, 1);
    numPositionsTypedArray[0] = numPositions;
    const drew = damageFn(
      inst,
      x, y, z,
      radius,
      positionsTypedArray.byteOffset,
      numPositionsTypedArray.byteOffset
    );

    if (drew) {      
      numPositions = numPositionsTypedArray[0];
      const chunks = Array(numPositions);
      for (let i = 0; i < numPositions; i++) {
        const position = positionsTypedArray.slice(i * 3, (i + 1) * 3);
        chunks[i] = {
          position,
        };
      }
      return chunks;
    } else {
      return null;
    }
  } finally {
    allocator.freeAll();
  }
};
w.drawSphereDamage = function() {
  return sphereDamage(Module._drawSphereDamage.bind(Module)).apply(this, arguments);
};
w.eraseSphereDamage = function() {
  return sphereDamage(Module._eraseSphereDamage.bind(Module)).apply(this, arguments);
}; */

//

const _parseTerrainVertexBuffer = (arrayBuffer, bufferAddress) => {
  const dataView = new DataView(arrayBuffer, bufferAddress);

  let index = 0;

  // positions
  const numPositions = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const positions = new Float32Array(arrayBuffer, bufferAddress + index, numPositions * 3);
  index += Float32Array.BYTES_PER_ELEMENT * numPositions * 3;

  // normals
  const numNormals = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const normals = new Float32Array(arrayBuffer, bufferAddress + index, numNormals * 3);
  index += Float32Array.BYTES_PER_ELEMENT * numNormals * 3;

  // biomes
  const numBiomes = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const biomes = new Int32Array(arrayBuffer, bufferAddress + index, numBiomes * 4);
  index += Int32Array.BYTES_PER_ELEMENT * numBiomes * 4;

  // biomes weights
  const numBiomesWeights = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const biomesWeights = new Float32Array(arrayBuffer, bufferAddress + index, numBiomesWeights * 4);
  index += Float32Array.BYTES_PER_ELEMENT * numBiomesWeights * 4;

  // biomes uvs 1
  const numBiomesUvs1 = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const biomesUvs1 = new Float32Array(arrayBuffer, bufferAddress + index, numBiomesUvs1 * 4);
  index += Float32Array.BYTES_PER_ELEMENT * numBiomesUvs1 * 4;

  // biomes uvs 2
  const numBiomesUvs2 = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const biomesUvs2 = new Float32Array(arrayBuffer, bufferAddress + index, numBiomesUvs2 * 4);
  index += Float32Array.BYTES_PER_ELEMENT * numBiomesUvs2 * 4;

  // indices
  const numIndices = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const indices = new Uint32Array(arrayBuffer, bufferAddress + index, numIndices);
  index += Uint32Array.BYTES_PER_ELEMENT * numIndices;

  // skylights
  const numSkylights = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const skylights = new Uint8Array(arrayBuffer, bufferAddress + index, numSkylights);
  index += Uint8Array.BYTES_PER_ELEMENT * numSkylights;
  index = align4(index);

  // aos
  const numAos = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const aos = new Uint8Array(arrayBuffer, bufferAddress + index, numAos);
  index += Uint8Array.BYTES_PER_ELEMENT * numAos;
  index = align4(index);

  // const numPeeks = dataView.getUint32(index, true);
  // index += Uint32Array.BYTES_PER_ELEMENT;
  // const peeks = new Uint8Array(arrayBuffer, bufferAddress + index, numPeeks);
  // index += Uint32Array.BYTES_PER_ELEMENT * numPeeks;

  return {
    bufferAddress,
    positions,
    normals,
    biomes,
    biomesWeights,
    biomesUvs1,
    biomesUvs2,
    indices,
    skylights,
    aos,
    // peeks,
  };
};
w.createTerrainChunkMeshAsync = async (inst, taskId, x, z, lod) => {
  const allocator = new Allocator(Module);


  Module._createTerrainChunkMeshAsync(
    inst,
    taskId,
    x, z,
    lod,
  );
  const p = makePromise();
  cbs.set(taskId, p);

  allocator.freeAll();

  const outputBufferOffset = await p;

  if (outputBufferOffset) {
    const result = _parseTerrainVertexBuffer(
      Module.HEAP8.buffer,
      Module.HEAP8.byteOffset + outputBufferOffset
    );
    return result;
  } else {
    return null;
  }
};

//

/* const _parseLiquidVertexBuffer = (arrayBuffer, bufferAddress) => {
  const dataView = new DataView(arrayBuffer, bufferAddress);

  let index = 0;

  // positions
  const numPositions = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const positions = new Float32Array(arrayBuffer, bufferAddress + index, numPositions * 3);
  index += Float32Array.BYTES_PER_ELEMENT * numPositions * 3;

  // normals
  const numNormals = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const normals = new Float32Array(arrayBuffer, bufferAddress + index, numNormals * 3);
  index += Float32Array.BYTES_PER_ELEMENT * numNormals * 3;

  // biomes
  const numBiomes = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const biomes = new Int32Array(arrayBuffer, bufferAddress + index, numBiomes);
  index += Int32Array.BYTES_PER_ELEMENT * numBiomes;

  // indices
  const numIndices = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const indices = new Uint32Array(arrayBuffer, bufferAddress + index, numIndices);
  index += Uint32Array.BYTES_PER_ELEMENT * numIndices;

  return {
    bufferAddress,
    positions,
    normals,
    biomes,
    indices,
  };
};
w.createLiquidChunkMeshAsync = async (inst, taskId, x, y, z, lods) => {
  const allocator = new Allocator(Module);

  const lodArray = allocator.alloc(Int32Array, 8);
  lodArray.set(lods);

  Module._createLiquidChunkMeshAsync(
    inst,
    taskId,
    x, y, z,
    lodArray.byteOffset,
  );

  const p = makePromise();
  cbs.set(taskId, p);
  const outputBufferOffset = await p;

  allocator.freeAll();

  if (outputBufferOffset) {
    const result = _parseLiquidVertexBuffer(
      Module.HEAP8.buffer,
      Module.HEAP8.byteOffset + outputBufferOffset
    );
    return result;
  } else {
    return null;
  }
}; */

//

/* w.getHeightfieldRangeAsync = async (inst, taskId, x, y, w, h, lod, priority) => {
  const allocator = new Allocator(Module);

  try {
    const heights = allocator.alloc(Float32Array, w * h);

    Module._getHeightfieldRangeAsync(
      inst,
      taskId,
      x, y,
      w, h,
      lod,
      heights.byteOffset,
      priority
    );

    const p = makePromise();
    cbs.set(taskId, p);

    await p;

    return heights.slice();
  } finally {
    allocator.freeAll();
  }
};
w.getLightRangeAsync = async (inst, taskId, x, y, z, w, h, d, lod, priority) => {
  const allocator = new Allocator(Module);

  try {
    const skylightsArray = allocator.alloc(Uint8Array, w * h * d);
    const aosArray = allocator.alloc(Uint8Array, w * h * d);

    Module._getLightRangeAsync(
      inst,
      taskId,
      x, y, z,
      w, h, d,
      lod,
      skylightsArray.byteOffset,
      aosArray.byteOffset,
      priority
    );

    const p = makePromise();
    cbs.set(taskId, p);

    await p;

    return {
      skylights: skylightsArray.slice(),
      aos: aosArray.slice(),
    };
  } finally {
    allocator.freeAll();
  }
}; */

//

/* w.getChunkHeightfieldAsync = async (inst, taskId, x, z, lod, priority) => {
  Module._getChunkHeightfieldAsync(
    inst,
    taskId,
    x, z,
    lod,
    priority
  );

  const p = makePromise();
  cbs.set(taskId, p);
  const heights = await p;

  const heights2 = new Float32Array(Module.HEAPU8.buffer, heights, chunkSize * chunkSize).slice();
  Module._doFree(heights);
  return heights2;
};
w.getChunkSkylightAsync = async (inst, taskId, x, y, z, lod) => {
  Module._getChunkSkylightAsync(
    inst,
    taskId,
    x, y, z,
    lod
  );

  const p = makePromise();
  cbs.set(taskId, p);
  const skylights = await p;

  const skylights2 = new Uint8Array(Module.HEAPU8.buffer, skylights, chunkSize * chunkSize * chunkSize).slice();
  Module._doFree(skylights);
  return skylights2;
};
w.getChunkAoAsync = async (inst, taskId, x, y, z, lod) => {
  Module._getChunkAoAsync(
    inst,
    taskId,
    x, y, z,
    lod
  );

  const p = makePromise();
  cbs.set(taskId, p);
  const aos = await p;

  const aos2 = new Uint8Array(Module.HEAPU8.buffer, aos, chunkSize * chunkSize * chunkSize).slice();
  Module._doFree(aos);
  return aos2;
}; */

function _parsePQI(addr) {
  const dataView = new DataView(Module.HEAPU8.buffer, addr);

  let index = 0;
  const psSize = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const ps = new Float32Array(dataView.buffer, dataView.byteOffset + index, psSize).slice();
  index += psSize * Float32Array.BYTES_PER_ELEMENT;
  const qsSize = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const qs = new Float32Array(dataView.buffer, dataView.byteOffset + index, qsSize).slice();
  index += qsSize * Float32Array.BYTES_PER_ELEMENT;
  const instancesSize = dataView.getUint32(index, true);
  index += Uint32Array.BYTES_PER_ELEMENT;
  const instances = new Float32Array(dataView.buffer, dataView.byteOffset + index, instancesSize).slice();
  index += instancesSize * Float32Array.BYTES_PER_ELEMENT;

  return {
    ps,
    qs,
    instances,
  };
}
w.createGrassSplatAsync = async (inst, taskId, x, z, lod, priority) => {
  // const allocator = new Allocator(Module);

  // const allocSize = 64 * 1024;
  // const ps = allocator.alloc(Float32Array, allocSize * 3);
  // const qs = allocator.alloc(Float32Array, allocSize * 4);
  // const instances = allocator.alloc(Float32Array, allocSize);
  // const count = allocator.alloc(Uint32Array, 1);

  // try {
    Module._createGrassSplatAsync(
      inst,
      taskId,
      x, z,
      lod,
      priority
    );

    const p = makePromise();
    cbs.set(taskId, p);
    const result = await p;
    const pqi = _parsePQI(result);
    // console.log('got result 1', _parsePQI(result));
    Module._doFree(result);
    return pqi;

    /* const numElements = count[0];
    return {
      ps: ps.slice(0, numElements * 3),
      qs: qs.slice(0, numElements * 4),
      instances: instances.slice(0, numElements),
    }; */
  /* } finally {
    // allocator.freeAll();
  } */
};
w.createVegetationSplatAsync = async (inst, taskId, x, z, lod, priority) => {
  // const allocator = new Allocator(Module);

  // const allocSize = 64 * 1024;
  // const ps = allocator.alloc(Float32Array, allocSize * 3);
  // const qs = allocator.alloc(Float32Array, allocSize * 4);
  // const instances = allocator.alloc(Float32Array, allocSize);
  // const count = allocator.alloc(Uint32Array, 1);

  // try {
    Module._createVegetationSplatAsync(
      inst,
      taskId,
      x, z,
      lod,
      priority
    );

    const p = makePromise();
    cbs.set(taskId, p);
    const result = await p;

    const pqi = _parsePQI(result);
    // console.log('got result 2', _parsePQI(result));
    Module._doFree(result);
    return pqi;
    /* const numElements = count[0];
    return {
      ps: ps.slice(0, numElements * 3),
      qs: qs.slice(0, numElements * 4),
      instances: instances.slice(0, numElements),
    }; */
  /* } finally {
    // allocator.freeAll();
  } */
};
w.createMobSplatAsync = async (inst, taskId, x, z, lod, priority) => {
  // const allocator = new Allocator(Module);

  /* const allocSize = 64 * 1024;
  const ps = allocator.alloc(Float32Array, allocSize * 3);
  const qs = allocator.alloc(Float32Array, allocSize * 4);
  const instances = allocator.alloc(Float32Array, allocSize);
  const count = allocator.alloc(Uint32Array, 1); */

  // try {
    Module._createMobSplatAsync(
      inst,
      taskId,
      x, z,
      lod,
      priority
    );

    const p = makePromise();
    cbs.set(taskId, p);
    const result = await p;
    const pqi = _parsePQI(result);
    // console.log('got result 3', _parsePQI(result));
    Module._doFree(result);
    return pqi;

    /* const numElements = count[0];
    return {
      ps: ps.slice(0, numElements * 3),
      qs: qs.slice(0, numElements * 4),
      instances: instances.slice(0, numElements),
    }; */
  /* } finally {
    // allocator.freeAll();
  } */
};
// _parsePQI parses ps, qs, instances from a buffer
// the buffer contains 6 entries:
// ps size (uint32_t)
// ps data (float32_t) * size
// qs size (uint32_t)
// qs data (float32_t) * size
// instances size (uint32_t)
// instances data (float32_t) * size

//

w.setCamera = (
  inst,
  worldPosition,
  cameraPosition,
  cameraQuaternion,
  projectionMatrix
) => {
  const allocator = new Allocator(Module);

  const worldPositionArray = allocator.alloc(Float32Array, 3);
  worldPositionArray.set(worldPosition);

  const cameraPositionArray = allocator.alloc(Float32Array, 3);
  cameraPositionArray.set(cameraPosition);

  const cameraQuaternionArray = allocator.alloc(Float32Array, 4);
  cameraQuaternionArray.set(cameraQuaternion);

  const projectionMatrixArray = allocator.alloc(Float32Array, 16);
  projectionMatrixArray.set(projectionMatrix);

  Module._setCamera(
    inst,
    worldPositionArray.byteOffset,
    cameraPositionArray.byteOffset,
    cameraQuaternionArray.byteOffset,
    projectionMatrixArray.byteOffset
  );

  allocator.freeAll();
};

//

w.cancelTask = async (inst, taskId) => {
  // console.log('cancel task', inst, taskId);
  Module._cancelTask(inst, taskId);
};

globalThis.handleResult = (id, result) => {
  const p = cbs.get(id);
  if (p) {
    cbs.delete(id);
    p.resolve(result);
  } else {
    console.warn('failed to find promise for id', id, result);
  }
};

export default w;