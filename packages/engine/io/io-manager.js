/*
io manager reads inputs from the browser.
some inputs are implicit, like resize.
the functionality is implemented in other managers.
*/

import * as THREE from 'three';
// import metaversefile from 'metaversefile';
// import {
//   CameraManager,
// } from './camera-manager.js';
// import {world} from './world.js';
// import voiceInput from '../voice-input/voice-input.js';
// import {getRenderer, camera} from './renderer.js';
import physicsManager from '../physics/physics-manager.js';
// import transformControls from './transform-controls.js';
// import storyManager from './story.js';
// import {
//   RaycastManager,
// } from './raycast-manager.js';
// import {
//   interactionManager,
// } from './grab-manager.js';

const localVector = new THREE.Vector3();
// const localVector2 = new THREE.Vector3();
const localEuler = new THREE.Euler();
const localMatrix2 = new THREE.Matrix4();
const localMatrix3 = new THREE.Matrix4();
const localQuaternion = new THREE.Quaternion();
const localQuaternion2 = new THREE.Quaternion();
// const localQuaternion3 = new THREE.Quaternion();
const localMatrix = new THREE.Matrix4();
// const localPlane = new THREE.Plane();
const localFrustum = new THREE.Frustum();

const zeroVector = new THREE.Vector3(0, 0, 0);
const upVector = new THREE.Vector3(0, 1, 0);

const doubleTapTime = 200;

export class IoManager extends EventTarget {
  lastAxes = [[0, 0, 0, 0], [0, 0, 0, 0]];
  lastButtons = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
  currentWeaponValue = 0;
  lastWeaponValue = 0;
  currentTeleport = false;
  lastTeleport = false;
  currentMenuDown = false;
  lastMenuDown = false;
  menuExpanded = false;
  lastMenuExpanded = false;
  currentWeaponGrabs = [false, false];
  lastWeaponGrabs = [false, false];
  currentWalked = false;
  lastMouseButtons = 0;
  movementEnabled = true;

  keysDirection = new THREE.Vector3();

  keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    forward: false,
    backward: false,
    shift: false,
    doubleTap: false,
    space: false,
    ctrl: false,
  };

  lastKeysDownTime = {
    keyW: 0,
    keyA: 0,
    keyS: 0,
    keyD: 0,
    keyE: 0,
  };

  constructor({
    engine,
    cameraManager,
    pointerLockManager,
    raycastManager,
    webaverseRenderer,
    playersManager,
    realmManager,
  }) {
    super();
    
    if (!engine || !cameraManager || !pointerLockManager || !raycastManager || !webaverseRenderer || !playersManager || !realmManager) {
      console.warn('missing managers', {
        engine,
        cameraManager,
        pointerLockManager,
        raycastManager,
        webaverseRenderer,
        playersManager,
        realmManager,
      });
      debugger;
      throw new Error('missing managers');
    }
    this.engine = engine;
    this.cameraManager = cameraManager;
    this.pointerLockManager = pointerLockManager;
    this.raycastManager = raycastManager;
    this.webaverseRenderer = webaverseRenderer;
    this.playersManager = playersManager;
    this.realmManager = realmManager;

    // XXX this should be moved to its own manager (pointerlock manager?)
    this.cameraManager.addEventListener('pointerlockchange', () => {
      this.resetKeys();
    });
  }

  inputFocused() {
    return document.activeElement &&
      (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.getAttribute('contenteditable') !== null
      )
    };

  update(timeDiff) {
    // const renderer = getRenderer();
    const {webaverseRenderer} = this;
    const {renderer, camera} = webaverseRenderer;
    const xrCamera = renderer.xr.getSession() ?
      renderer.xr.getCamera(camera)
    : camera;
    if (renderer.xr.getSession()) {
      ioManager.currentWalked = false;
      const inputSources = Array.from(renderer.xr.getSession().inputSources);
      for (let i = 0; i < inputSources.length; i++) {
        const inputSource = inputSources[i];
        const {handedness, gamepad} = inputSource;
        if (gamepad && gamepad.buttons.length >= 2) {
          const index = handedness === 'right' ? 1 : 0;

          // axes
          const {axes: axesSrc, buttons: buttonsSrc} = gamepad;
          const axes = [
            axesSrc[0] || 0,
            axesSrc[1] || 0,
            axesSrc[2] || 0,
            axesSrc[3] || 0,
          ];
          const buttons = [
            buttonsSrc[0] ? buttonsSrc[0].value : 0,
            buttonsSrc[1] ? buttonsSrc[1].value : 0,
            buttonsSrc[2] ? buttonsSrc[2].value : 0,
            buttonsSrc[3] ? buttonsSrc[3].value : 0,
            buttonsSrc[4] ? buttonsSrc[4].value : 0,
            buttonsSrc[5] ? buttonsSrc[4].value : 0,
          ];
          if (handedness === 'left') {
            const dx = axes[0] + axes[2];
            const dy = axes[1] + axes[3];
            if (Math.abs(dx) >= 0.01 || Math.abs(dy) >= 0.01) {
              localEuler.setFromQuaternion(xrCamera.quaternion, 'YXZ');
              localEuler.x = 0;
              localEuler.z = 0;
              localVector.set(dx, 0, dy)
                .applyEuler(localEuler)
                .multiplyScalar(0.05);

              camera.matrix
                // .premultiply(localMatrix2.makeTranslation(-xrCamera.position.x, -xrCamera.position.y, -xrCamera.position.z))
                .premultiply(localMatrix3.makeTranslation(localVector.x, localVector.y, localVector.z))
                // .premultiply(localMatrix2.copy(localMatrix2).invert())
                .decompose(camera.position, camera.quaternion, camera.scale);
              ioManager.currentWalked = true;
            }

            ioManager.currentWeaponGrabs[1] = buttons[1] > 0.5;
          } else if (handedness === 'right') {
            const _applyRotation = r => {
              camera.matrix
                .premultiply(localMatrix2.makeTranslation(-xrCamera.position.x, -xrCamera.position.y, -xrCamera.position.z))
                .premultiply(localMatrix3.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(0, 1, 0), r)))
                .premultiply(localMatrix2.copy(localMatrix2).invert())
                .decompose(camera.position, camera.quaternion, camera.scale);
            };
            if (
              (axes[0] < -0.75 && !(ioManager.lastAxes[index][0] < -0.75)) ||
              (axes[2] < -0.75 && !(ioManager.lastAxes[index][2] < -0.75))
            ) {
              _applyRotation(Math.PI * 0.2);
            } else if (
              (axes[0] > 0.75 && !(ioManager.lastAxes[index][0] > 0.75)) ||
              (axes[2] > 0.75 && !(ioManager.lastAxes[index][2] > 0.75))
            ) {
              _applyRotation(-Math.PI * 0.2);
            }
            ioManager.currentTeleport = (axes[1] < -0.75 || axes[3] < -0.75);
            ioManager.currentMenuDown = (axes[1] > 0.75 || axes[3] > 0.75);

            ioManager.currentWeaponDown = buttonsSrc[0].pressed;
            ioManager.currentWeaponValue = buttons[0];
            ioManager.currentWeaponGrabs[0] = buttonsSrc[1].pressed;

            if (
              buttons[3] >= 0.5 && ioManager.lastButtons[index][3] < 0.5 &&
              !(Math.abs(axes[0]) > 0.5 || Math.abs(axes[1]) > 0.5 || Math.abs(axes[2]) > 0.5 || Math.abs(axes[3]) > 0.5) &&
              !this.engine.game.isJumping() &&
              !this.engine.game.isSitting()
            ) {
              this.engine.game.jump();
            }
          }

          ioManager.lastAxes[index][0] = axes[0];
          ioManager.lastAxes[index][1] = axes[1];
          ioManager.lastAxes[index][2] = axes[2];
          ioManager.lastAxes[index][3] = axes[3];

          ioManager.lastButtons[index][0] = buttons[0];
          ioManager.lastButtons[index][1] = buttons[1];
          ioManager.lastButtons[index][2] = buttons[2];
          ioManager.lastButtons[index][3] = buttons[3];
          ioManager.lastButtons[index][4] = buttons[4];
        }
      }
    } else {
      this.keysDirection.set(0, 0, 0);

      const localPlayer = this.playersManager.getLocalPlayer();
      // const localPlayer = metaversefile.useLocalPlayer();

      const _updateHorizontal = direction => {
        if (this.keys.left) {
          direction.x -= 1;
        }
        if (this.keys.right) {
          direction.x += 1;
        }
        if (this.keys.up) {
          direction.z -= 1;
        }
        if (this.keys.down) {
          direction.z += 1;
        }
      };

      const _updateVertical = direction => {
        if (this.keys.space) {
          direction.y += 1;
        }
        if (this.keys.ctrl) {
          direction.y -= 1;
        }
      };

      _updateHorizontal(this.keysDirection);
      if (this.keysDirection.equals(zeroVector)) {
        if (localPlayer.actionManager.hasActionType('narutoRun')) {
          this.keysDirection.copy(this.cameraManager.lastNonzeroDirectionVector);
        }
      } else {
        this.cameraManager.lastNonzeroDirectionVector.copy(this.keysDirection);
      }

      if (localPlayer.actionManager.hasActionType('swim')) {
        if (this.keys.shift && this.keysDirection.length() > 0) {
          localPlayer.actionManager.getAction('swim').animationType = 'freestyle';
        }
        else if (!this.keys.shift && this.keysDirection.length() > 0) {
          localPlayer.actionManager.getAction('swim').animationType = 'breaststroke';
        }
        else {
          localPlayer.actionManager.getAction('swim').animationType = 'null';
        }
      }
      const {camera} = this.webaverseRenderer;
      if (localPlayer.actionManager.hasActionType('fly') || localPlayer.actionManager.hasActionType('swim')) {
        this.keysDirection.applyQuaternion(camera.quaternion);
        _updateVertical(this.keysDirection);
      } else {
        const _applyCameraRelativeKeys = () => {
          // get distance to the camera frustum planes
          const transformCameraFrustum = localFrustum.setFromProjectionMatrix(
            camera.projectionMatrix
          );
          // transform the planes to the camera
          for (const plane of transformCameraFrustum.planes) {
            plane.applyMatrix4(camera.matrixWorld);
          }
          // get the closest plane distance
          let closestDistance = Infinity;
          for (const plane of transformCameraFrustum.planes) {
            const distance = plane.distanceToPoint(localPlayer.position);
            if (distance < closestDistance) {
              closestDistance = distance;
            }
          }

          const transformCameraForwardDirection = localVector.set(0, 0, -1)
            .applyQuaternion(camera.quaternion);
          transformCameraForwardDirection.y = 0;
          if (transformCameraForwardDirection.x === 0 && transformCameraForwardDirection.z === 0) {
            transformCameraForwardDirection.z = -1;
          }
          transformCameraForwardDirection.normalize();
          const backQuaternion = localQuaternion2.setFromRotationMatrix(
            localMatrix.lookAt(zeroVector, transformCameraForwardDirection, upVector)
          );

          this.keysDirection.applyQuaternion(backQuaternion);
        };
        _applyCameraRelativeKeys();

        const _updateCrouch = () => {
          if (this.keys.ctrl && !this.lastCtrlKey && this.engine.game.isGrounded()) {
            this.engine.game.toggleCrouch();
          }
          this.lastCtrlKey = this.keys.ctrl;
        };
        _updateCrouch();
      }
      const physicsScene = physicsManager.getScene();
      if (physicsScene.getPhysicsEnabled() && this.movementEnabled) {
        const speed = this.engine.game.getSpeed();
        const velocity = this.keysDirection.normalize().multiplyScalar(speed);
        localPlayer.characterPhysics.applyWasd(velocity, camera, timeDiff);
      }
    }
  };

  updatePost() {
    this.lastTeleport = this.currentTeleport;
    this.lastMenuDown = this.currentMenuDown;
    this.lastWeaponDown = this.currentWeaponDown;
    this.lastWeaponValue = this.currentWeaponValue;
    this.lastMenuExpanded = this.menuExpanded;
    for (let i = 0; i < 2; i++) {
      this.lastWeaponGrabs[i] = this.currentWeaponGrabs[i];
    }
  };

  setMovementEnabled(newMovementEnabled) {
    const {camera} = this.webaverseRenderer;

    this.movementEnabled = newMovementEnabled;
    if (!this.movementEnabled) {
      const localPlayer = metaversefile.useLocalPlayer();
      localPlayer.characterPhysics.applyWasd(zeroVector, camera, 0);
    }
  };

  resetKeys() {
    for (const k in this.keys) {
      this.keys[k] = false;
    }
  };

  keydown(e) {
    if (this.inputFocused() || e.repeat) {
      return;
    }

    if (e.keyCode === 18) { // alt
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    switch (e.which) {
      case 9: { // tab
        break;
      }
      case 49: // 1
      case 50: // 2
      case 51: // 3
      case 52: // 4
      case 53: // 5
      case 54: // 6
      case 55: // 7
      case 56: // 8
        {
          this.engine.game.selectLoadout(e.which - 49);
          break;
        }
      case 87: { // W
        this.keys.up = true;
        this.engine.game.setMovements();

        const now = performance.now();
        const timeDiff = now - this.lastKeysDownTime.keyW;
        if (timeDiff < doubleTapTime && this.keys.shift) {
          this.keys.doubleTap = true;
          this.engine.game.menuDoubleTap();
        }
        this.lastKeysDownTime.keyW = now;
        this.lastKeysDownTime.keyS = 0;
        break;
      }
      case 65: { // A
        this.keys.left = true;
        this.engine.game.setMovements();

        const now = performance.now();
        const timeDiff = now - this.lastKeysDownTime.keyA;
        if (timeDiff < doubleTapTime && this.keys.shift) {
          this.keys.doubleTap = true;
          this.engine.game.menuDoubleTap();
        }
        this.lastKeysDownTime.keyA = now;
        this.lastKeysDownTime.keyD = 0;
        break;
      }
      case 83: { // S
        if (e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();

          this.engine.game.saveScene();
        } else {
          this.keys.down = true;
          this.engine.game.setMovements();

          const now = performance.now();
          const timeDiff = now - this.lastKeysDownTime.keyS;
          if (timeDiff < doubleTapTime && this.keys.shift) {
            this.keys.doubleTap = true;
            this.engine.game.menuDoubleTap();
          }
          this.lastKeysDownTime.keyS = now;
          this.lastKeysDownTime.keyW = 0;
        }
        break;
      }
      case 68: { // D
        this.keys.right = true;
        this.engine.game.setMovements();

        const now = performance.now();
        const timeDiff = now - this.lastKeysDownTime.keyD;
        if (timeDiff < doubleTapTime && this.keys.shift) {
          this.keys.doubleTap = true;
          this.engine.game.menuDoubleTap();
        }
        this.lastKeysDownTime.keyD = now;
        this.lastKeysDownTime.keyA = 0;
        break;

      }
      case 70: { // F
        e.preventDefault();
        e.stopPropagation();
        if (this.engine.interactionManager.canPush()) {
          this.keys.forward = true;
        } else {
          this.engine.game.toggleFly();
        }
        break;
      }
      case 88: { // X
        if (!e.ctrlKey) {
          // this.engine.game.menuDelete();
          this.engine.interactionManager.menuDelete();
        }
        break;
      }
      case 67: { // C
        if (this.engine.interactionManager.canPush()) {
          this.keys.backward = true;
        } else {
          this.keys.ctrl = true;
        }
        break;
      }
      case 71: { // G
        this.engine.game.menuSwitchCharacter();
        break;
      }
      case 86: { // V
        e.preventDefault();
        e.stopPropagation();
        this.engine.game.menuVDown(e);
        break;
      }
      case 85: { // U
        e.preventDefault();
        e.stopPropagation();
        this.engine.game.worldClear();
        break;
      }
      case 73: { // I
        e.preventDefault();
        e.stopPropagation();
        this.engine.game.worldOpen();
        break;
      }
      case 79: { // O
        this.engine.game.equipTest();
        break;
      }
      case 80: { // P
        this.engine.game.dropTest();
        break;
      }
      case 66: { // B
        e.preventDefault();
        e.stopPropagation();
        this.engine.game.menuBDown(e);
        break;
      }
      case 69: { // E
        this.engine.game.menuMiddleRelease();
        
        const now = performance.now();
        const timeDiff = now - this.lastKeysDownTime.keyE;
        const canRotate = this.engine.interactionManager.canRotate();
        if (timeDiff < doubleTapTime && !canRotate) {
          this.engine.game.menuMiddleToggle();
        } else {
          if (canRotate) {
            this.engine.interactionManager.menuRotate(-1);
          } else {
            this.engine.game.menuActivateDown();
          }
        }
        this.lastKeysDownTime.keyE = now;
        break;
      }
      case 84: { // T
        e.preventDefault();
        e.stopPropagation();
        this.engine.game.toggleMic(e);
        // voiceInput.toggleMic();
        break;
      }
      case 89: { // Y
        e.preventDefault();
        e.stopPropagation();
        this.engine.game.toggleSpeech(e);
        // voiceInput.toggleSpeech();
        break;
      }
      case 82: { // R
        if (this.pointerLockManager.pointerLockElement) {
          if (this.engine.interactionManager.canRotate()) {
            this.engine.interactionManager.menuRotate(1);
          } else if (!e.ctrlKey) {
            this.engine.game.dropSelectedApp();
          }
        }
        break;
      }
      case 16: { // shift
        this.keys.shift = true;
        this.engine.game.setSprint(true);
        break;
      }
      case 32: { // space
        this.keys.space = true;
        if (this.engine.game.isGlidering()) {
          this.engine.game.unglider();
        } else if (this.engine.game.isSkydiving()) {
          this.engine.game.glider();
        } else if (!this.engine.game.isJumping()) {
          this.engine.game.jump('jump');
        } else if (!this.engine.game.isDoubleJumping()) {
          this.engine.game.doubleJump();
        }
        break;
      }
      case 81: { // Q
        if (e.ctrlKey) {
          if (this.pointerLockManager.pointerLockElement) {
            this.pointerLockManager.exitPointerLock();
          } else {
            this.pointerLockManager.requestPointerLock();
          }
        } else {
          if (this.engine.game.canToggleAxis()) {
            this.engine.game.toggleAxis();
          } else {
            // clear conflicting aim with quick menu
            this.engine.game.menuUnaim();
          }
        }
        break;
      }
      case 74: { // J
        this.engine.game.inventoryHack = !this.engine.game.inventoryHack;
        break;
      }
      case 27: { // esc
        this.engine.game.setContextMenu(false);
        break;
      }
      case 72: { // H
        const debug = metaversefile.useDebug();
        debug.toggle();
        break;
      }
      case 192: { // tilde
        this.engine.interactionManager.toggleEditMode();
        break;
      }
      case 77: { // M
        if (e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          this.engine.universe.enterMultiplayer();
        }
        break;
      }
    }
  }

  keypress = e => {
    // nothing
  };

  wheel = e => {
    // if (storyManager.handleWheel(e)) {
    //   // nothing
    // } else {
      const physicsScene = physicsManager.getScene();

      if (physicsScene.getPhysicsEnabled()) {
        this.cameraManager.handleWheelEvent(e);
      }
    // }
  }

  keyup = e => {
    if (this.inputFocused() || e.repeat) {
      return;
    }

    if (e.keyCode === 18) { // alt
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    switch (e.which) {
      case 87: { // W
        this.keys.up = false;
        this.engine.game.setMovements();
        break;
      }
      case 65: { // A
        this.keys.left = false;
        this.engine.game.setMovements();
        break;
      }
      case 83: { // S
        this.keys.down = false;
        this.engine.game.setMovements();
        break;
      }
      case 68: { // D
        this.keys.right = false;
        this.engine.game.setMovements();
        break;
      }
      case 32: { // space
        this.keys.space = false;
        break;
      }
      case 69: { // E
        if (this.pointerLockManager.pointerLockElement) {
          this.engine.game.menuActivateUp();
        }
        break;
      }
      case 70: { // F
        this.keys.forward = false;
        break;
      }
      case 67: { // C
        this.keys.backward = false;
        this.keys.ctrl = false;
        break;
      }
      case 86: { // V
        e.preventDefault();
        e.stopPropagation();
        this.engine.game.menuVUp();
        break;
      }
      case 66: { // B
        e.preventDefault();
        e.stopPropagation();
        this.engine.game.menuBUp();
        break;
      }
      case 16: { // shift
        const oldShift = this.keys.shift;
        const oldDoubleTap = this.keys.doubleTap;

        this.keys.shift = false;
        this.keys.doubleTap = false;

        oldShift && this.engine.game.setSprint(false);
        oldDoubleTap && this.engine.game.menuUnDoubleTap();
        break;
      }
      /* case 46: { // delete
        const object = this.engine.game.getMouseSelectedObject();
        if (object) {
          this.engine.game.setMouseHoverObject(null);
          this.engine.game.setMouseSelectedObject(null);
          world.removeObject(object.instanceId);
        } else if (!e.ctrlKey) {
          this.engine.game.deleteSelectedApp();
        }
        break;
      } */
      case 27: {
        this.engine.game.setMouseSelectedObject(null);
      }
    }
  };

  mousemove = e => {
    if (this.pointerLockManager.pointerLockElement) {
      this.cameraManager.handleMouseMove(e);
    } else {
      if (this.engine.game.dragging) {
        this.engine.game.menuDrag(e);
        this.engine.game.menuDragRight(e);
      }
    }
    this.raycastManager.setLastMouseEvent(e);
  };

  mouseenter = e => {
  };
  mouseleave = e => {
    // const renderer = getRenderer();
    // this.webaverseRenderer.renderer.domElement.classList.remove('hover');
  };

  click = e => {
    // console.log('click')
    if (this.pointerLockManager.pointerLockElement) {
      this.engine.interactionManager.menuClick(e);
    } else if (!this.engine.game.hoverEnabled) {
      // console.log('requesting pointer lock')
      this.pointerLockManager.requestPointerLock();
    }
    this.raycastManager.setLastMouseEvent(e);
  };

  dblclick = e => {
    // nothing
  };

  mousedown = e => {
    const changedButtons = this.lastMouseButtons ^ e.buttons;
    if (this.pointerLockManager.pointerLockElement) {
      if ((changedButtons & 1) && (e.buttons & 1)) { // left
        this.engine.game.menuMouseDown();
      }
      if ((changedButtons & 2) && (e.buttons & 2)) { // right
        this.engine.game.menuAim();
      }
    } else {
      // if ((changedButtons & 1) && (e.buttons & 1)) { // left
      //   const raycaster = this.raycastManager.getMouseRaycaster(e);
      //   if (raycaster) {
      //     transformControls.handleMouseDown(raycaster);
      //   }
      // }
      if ((changedButtons & 1) && (e.buttons & 2)) { // right
        this.engine.game.menuDragdownRight();
        this.engine.game.setContextMenu(false);
      }
    }
    if ((changedButtons & 4) && (e.buttons & 4)) { // middle
      e.preventDefault();
      if (!this.pointerLockManager.pointerLockElement) {
        this.pointerLockManager.requestPointerLock();
      }
      // this.engine.game.menuMiddleDown();
    }
    this.lastMouseButtons = e.buttons;
    this.raycastManager.setLastMouseEvent(e);
  };

  mouseup = e => {
    const changedButtons = this.lastMouseButtons ^ e.buttons;
    if (this.pointerLockManager.pointerLockElement) {
      if ((changedButtons & 1) && !(e.buttons & 1)) { // left
        this.engine.game.menuMouseUp();
      }
      if ((changedButtons & 2) && !(e.buttons & 2)) { // right
        this.engine.game.menuUnaim();
      }
    } else {
      if ((changedButtons & 2) && !(e.buttons & 2)) { // right
        this.engine.game.menuDragupRight();
      }
    }
    if ((changedButtons & 4) && !(e.buttons & 4)) { // middle
      // this.engine.game.menuMiddleUp();
    }
    this.lastMouseButtons = e.buttons;
    this.raycastManager.setLastMouseEvent(e);
  };

  paste = e => {
    if (!globalThis.document.activeElement) {
      const items = Array.from(e.clipboardData.items);
      if (items.length > 0) {
        e.preventDefault();
        console.log('paste items', items);
      }
    }
  };
}