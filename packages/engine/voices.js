import {
  voicePacksUrl,
  voiceEndpointsUrl,
} from './endpoints.js';
import overrides from './overrides.js';
// import {
//   PlayersManager,
// } from './players-manager.js';

export class Voices {
  constructor({
    playersManager,
  }) {
    if (!playersManager) {
      throw new Error('no playersManager');
    }

    this.playersManager = playersManager;

    this.voicePacks = [];
    this.voiceEndpoints = [];
    
    [
      'overrideVoicePack',
      'userVoicePack',
    ].forEach(key => {
      overrides[key].addEventListener('change', async e => {
        const voicePackName = overrides.overrideVoicePack.get() ?? overrides.userVoicePack.get() ?? null;
        if (!voicePackName) {
          throw new Error('no voice pack name');
        }
        const voicePack = this.voicePacks.find(vp => vp.name === voicePackName);
    
        const {
          audioPath,
          indexPath,
        } = voicePack;
        const voicePacksUrlBase = voicePacksUrl.replace(/\/+[^\/]+$/, '');
        const audioUrl = voicePacksUrlBase + audioPath;
        const indexUrl = voicePacksUrlBase + indexPath;
    
        const localPlayer = this.playersManager.getLocalPlayer();
        await localPlayer.setVoicePack({
          audioUrl,
          indexUrl,
        });
      });
    });
    [
      'overrideVoiceEndpoint',
      'userVoiceEndpoint',
    ].forEach(key => {
      overrides[key].addEventListener('change', async e => {
        const voiceEndpointName = overrides.overrideVoiceEndpoint.get() ?? overrides.userVoiceEndpoint.get() ?? null;
        if (!voiceEndpointName) {
          throw new Error('no voice endpoint name');
        }
        const voiceEndpoint = this.voiceEndpoints.find(ve => ve.name === voiceEndpointName);
    
        const localPlayer = playersManager.getLocalPlayer();
        localPlayer.setVoiceEndpoint(voiceEndpoint.drive_id);
      });
    });

    this.loadPromise = (async () => {
      await Promise.all([
        (async () => {
          const res = await fetch(voicePacksUrl);
          const j = await res.json();
          this.voicePacks.push(...j);
        })(),
        (async () => {
          const res = await fetch(voiceEndpointsUrl);
          const j = await res.json();
          this.voiceEndpoints.push(...j);
        })(),
      ]);
    })();
  }
  waitForLoad() {
    return this.loadPromise;
  }
}