// compression utils

import DracoDecoderModule from './lib/draco/draco_decoder.js'
import DracoEncoderModule from './lib/draco/draco_encoder.js'

//

export const compressImage = async ( imageArrayBuffer ) => {
  const blob = new Blob([imageArrayBuffer])
  const imageBitmap = await createImageBitmap( blob )

  const canvas = new OffscreenCanvas( imageBitmap.width, imageBitmap.height )

  const context = canvas.getContext( '2d' )
  context.drawImage( imageBitmap, 0, 0 )
  imageBitmap.close()
  // encode as webp
  const webpBlob = await canvas.convertToBlob({
    type: 'image/webp',
    quality: 0.8,
  })
  const webpArraybuffer = await webpBlob.arrayBuffer()
  return webpArraybuffer
}

//

export const compressPointCloud = async ( vertices ) => {
  const numPoints = vertices.length / 3

  const [
    encoderModule,
    // decoderModule,
  ] = await Promise.all([
    DracoEncoderModule(),
    // DracoDecoderModule(),
  ])

  const encoder = new encoderModule.Encoder()
  const pointCloudBuilder = new encoderModule.PointCloudBuilder()
  const dracoPointCloud = new encoderModule.PointCloud()

  const positionAttribute = pointCloudBuilder.AddFloatAttribute(
    dracoPointCloud,
    encoderModule.POSITION,
    numPoints,
    3,
    vertices
  )

  const encodedData = new encoderModule.DracoInt8Array()
  // Use default encoding setting.
  const encodedLen = encoder.EncodePointCloudToDracoBuffer(
    dracoPointCloud,
    false,
    encodedData
  )
  const uint8Array = new Uint8Array( encodedLen )
  const int8Array = new Int8Array( uint8Array.buffer )
  for ( let i = 0; i < encodedLen; i++ ) {
    int8Array[i] = encodedData.GetValue( i )
  }
  const result = uint8Array

  encoderModule.destroy( encodedData )
  encoderModule.destroy( dracoPointCloud )
  encoderModule.destroy( encoder )
  encoderModule.destroy( pointCloudBuilder )

  return result
}
export const decompressPointCloud = async ( byteArray ) => {
  const [
    // encoderModule,
    decoderModule,
  ] = await Promise.all([
    // DracoEncoderModule(),
    DracoDecoderModule(),
  ])

  // Create the Draco decoder.
  const buffer = new decoderModule.DecoderBuffer()
  buffer.Init( byteArray, byteArray.length )

  // Create a buffer to hold the encoded data.
  const decoder = new decoderModule.Decoder()
  const geometryType = decoder.GetEncodedGeometryType( buffer )

  // Decode the encoded geometry.
  let outputGeometry
  let status
  if ( geometryType == decoderModule.TRIANGULAR_MESH ) {
    throw new Error(
      'decompress failed because the encoded geometry is not a point cloud'
    )
  } else {
    outputGeometry = new decoderModule.PointCloud()
    status = decoder.DecodeBufferToPointCloud( buffer, outputGeometry )
  }

  const pc = outputGeometry
  const positionAttribute = decoder.GetAttribute( pc, 0 )
  const positionAttributeData = new decoderModule.DracoFloat32Array()
  decoder.GetAttributeFloatForAllPoints(
    pc,
    positionAttribute,
    positionAttributeData
  )

  // copy data
  const float32Array = new Float32Array( positionAttributeData.size())
  for ( let i = 0; i < float32Array.length; i++ ) {
    float32Array[i] = positionAttributeData.GetValue( i )
  }

  // You must explicitly delete objects created from the DracoDecoderModule
  // or Decoder.
  decoderModule.destroy( pc )
  decoderModule.destroy( positionAttribute )
  decoderModule.destroy( positionAttributeData )
  decoderModule.destroy( decoder )
  decoderModule.destroy( buffer )

  return float32Array
}

export const compressDepthQuantized = async (
  float32Array,
  maxDepth = 10000
) => {
  const numPoints = float32Array.length

  const [
    encoderModule,
    // decoderModule,
  ] = await Promise.all([
    DracoEncoderModule(),
    // DracoDecoderModule(),
  ])

  const encoder = new encoderModule.Encoder()
  const pointCloudBuilder = new encoderModule.PointCloudBuilder()
  const dracoPointCloud = new encoderModule.PointCloud()

  encoder.SetEncodingMethod( encoderModule.POINT_CLOUD_SEQUENTIAL_ENCODING )

  // encode the floats to fit inside uint16
  const uint16Array = new Uint16Array( float32Array.length )
  for ( let i = 0; i < float32Array.length; i++ ) {
    const depth = float32Array[i]
    const encodedDepth = ( Math.round( depth ) / maxDepth ) * 65535
    uint16Array[i] = encodedDepth
  }

  const positionAttribute = pointCloudBuilder.AddUInt16Attribute(
    dracoPointCloud,
    encoderModule.POSITION,
    numPoints,
    1,
    uint16Array
  )

  const encodedData = new encoderModule.DracoInt8Array()
  const encodedLen = encoder.EncodePointCloudToDracoBuffer(
    dracoPointCloud,
    false,
    encodedData
  )
  const uint8Array = new Uint8Array( encodedLen )
  const int8Array = new Int8Array( uint8Array.buffer )
  for ( let i = 0; i < encodedLen; i++ ) {
    int8Array[i] = encodedData.GetValue( i )
  }
  const result = uint8Array

  encoderModule.destroy( encodedData )
  encoderModule.destroy( dracoPointCloud )
  encoderModule.destroy( encoder )
  encoderModule.destroy( pointCloudBuilder )

  return result
}
export const decompressDepthQuantized = async (
  byteArray,
  maxDepth = 10000
) => {
  const [
    // encoderModule,
    decoderModule,
  ] = await Promise.all([
    // DracoEncoderModule(),
    DracoDecoderModule(),
  ])

  // Create the Draco decoder.
  const buffer = new decoderModule.DecoderBuffer()
  buffer.Init( byteArray, byteArray.length )

  // Create a buffer to hold the encoded data.
  const decoder = new decoderModule.Decoder()
  const geometryType = decoder.GetEncodedGeometryType( buffer )

  // Decode the encoded geometry.
  let outputGeometry
  let status
  if ( geometryType == decoderModule.TRIANGULAR_MESH ) {
    throw new Error(
      'decompress failed because the encoded geometry is not a point cloud'
    )
  } else {
    outputGeometry = new decoderModule.PointCloud()
    status = decoder.DecodeBufferToPointCloud( buffer, outputGeometry )
  }

  if ( !status.ok()) {
    const pc = outputGeometry
    const positionAttribute = decoder.GetAttribute( pc, 0 )
    const positionAttributeData = new decoderModule.DracoUInt16Array()
    decoder.GetAttributeUInt16ForAllPoints(
      pc,
      positionAttribute,
      positionAttributeData
    )

    // decode back to float32
    const float32Array = new Float32Array( positionAttributeData.size())
    for ( let i = 0; i < float32Array.length; i++ ) {
      const encodedDepth = positionAttributeData.GetValue( i )
      const depth = ( encodedDepth / 65535 ) * maxDepth
      float32Array[i] = depth
    }

    // You must explicitly delete objects created from the DracoDecoderModule
    // or Decoder.
    decoderModule.destroy( pc )
    decoderModule.destroy( positionAttribute )
    decoderModule.destroy( positionAttributeData )
    decoderModule.destroy( decoder )
    decoderModule.destroy( buffer )

    return float32Array
  } else {
    throw new Error( 'decompress failed' )
  }
}

export const compressDepth = async ( float32Array, quantization = -1 ) => {
  const numPoints = float32Array.length

  const [
    encoderModule,
    // decoderModule,
  ] = await Promise.all([
    DracoEncoderModule(),
    // DracoDecoderModule(),
  ])

  const encoder = new encoderModule.Encoder()
  const pointCloudBuilder = new encoderModule.PointCloudBuilder()
  const dracoPointCloud = new encoderModule.PointCloud()

  encoder.SetEncodingMethod( encoderModule.POINT_CLOUD_SEQUENTIAL_ENCODING )
  if ( quantization !== -1 ) {
    encoder.SetAttributeQuantization( encoderModule.POSITION, quantization )
    encoder.SetAttributeQuantization( encoderModule.GENERIC, quantization )
  }

  const positionAttribute = pointCloudBuilder.AddFloatAttribute(
    dracoPointCloud,
    encoderModule.POSITION,
    numPoints,
    1,
    float32Array
  )

  const encodedData = new encoderModule.DracoInt8Array()
  const encodedLen = encoder.EncodePointCloudToDracoBuffer(
    dracoPointCloud,
    false,
    encodedData
  )
  const uint8Array = new Uint8Array( encodedLen )
  const int8Array = new Int8Array( uint8Array.buffer )
  for ( let i = 0; i < encodedLen; i++ ) {
    int8Array[i] = encodedData.GetValue( i )
  }
  const result = uint8Array

  encoderModule.destroy( encodedData )
  encoderModule.destroy( dracoPointCloud )
  encoderModule.destroy( encoder )
  encoderModule.destroy( pointCloudBuilder )

  return result
}
export const decompressDepth = async ( byteArray ) => {
  const [decoderModule] = await Promise.all([DracoDecoderModule()])

  // Create the Draco decoder.
  const buffer = new decoderModule.DecoderBuffer()
  buffer.Init( byteArray, byteArray.length )

  // Create a buffer to hold the encoded data.
  const decoder = new decoderModule.Decoder()
  const geometryType = decoder.GetEncodedGeometryType( buffer )

  // Decode the encoded geometry.
  let outputGeometry
  let status
  if ( geometryType == decoderModule.TRIANGULAR_MESH ) {
    throw new Error(
      'decompress failed because the encoded geometry is not a point cloud'
    )
  } else {
    outputGeometry = new decoderModule.PointCloud()
    status = decoder.DecodeBufferToPointCloud( buffer, outputGeometry )
  }

  if ( status.ok()) {
    const pc = outputGeometry
    const positionAttribute = decoder.GetAttribute( pc, 0 )
    const positionAttributeData = new decoderModule.DracoFloat32Array()
    decoder.GetAttributeFloatForAllPoints(
      pc,
      positionAttribute,
      positionAttributeData
    )

    // copy data
    const float32Array = new Float32Array( positionAttributeData.size())
    for ( let i = 0; i < float32Array.length; i++ ) {
      float32Array[i] = positionAttributeData.GetValue( i )
    }

    // You must explicitly delete objects created from the DracoDecoderModule
    // or Decoder.
    decoderModule.destroy( pc )
    decoderModule.destroy( positionAttribute )
    decoderModule.destroy( positionAttributeData )
    decoderModule.destroy( decoder )
    decoderModule.destroy( buffer )

    return float32Array
  } else {
    throw new Error( 'decompress failed' )
  }
}
const compressionRatioString = ( encoded, raw ) =>
  (( encoded.byteLength / raw.byteLength ) * 100 ).toFixed( 2 ) + '%'

export const compressByteAttribute = async ( byteAttribute ) => {
  const numPoints = byteAttribute.length

  const [encoderModule] = await Promise.all([DracoEncoderModule()])

  const encoder = new encoderModule.Encoder()
  const pointCloudBuilder = new encoderModule.PointCloudBuilder()
  const dracoPointCloud = new encoderModule.PointCloud()

  encoder.SetEncodingMethod( encoderModule.POINT_CLOUD_SEQUENTIAL_ENCODING )
  encoder.SetAttributeQuantization( encoderModule.POSITION, 0 )
  encoder.SetAttributeQuantization( encoderModule.GENERIC, 0 )

  const positionAttribute = pointCloudBuilder.AddUInt8Attribute(
    dracoPointCloud,
    encoderModule.POSITION,
    numPoints,
    1,
    byteAttribute
  )

  const encodedData = new encoderModule.DracoInt8Array()
  // Use default encoding setting.
  const encodedLen = encoder.EncodePointCloudToDracoBuffer(
    dracoPointCloud,
    false,
    encodedData
  )
  const uint8Array = new Uint8Array( encodedLen )
  const int8Array = new Int8Array( uint8Array.buffer )
  // const int8Array = new Int8Array(encodedLen);
  for ( let i = 0; i < encodedLen; i++ ) {
    int8Array[i] = encodedData.GetValue( i )
  }
  const result = uint8Array
  // const result = int8Array;

  encoderModule.destroy( encodedData )
  encoderModule.destroy( dracoPointCloud )
  encoderModule.destroy( encoder )
  encoderModule.destroy( pointCloudBuilder )

  return result
}
export const decompressByteAttribute = async ( byteArray ) => {
  const [
    // encoderModule,
    decoderModule,
  ] = await Promise.all([
    // DracoEncoderModule(),
    DracoDecoderModule(),
  ])

  // Create the Draco decoder.
  const buffer = new decoderModule.DecoderBuffer()
  buffer.Init( byteArray, byteArray.length )

  // Create a buffer to hold the encoded data.
  const decoder = new decoderModule.Decoder()
  const geometryType = decoder.GetEncodedGeometryType( buffer )

  // Decode the encoded geometry.
  let outputGeometry
  let status
  if ( geometryType == decoderModule.TRIANGULAR_MESH ) {
    throw new Error(
      'decompress failed because the encoded geometry is not a point cloud'
    )
  } else {
    outputGeometry = new decoderModule.PointCloud()
    status = decoder.DecodeBufferToPointCloud( buffer, outputGeometry )
  }

  const pc = outputGeometry
  const positionAttribute = decoder.GetAttribute( pc, 0 )
  const positionAttributeData = new decoderModule.DracoUInt8Array()
  decoder.GetAttributeUInt8ForAllPoints(
    pc,
    positionAttribute,
    positionAttributeData
  )

  // copy data
  const uint8Array = new Uint8Array( positionAttributeData.size())
  for ( let i = 0; i < uint8Array.length; i++ ) {
    uint8Array[i] = positionAttributeData.GetValue( i )
  }

  // You must explicitly delete objects created from the DracoDecoderModule
  // or Decoder.
  decoderModule.destroy( pc )
  decoderModule.destroy( positionAttribute )
  decoderModule.destroy( positionAttributeData )
  decoderModule.destroy( decoder )
  decoderModule.destroy( buffer )

  return uint8Array
}

/**
 *
 * @param chunks
 */
function mergeChunks( chunks ) {
  const result = new Uint8Array( chunks.reduce(( a, b ) => a + b.byteLength, 0 ))
  let offset = 0
  for ( const chunk of chunks ) {
    result.set( chunk, offset )
    offset += chunk.byteLength
  }
  return result
}
const makeReadableStream = ( array ) =>
  new ReadableStream({
    pull( controller ) {
      for ( let i = 0; i < array.length; i++ ) {
        controller.enqueue( array[i])
      }
      controller.close()
    },
  })
export const compressGeneric = async ( data ) => {
  const s = makeReadableStream([data]).pipeThrough(
    new CompressionStream( 'gzip' )
  )
  const reader = s.getReader()
  const chunks = []
  while ( true ) {
    const { value, done } = await reader.read()
    if ( done ) {
      break
    }
    chunks.push( value )
  }
  return mergeChunks( chunks )
}
export const decompressGeneric = async ( data ) => {
  const s = makeReadableStream([data]).pipeThrough(
    new DecompressionStream( 'gzip' )
  )
  const reader = s.getReader()
  const chunks = []
  while ( true ) {
    const { value, done } = await reader.read()
    if ( done ) {
      break
    }
    chunks.push( value )
  }
  return mergeChunks( chunks )
}
