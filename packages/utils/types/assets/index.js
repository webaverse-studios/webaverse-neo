/**
 * @typedef {object} GLTFAsset
 * @property {string} [copyright] Copyright
 * @property {string} [generator] Generator
 * @property {string} [version] Version
 * @property {string} [minVersion] Minimum Version
 * @property {any} [extensions] Extensions
 * @property {any} [extras] Extras
 */

/**
 * @typedef {object} GLTF
 * @property {any} userData User Data
 * @property {GLTFAsset} asset Asset
 * @property {import('three').Group} scene Scene
 * @property {import('three').Group[]} scenes Scenes
 * @property {import('three').Camera[]} cameras Cameras
 * @property {import('three').AnimationClip[]} animations Animations
 * @property {import('three/examples/jsm/loaders/GLTFLoader').GLTFParser} parser Parser
 */

export default {}
