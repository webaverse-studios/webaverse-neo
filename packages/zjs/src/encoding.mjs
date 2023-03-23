import { align4 } from './util.mjs'

const HTMLImageElement =
  typeof window !== 'undefined' ? window.HTMLImageElement : function () {}
const HTMLCanvasElement =
  typeof window !== 'undefined' ? window.HTMLCanvasElement : function () {}
const ImageData =
  typeof window !== 'undefined' ? window.ImageData : function () {}
const ImageBitmap =
  typeof window !== 'undefined' ? window.ImageBitmap : function () {}

const ADDENDUM_TYPES = (() => {
  let iota = 0
  const result = new Map()
  result.set( Uint8Array, ++iota )
  result.set( Uint16Array, ++iota )
  result.set( Uint32Array, ++iota )
  result.set( Int8Array, ++iota )
  result.set( Int16Array, ++iota )
  result.set( Int32Array, ++iota )
  result.set( Float32Array, ++iota )
  result.set( Float64Array, ++iota )
  result.set( ArrayBuffer, ++iota )

  const imageIota = ++iota
  result.set( HTMLImageElement, imageIota )
  result.set( HTMLCanvasElement, imageIota )
  result.set( ImageData, imageIota )
  result.set( ImageBitmap, imageIota )

  return result
})()

const ADDENDUM_CONSTRUCTORS = (() => {
  const _construct = ( constructor ) => ( buffer, offset, byteLength ) =>
    new constructor(
      buffer,
      offset,
      byteLength / constructor.BYTES_PER_ELEMENT
    )
  return [
    null, // start at 1
    _construct( Uint8Array ),
    _construct( Uint16Array ),
    _construct( Uint32Array ),
    _construct( Int8Array ),
    _construct( Int16Array ),
    _construct( Int32Array ),
    _construct( Float32Array ),
    _construct( Float64Array ),
    ( buffer, offset, byteLength ) =>
      buffer.slice( offset, offset + byteLength ), // ArrayBuffer
    ( buffer, offset, byteLength ) => {
      // ImageData
      const dataView = new DataView( buffer, offset, byteLength )
      const width = dataView.getUint32( 0, true )
      const height = dataView.getUint32( 4, true )
      const data = new Uint8ClampedArray( buffer, offset + 8, byteLength - 8 )
      const imageData = new ImageData( data, width, height )
      return imageData
    },
  ]
})()

const ADDENDUM_SERIALIZERS = (() => {
  const _serializedTypedArray = ( typedArray, uint8Array, index ) => {
    uint8Array.set(
      new Uint8Array(
        typedArray.buffer,
        typedArray.byteOffset,
        typedArray.byteLength
      ),
      index
    )
  }
  _serializedTypedArray.normalize = ( a ) => a
  _serializedTypedArray.getSize = ( typedArray ) => typedArray.byteLength

  const _serializeArrayBuffer = ( arrayBuffer, uint8Array, index ) => {
    uint8Array.set( new Uint8Array( arrayBuffer ), index )
  }
  _serializeArrayBuffer.normalize = ( a ) => a
  _serializeArrayBuffer.getSize = ( arrayBuffer ) => arrayBuffer.byteLength

  const _serializeImage = ( imageData, uint8Array, index ) => {
    const dataView = new DataView( uint8Array.buffer, index )
    dataView.setUint32( 0, imageData.width, true )
    dataView.setUint32( 4, imageData.height, true )
    const srcData = new Uint8Array(
      imageData.data.buffer,
      imageData.data.byteOffset,
      imageData.data.byteLength
    )
    uint8Array.set( srcData, index + 8 )
  }
  _serializeImage.normalize = ( image ) => {
    if ( !( image instanceof ImageData )) {
      // draw to canvas to convert to ImageData
      const canvas = document.createElement( 'canvas' )
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext( '2d' )
      context.drawImage( image, 0, 0 )
      image = context.getImageData( 0, 0, image.width, image.height )
    }
    return image
  }
  _serializeImage.getSize = ( imageData ) => {
    const size = 8 + imageData.data.byteLength
    return size
  }

  return [
    null, // start at 1
    _serializedTypedArray, // Uint8Array
    _serializedTypedArray, // Uint16Array
    _serializedTypedArray, // Uint32Array
    _serializedTypedArray, // Int8Array
    _serializedTypedArray, // Int16Array
    _serializedTypedArray, // Int32Array
    _serializedTypedArray, // Float32Array
    _serializedTypedArray, // Float64Array
    _serializeArrayBuffer, // ArrayBuffer
    _serializeImage, // ImageData
  ]
})()

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
let textUint8Array = new Uint8Array( 4 * 1024 * 1024 ) // 4 MB

const encodableConstructors = [
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Float32Array,
  Float64Array,
  ArrayBuffer,
  HTMLImageElement,
  HTMLCanvasElement,
  ImageData,
  ImageBitmap,
]
const _isAddendumEncodable = ( o ) =>
  encodableConstructors.includes( o?.constructor )
const nullUint8Array = textEncoder.encode( 'null' )
/**
 * zbencode
 *
 * @param {object} o
 */
function zbencode( o ) {
  const addendums = []
  const addendumIndexes = []
  const addendumTypes = []
  const _getSb = () => {
    if ( _isAddendumEncodable( o )) {
      // common fast path
      addendums.push( o )
      addendumIndexes.push( 1 )
      addendumTypes.push( ADDENDUM_TYPES.get( o.constructor ))
      return nullUint8Array
    } else {
      let recursionIndex = 0
      const _recurseExtractAddendums = ( o ) => {
        recursionIndex++
        if ( _isAddendumEncodable( o )) {
          addendums.push( o )
          addendumIndexes.push( recursionIndex )
          const addendumType = ADDENDUM_TYPES.get( o.constructor )
          addendumTypes.push( addendumType )
          return null
        } else {
          return o
        }
      }
      const s = JSON.stringify( o, function ( k, v ) {
        return _recurseExtractAddendums( v )
      })
      let result
      for ( ;; ) {
        result = textEncoder.encodeInto( s, textUint8Array )
        if ( result.read === s.length ) {
          break
        } else {
          textUint8Array = new Uint8Array( textUint8Array.length * 2 )
          console.warn( 'zjs: resizing buffer' )
        }
      }
      return textUint8Array.subarray( 0, result.written )
    }
  }
  const sb = _getSb()

  let totalSize = 0
  totalSize += Uint32Array.BYTES_PER_ELEMENT // length
  totalSize += sb.byteLength // data
  totalSize = align4( totalSize )
  totalSize += Uint32Array.BYTES_PER_ELEMENT // count
  for ( let i = 0; i < addendums.length; i++ ) {
    const addendum = addendums[i]

    totalSize += Uint32Array.BYTES_PER_ELEMENT // index
    totalSize += Uint32Array.BYTES_PER_ELEMENT // type
    totalSize += Uint32Array.BYTES_PER_ELEMENT // length

    // totalSize += addendum.byteLength; // data
    const addendumType = addendumTypes[i]
    const Serializer = ADDENDUM_SERIALIZERS[addendumType]
    const normalizedAddendum = Serializer.normalize( addendum )
    addendums[i] = normalizedAddendum
    const addendumByteLength = Serializer.getSize( normalizedAddendum )
    totalSize += align4( addendumByteLength )
  }

  const ab = new ArrayBuffer( totalSize )
  const uint8Array = new Uint8Array( ab )
  const dataView = new DataView( ab )
  {
    let index = 0
    // sb
    {
      dataView.setUint32( index, sb.byteLength, true )
      index += Uint32Array.BYTES_PER_ELEMENT

      uint8Array.set( sb, index )
      index += sb.byteLength
      index = align4( index )
    }
    // addendums
    dataView.setUint32( index, addendums.length, true )
    index += Uint32Array.BYTES_PER_ELEMENT
    for ( let i = 0; i < addendums.length; i++ ) {
      const addendum = addendums[i]
      const addendumIndex = addendumIndexes[i]
      const addendumType = addendumTypes[i]

      dataView.setUint32( index, addendumIndex, true )
      index += Uint32Array.BYTES_PER_ELEMENT

      dataView.setUint32( index, addendumType, true )
      index += Uint32Array.BYTES_PER_ELEMENT

      const Serializer = ADDENDUM_SERIALIZERS[addendumType]
      const addendumByteLength = Serializer.getSize( addendum )

      dataView.setUint32( index, addendumByteLength, true )
      index += Uint32Array.BYTES_PER_ELEMENT

      Serializer( addendum, uint8Array, index )
      index += align4( addendumByteLength )
    }
  }
  return uint8Array
}

/**
 * zbdecode
 *
 * @param {Uint8Array} uint8Array
 */
function zbdecode( uint8Array ) {
  const dataView = new DataView(
    uint8Array.buffer,
    uint8Array.byteOffset,
    uint8Array.byteLength
  )

  let index = 0
  const sbLength = dataView.getUint32( index, true )
  index += Uint32Array.BYTES_PER_ELEMENT

  const buffer = new Uint8Array(
    uint8Array.buffer,
    uint8Array.byteOffset + index,
    sbLength
  )
  index += sbLength
  index = align4( index )
  const decodedString = textDecoder.decode( buffer )
  let json = JSON.parse( decodedString )

  const numAddendums = dataView.getUint32( index, true )
  index += Uint32Array.BYTES_PER_ELEMENT

  const addendums = Array( numAddendums )
  const addendumIndexes = Array( numAddendums )
  const addendumTypes = Array( numAddendums )

  for ( let i = 0; i < numAddendums; i++ ) {
    const addendumIndex = dataView.getUint32( index, true )
    index += Uint32Array.BYTES_PER_ELEMENT

    const addendumType = dataView.getUint32( index, true )
    index += Uint32Array.BYTES_PER_ELEMENT

    const addendumByteLength = dataView.getUint32( index, true )
    index += Uint32Array.BYTES_PER_ELEMENT

    const TypedArrayCons = ADDENDUM_CONSTRUCTORS[addendumType]
    const addendum = TypedArrayCons(
      uint8Array.buffer,
      uint8Array.byteOffset + index,
      addendumByteLength
    )
    index += addendumByteLength
    index = align4( index )

    addendums[i] = addendum
    addendumIndexes[i] = addendumIndex
    addendumTypes[i] = addendumType
  }

  {
    let recursionIndex = 0
    let currentAddendum = 0
    const _recurseBindAddendums = ( obj ) => {
      recursionIndex++

      const addendumIndex = addendumIndexes[currentAddendum]
      if ( addendumIndex === recursionIndex ) {
        const addendum = addendums[currentAddendum]
        currentAddendum++
        return addendum
      }

      if ( Array.isArray( obj )) {
        for ( let i = 0; i < obj.length; i++ ) {
          const addendum = _recurseBindAddendums( obj[i])
          if ( addendum ) {
            obj[i] = addendum
          }
        }
      } else if ( typeof obj === 'object' && obj !== null ) {
        for ( const k in obj ) {
          const addendum = _recurseBindAddendums( obj[k])
          if ( addendum ) {
            obj[k] = addendum
          }
        }
      }

      return null
    }

    const j2 = _recurseBindAddendums( json )
    if ( j2 ) {
      json = j2
    }

    if ( currentAddendum !== addendums.length ) {
      console.warn(
        'did not bind all addendums',
        json,
        currentAddendum,
        addendums
      )
    }

    return json
  }
}

/**
 * zbclone
 *
 * @param {object} obj object to clone
 * @returns {object} cloned object
 */
function zbclone( obj ) {
  return zbdecode( zbencode( obj ))
}

export { zbencode, zbdecode, zbclone }
