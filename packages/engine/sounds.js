// import {
//   AudioManager,
// } from './audio-manager.js';

import {loadAudioBuffer} from './util.js';
import soundFileSpecs from './sound-files.json';

const _getSoundFiles = regex => soundFileSpecs.filter(f => regex.test(f.name));
const soundFiles = {
  walk: _getSoundFiles(/^walk\//),
  run: _getSoundFiles(/^run\//),
  jump: _getSoundFiles(/^jump\//),
  doubleJump: _getSoundFiles(/^doubleJump\//),
  land: _getSoundFiles(/^land\//),
  narutoRun: _getSoundFiles(/^narutoRun\//),
  sonicBoom: _getSoundFiles(/^sonicBoom\//),
  chomp: _getSoundFiles(/^food\/chomp/),
  combat: _getSoundFiles(/^combat\//),
  gulp: _getSoundFiles(/^food\/gulp/),
  enemyDeath: _getSoundFiles(/ff7_enemy_death/),
  enemyCut: _getSoundFiles(/ff7_cut/),
  menuOpen: _getSoundFiles(/ff7_save/),
  // menuOpen: _getSoundFiles(/PauseMenu_Open/),
  // menuOpen: _getSoundFiles(/ff8_save/),
  
  // mobs sounds todo: implement sound bank package in app
  worm_bloaterattack: _getSoundFiles(/worm_bloaterattack/),
  worm_slasherattack: _getSoundFiles(/worm_slasherattack/),
  worm_runnerattack:  _getSoundFiles(/worm_runnerattack/),
  worm_attack:  _getSoundFiles(/worm_attack/),
  worm_bloaterdie: _getSoundFiles(/worm_bloaterdie/),
  worm_slasherdie: _getSoundFiles(/worm_slasherdie/),
  worm_runnerdie:  _getSoundFiles(/worm_runnerdie/),
  worm_die:  _getSoundFiles(/worm_die/),
  // end mob sounds
  
  // menuOpen: _getSoundFiles(/ff8_menu_open\.wav/),
  // menuClose: _getSoundFiles(/PauseMenu_Close/),
  menuClose: _getSoundFiles(/ff8_menu_back/),
  menuMove: _getSoundFiles(/PauseMenu_Cursor/),
  menuNext: _getSoundFiles(/OOT_Dialogue_Next/),
  menuDone: _getSoundFiles(/OOT_Dialogue_Done/),
  menuClick: _getSoundFiles(/ff8_click/),
  menuOk: _getSoundFiles(/ff8_menu_ok/),
  menuSelect: _getSoundFiles(/PauseMenu_Select/),
  menuBack: _getSoundFiles(/ff8_menu_back/),
  menuLeft: _getSoundFiles(/PauseMenu_Turn_Left/),
  menuRight: _getSoundFiles(/PauseMenu_Turn_Right/),
  menuReady: _getSoundFiles(/ff7_cursor_ready/),
  menuBeep: _getSoundFiles(/beep/),
  menuBoop: _getSoundFiles(/boop/),
  itemEquip: _getSoundFiles(/Link_Item\.wav/),
  itemUnequip: _getSoundFiles(/Link_Item_Away/),
  zTargetCenter: _getSoundFiles(/ZTarget_Center/),
  zTargetObject: _getSoundFiles(/ZTarget_Object/),
  zTargetEnemy: _getSoundFiles(/ZTarget_Enemy/),
  zTargetCancel: _getSoundFiles(/ZTarget_Cancel/),
  battleTransition: _getSoundFiles(/ff7_battle_transition/),
  limitBreak: _getSoundFiles(/ff7_limit_break/),
  limitBreakReady: _getSoundFiles(/ff8_limit_ready/),
  naviHey: _getSoundFiles(/navi_hey/),
  naviWatchout: _getSoundFiles(/navi_watchout/),
  naviFriendly: _getSoundFiles(/navi_friendly/),
  naviItem: _getSoundFiles(/navi_item/),
  naviDanger: _getSoundFiles(/navi_danger/),
  bushCut: _getSoundFiles(/OOT_Bush_Cut/),
  // bushPickup: _getSoundFiles(/OOT_Bush_Pickup/),
  // bushWalk: _getSoundFiles(/OOT_Bush_Walk/),
  hpPickup: _getSoundFiles(/OOT_Get_Heart/),
  mpPickup: _getSoundFiles(/OOT_Get_SmallItem1/),
  refill: _getSoundFiles(/OOT_MagicRefill/),
  explosion: _getSoundFiles(/OOT_Bomb_Blow/),
  swordSlash: _getSoundFiles(/sword_slash/),

  menuBeepLow: _getSoundFiles(/pd_beep1/),
  menuBeepHigh: _getSoundFiles(/pd_beep2/),
  menuSweepIn: _getSoundFiles(/pd_sweep1/),
  menuSweepOut: _getSoundFiles(/pd_sweep2/),

  water: _getSoundFiles(/^water\//),
};

// move to a class
export class Sounds {
  #soundFileAudioBuffer;
  
  constructor({
    audioManager,
  }) {
    if (!audioManager) {
      console.warn('no audioManager', {
        audioManager,
      });
      debugger;
    }
    this.audioManager = audioManager;

    this.loadPromise = (async () => {
      const {audioContext} = this.audioManager;
      this.#soundFileAudioBuffer = await loadAudioBuffer(
        audioContext,
        '/sounds/sounds.mp3'
      );
    })();
  }

  getSoundFiles() {
    return soundFiles;
  }
  getSoundFileAudioBuffer() {
    return this.#soundFileAudioBuffer;
  }
  playSound(audioSpec) {
    const {offset, duration} = audioSpec;
    const {audioContext} = this.audioManager;
    const audioBufferSourceNode = audioContext.createBufferSource();
    audioBufferSourceNode.buffer = this.#soundFileAudioBuffer;
    audioBufferSourceNode.connect(audioContext.gain);
    audioBufferSourceNode.start(0, offset, duration);
    return audioBufferSourceNode;
  }
  playSoundName(name) {
    const snds = soundFiles[name];
    if (snds) {
      const sound = snds[Math.floor(Math.random() * snds.length)];
      this.playSound(sound);
      return true;
    } else {
      debugger;
      return false;
    }
  }

  async waitForLoad() {
    await this.loadPromise;
  }
}