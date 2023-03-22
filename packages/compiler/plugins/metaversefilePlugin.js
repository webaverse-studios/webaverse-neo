/* eslint-disable no-console */
/* eslint-disable max-statements */
/* eslint-disable max-len */

import { createHash } from 'crypto'
import path from 'path'

import mimeTypes from 'mime-types'
import postcss from 'postcss'
import cssModules from 'postcss-modules'

import contracts from '../contracts'
import loaders from '../loaders'
import { absoluteImportRegex, getCwd, httpsRegex, readFile } from '../utils'

/**
 * @typedef {object} MetaverseFilePluigin
 * @property {string} name name of the plugin
 * @property {string} enforce enforce ??
 * @property {(source: string, importer: any) => Promise<string>} resolveId resolve an import specifier to an absolute path
 * @property {(id: string) => Promise<{code: string}>} load load a file
 */

const contractNames = {
  '0x79986af15539de2db9a5086382daeda917a9cf0c': 'cryptovoxels',
  '0x1dfe7ca09e99d10835bf73044a23b73fc20623df': 'moreloot',
  '0x1d20a51f088492a0f1c57f047a9e30c9ab5c07ea': 'loomlock',
}

const dataUrlRegex =
  /^data:([^;,]+)(?:;(charset=utf-8|base64))?,([\s\S]*?)\.data$/

const dataUrlRegexNoSuffix =
  /^data:([^;,]+)(?:;(charset=utf-8|base64))?,([\s\S]*?)$/

/**
 * @type {Object<string, MetaverseFilePluigin>}
 */
const mappedModules = {
  metaversefile: {
    resolveId( source ) {
      return `/@map/${source}`
    },
    load( _id ) {
      return {
        code: `\
          const {metaversefile} = globalThis.Metaversefile.exports;
          export default metaversefile;
        `,
      }
    },
  },
  three: {
    resolveId( source ) {
      return `/@map/${source}`
    },
    load( _id ) {
      return {
        // code: `import * as THREE from '/public/three.module.js';`,
        code: `\
          const {THREE} = globalThis.Metaversefile.exports;
          const { ACESFilmicToneMapping, AddEquation, AddOperation, AdditiveAnimationBlendMode, AdditiveBlending, AlphaFormat, AlwaysDepth, AlwaysStencilFunc, AmbientLight, AmbientLightProbe, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, AnimationUtils, ArcCurve, ArrayCamera, ArrowHelper, Audio, AudioAnalyser, AudioContext, AudioListener, AudioLoader, AxesHelper, BackSide, BasicDepthPacking, BasicShadowMap, Bone, BooleanKeyframeTrack, Box2, Box3, Box3Helper, BoxBufferGeometry, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, ByteType, Cache, Camera, CameraHelper, CanvasTexture, CapsuleBufferGeometry, CapsuleGeometry, CatmullRomCurve3, CineonToneMapping, CircleBufferGeometry, CircleGeometry, ClampToEdgeWrapping, Clock, Color, ColorKeyframeTrack, ColorManagement, CompressedTexture, CompressedTextureLoader, ConeBufferGeometry, ConeGeometry, CubeCamera, CubeReflectionMapping, CubeRefractionMapping, CubeTexture, CubeTextureLoader, CubeUVReflectionMapping, CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, CullFaceBack, CullFaceFront, CullFaceFrontBack, CullFaceNone, Curve, CurvePath, CustomBlending, CustomToneMapping, CylinderBufferGeometry, CylinderGeometry, Cylindrical, Data3DTexture, DataArrayTexture, DataTexture, DataTexture2DArray, DataTexture3D, DataTextureLoader, DataUtils, DecrementStencilOp, DecrementWrapStencilOp, DefaultLoadingManager, DepthFormat, DepthStencilFormat, DepthTexture, DirectionalLight, DirectionalLightHelper, DiscreteInterpolant, DodecahedronBufferGeometry, DodecahedronGeometry, DoubleSide, DstAlphaFactor, DstColorFactor, DynamicCopyUsage, DynamicDrawUsage, DynamicReadUsage, EdgesGeometry, EllipseCurve, EqualDepth, EqualStencilFunc, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Euler, EventDispatcher, ExtrudeBufferGeometry, ExtrudeGeometry, FileLoader, FlatShading, Float16BufferAttribute, Float32BufferAttribute, Float64BufferAttribute, FloatType, Fog, FogExp2, Font, FontLoader, FramebufferTexture, FrontSide, Frustum, GLBufferAttribute, GLSL1, GLSL3, GreaterDepth, GreaterEqualDepth, GreaterEqualStencilFunc, GreaterStencilFunc, GridHelper, Group, HalfFloatType, HemisphereLight, HemisphereLightHelper, HemisphereLightProbe, IcosahedronBufferGeometry, IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, ImmediateRenderObject, IncrementStencilOp, IncrementWrapStencilOp, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16BufferAttribute, Int32BufferAttribute, Int8BufferAttribute, IntType, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, InvertStencilOp, KeepStencilOp, KeyframeTrack, LOD, LatheBufferGeometry, LatheGeometry, Layers, LessDepth, LessEqualDepth, LessEqualStencilFunc, LessStencilFunc, Light, LightProbe, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop, LineSegments, LinearEncoding, LinearFilter, LinearInterpolant, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, LinearSRGBColorSpace, LinearToneMapping, Loader, LoaderUtils, LoadingManager, LoopOnce, LoopPingPong, LoopRepeat, LuminanceAlphaFormat, LuminanceFormat, MOUSE, Material, MaterialLoader, MathUtils, Matrix3, Matrix4, MaxEquation, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, MinEquation, MirroredRepeatWrapping, MixOperation, MultiplyBlending, MultiplyOperation, NearestFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, NeverDepth, NeverStencilFunc, NoBlending, NoColorSpace, NoToneMapping, NormalAnimationBlendMode, NormalBlending, NotEqualDepth, NotEqualStencilFunc, NumberKeyframeTrack, Object3D, ObjectLoader, ObjectSpaceNormalMap, OctahedronBufferGeometry, OctahedronGeometry, OneFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, OrthographicCamera, PCFShadowMap, PCFSoftShadowMap, PMREMGenerator, ParametricGeometry, Path, PerspectiveCamera, Plane, PlaneBufferGeometry, PlaneGeometry, PlaneHelper, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronBufferGeometry, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack, QuaternionLinearInterpolant, REVISION, RGBADepthPacking, RGBAFormat, RGBAIntegerFormat, RGBA_ASTC_10x10_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_BPTC_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGBFormat, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, RGFormat, RGIntegerFormat, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RedFormat, RedIntegerFormat, ReinhardToneMapping, RepeatWrapping, ReplaceStencilOp, ReverseSubtractEquation, RingBufferGeometry, RingGeometry, SRGBColorSpace, Scene, ShaderChunk, ShaderLib, ShaderMaterial, ShadowMaterial, Shape, ShapeBufferGeometry, ShapeGeometry, ShapePath, ShapeUtils, ShortType, Skeleton, SkeletonHelper, SkinnedMesh, SmoothShading, Source, Sphere, SphereBufferGeometry, SphereGeometry, Spherical, SphericalHarmonics3, SplineCurve, SpotLight, SpotLightHelper, Sprite, SpriteMaterial, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, StaticCopyUsage, StaticDrawUsage, StaticReadUsage, StereoCamera, StreamCopyUsage, StreamDrawUsage, StreamReadUsage, StringKeyframeTrack, SubtractEquation, SubtractiveBlending, TOUCH, TangentSpaceNormalMap, TetrahedronBufferGeometry, TetrahedronGeometry, TextGeometry, Texture, TextureLoader, TorusBufferGeometry, TorusGeometry, TorusKnotBufferGeometry, TorusKnotGeometry, Triangle, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode, TubeBufferGeometry, TubeGeometry, UVMapping, Uint16BufferAttribute, Uint32BufferAttribute, Uint8BufferAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsGroup, UniformsLib, UniformsUtils, UnsignedByteType, UnsignedInt248Type, UnsignedIntType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShortType, VSMShadowMap, Vector2, Vector3, Vector4, VectorKeyframeTrack, VideoTexture, WebGL1Renderer, WebGL3DRenderTarget, WebGLArrayRenderTarget, WebGLCubeRenderTarget, WebGLMultipleRenderTargets, WebGLMultisampleRenderTarget, WebGLRenderTarget, WebGLRenderer, WebGLUtils, WireframeGeometry, WrapAroundEnding, ZeroCurvatureEnding, ZeroFactor, ZeroSlopeEnding, ZeroStencilOp, _SRGBAFormat, sRGBEncoding } = THREE;
          export { ACESFilmicToneMapping, AddEquation, AddOperation, AdditiveAnimationBlendMode, AdditiveBlending, AlphaFormat, AlwaysDepth, AlwaysStencilFunc, AmbientLight, AmbientLightProbe, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, AnimationUtils, ArcCurve, ArrayCamera, ArrowHelper, Audio, AudioAnalyser, AudioContext, AudioListener, AudioLoader, AxesHelper, BackSide, BasicDepthPacking, BasicShadowMap, Bone, BooleanKeyframeTrack, Box2, Box3, Box3Helper, BoxBufferGeometry, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, ByteType, Cache, Camera, CameraHelper, CanvasTexture, CapsuleBufferGeometry, CapsuleGeometry, CatmullRomCurve3, CineonToneMapping, CircleBufferGeometry, CircleGeometry, ClampToEdgeWrapping, Clock, Color, ColorKeyframeTrack, ColorManagement, CompressedTexture, CompressedTextureLoader, ConeBufferGeometry, ConeGeometry, CubeCamera, CubeReflectionMapping, CubeRefractionMapping, CubeTexture, CubeTextureLoader, CubeUVReflectionMapping, CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, CullFaceBack, CullFaceFront, CullFaceFrontBack, CullFaceNone, Curve, CurvePath, CustomBlending, CustomToneMapping, CylinderBufferGeometry, CylinderGeometry, Cylindrical, Data3DTexture, DataArrayTexture, DataTexture, DataTexture2DArray, DataTexture3D, DataTextureLoader, DataUtils, DecrementStencilOp, DecrementWrapStencilOp, DefaultLoadingManager, DepthFormat, DepthStencilFormat, DepthTexture, DirectionalLight, DirectionalLightHelper, DiscreteInterpolant, DodecahedronBufferGeometry, DodecahedronGeometry, DoubleSide, DstAlphaFactor, DstColorFactor, DynamicCopyUsage, DynamicDrawUsage, DynamicReadUsage, EdgesGeometry, EllipseCurve, EqualDepth, EqualStencilFunc, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Euler, EventDispatcher, ExtrudeBufferGeometry, ExtrudeGeometry, FileLoader, FlatShading, Float16BufferAttribute, Float32BufferAttribute, Float64BufferAttribute, FloatType, Fog, FogExp2, Font, FontLoader, FramebufferTexture, FrontSide, Frustum, GLBufferAttribute, GLSL1, GLSL3, GreaterDepth, GreaterEqualDepth, GreaterEqualStencilFunc, GreaterStencilFunc, GridHelper, Group, HalfFloatType, HemisphereLight, HemisphereLightHelper, HemisphereLightProbe, IcosahedronBufferGeometry, IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, ImmediateRenderObject, IncrementStencilOp, IncrementWrapStencilOp, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16BufferAttribute, Int32BufferAttribute, Int8BufferAttribute, IntType, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, InvertStencilOp, KeepStencilOp, KeyframeTrack, LOD, LatheBufferGeometry, LatheGeometry, Layers, LessDepth, LessEqualDepth, LessEqualStencilFunc, LessStencilFunc, Light, LightProbe, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop, LineSegments, LinearEncoding, LinearFilter, LinearInterpolant, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, LinearSRGBColorSpace, LinearToneMapping, Loader, LoaderUtils, LoadingManager, LoopOnce, LoopPingPong, LoopRepeat, LuminanceAlphaFormat, LuminanceFormat, MOUSE, Material, MaterialLoader, MathUtils, Matrix3, Matrix4, MaxEquation, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, MinEquation, MirroredRepeatWrapping, MixOperation, MultiplyBlending, MultiplyOperation, NearestFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, NeverDepth, NeverStencilFunc, NoBlending, NoColorSpace, NoToneMapping, NormalAnimationBlendMode, NormalBlending, NotEqualDepth, NotEqualStencilFunc, NumberKeyframeTrack, Object3D, ObjectLoader, ObjectSpaceNormalMap, OctahedronBufferGeometry, OctahedronGeometry, OneFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, OrthographicCamera, PCFShadowMap, PCFSoftShadowMap, PMREMGenerator, ParametricGeometry, Path, PerspectiveCamera, Plane, PlaneBufferGeometry, PlaneGeometry, PlaneHelper, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronBufferGeometry, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack, QuaternionLinearInterpolant, REVISION, RGBADepthPacking, RGBAFormat, RGBAIntegerFormat, RGBA_ASTC_10x10_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_BPTC_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGBFormat, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, RGFormat, RGIntegerFormat, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RedFormat, RedIntegerFormat, ReinhardToneMapping, RepeatWrapping, ReplaceStencilOp, ReverseSubtractEquation, RingBufferGeometry, RingGeometry, SRGBColorSpace, Scene, ShaderChunk, ShaderLib, ShaderMaterial, ShadowMaterial, Shape, ShapeBufferGeometry, ShapeGeometry, ShapePath, ShapeUtils, ShortType, Skeleton, SkeletonHelper, SkinnedMesh, SmoothShading, Source, Sphere, SphereBufferGeometry, SphereGeometry, Spherical, SphericalHarmonics3, SplineCurve, SpotLight, SpotLightHelper, Sprite, SpriteMaterial, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, StaticCopyUsage, StaticDrawUsage, StaticReadUsage, StereoCamera, StreamCopyUsage, StreamDrawUsage, StreamReadUsage, StringKeyframeTrack, SubtractEquation, SubtractiveBlending, TOUCH, TangentSpaceNormalMap, TetrahedronBufferGeometry, TetrahedronGeometry, TextGeometry, Texture, TextureLoader, TorusBufferGeometry, TorusGeometry, TorusKnotBufferGeometry, TorusKnotGeometry, Triangle, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode, TubeBufferGeometry, TubeGeometry, UVMapping, Uint16BufferAttribute, Uint32BufferAttribute, Uint8BufferAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsGroup, UniformsLib, UniformsUtils, UnsignedByteType, UnsignedInt248Type, UnsignedIntType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShortType, VSMShadowMap, Vector2, Vector3, Vector4, VectorKeyframeTrack, VideoTexture, WebGL1Renderer, WebGL3DRenderTarget, WebGLArrayRenderTarget, WebGLCubeRenderTarget, WebGLMultipleRenderTargets, WebGLMultisampleRenderTarget, WebGLRenderTarget, WebGLRenderer, WebGLUtils, WireframeGeometry, WrapAroundEnding, ZeroCurvatureEnding, ZeroFactor, ZeroSlopeEnding, ZeroStencilOp, _SRGBAFormat, sRGBEncoding };
          // export default THREE;
        `,
      }
    },
  },
  react: {
    resolveId( source ) {
      // return source;
      return `/@map/${source}`
    },
    load( _id ) {
      return {
        code: `\
          const {React} = globalThis.Metaversefile.exports;
          const {forwardRef, createContext, createElement, Fragment, Children, isValidElement, cloneElement, memo, Component, useEffect, useState, useRef, useLayoutEffect, useMemo, useCallback, useContext, useReducer, useImperativeHandle, useDebugValue} = React;
          export {forwardRef, createContext, createElement, Fragment, Children, isValidElement, cloneElement, memo, Component, React, useEffect, useState, useRef, useLayoutEffect, useMemo, useCallback, useContext, useReducer, useImperativeHandle, useDebugValue};
          export default React;
        `,
      }
    },
  },
}

/**
 * Metafile plugin
 *
 * @returns {MetaverseFilePluigin} Plugin
 */
export default function metaversefilePlugin() {
  return {
    name: 'metaversefile',
    enforce: 'pre',
    async resolveId( source, importer ) {
      const mappedModule = mappedModules[source]
      if ( mappedModule ) {
        return mappedModule.resolveId( source, importer )
      }

      // scripts/compile.js: handle local compile case
      if ( /^\.+\//.test( source )) {
        if ( importer ) {
          if ( /^data:/.test( importer )) {
            return path.join( getCwd(), source )
          }

          const match = importer.match( /^(#[\s\S]*)$/ )
          const hash = match ? match[1] : ''
          if ( absoluteImportRegex.test( importer )) {
            const fakeBase = 'https://example.com'
            importer = `${fakeBase}${importer}`
            source =
              new URL( source, importer ).href.slice( fakeBase.length ) + hash
          } else {
            source = new URL( source, importer ).href + hash
          }
        } else {
          source = source.replace( /^\.+/, '' )
        }
      }

      let match
      if (( match = source.match( dataUrlRegex ))) {
        source =
          'data:' +
          match[1] +
          ( match[2] ? ';' + match[2] : '' ) +
          ',' +
          decodeURIComponent( match[3])
      }

      if ( /^ipfs:\/\//.test( source )) {
        source = source.replace(
          /^ipfs:\/\/(?:ipfs\/)?/,
          'https://cloudflare-ipfs.com/ipfs/'
        )

        const url = new URL( source )
        if ( !url.searchParams.get( 'type' )) {
          const res = await fetch( source, {
            method: 'HEAD',
          })

          // Errpr handling
          if ( !res.ok ) {
            throw new Error( 'IPFS content not found: ' + source )
          }

          const contentType = res.headers.get( 'content-type' )
          const typeTag = mimeTypes.extension( contentType )
          if ( !typeTag ) {
            console.warn( 'unknown IPFS content type:', contentType )
          }

          source += `#type=${typeTag}`
        }
      }

      if (( match = source.match( /^eth:\/\/(0x[0-9a-f]+)\/([0-9]+)$/ ))) {
        const address = match[1]
        const contractName = contractNames[address]
        const contract = contracts[contractName]
        const resolveId = contract?.resolveId
        if ( resolveId ) return await resolveId( source, importer )
      }

      const type = getLoaderType( source )
      const loader = loaders[type]
      const resolveId = loader?.resolveId
      if ( resolveId ) {
        const source2 = await resolveId( source, importer )
        if ( source2 ) {
          return source2
        }
      }

      if ( !source ) {
        throw new Error( `could not resolve` )
      }

      return source
    },

    async load( id ) {
      if ( /\.css$/.test( id )) {
        const css = await readFile( id )
        const result = await buildCssModulesJs( css, id )
        return {
          code: result,
        }
      }

      let match
      if (( match = id.match( /^\/@map\/(.+)$/ ))) {
        const id2 = match[1]
        const mappedModule = mappedModules[id2]
        if ( mappedModule ) {
          const res = mappedModule.load( id2 )
          return res
        }
      }

      id = id.replace( /^(eth:\/(?!\/))/, '$1/' )

      if (( match = id.match( /^eth:\/\/(0x[0-9a-f]+)\/([0-9]+)$/ ))) {
        const address = match[1]
        const contractName = contractNames[address]
        const contract = contracts[contractName]
        const load = contract?.load
        if ( load ) {
          const src = await load( id )

          // console.log('load contract 2', src);
          if ( src !== null && src !== undefined ) {
            return src
          }
        }
      }

      const type = getLoaderType( id )
      const loader = loaders[type]
      const load = loader?.load

      if ( load ) {
        const src = await load( resolveLoaderId( id ))
        if ( src !== null && src !== undefined ) {
          return src
        }
      }

      // Is it a https url?
      if ( httpsRegex.test( id )) {
        const res = await fetch( id )
        if ( !res.ok ) {
          throw new Error( `invalid status code: ${res.status} ${id}` )
        }

        return await res.text()
      }

      // Is it a data url?
      if (( match = id.match( dataUrlRegexNoSuffix ))) {
        const encoding = match[2]
        const src = match[3]

        return encoding === 'base64'
          ? Buffer.from( src, 'base64' )
          : decodeURIComponent( src )
      }

      throw new Error( `could not load "${id}"` )
    },
  }
}

/**
 * Get the loader type from the id
 *
 * @param {string} id the id of the file
 * @returns {string} the loader type
 */
function getLoaderType( id ) {
  /** @type {string} */
  let match

  const url = new URL( id )

  if ( url.href && ( match = url.href.match( dataUrlRegexNoSuffix ))) {
    let type = match[1] ?? ''
    if ( match[1] === 'text/javascript' ) {
      type = 'application/javascript'
    }

    let extension, typeMatch
    if (
      ( typeMatch = type.match(
        /^application\/(light|text|rendersettings|spawnpoint|lore|quest|npc|mob|react|group|wind|vircadia)$/
      ))
    ) {
      extension = typeMatch[1]
    } else if (( typeMatch = type.match( /^application\/(javascript)$/ ))) {
      extension = 'js'
    } else {
      extension = mimeTypes.extension( type )
    }
    return extension || ''
  }

  // if hash type is set, use that
  if ( url.hash && ( match = url.hash.match( /^#type=(.+)$/ ))) {
    return match[1] || ''
  }

  // if query type is set, use that
  if ( url.search && url.searchParams.get( 'type' )) {
    return url.searchParams.get( 'type' )
  }

  //
  if (( match = url.path.match( /\.([^.\\/]+)$/ ))) {
    return match[1].toLowerCase() || ''
  }

  return ''
}

/**
 * Cross platform resolve loader id
 *
 * @param {string} loaderId the id of the loader
 * @returns {string} the resolved loader id
 */
function resolveLoaderId( loaderId ) {
  /**
   * This check is specifically added because of windows
   * as windows is converting constantly all forward slashes into
   * backward slash
   */
  if ( process.platform === 'win32' ) {
    loaderId = loaderId.replaceAll( '\\', '/' )
  }

  return loaderId
}

/**
 * Extract CSS Modules class names from CSS source code
 *
 * @param {string} css CSS source code
 * @param {string | undefined} cssFullPath CSS file path
 * @param {object} [options={}] Css processor options
 */
async function buildCssModulesJs( css, cssFullPath, options = {}) {
  const {
    inject = true,
    generateScopedName,
    cssModulesOption = {},
    localsConvention = 'camelCaseOnly',
  } = options

  let cssModulesJSON = {}
  const result = await postcss([
    cssModules({
      localsConvention,
      generateScopedName,
      getJSON( cssSourceFile, json ) {
        cssModulesJSON = { ...json }
        return cssModulesJSON
      },
      ...cssModulesOption,
    }),
  ]).process( css, {
    from: cssFullPath,
    map: false,
  })

  const classNames = JSON.stringify( cssModulesJSON )
  const hash = createHash( 'sha256' )
  hash.update( cssFullPath )
  const digest = hash.digest( 'hex' )

  let injectedCode = ''
  if ( inject === true ) {
    injectedCode = `
(function() {
  if (typeof document === 'undefined') {
    return;
  }
  if (!document.getElementById(digest)) {
    var el = document.createElement('style');
    el.id = digest;
    el.textContent = css;
    document.head.appendChild(el);
  }
})();
    `
  } else if ( typeof inject === 'function' ) {
    injectedCode = inject( result.css, digest )
  }

  const jsContent = `
const digest = '${digest}';
const css = \`${result.css}\`;
${injectedCode}
export default ${classNames};
export { css, digest };
`

  return jsContent
}
