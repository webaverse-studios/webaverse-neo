import directory from './directory.js'
import gif from './gif.js'
import glb from './glb.js'
import glbb from './glbb.js'
import gltj from './gltj.js'
import group from './group.js'
import html from './html.js'
import image from './image.js'
import jsx from './jsx.js'
import light from './light.js'
import lore from './lore.js'
import metaversefile from './metaversefile.js'
import mob from './mob.js'
import npc from './npc.js'
import quest from './quest.js'
import react from './react.js'
import rendersettings from './rendersettings.js'
import scn from './scn.js'
import spawnpoint from './spawnpoint.js'
import text from './text.js'
import video from './video.js'
import vircadia from './vircadia.js'
import vox from './vox.js'
import vrm from './vrm.js'
import wind from './wind.js'

/** @typedef {import('../plugins/metaversefilePlugin.js').MetaverseFilePluigin} MetaverseFilePluigin */

/**
 * @type {Object<string,MetaverseFilePluigin>}
 */
const loaders = {
  gif,
  glb,
  glbb,
  gltj,
  group,
  html,
  jpg: image,
  jpeg: image,
  js: jsx,
  jsx,
  light,
  lore,
  metaversefile,
  mob,
  mov: video,
  mp4: video,
  npc,
  png: image,
  quest,
  react,
  rendersettings,
  scn,
  spawnpoint,
  svg: image,
  text,
  vircadia,
  vox,
  vrm,
  wind,
  '': directory,
}

export default loaders
