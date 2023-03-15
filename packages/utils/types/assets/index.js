/* eslint-disable max-len */

import { AnimationClip, Group, Camera } from 'three'

/**
 * @typedef {{
 * animations: AnimationClip[],
 * scene: Group,
 * scenes: Group[],
 * cameras: Camera[],
 * asset: {
 *  copyright?: string | undefined;
 *  generator?: string | undefined;
 *  version?: string | undefined;
 *  minVersion?: string | undefined;
 *  extensions?: any;
 *  extras?: any;
 * }
 * parser: GLTFParser
 * userData: any;
 * }} GLTF
 */
