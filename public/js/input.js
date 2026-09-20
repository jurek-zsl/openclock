/**
 * Cross-platform Input Controller with Super Ability and Expanded Weapons
 */

const TOUCH_AIM_DEADZONE = 18;
const TOUCH_AIM_RESPONSE = 0.22;

export class InputController {
  constructor(canvas, onWeaponChange, onDash, onEmojiToggle, onSuperActivate, onParry) {
    this.canvas = canvas;
    this.onWeaponChange = onWeaponChange;
    this.onDash = onDash;
    this.onEmojiToggle = onEmojiToggle;
    this.onSuperActivate = onSuperActivate;
    this.onParry = onParry;

    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      dash: false
    };

    this.arrowAimKeys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, down: false };
    this.aimAngle = 0;
    this.isShooting = false;
    this.keyFire = false;
    this.arrowShooting = false;

    this.joyMove = { x: 0, y: 0, active: false, touchId: null };
    this.joyAim = { x: 0, y: 0, active: false, touchId: null, targetAngle: 0 };

    this.setupKeyboard();
    this.setupMouse();
    this.setupTouch();
  }

  resetAllKeys() {
    this.keys.up = false;
    this.keys.down = false;
    this.keys.left = false;
    this.keys.right = false;
    this.keys.dash = false;
    this.arrowAimKeys.up = false;
    this.arrowAimKeys.down = false;
    this.arrowAimKeys.left = false;
    this.arrowAimKeys.right = false;
    this.keyFire = false;
    this.arrowShooting = false;
    this.mouse.down = false;
    if (!this.joyAim.active) {
      this.isShooting = false;
    }
  }

  setupKeyboard() {
    window.addEventListener('blur', () => this.resetAllKeys());
    window.addEventListener('focus', () => this.resetAllKeys());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.resetAllKeys();
    });

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.code) {
        // WASD Movement
        case 'KeyW':
          this.keys.up = true;
          break;
        case 'KeyS':
          this.keys.down = true;
          break;
        case 'KeyA':
          this.keys.left = true;
          break;
        case 'KeyD':
          this.keys.right = true;
          break;

        // Twin-stick Arrow Keys (Aim & Shoot for keyboard play)
        case 'ArrowUp':
          this.arrowAimKeys.up = true;
          this.updateArrowAim();
          break;
        case 'ArrowDown':
          this.arrowAimKeys.down = true;
          this.updateArrowAim();
          break;
        case 'ArrowLeft':
          this.arrowAimKeys.left = true;
          this.updateArrowAim();
          break;
        case 'ArrowRight':
          this.arrowAimKeys.right = true;
          this.updateArrowAim();
          break;

        // Dedicated Keyboard Fire Keys (Glide trackpad + Press J or Z to Fire)
        case 'KeyJ':
        case 'KeyZ':
          this.keyFire = true;
          this.isShooting = true;
          break;

        // Explicit Dash Keys (Space, Shift, K)
        case 'Space':
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'KeyK':
          if (!this.keys.dash) {
            this.keys.dash = true;
            if (this.onDash) this.onDash();
          }
          break;

        // Super Ability Keys (Q, F, L)
        case 'KeyQ':
        case 'KeyF':
        case 'KeyL':
          if (this.onSuperActivate) this.onSuperActivate();
          break;

        // Deflect / Parry Shield Keys (C, V)
        case 'KeyC':
        case 'KeyV':
          if (this.onParry) this.onParry();
          break;

        // Comms / Quickchat
        case 'KeyE':
          if (this.onEmojiToggle) this.onEmojiToggle();
          break;

        // Weapons
        case 'Digit1': if (this.onWeaponChange) this.onWeaponChange('blaster'); break;
        case 'Digit2': if (this.onWeaponChange) this.onWeaponChange('scatter'); break;
        case 'Digit3': if (this.onWeaponChange) this.onWeaponChange('railgun'); break;
        case 'Digit4': if (this.onWeaponChange) this.onWeaponChange('bouncing'); break;
        case 'Digit5': if (this.onWeaponChange) this.onWeaponChange('rocket'); break;
        case 'Digit6': if (this.onWeaponChange) this.onWeaponChange('cryo'); break;
        case 'Digit7': if (this.onWeaponChange) this.onWeaponChange('flame'); break;
        case 'Digit8': if (this.onWeaponChange) this.onWeaponChange('seeker'); break;
      }
    });

    window.addEventListener('keyup', (e) => {
      // If Meta/Alt/Control key was released, reset keys to prevent OS shortcut sticking
      if (e.key === 'Meta' || e.key === 'Alt' || e.key === 'Control') {
        this.resetAllKeys();
        return;
      }

      switch (e.code) {
        case 'KeyW':
          this.keys.up = false;
          break;
        case 'KeyS':
          this.keys.down = false;
          break;
        case 'KeyA':
          this.keys.left = false;
          break;
        case 'KeyD':
          this.keys.right = false;
          break;

        case 'ArrowUp':
          this.arrowAimKeys.up = false;
          this.updateArrowAim();
          break;
        case 'ArrowDown':
          this.arrowAimKeys.down = false;
          this.updateArrowAim();
          break;
        case 'ArrowLeft':
          this.arrowAimKeys.left = false;
          this.updateArrowAim();
          break;
        case 'ArrowRight':
          this.arrowAimKeys.right = false;
          this.updateArrowAim();
          break;

        case 'KeyJ':
        case 'KeyZ':
          this.keyFire = false;
          if (!this.mouse.down && !this.joyAim.active && !this.arrowShooting) {
            this.isShooting = false;
          }
          break;

        case 'Space':
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'KeyK':
          this.keys.dash = false;
          break;
      }
    });
  }

  updateArrowAim() {
    const dx = (this.arrowAimKeys.right ? 1 : 0) - (this.arrowAimKeys.left ? 1 : 0);
    const dy = (this.arrowAimKeys.down ? 1 : 0) - (this.arrowAimKeys.up ? 1 : 0);

    if (dx !== 0 || dy !== 0) {
      this.aimAngle = Math.atan2(dy, dx);
      this.arrowShooting = true;
      this.isShooting = true;
    } else {
      this.arrowShooting = false;
      if (!this.mouse.down && !this.keyFire && !this.joyAim.active) {
        this.isShooting = false;
      }
      this.updateAimAngle();
    }
  }

  setupMouse() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.updateAimAngle();
    });

    window.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('#lobby-modal') || e.target.closest('#emoji-modal') || e.target.closest('#host-modal') || e.target.closest('#controls-modal') || e.target.closest('select')) {
        return;
      }

      if (e.button === 0) {
        this.mouse.down = true;
        this.isShooting = true;
      } else if (e.button === 2) {
        e.preventDefault();
        if (this.onDash) this.onDash();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.mouse.down = false;
        if (!this.joyAim.active && !this.keyFire && !this.arrowShooting) {
          this.isShooting = false;
        }
      }
    });

    // Suppress right-click context menu so two-finger touchpad taps dash smoothly
    window.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('input') && !e.target.closest('select')) {
        e.preventDefault();
      }
    });

    const weapons = ['blaster', 'scatter', 'railgun', 'bouncing', 'rocket', 'cryo', 'flame', 'seeker'];
    let curWpIdx = 0;
    window.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > 10) {
        curWpIdx = (curWpIdx + (e.deltaY > 0 ? 1 : -1) + weapons.length) % weapons.length;
        if (this.onWeaponChange) this.onWeaponChange(weapons[curWpIdx]);
      }
    }, { passive: true });
  }

  updateAimAngle() {
    if (this.arrowShooting) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    this.aimAngle = Math.atan2(this.mouse.y - centerY, this.mouse.x - centerX);
  }

  setupTouch() {
    const joyMoveEl = document.getElementById('touch-joy-move');
    const joyAimEl = document.getElementById('touch-joy-aim');
    const btnDash = document.getElementById('btn-touch-dash');
    const btnSuper = document.getElementById('btn-touch-super');
    const btnEmoji = document.getElementById('btn-touch-emoji');

    if (btnDash) {
      btnDash.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.onDash) this.onDash();
      }, { passive: false });
    }

    if (btnSuper) {
      btnSuper.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.onSuperActivate) this.onSuperActivate();
      }, { passive: false });
    }

    if (btnEmoji) {
      btnEmoji.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.onEmojiToggle) this.onEmojiToggle();
      }, { passive: false });
    }

    const btnParry = document.getElementById('btn-touch-parry');
    if (btnParry) {
      btnParry.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.onParry) this.onParry();
      }, { passive: false });
    }

    if (!joyMoveEl || !joyAimEl) return;

    const moveThumb = joyMoveEl.querySelector('.joy-thumb');
    const aimThumb = joyAimEl.querySelector('.joy-thumb');
    const maxRadius = 45;

    const handleMoveTouch = (touch) => {
      const rect = joyMoveEl.getBoundingClientRect();
      const dx = touch.clientX - (rect.left + rect.width / 2);
      const dy = touch.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const clampedDist = Math.min(dist, maxRadius);

      const thumbX = Math.cos(angle) * clampedDist;
      const thumbY = Math.sin(angle) * clampedDist;

      if (moveThumb) moveThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;

      this.joyMove.x = thumbX / maxRadius;
      this.joyMove.y = thumbY / maxRadius;
      this.joyMove.active = true;
    };

    const handleAimTouch = (touch) => {
      const rect = joyAimEl.getBoundingClientRect();
      const dx = touch.clientX - (rect.left + rect.width / 2);
      const dy = touch.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const clampedDist = Math.min(dist, maxRadius);

      const thumbX = Math.cos(angle) * clampedDist;
      const thumbY = Math.sin(angle) * clampedDist;

      if (aimThumb) aimThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;

      if (dist > TOUCH_AIM_DEADZONE) {
        if (!this.joyAim.active) {
          this.aimAngle = angle;
        }
        this.joyAim.targetAngle = angle;
      }
      this.joyAim.active = true;
      this.isShooting = dist > TOUCH_AIM_DEADZONE;
    };

    joyMoveEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.joyMove.touchId = touch.identifier;
      handleMoveTouch(touch);
    }, { passive: false });

    joyAimEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.joyAim.touchId = touch.identifier;
      handleAimTouch(touch);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joyMove.touchId) handleMoveTouch(touch);
        else if (touch.identifier === this.joyAim.touchId) handleAimTouch(touch);
      }
    }, { passive: false });

    const handleTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joyMove.touchId) {
          this.joyMove.active = false;
          this.joyMove.touchId = null;
          this.joyMove.x = 0;
          this.joyMove.y = 0;
          if (moveThumb) moveThumb.style.transform = 'translate(0px, 0px)';
        } else if (touch.identifier === this.joyAim.touchId) {
          this.joyAim.active = false;
          this.joyAim.touchId = null;
          this.isShooting = false;
          if (aimThumb) aimThumb.style.transform = 'translate(0px, 0px)';
        }
      }
    };

    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
  }

  getPayload() {
    if (this.joyAim.active) {
      let angleDelta = this.joyAim.targetAngle - this.aimAngle;
      while (angleDelta < -Math.PI) angleDelta += Math.PI * 2;
      while (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
      this.aimAngle += angleDelta * TOUCH_AIM_RESPONSE;
    }

    const shooting = this.isShooting || this.mouse.down || this.keyFire || this.arrowShooting;

    return {
      movement: {
        up: this.keys.up,
        down: this.keys.down,
        left: this.keys.left,
        right: this.keys.right,
        joyX: this.joyMove.active ? this.joyMove.x : 0,
        joyY: this.joyMove.active ? this.joyMove.y : 0
      },
      aimAngle: this.aimAngle,
      shooting: !!shooting
    };
  }
}
