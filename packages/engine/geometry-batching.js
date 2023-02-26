import * as THREE from "three";
import {FreeList} from "./geometry-util.js";
import {getRenderer} from "./renderer.js";
import {getBoundingSize} from "./util.js";

const localVector2D = new THREE.Vector2();
const localMatrix = new THREE.Matrix4();
const localSphere = new THREE.Sphere();
const localBox = new THREE.Box3();
const localFrustum = new THREE.Frustum();
const localDataTexture = new THREE.DataTexture();

export class DrawCallBinding {
  constructor(geometryIndex, freeListEntry, allocator) {
    this.geometryIndex = geometryIndex;
    this.freeListEntry = freeListEntry;
    this.allocator = allocator;
  }

  getTexture(name) {
    return this.allocator.getTexture(name);
  }

  getTextureOffset(name) {
    const texture = this.getTexture(name);
    const {itemSize} = texture;
    return (
      this.freeListEntry *
      this.allocator.maxInstancesPerGeometryPerDrawCall *
      itemSize
    );
  }

  getInstanceCount() {
    return this.allocator.getInstanceCount(this);
  }

  setInstanceCount(instanceCount) {
    this.allocator.setInstanceCount(this, instanceCount);
  }

  incrementInstanceCount() {
    return this.allocator.incrementInstanceCount(this);
  }

  decrementInstanceCount() {
    return this.allocator.decrementInstanceCount(this);
  }

  updateTexture(name, dataIndex, dataLength) {
    const texture = this.getTexture(name);

    let pixelIndex = dataIndex / texture.itemSize;
    let itemCount = dataLength / texture.itemSize;

    // update all pixels from pixelIndex to pixelIndex + itemCount
    // this requires up to 3 writes to the texture
    const renderer = getRenderer();

    let minX = pixelIndex % texture.image.width;
    let minY = Math.floor(pixelIndex / texture.image.width);
    const maxX = (pixelIndex + itemCount) % texture.image.width;
    const maxY = Math.floor((pixelIndex + itemCount) / texture.image.width);

    // top
    if (minX !== 0) {
      const x = minX;
      const y = minY;
      const w = Math.min(texture.image.width - x, itemCount);
      const h = 1;
      const position = localVector2D.set(x, y);
      const start = (x + y * texture.image.width) * texture.itemSize;
      const size = w * h * texture.itemSize;
      const data = texture.image.data.subarray(start, start + size);

      const srcTexture = localDataTexture;
      srcTexture.image.data = data;
      srcTexture.image.width = w;
      srcTexture.image.height = h;
      srcTexture.format = texture.format;
      srcTexture.type = texture.type;

      renderer.copyTextureToTexture(position, srcTexture, texture, 0);

      srcTexture.image.data = null;

      minX = 0;
      minY++;

      pixelIndex += w * h;
      itemCount -= w * h;
    }

    // middle
    if (minY < maxY) {
      const x = 0;
      const y = minY;
      const w = texture.image.width;
      const h = maxY - minY;
      const position = localVector2D.set(x, y);
      const start = (x + y * texture.image.width) * texture.itemSize;
      const size = w * h * texture.itemSize;
      const data = texture.image.data.subarray(start, start + size);

      const srcTexture = localDataTexture;
      srcTexture.image.data = data;
      srcTexture.image.width = w;
      srcTexture.image.height = h;
      srcTexture.format = texture.format;
      srcTexture.type = texture.type;

      renderer.copyTextureToTexture(position, srcTexture, texture);

      srcTexture.image.data = null;

      minX = 0;
      minY = maxY;

      pixelIndex += w * h;
      itemCount -= w * h;
    }

    // bottom
    if (itemCount > 0) {
      const x = minX;
      const y = minY;
      const w = itemCount;
      const h = 1;
      const position = localVector2D.set(x, y);
      const start = (x + y * texture.image.width) * texture.itemSize;
      const size = w * h * texture.itemSize;
      const data = texture.image.data.subarray(start, start + size);

      const srcTexture = localDataTexture;
      srcTexture.image.data = data;
      srcTexture.image.width = w;
      srcTexture.image.height = h;
      srcTexture.format = texture.format;
      srcTexture.type = texture.type;

      renderer.copyTextureToTexture(position, srcTexture, texture);

      srcTexture.image.data = null;
    }
  }
}

/* const _swapTextureAttributes = (texture, i, j, maxInstancesPerDrawCall) => {
  const {itemSize} = texture;
  const startOffset = i * maxInstancesPerDrawCall;
  const dstStart = (startOffset + j) * itemSize;
  const srcStart = (startOffset + maxInstancesPerDrawCall - 1) * itemSize;
  const count = itemSize;
  texture.image.data.copyWithin(
    dstStart,
    srcStart,
    srcStart + count
  );
};
const _swapBoundingDataSphere = (instanceBoundingData, i, j, maxInstancesPerDrawCall) => {
  const dstStart = (startOffset + j) * 4;
  const srcStart = (startOffset + maxInstancesPerDrawCall - 1) * 4;
  instanceBoundingData.copyWithin(
    dstStart,
    srcStart,
    srcStart + 4
  );
};
const _swapBoundingDataBox = (instanceBoundingData, i, j, maxInstancesPerDrawCall) => {
  const dstStart = (startOffset + j) * 6;
  const srcStart = (startOffset + maxInstancesPerDrawCall - 1) * 6;
  instanceBoundingData.copyWithin(
    dstStart,
    srcStart,
    srcStart + 6
  );
}; */
export class InstancedGeometryAllocator {
  constructor(
    instanceTextureSpecs,
    {
      maxNumGeometries,
      maxInstancesPerGeometryPerDrawCall,
      maxDrawCallsPerGeometry,
      boundingType = null,
    },
  ) {
    this.maxNumGeometries = maxNumGeometries;
    this.maxInstancesPerGeometryPerDrawCall =
      maxInstancesPerGeometryPerDrawCall;
    this.maxDrawCallsPerGeometry = maxDrawCallsPerGeometry;
    this.boundingType = boundingType;
    const totalGeometries = maxNumGeometries * maxDrawCallsPerGeometry;
    this.drawStarts = new Int32Array(totalGeometries);
    this.drawCounts = new Int32Array(totalGeometries);
    this.drawInstanceCounts = new Int32Array(totalGeometries);

    const boundingSize = getBoundingSize(boundingType);
    this.boundingData = new Float32Array(totalGeometries * boundingSize);

    this.testBoundingFn = (() => {
      if (this.boundingType === "sphere") {
        return (i, frustum) => {
          localSphere.center.fromArray(this.boundingData, i * 4);
          localSphere.radius = this.boundingData[i * 4 + 3];
          return frustum.intersectsSphere(localSphere);
        };
      } else if (this.boundingType === "box") {
        return (i, frustum) => {
          localBox.min.fromArray(this.boundingData, i * 6);
          localBox.max.fromArray(this.boundingData, i * 6 + 3);
          return frustum.intersectsBox(localBox);
        };
      } else {
        return null;
      }
    })();

    {
      this.geometry = null;
      this.geometryRegistry = new Map();

      this.texturesArray = instanceTextureSpecs.map(spec => {
        let {
          name,
          Type,
          itemSize, // note: overridden to >= 4
          customItemCount,
          // instanced = true
        } = spec;

        // compute the minimum size of a texture that can hold the data

        const itemCount =
          customItemCount ||
          maxNumGeometries *
            maxDrawCallsPerGeometry *
            maxInstancesPerGeometryPerDrawCall;
        /* if (!instanced) {
          itemCount = maxSlotsPerGeometry * numGeometries;
        } */
        // let itemCount = maxDrawCalls * maxInstancesPerDrawCall;
        /* if (isNaN(itemCount)) {
          debugger;
        } */
        let neededItems4 = itemCount;
        if (itemSize > 4) {
          neededItems4 *= itemSize / 4;
        } else {
          itemSize = 4;
        }
        const textureSizePx = Math.min(
          Math.max(
            Math.pow(2, Math.ceil(Math.log2(Math.sqrt(neededItems4)))),
            16,
          ),
          2048,
        );
        const itemSizeSnap = itemSize > 4 ? 4 : itemSize;
        // console.log('textureSizePx', name, textureSizePx, itemCount);

        const format = (() => {
          if (itemSize === 1) {
            return THREE.RedFormat;
          } else if (itemSize === 2) {
            return THREE.RGFormat;
          } else if (itemSize === 3) {
            return THREE.RGBFormat;
          } /* if (itemSize >= 4) */ else {
            return THREE.RGBAFormat;
          }
        })();
        const type = (() => {
          if (Type === Float32Array) {
            return THREE.FloatType;
          } else if (Type === Uint32Array) {
            return THREE.UnsignedIntType;
          } else if (Type === Int32Array) {
            return THREE.IntType;
          } else if (Type === Uint16Array) {
            return THREE.UnsignedShortType;
          } else if (Type === Int16Array) {
            return THREE.ShortType;
          } else if (Type === Uint8Array) {
            return THREE.UnsignedByteType;
          } else if (Type === Int8Array) {
            return THREE.ByteType;
          } else {
            throw new Error("unsupported type: " + Type);
          }
        })();

        const data = new Type(textureSizePx * textureSizePx * itemSizeSnap);
        const texture = new THREE.DataTexture(
          data,
          textureSizePx,
          textureSizePx,
          format,
          type,
        );
        texture.name = name;
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        // texture.flipY = true;
        texture.needsUpdate = true;
        texture.itemSize = itemSize;
        return texture;
      });
      this.textures = {};
      for (let i = 0; i < this.texturesArray.length; i++) {
        const textureSpec = instanceTextureSpecs[i];
        const {name} = textureSpec;
        this.textures[name] = this.texturesArray[i];
      }
      this.textureIndexes = {};
      for (let i = 0; i < this.texturesArray.length; i++) {
        const textureSpec = instanceTextureSpecs[i];
        const {name} = textureSpec;
        this.textureIndexes[name] = i;
      }

      this.freeList = new FreeList(maxNumGeometries * maxDrawCallsPerGeometry);
    }
  }

  getTextureBytePadding() {
    return 4;
  }

  setGeometries(geometries, additionalAttributeSpecs = []) {
    const geometry = new THREE.BufferGeometry();

    // attributes
    const attributeSpecs = [
      {
        name: "position",
        itemSize: 3,
      },
      {
        name: "normal",
        itemSize: 3,
      },
      {
        name: "uv",
        itemSize: 2,
      },
    ];
    for (const el of additionalAttributeSpecs) attributeSpecs.push(el);
    for (let i = 0; i < attributeSpecs.length; i++) {
      const attributeSpec = attributeSpecs[i];
      const {name, itemSize} = attributeSpec;

      let sum = 0;
      for (let i = 0; i < geometries.length; i++) {
        const lodGeometries = geometries[i];
        const lod0Geometry = lodGeometries[0];
        const attribute = lod0Geometry.attributes[name];
        sum += attribute.array.length;
      }

      const array = new Float32Array(sum);
      let index = 0;
      for (let i = 0; i < geometries.length; i++) {
        const lodGeometries = geometries[i];
        const lod0Geometry = lodGeometries[0];
        const attribute = lod0Geometry.attributes[name];
        array.set(attribute.array, index);
        index += attribute.array.length;
      }
      geometry.setAttribute(name, new THREE.BufferAttribute(array, itemSize));
    }

    // indices
    {
      let sum = 0;
      for (let i = 0; i < geometries.length; i++) {
        const lodGeometries = geometries[i];
        for (let j = 0; j < lodGeometries.length; j++) {
          const lodGeometry = lodGeometries[j];
          sum += lodGeometry.index.array.length;
        }
      }

      const index = new Uint32Array(sum);
      let positionIndex = 0;
      let indexIndex = 0;
      for (let i = 0; i < geometries.length; i++) {
        const lodGeometries = geometries[i];

        const geometryRegistryArray = Array(lodGeometries.length);
        for (let j = 0; j < lodGeometries.length; j++) {
          const lodGeometry = lodGeometries[j];
          geometryRegistryArray[j] = {
            index: {
              start: indexIndex,
              count: lodGeometry.index.array.length,
            },
          };
          for (let k = 0; k < lodGeometry.index.array.length; k++) {
            index[indexIndex + k] = lodGeometry.index.array[k] + positionIndex;
          }
          indexIndex += lodGeometry.index.array.length;
        }
        this.geometryRegistry.set(i, geometryRegistryArray);

        const lod0Geometry = lodGeometries[0];
        positionIndex += lod0Geometry.attributes.position.array.length / 3;
      }
      geometry.setIndex(new THREE.BufferAttribute(index, 1));
    }

    this.geometry = geometry;

    // console.log('set geometries', geometry, Array.from(this.geometryRegistry.values()));
  }

  setBoundingObject(boundingObject, freeListEntry) {
    if (this.boundingType === "sphere") {
      boundingObject.center.toArray(this.boundingData, freeListEntry * 4);
      this.boundingData[freeListEntry * 4 + 3] = boundingObject.radius;
    } else if (this.boundingType === "box") {
      boundingObject.min.toArray(this.boundingData, freeListEntry * 6);
      boundingObject.max.toArray(this.boundingData, freeListEntry * 6 + 3);
    }
  }

  allocDrawCall(geometryIndex, lodIndex, instanceCount, boundingObject) {
    const freeListEntry = this.freeList.alloc(1);
    const drawCall = new DrawCallBinding(geometryIndex, freeListEntry, this);

    const geometryEntry = this.geometryRegistry.get(geometryIndex);
    if (geometryEntry) {
      const geometrySpec = geometryEntry[lodIndex];
      const {
        index: {start, count},
      } = geometrySpec;

      this.drawStarts[freeListEntry] =
        start * this.geometry.index.array.BYTES_PER_ELEMENT;
      this.drawCounts[freeListEntry] = count;
      this.drawInstanceCounts[freeListEntry] = instanceCount;
      this.setBoundingObject(boundingObject, freeListEntry);
    }

    return drawCall;
  }

  freeDrawCall(drawCall) {
    const {freeListEntry} = drawCall;

    this.drawStarts[freeListEntry] = 0;
    this.drawCounts[freeListEntry] = 0;
    this.drawInstanceCounts[freeListEntry] = 0;
    if (this.boundingType === "sphere") {
      this.boundingData[freeListEntry * 4] = 0;
      this.boundingData[freeListEntry * 4 + 1] = 0;
      this.boundingData[freeListEntry * 4 + 2] = 0;
      this.boundingData[freeListEntry * 4 + 3] = 0;
    } else if (this.boundingType === "box") {
      this.boundingData[freeListEntry * 6] = 0;
      this.boundingData[freeListEntry * 6 + 1] = 0;
      this.boundingData[freeListEntry * 6 + 2] = 0;
      this.boundingData[freeListEntry * 6 + 3] = 0;
      this.boundingData[freeListEntry * 6 + 4] = 0;
      this.boundingData[freeListEntry * 6 + 5] = 0;
    }

    this.freeList.free(freeListEntry);
  }

  getInstanceCount(drawCall) {
    return this.drawInstanceCounts[drawCall.freeListEntry];
  }

  setInstanceCount(drawCall, instanceCount) {
    this.drawInstanceCounts[drawCall.freeListEntry] = instanceCount;
  }

  incrementInstanceCount(drawCall) {
    this.drawInstanceCounts[drawCall.freeListEntry]++;
  }

  decrementInstanceCount(drawCall) {
    this.drawInstanceCounts[drawCall.freeListEntry]--;
  }

  getTexture(name) {
    return this.textures[name];
  }

  getDrawSpec(
    camera,
    multiDrawStarts,
    multiDrawCounts,
    multiDrawInstanceCounts,
  ) {
    multiDrawStarts.length = this.drawStarts.length;
    multiDrawCounts.length = this.drawCounts.length;
    multiDrawInstanceCounts.length = this.drawInstanceCounts.length;

    if (this.testBoundingFn || this.testInstanceBoundingFn) {
      const projScreenMatrix = localMatrix.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      );
      localFrustum.setFromProjectionMatrix(projScreenMatrix);
    }

    for (let i = 0; i < this.drawStarts.length; i++) {
      if (!this.testBoundingFn || this.testBoundingFn(i, localFrustum)) {
        multiDrawStarts[i] = this.drawStarts[i];
        multiDrawCounts[i] = this.drawCounts[i];

        /* if (this.instanceBoundingType) {
          const startOffset = i * this.maxInstancesPerDrawCall;

          // arrange the instanced draw list :
          // - apply per-instance frustum culling
          // - swapping the bounding data into place
          // - accumulate the real instance draw count
          const maxDrawableInstances = this.drawInstanceCounts[i];
          let instancesToDraw = 0;
          for (let j = 0; j < maxDrawableInstances; j++) {
            if (!this.testInstanceBoundingFn || this.testInstanceBoundingFn(startOffset + j, localFrustum)) {
              instancesToDraw++;
            } else {
              // swap this instance with the last instance to remove it
              for (const texture of this.texturesArray) {
                _swapTextureAttributes(texture, i, j, this.maxInstancesPerDrawCall);
              }
              if (this.swapBoundingDataFn) {
                  this.swapBoundingDataFn(this.instanceBoundingData, i, j, this.maxInstancesPerDrawCall);
              }
            }
          }

          multiDrawInstanceCounts[i] = instancesToDraw;
        } else { */
        multiDrawInstanceCounts[i] = this.drawInstanceCounts[i];
        // }
      } else {
        multiDrawStarts[i] = 0;
        multiDrawCounts[i] = 0;
        multiDrawInstanceCounts[i] = 0;
      }
    }
  }
}

export class InstancedBatchedMesh extends THREE.InstancedMesh {
  constructor(geometry, material, allocator, maxInstanceCount) {
    super(geometry, material, maxInstanceCount);

    this.isBatchedMesh = true;
    this.allocator = allocator;
  }

  getDrawSpec(
    camera,
    multiDrawStarts,
    multiDrawCounts,
    multiDrawInstanceCounts,
  ) {
    this.allocator.getDrawSpec(
      camera,
      multiDrawStarts,
      multiDrawCounts,
      multiDrawInstanceCounts,
    );
  }
}