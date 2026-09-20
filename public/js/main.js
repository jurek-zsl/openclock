import { sounds } from './audio.js';
import { InputController } from './input.js';
import { GameRenderer } from './renderer.js';
import { QuickChat } from './quickchat.js';
import { icons } from './icons.js';

class OverclockClient {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.renderer = new GameRenderer(this.canvas, this.minimapCanvas);
    this.hangarCanvas = document.getElementById('hangar-canvas');

    this.socket = null;
    this.localPlayerId = null;
    this.isHost = false;
    this.currentBotCount = 0;
    this.currentBotDifficulty = 'medium';
    this.spectateTargetId = null;

    this.selectedColor = '#00f7ff';
    this.selectedClass = 'spectre';
    this.selectedWeapon = 'blaster';
    this.selectedTitle = 'Cyber Ghost';
    this.hasJoined = false;

    this.latestState = {
      players: [],
      projectiles: [],
      powerups: [],
      events: [],
      mapId: 'core',
      gameMode: 'ffa',
      botCount: 0
    };
    this.lastFrameTime = performance.now();

    this.initUI();
    this.initHostControls();
    this.initNetworkInfo();
    this.connectWebSocket();
  }

  async initNetworkInfo() {
    try {
      const res = await fetch('/api/info');
      const data = await res.json();

      const qrImg = document.getElementById('lan-qr-img');
      const urlDisplay = document.getElementById('lan-url-display');
      const ipStatus = document.getElementById('status-ip');
      const netStatus = document.getElementById('status-net');
      const qrPlaceholder = document.getElementById('qr-loading-placeholder');

      if (qrImg && data.qrCode) {
        qrImg.src = data.qrCode;
        qrImg.style.display = 'block';
        if (qrPlaceholder) qrPlaceholder.style.display = 'none';
      }
      if (urlDisplay) urlDisplay.value = data.url;
      if (ipStatus && data.url) ipStatus.innerText = data.url.replace(/^https?:\/\//, '');
      if (netStatus) netStatus.innerText = 'ONLINE';
    } catch (e) {
      console.warn('Could not fetch LAN info:', e);
      const urlDisplay = document.getElementById('lan-url-display');
      if (urlDisplay) urlDisplay.value = window.location.origin;
    }
  }

  updateClassStats(className) {
    const titleEl = document.getElementById('hangar-class-title');
    const speedBar = document.getElementById('stat-speed-bar');
    const armorBar = document.getElementById('stat-armor-bar');
    const rateBar = document.getElementById('stat-rate-bar');
    const superBadge = document.getElementById('stat-super-badge');

    const stats = {
      spectre: {
        title: 'SPECTRE [SCOUT]',
        speed: '95%',
        armor: '40%',
        rate: '70%',
        super: 'STEALTH CLOAK'
      },
      titan: {
        title: 'TITAN [HEAVY TANK]',
        speed: '45%',
        armor: '100%',
        rate: '55%',
        super: 'PLASMA SHIELD'
      },
      viper: {
        title: 'VIPER [STRIKER]',
        speed: '85%',
        armor: '55%',
        rate: '95%',
        super: 'OVERDRIVE BERSERK'
      },
      vortex: {
        title: 'VORTEX [TACTICAL]',
        speed: '70%',
        armor: '70%',
        rate: '65%',
        super: 'EMP SHOCKWAVE'
      },
      chrono: {
        title: 'CHRONO [TIME WARPER]',
        speed: '75%',
        armor: '65%',
        rate: '70%',
        super: 'TIME RECALL'
      },
      aegis: {
        title: 'AEGIS [BASTION DEFENDER]',
        speed: '50%',
        armor: '85%',
        rate: '60%',
        super: 'HEX-DOME'
      },
      phantom: {
        title: 'PHANTOM [VOID INFILTRATOR]',
        speed: '90%',
        armor: '45%',
        rate: '80%',
        super: 'VOID PHASE'
      },
      gravity: {
        title: 'GRAVITY [SINGULARITY]',
        speed: '65%',
        armor: '75%',
        rate: '65%',
        super: 'BLACK HOLE'
      }
    };

    const s = stats[className] || stats.spectre;
    if (titleEl) titleEl.innerText = s.title;
    if (speedBar) speedBar.style.width = s.speed;
    if (armorBar) armorBar.style.width = s.armor;
    if (rateBar) rateBar.style.width = s.rate;
    if (superBadge) superBadge.innerText = s.super;
  }

  initUI() {
    this.updateClassStats(this.selectedClass);

    const nickInput = document.getElementById('input-nickname');
    const savedNick = localStorage.getItem('neon_clash_nick');
    if (savedNick && nickInput) nickInput.value = savedNick;

    const titleSelect = document.getElementById('select-title');
    if (titleSelect) {
      titleSelect.addEventListener('change', (e) => {
        sounds.init();
        sounds.playUiClick();
        this.selectedTitle = e.target.value;
      });
    }

    // Mech Class Pickers
    const classButtons = document.querySelectorAll('.class-choice');
    classButtons.forEach(cb => {
      cb.addEventListener('mouseenter', () => {
        sounds.init();
        sounds.playUiHover();
      });
      cb.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        classButtons.forEach(c => c.classList.remove('active'));
        cb.classList.add('active');
        this.selectedClass = cb.getAttribute('data-class');
        this.updateClassStats(this.selectedClass);
      });
    });

    // Hull Color Pickers
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('mouseenter', () => {
        sounds.init();
        sounds.playUiHover();
      });
      swatch.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.selectedColor = swatch.getAttribute('data-color');
      });
    });

    // Weapon choice buttons
    const weaponButtons = document.querySelectorAll('.weapon-choice');
    weaponButtons.forEach(wb => {
      wb.addEventListener('mouseenter', () => {
        sounds.init();
        sounds.playUiHover();
      });
      wb.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        weaponButtons.forEach(w => w.classList.remove('active'));
        wb.classList.add('active');
        this.selectedWeapon = wb.getAttribute('data-weapon');
      });
    });

    // Deploy Button
    const btnDeploy = document.getElementById('btn-deploy');
    if (btnDeploy) {
      btnDeploy.addEventListener('mouseenter', () => {
        sounds.init();
        sounds.playUiHover();
      });
      btnDeploy.addEventListener('click', () => this.deploy());
    }
    if (nickInput) {
      nickInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.deploy();
      });
    }

    // Copy URL
    const btnCopy = document.getElementById('btn-copy-url');
    const urlDisplay = document.getElementById('lan-url-display');
    if (btnCopy && urlDisplay) {
      btnCopy.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        navigator.clipboard.writeText(urlDisplay.value).then(() => {
          btnCopy.innerText = 'COPIED!';
          setTimeout(() => btnCopy.innerText = 'COPY', 2000);
        }).catch(() => {
          urlDisplay.select();
        });
      });
    }

    // Claim Host Button (Requires Security PIN 1510)
    const btnClaimHost = document.getElementById('btn-claim-host');
    if (btnClaimHost) {
      btnClaimHost.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        const enteredPin = window.prompt('ENTER HOST SECURITY PIN // [PASSWORD]:');
        if (enteredPin && this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'claim_host', pin: enteredPin.trim() }));
        }
      });
    }

    // Synchronize Audio & Display UI Toggles (Settings Modal)
    const syncSettingsUI = () => {
      const bgmActive = typeof sounds.bgmActive !== 'undefined' ? sounds.bgmActive : !sounds.bgmMuted;
      const isMuted = !!sounds.muted;
      const crtEnabled = this.renderer ? !!this.renderer.crtFilterEnabled : true;

      // Settings Modal toggles
      const btnSettingSynth = document.getElementById('btn-setting-synth');
      const txtSettingSynth = document.getElementById('txt-setting-synth');
      if (btnSettingSynth && txtSettingSynth) {
        btnSettingSynth.className = bgmActive ? 'setting-toggle-btn active' : 'setting-toggle-btn off';
        txtSettingSynth.innerText = bgmActive ? 'ON' : 'OFF';
      }

      const btnSettingSfx = document.getElementById('btn-setting-sfx');
      const txtSettingSfx = document.getElementById('txt-setting-sfx');
      if (btnSettingSfx && txtSettingSfx) {
        btnSettingSfx.className = !isMuted ? 'setting-toggle-btn active' : 'setting-toggle-btn muted';
        txtSettingSfx.innerText = !isMuted ? 'ON' : 'MUTED';
      }

      const btnSettingCrt = document.getElementById('btn-setting-crt');
      const txtSettingCrt = document.getElementById('txt-setting-crt');
      if (btnSettingCrt && txtSettingCrt) {
        btnSettingCrt.className = crtEnabled ? 'setting-toggle-btn active' : 'setting-toggle-btn off';
        txtSettingCrt.innerText = crtEnabled ? 'ON' : 'OFF';
      }
    };
    this.syncSettingsUI = syncSettingsUI;
    syncSettingsUI();

    // Top HUD Controls
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
      });
    }

    const btnCloseControls = document.getElementById('btn-close-controls');
    const controlsModal = document.getElementById('controls-modal');
    if (btnCloseControls && controlsModal) {
      btnCloseControls.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        controlsModal.classList.add('hidden');
      });
    }

    // Lobby Settings Modal
    const btnLobbySettings = document.getElementById('btn-lobby-settings');
    const settingsModal = document.getElementById('settings-modal');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnSettingsOpenGuide = document.getElementById('btn-settings-open-guide');

    if (btnLobbySettings && settingsModal) {
      btnLobbySettings.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        syncSettingsUI();
        settingsModal.classList.toggle('hidden');
      });
    }
    if (btnCloseSettings && settingsModal) {
      btnCloseSettings.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        settingsModal.classList.add('hidden');
      });
    }

    const btnSettingSynth = document.getElementById('btn-setting-synth');
    if (btnSettingSynth) {
      btnSettingSynth.addEventListener('click', () => {
        sounds.init();
        sounds.toggleBGM();
        syncSettingsUI();
      });
    }

    const btnSettingSfx = document.getElementById('btn-setting-sfx');
    if (btnSettingSfx) {
      btnSettingSfx.addEventListener('click', () => {
        sounds.init();
        sounds.toggleMute();
        syncSettingsUI();
      });
    }

    const btnSettingCrt = document.getElementById('btn-setting-crt');
    if (btnSettingCrt) {
      btnSettingCrt.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        this.renderer.toggleCRT();
        syncSettingsUI();
      });
    }

    // Tactical Field Guide Modal
    const btnLobbyGuide = document.getElementById('btn-lobby-guide');
    const guideModal = document.getElementById('guide-modal');
    const btnCloseGuide = document.getElementById('btn-close-guide');

    const openGuideModal = () => {
      sounds.init();
      sounds.playUiClick();
      if (settingsModal) settingsModal.classList.add('hidden');
      if (guideModal) guideModal.classList.remove('hidden');
    };

    if (btnLobbyGuide) btnLobbyGuide.addEventListener('click', openGuideModal);
    if (btnSettingsOpenGuide) btnSettingsOpenGuide.addEventListener('click', openGuideModal);

    if (btnCloseGuide && guideModal) {
      btnCloseGuide.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        guideModal.classList.add('hidden');
      });
    }

    // Guide Tab Switching
    const guideTabBtns = document.querySelectorAll('.guide-tab-btn');
    const guidePanels = document.querySelectorAll('.guide-panel');
    guideTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        const tabId = btn.getAttribute('data-tab');
        guideTabBtns.forEach(b => b.classList.remove('active'));
        guidePanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(tabId);
        if (target) target.classList.add('active');
      });
    });

    // Close Modals on Escape Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (settingsModal && !settingsModal.classList.contains('hidden')) {
          settingsModal.classList.add('hidden');
        } else if (guideModal && !guideModal.classList.contains('hidden')) {
          guideModal.classList.add('hidden');
        } else if (controlsModal && !controlsModal.classList.contains('hidden')) {
          controlsModal.classList.add('hidden');
        }
      }
    });

    this.quickChat = new QuickChat((emoji) => this.sendEmoji(emoji));

    this.inputs = new InputController(
      this.canvas,
      (weapon) => this.switchWeapon(weapon),
      () => this.triggerDash(),
      () => this.quickChat.toggle(),
      () => this.triggerSuper(),
      () => this.triggerParry()
    );

    // Populate Tactical Weapon Dock Icons & Click listeners
    const weaponKeys = ['blaster', 'scatter', 'railgun', 'bouncing', 'rocket', 'cryo', 'flame', 'seeker'];
    weaponKeys.forEach(w => {
      const iconEl = document.getElementById(`slot-icon-${w}`);
      if (iconEl && icons[w]) iconEl.innerHTML = icons[w];
    });

    document.querySelectorAll('.weapon-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const weapon = slot.getAttribute('data-weapon');
        if (weapon) this.switchWeapon(weapon);
      });
    });

    // Spectator Mode Buttons
    const btnSpecPrev = document.getElementById('btn-spec-prev');
    const btnSpecNext = document.getElementById('btn-spec-next');
    if (btnSpecPrev) btnSpecPrev.addEventListener('click', () => this.cycleSpectateTarget(-1));
    if (btnSpecNext) btnSpecNext.addEventListener('click', () => this.cycleSpectateTarget(1));

    // Victory Podium Modal Close / Return to Lobby Button
    const btnClosePodium = document.getElementById('btn-close-podium');
    if (btnClosePodium) {
      btnClosePodium.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        document.getElementById('podium-modal')?.classList.add('hidden');
        document.getElementById('lobby-modal')?.classList.remove('hidden');
        this.hasJoined = false;
        sounds.stopSynthwaveBGM();
        sounds.stopAllAudio();
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'return_to_lobby' }));
        }
      });
    }

    // Global Key listener for Host Panel ('H') and Spectator cycling
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if ((e.key === 'h' || e.key === 'H') && this.isHost) {
        this.toggleHostModal();
      }

      const me = this.latestState.players.find(p => p.id === this.localPlayerId);
      if (me && !me.isAlive) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          this.cycleSpectateTarget(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          this.cycleSpectateTarget(1);
        }
      }
    });

    requestAnimationFrame((t) => this.loop(t));
  }

  initHostControls() {
    // Lobby Host Selectors
    const mapSelect = document.getElementById('select-map');
    if (mapSelect) {
      mapSelect.addEventListener('change', (e) => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'change_map', mapId: e.target.value }));
        }
      });
    }

    const modeSelect = document.getElementById('select-gamemode');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'change_mode', mode: e.target.value }));
        }
      });
    }

    // Lobby Bot Stepper & Difficulty
    const btnLobbyBotPlus = document.getElementById('btn-lobby-bot-plus');
    const btnLobbyBotMinus = document.getElementById('btn-lobby-bot-minus');
    if (btnLobbyBotPlus) {
      btnLobbyBotPlus.addEventListener('click', () => this.adjustBots(1));
    }
    if (btnLobbyBotMinus) {
      btnLobbyBotMinus.addEventListener('click', () => this.adjustBots(-1));
    }

    const lobbyBotDiffSelect = document.getElementById('select-bot-difficulty');
    if (lobbyBotDiffSelect) {
      lobbyBotDiffSelect.addEventListener('change', (e) => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'set_bot_difficulty', difficulty: e.target.value }));
        }
      });
    }

    // In-game Host Panel Buttons
    const btnHostPanel = document.getElementById('btn-host-panel');
    const btnTouchHost = document.getElementById('btn-touch-host');
    const btnCloseHost = document.getElementById('btn-close-host');

    if (btnHostPanel) btnHostPanel.addEventListener('click', () => this.toggleHostModal());
    if (btnTouchHost) btnTouchHost.addEventListener('click', () => this.toggleHostModal());
    if (btnCloseHost) btnCloseHost.addEventListener('click', () => this.toggleHostModal(false));

    const hostMapSelect = document.getElementById('host-select-map');
    if (hostMapSelect) {
      hostMapSelect.addEventListener('change', (e) => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'change_map', mapId: e.target.value }));
        }
      });
    }

    const hostModeSelect = document.getElementById('host-select-mode');
    if (hostModeSelect) {
      hostModeSelect.addEventListener('change', (e) => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'change_mode', mode: e.target.value }));
        }
      });
    }

    const btnBotPlus = document.getElementById('btn-bot-plus');
    const btnBotMinus = document.getElementById('btn-bot-minus');
    if (btnBotPlus) btnBotPlus.addEventListener('click', () => this.adjustBots(1));
    if (btnBotMinus) btnBotMinus.addEventListener('click', () => this.adjustBots(-1));

    const hostBotDiffSelect = document.getElementById('host-select-bot-difficulty');
    if (hostBotDiffSelect) {
      hostBotDiffSelect.addEventListener('change', (e) => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'set_bot_difficulty', difficulty: e.target.value }));
        }
      });
    }

    // Host Action Buttons
    const btnSuddenDeath = document.getElementById('btn-host-sudden-death');
    if (btnSuddenDeath) {
      btnSuddenDeath.addEventListener('click', () => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'host_action', action: 'sudden_death' }));
          this.toggleHostModal(false);
        }
      });
    }

    const btnMegaCrate = document.getElementById('btn-host-mega-crate');
    if (btnMegaCrate) {
      btnMegaCrate.addEventListener('click', () => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'host_action', action: 'mega_crate' }));
          this.toggleHostModal(false);
        }
      });
    }

    const btnResetScores = document.getElementById('btn-host-reset-scores');
    if (btnResetScores) {
      btnResetScores.addEventListener('click', () => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'host_action', action: 'reset_scores' }));
          this.toggleHostModal(false);
        }
      });
    }

    // Host Custom Game Mutators
    const speedSlider = document.getElementById('host-mutator-speed');
    const speedVal = document.getElementById('val-host-speed');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (speedVal) speedVal.innerText = `${val.toFixed(1)}x`;
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'set_mutator', key: 'speed', value: val }));
        }
      });
    }

    const toggles = ['infiniteDash', 'unlimitedSupers', 'vampirism', 'instagib', 'bouncingHell', 'lowFriction'];
    toggles.forEach(key => {
      const el = document.getElementById(`host-toggle-${key}`);
      if (el) {
        el.addEventListener('click', () => {
          if (!this.isHost || this.socket?.readyState !== WebSocket.OPEN) return;
          const current = !!(this.mutators && this.mutators[key]);
          this.socket.send(JSON.stringify({ type: 'set_mutator', key, value: !current }));
        });
      }
    });

    const wpLockSelect = document.getElementById('host-select-weaponLock');
    if (wpLockSelect) {
      wpLockSelect.addEventListener('change', (e) => {
        if (this.isHost && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'set_mutator', key: 'weaponLock', value: e.target.value || null }));
        }
      });
    }

    const btnReturnLobby = document.getElementById('btn-host-return-lobby');
    if (btnReturnLobby) {
      btnReturnLobby.addEventListener('click', () => {
        sounds.init();
        sounds.playUiClick();
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'return_to_lobby' }));
        }
        this.toggleHostModal(false);
        document.getElementById('lobby-modal')?.classList.remove('hidden');
        this.hasJoined = false;
        sounds.stopSynthwaveBGM();
        sounds.stopAllAudio();
      });
    }
  }

  updateMutatorsUI(mutators) {
    if (!mutators) return;
    this.mutators = mutators;

    const speedSlider = document.getElementById('host-mutator-speed');
    const speedVal = document.getElementById('val-host-speed');
    if (speedSlider && document.activeElement !== speedSlider) {
      speedSlider.value = mutators.speed || 1.0;
    }
    if (speedVal) speedVal.innerText = `${(mutators.speed || 1.0).toFixed(1)}x`;

    const toggles = ['infiniteDash', 'unlimitedSupers', 'vampirism', 'instagib', 'bouncingHell', 'lowFriction'];
    toggles.forEach(key => {
      const el = document.getElementById(`host-toggle-${key}`);
      if (el) {
        const active = !!mutators[key];
        el.classList.toggle('active', active);
        const statusSpan = el.querySelector('.m-status');
        if (statusSpan) statusSpan.innerText = active ? 'ON' : 'OFF';
      }
    });

    const wpLockSelect = document.getElementById('host-select-weaponLock');
    if (wpLockSelect && document.activeElement !== wpLockSelect) {
      wpLockSelect.value = (mutators.weaponLock && mutators.weaponLock !== 'none') ? mutators.weaponLock : '';
    }
  }

  adjustBots(delta) {
    if (!this.isHost) return;
    const newCount = Math.max(0, Math.min(8, this.currentBotCount + delta));
    if (newCount !== this.currentBotCount) {
      this.currentBotCount = newCount;
      this.updateBotDisplays(newCount, this.currentBotDifficulty);
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'set_bots',
          count: newCount,
          difficulty: this.currentBotDifficulty
        }));
      }
    }
  }

  updateBotDisplays(count, difficulty) {
    if (typeof count === 'number') this.currentBotCount = count;
    if (difficulty) this.currentBotDifficulty = difficulty;

    const diff = this.currentBotDifficulty || 'medium';
    const diffUpper = diff.toUpperCase();

    const lobbyBotDisplay = document.getElementById('lobby-bot-display');
    const hostBotDisplay = document.getElementById('host-bot-display');
    const guestBotDisplay = document.getElementById('guest-bots-display');

    const str = `${this.currentBotCount} BOTS`;
    if (lobbyBotDisplay) lobbyBotDisplay.innerText = str;
    if (hostBotDisplay) hostBotDisplay.innerText = str;
    if (guestBotDisplay) guestBotDisplay.innerText = `${this.currentBotCount} BOTS [${diffUpper}]`;

    const lobbyBotDiffSelect = document.getElementById('select-bot-difficulty');
    if (lobbyBotDiffSelect && lobbyBotDiffSelect.value !== diff) {
      lobbyBotDiffSelect.value = diff;
    }
    const hostBotDiffSelect = document.getElementById('host-select-bot-difficulty');
    if (hostBotDiffSelect && hostBotDiffSelect.value !== diff) {
      hostBotDiffSelect.value = diff;
    }
  }

  toggleHostModal(forceState) {
    const modal = document.getElementById('host-modal');
    if (!modal) return;
    if (typeof forceState === 'boolean') {
      if (forceState) modal.classList.remove('hidden');
      else modal.classList.add('hidden');
    } else {
      modal.classList.toggle('hidden');
    }
  }

  updateHostPermissions(isHost) {
    this.isHost = isHost;

    const lobbyHostPanel = document.getElementById('lobby-host-panel');
    const lobbyGuestPanel = document.getElementById('lobby-guest-panel');
    const btnHostPanel = document.getElementById('btn-host-panel');
    const btnTouchHost = document.getElementById('btn-touch-host');

    if (isHost) {
      if (lobbyHostPanel) lobbyHostPanel.classList.remove('hidden');
      if (lobbyGuestPanel) lobbyGuestPanel.classList.add('hidden');
      if (btnHostPanel) btnHostPanel.classList.remove('hidden');
      if (btnTouchHost) btnTouchHost.classList.remove('hidden');
    } else {
      if (lobbyHostPanel) lobbyHostPanel.classList.add('hidden');
      if (lobbyGuestPanel) lobbyGuestPanel.classList.remove('hidden');
      if (btnHostPanel) btnHostPanel.classList.add('hidden');
      if (btnTouchHost) btnTouchHost.classList.add('hidden');
    }
  }

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'ping', time: Date.now() }));
        }
      }, 2000);
    };

    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'welcome':
            this.localPlayerId = msg.playerId;
            this.updateHostPermissions(msg.isHost);
            this.renderer.setMapConfig(msg.currentMap);
            this.updateMapModeHUD(msg.currentMapId, msg.gameMode);
            this.updateBotDisplays(msg.botCount || 0, msg.botDifficulty || 'medium');

            // Sync selectors to current server state
            const mapSelect = document.getElementById('select-map');
            const hostMapSelect = document.getElementById('host-select-map');
            if (mapSelect) mapSelect.value = msg.currentMapId;
            if (hostMapSelect) hostMapSelect.value = msg.currentMapId;

            const modeSelect = document.getElementById('select-gamemode');
            const hostModeSelect = document.getElementById('host-select-mode');
            if (modeSelect) modeSelect.value = msg.gameMode;
            if (hostModeSelect) hostModeSelect.value = msg.gameMode;
            break;

          case 'host_promoted':
            this.updateHostPermissions(true);
            this.showAnnouncement('👑 YOU ARE NOW ROOM HOST! 👑');
            break;

          case 'map_change':
            this.renderer.setMapConfig(msg.map);
            this.updateMapModeHUD(msg.mapId, this.latestState.gameMode);
            this.showAnnouncement(`MAP: ${msg.map.name.toUpperCase()}`);
            break;

          case 'joined':
            this.hasJoined = true;
            this.updateHostPermissions(msg.isHost);
            document.getElementById('lobby-modal').classList.add('hidden');
            setInterval(() => this.sendInput(), 1000 / 35);
            sounds.startSynthwaveBGM();
            break;

          case 'pong':
            const rtt = Date.now() - msg.clientTime;
            const pingEl = document.getElementById('hud-ping');
            if (pingEl) pingEl.innerText = `PING: ${rtt}ms`;
            break;

          case 'error':
            this.showAnnouncement(`⚠️ ${msg.message}`);
            break;

          case 'state':
            this.handleServerState(msg.data);
            break;
        }
      } catch (err) {
        console.error('Socket error:', err);
      }
    };

    this.socket.onclose = () => {
      setTimeout(() => this.connectWebSocket(), 2000);
    };
  }

  deploy() {
    sounds.init();
    sounds.playDeploy();

    const nickInput = document.getElementById('input-nickname');
    const name = (nickInput?.value || 'Pilot').trim();
    localStorage.setItem('neon_clash_nick', name);

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'join',
        name,
        color: this.selectedColor,
        mechClass: this.selectedClass,
        weapon: this.selectedWeapon,
        title: this.selectedTitle
      }));
      if (this.isHost) {
        this.socket.send(JSON.stringify({ type: 'start_match' }));
      }
    }
  }

  sendInput() {
    if (!this.hasJoined || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({
      type: 'input',
      data: this.inputs.getPayload()
    }));
  }

  triggerDash() {
    if (!this.hasJoined || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({
      type: 'input',
      data: { dash: true }
    }));
  }

  triggerSuper() {
    if (!this.hasJoined || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({ type: 'super' }));
  }

  triggerParry() {
    if (!this.hasJoined || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    const localP = this.latestState?.players?.find(p => p.id === this.localPlayerId);
    if (!localP || !localP.parryCooldownRemaining || localP.parryCooldownRemaining <= 0) {
      sounds.playParryActivate();
    }
    this.socket.send(JSON.stringify({ type: 'parry' }));
  }

  switchWeapon(weapon) {
    if (this.mutators?.weaponLock && this.mutators.weaponLock !== 'none') {
      this.showAnnouncement(`WEAPON LOCKED BY HOST // ${this.mutators.weaponLock.toUpperCase()}`);
      return;
    }
    if (this.latestState?.gameMode === 'gungame') {
      this.showAnnouncement('WEAPON LOCKED // EARN KILLS TO TIER UP');
      return;
    }
    this.selectedWeapon = weapon;
    this.updateWeaponDock(weapon, this.latestState?.gameMode);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'change_weapon', weapon }));
    }
  }

  updateWeaponDock(activeWeapon, gameMode, tier) {
    const slots = document.querySelectorAll('.weapon-slot');
    slots.forEach(slot => {
      const w = slot.getAttribute('data-weapon');
      if (w === activeWeapon) {
        slot.classList.add('active');
      } else {
        slot.classList.remove('active');
      }

      if (this.mutators?.weaponLock && this.mutators.weaponLock !== 'none') {
        if (w !== this.mutators.weaponLock) {
          slot.classList.add('locked');
        } else {
          slot.classList.remove('locked');
        }
      } else if (gameMode === 'gungame') {
        if (w !== activeWeapon) {
          slot.classList.add('locked');
        } else {
          slot.classList.remove('locked');
        }
      } else {
        slot.classList.remove('locked');
      }
    });
  }

  cycleSpectateTarget(delta) {
    sounds.init();
    sounds.playUiClick();
    const living = this.latestState.players.filter(p => p.isAlive && p.id !== this.localPlayerId);
    const candidates = [...living.map(p => ({ id: p.id, name: p.name }))];
    if (this.latestState.gameMode === 'pve' && this.latestState.pve?.boss && this.latestState.pve.boss.health > 0) {
      candidates.push({ id: 'boss', name: 'GOLIATH CORE [BOSS]' });
    }
    if (candidates.length === 0) {
      this.spectateTargetId = null;
      const nameEl = document.getElementById('spec-target-name');
      if (nameEl) nameEl.innerText = 'NO ACTIVE PILOTS';
      return;
    }
    let curIdx = candidates.findIndex(c => c.id === this.spectateTargetId);
    if (curIdx === -1) curIdx = 0;
    else curIdx = (curIdx + delta + candidates.length) % candidates.length;

    const chosen = candidates[curIdx];
    this.spectateTargetId = chosen.id;
    const nameEl = document.getElementById('spec-target-name');
    if (nameEl) nameEl.innerText = chosen.name;
  }

  showPodiumModal(podium) {
    const modal = document.getElementById('podium-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const p1 = podium?.first || podium?.top3?.[0] || null;
    const p2 = podium?.second || podium?.top3?.[1] || null;
    const p3 = podium?.third || podium?.top3?.[2] || null;

    const el1Name = document.getElementById('podium-name-1');
    const el1Score = document.getElementById('podium-score-1');
    if (el1Name) {
      el1Name.innerText = p1 ? p1.name : '--';
      el1Name.style.color = p1?.color || '#ffe600';
    }
    if (el1Score) {
      el1Score.innerText = p1 ? `${p1.score ?? 0} PTS (${p1.kills ?? 0} K)` : '-- PTS';
    }

    const el2Name = document.getElementById('podium-name-2');
    const el2Score = document.getElementById('podium-score-2');
    if (el2Name) {
      el2Name.innerText = p2 ? p2.name : '--';
      el2Name.style.color = p2?.color || '#e0e6ed';
    }
    if (el2Score) {
      el2Score.innerText = p2 ? `${p2.score ?? 0} PTS (${p2.kills ?? 0} K)` : '-- PTS';
    }

    const el3Name = document.getElementById('podium-name-3');
    const el3Score = document.getElementById('podium-score-3');
    if (el3Name) {
      el3Name.innerText = p3 ? p3.name : '--';
      el3Name.style.color = p3?.color || '#cd7f32';
    }
    if (el3Score) {
      el3Score.innerText = p3 ? `${p3.score ?? 0} PTS (${p3.kills ?? 0} K)` : '-- PTS';
    }

    const subEl = document.getElementById('podium-subtitle');
    if (subEl) {
      if (podium?.winningTeam) {
        subEl.innerText = `${podium.winningTeam.toUpperCase()} TEAM VICTORY // MATCH CONCLUDED`;
      } else if (podium?.reason === 'battleroyale_win') {
        subEl.innerText = 'APEX CHAMPION // LAST MECH STANDING';
      } else if (podium?.reason === 'gungame_win') {
        subEl.innerText = 'WEAPON MASTER // GUN GAME COMPLETED';
      } else {
        subEl.innerText = 'VICTORY CEREMONY // MVP AWARDS';
      }
    }

    const mvpBox = document.getElementById('podium-mvp');
    if (mvpBox) {
      if (Array.isArray(podium?.mvps) && podium.mvps.length > 0) {
        mvpBox.innerHTML = podium.mvps.map(m => `
          <div class="mvp-pill"><span style="color:#00f7ff;font-weight:700;">${m.label}:</span> ${m.name} <span style="color:#ffaa00;">(${m.value})</span></div>
        `).join('');
      } else if (podium?.mvp) {
        mvpBox.innerHTML = `
          <div class="mvp-pill"><span style="color:#00f7ff;font-weight:700;">👑 CHAMPION:</span> ${podium.mvp.champion || 'N/A'}</div>
          <div class="mvp-pill"><span style="color:#00f7ff;font-weight:700;">💀 MOST LETHAL:</span> ${podium.mvp.lethal || 'N/A'}</div>
          <div class="mvp-pill"><span style="color:#00f7ff;font-weight:700;">🎯 APEX SCORER:</span> ${podium.mvp.accuracy || 'N/A'}</div>
        `;
      }
    }

    // Match End Full Leaderboard Standings
    const lbContainer = document.getElementById('podium-leaderboard');
    if (lbContainer) {
      const players = podium?.leaderboard || (this.latestState?.players || []);
      if (players && players.length > 0) {
        lbContainer.innerHTML = `
          <div class="podium-lb-title">MATCH COMBAT STANDINGS</div>
          <div class="podium-lb-header">
            <span>#</span><span>PILOT</span><span>KILLS</span><span>DEATHS</span><span>DMG</span><span>SCORE</span>
          </div>
          <div class="podium-lb-rows">
            ${players.map((p, i) => `
              <div class="podium-lb-row ${p.id === this.localPlayerId ? 'me' : ''}">
                <span class="col-r">${p.rank || (i + 1)}</span>
                <span class="col-p" style="color: ${p.color || '#00f7ff'}">
                  ${p.isCrownKing ? '👑 ' : ''}${p.name} ${p.isBot ? '<small class="bot-badge">[AI]</small>' : ''}
                </span>
                <span class="col-k">${p.kills ?? 0}</span>
                <span class="col-d">${p.deaths ?? 0}</span>
                <span class="col-dmg">${p.damage ?? Math.round(p.damageDealt || 0)}</span>
                <span class="col-s">${p.score ?? 0}</span>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        lbContainer.innerHTML = '';
      }
    }
  }

  sendEmoji(emoji) {
    if (!this.hasJoined || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({ type: 'emoji', emoji }));
  }

  handleServerState(state) {
    this.latestState = state;

    // Podium sync (guarantees match end results are rendered if active)
    if (state.podium && state.podium.active) {
      this.showPodiumModal(state.podium);
    }

    // 1. Unconditional Leaderboard update (always on every snapshot)
    if (state.players) {
      this.updateLeaderboard(state.players);
    }

    // 2. Round Timer display update
    if (typeof state.roundTimer === 'number') {
      const timerEl = document.getElementById('round-timer-display');
      if (timerEl) {
        const mins = Math.floor(state.roundTimer / 60);
        const secs = state.roundTimer % 60;
        timerEl.innerText = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (state.roundTimer <= 30 && state.roundTimer > 0) {
          timerEl.classList.add('timer-warning');
        } else {
          timerEl.classList.remove('timer-warning');
        }
      }
    }

    // 3. Lobby state synchronization
    if (state.inLobby && !this.hasJoined) {
      document.getElementById('lobby-modal')?.classList.remove('hidden');
      document.getElementById('podium-modal')?.classList.add('hidden');
      document.getElementById('respawn-modal')?.classList.add('hidden');
      document.getElementById('spectator-bar')?.classList.add('hidden');
      sounds.stopSynthwaveBGM();
      sounds.stopAllAudio();
    }

    // Obstacles state synchronization (hp, maxHp, isDestroyed)
    if (state.obstacles && this.renderer) {
      this.renderer.updateObstacles(state.obstacles);
    }

    // 4. Mutators UI sync
    if (state.mutators) {
      this.updateMutatorsUI(state.mutators);
    }

    if (state.mapId && state.gameMode) {
      this.updateMapModeHUD(state.mapId, state.gameMode);
    }
    if (typeof state.botCount === 'number' && (state.botCount !== this.currentBotCount || (state.botDifficulty && state.botDifficulty !== this.currentBotDifficulty))) {
      this.updateBotDisplays(state.botCount, state.botDifficulty);
    }

    // Process events
    const inGame = this.hasJoined && (!document.getElementById('lobby-modal') || document.getElementById('lobby-modal').classList.contains('hidden'));
    if (state.events && state.events.length > 0) {
      for (const ev of state.events) {
        switch (ev.type) {
          case 'shoot':
            if (ev.weapon === 'blaster') sounds.playLaser();
            else if (ev.weapon === 'scatter') sounds.playScatter();
            else if (ev.weapon === 'railgun') sounds.playRailgun();
            else if (ev.weapon === 'bouncing') sounds.playBouncing();
            else if (ev.weapon === 'rocket') sounds.playRocket();
            else if (ev.weapon === 'cryo') sounds.playCryo();
            else if (ev.weapon === 'flame') sounds.playFlame();
            else if (ev.weapon === 'seeker') sounds.playSeeker();
            this.renderer.addSparks(ev.x, ev.y, ev.color, 4);
            break;

          case 'hit':
            if (inGame) sounds.playShieldHit();
            this.renderer.addSparks(ev.x, ev.y, ev.color, 6);
            break;

          case 'hit_confirmed':
            if (ev.playerId === this.localPlayerId) {
              sounds.playHitmarker();
              this.renderer.addHitmarker();
            }
            break;

          case 'bounce':
            sounds.playBouncing();
            this.renderer.addSparks(ev.x, ev.y, '#ffe600', 12);
            this.renderer.addScreenShake(5);
            break;

          case 'explosion':
            sounds.playExplosion(ev.radius > 80);
            this.renderer.addExplosion(ev.x, ev.y, ev.radius);
            break;

          case 'dash':
            sounds.playDash();
            this.renderer.addDashTrail(ev.x, ev.y, ev.angle, ev.color);
            break;

          case 'speed_boost':
            sounds.playSpeedPad();
            this.renderer.addDashTrail(ev.x, ev.y, ev.angle, '#00ff66');
            this.renderer.addSparks(ev.x, ev.y, '#00ff66', 14);
            this.renderer.addScreenShake(6);
            break;

          case 'super_activated':
            sounds.playSuper(ev.superType);
            this.renderer.addScreenShake(15);
            this.showAnnouncement(`⚡ ${ev.playerName.toUpperCase()} ACTIVATED SUPER! ⚡`);
            break;

          case 'sudden_death_started':
            sounds.playCrownAlert();
            this.showAnnouncement('⚠️ SUDDEN DEATH LASER APOCALYPSE! ⚠️');
            break;

          case 'mega_crate_spawned':
            if (inGame) sounds.playPowerup();
            this.showAnnouncement('📦 MEGA CRATE DROPPED IN CENTER! 📦');
            break;

          case 'scores_reset':
            this.showAnnouncement('🔄 MATCH SCORES RESET! 🔄');
            break;

          case 'combo_alert':
            this.showAnnouncement(`🔥 ${ev.combo}X COMBO MULTIPLIER! 🔥`);
            break;

          case 'juggernaut_born':
            if (inGame) sounds.playCrownAlert();
            this.showAnnouncement(`💀 JUGGERNAUT ASCENDED: ${ev.playerName.toUpperCase()} 💀`);
            break;

          case 'announcer_call':
            if (inGame) sounds.speakAnnouncer(ev.text);
            break;

          case 'tier_up':
            if (ev.playerId === this.localPlayerId) {
              if (inGame) sounds.playTierUp();
              this.selectedWeapon = ev.weapon;
              this.updateWeaponDock(ev.weapon, state.gameMode, ev.tier);
              this.showAnnouncement(`⭐ TIER ${ev.tier}: ${ev.weapon.toUpperCase()}! ⭐`);
            }
            break;

          case 'match_ended':
            if (inGame) sounds.playVictory();
            this.showPodiumModal(ev.podium);
            break;

          case 'pve_boss_spawned':
            if (inGame) sounds.playCrownAlert();
            this.showAnnouncement('⚠️ GOLIATH CORE AWAKENED! ⚠️');
            break;

          case 'pve_boss_defeated':
            this.showAnnouncement('🏆 GOLIATH CORE DESTROYED! VICTORY! 🏆');
            break;

          case 'infection_started':
            if (inGame) sounds.playCrownAlert();
            this.showAnnouncement('☣️ PATIENT ZERO AWAKENED! ☣️');
            break;

          case 'player_infected':
            if (ev.victimId === this.localPlayerId) {
              this.showAnnouncement('☣️ YOU WERE INFECTED! HUNT SURVIVORS! ☣️');
            }
            break;

          case 'mode_change':
            this.showAnnouncement(`GAMEMODE: ${ev.mode.toUpperCase()}`);
            break;

          case 'bot_difficulty_changed':
            this.updateBotDisplays(this.currentBotCount, ev.difficulty);
            this.showAnnouncement(`🤖 BOT PROTOCOL: ${ev.name.toUpperCase()}`);
            break;

          case 'bots_updated':
            this.updateBotDisplays(ev.count, ev.difficulty);
            break;

          case 'damage_number':
            this.renderer.addDamageNumber(ev.x, ev.y, ev.damage);
            break;

          case 'powerup_pickup':
            if (inGame) sounds.playPowerup();
            this.renderer.addSparks(ev.x, ev.y, '#ffe600', 12);
            break;

          case 'kill':
            if (inGame) sounds.playKill();
            this.addKillFeedEntry(ev);
            if (ev.killerId === this.localPlayerId && ev.banner) {
              this.showAnnouncement(ev.banner);
            }
            if (ev.isCrownKill && inGame) {
              sounds.playCrownAlert();
              this.showAnnouncement('👑 CROWN DETHRONED! 👑');
            }
            break;

          case 'parry_deflect':
            if (inGame) sounds.playParryDeflect();
            this.renderer.addSparks(ev.x, ev.y, '#ffe600', 18);
            this.renderer.addDamageNumber(ev.x, ev.y - 20, 'PARRY REFLECT!');
            break;

          case 'parry_activated':
            if (inGame) sounds.playParryActivate();
            this.renderer.addSparks(ev.x, ev.y, '#ffe600', 10);
            break;

          case 'rocket_jump':
            if (ev.playerId === this.localPlayerId && inGame) {
              sounds.playDash();
            }
            this.renderer.addSparks(ev.x, ev.y, '#ff8800', 14);
            this.renderer.addDamageNumber(ev.x, ev.y - 20, 'ROCKET JUMP!');
            break;

          case 'vampirism_heal':
            this.renderer.addSparks(ev.x, ev.y, '#00ff66', 12);
            this.renderer.addDamageNumber(ev.x, ev.y - 15, `+${ev.heal} HP`);
            break;

          case 'time_recall':
            if (inGame) sounds.playPowerup();
            this.renderer.addSparks(ev.x, ev.y, '#00f7ff', 20);
            this.renderer.addDamageNumber(ev.x, ev.y - 20, 'TIME RECALL');
            break;

          case 'hex_dome_deployed':
            if (inGame) sounds.playPowerup();
            this.renderer.addSparks(ev.x, ev.y, '#00f7ff', 18);
            break;

          case 'vortex_launched':
            if (inGame) sounds.playPowerup();
            this.renderer.addSparks(ev.x, ev.y, '#bf00ff', 18);
            break;

          case 'portal_charge':
            if (inGame) sounds.playPortalCharge();
            this.renderer.addPortalChargeFX(ev.x, ev.y, ev.color || '#00f7ff');
            break;

          case 'portal_teleport':
            if (inGame) sounds.playPortalWarp();
            this.renderer.addPortalWarpFX(ev.fromX, ev.fromY, ev.toX, ev.toY, ev.color || '#00f7ff', ev.playerId === this.localPlayerId);
            break;

          case 'barrel_exploded':
          case 'barrel_explosion':
            if (inGame) sounds.playBarrelExplosion();
            this.renderer.addBarrelExplosion(ev.x, ev.y, ev.radius || 180);
            break;

          case 'wall_damaged':
            this.renderer.addWallHitSparks(ev.x, ev.y, ev.hp, ev.maxHp);
            if (inGame) sounds.playWallHit();
            break;

          case 'wall_destroyed':
            this.renderer.addWallRubbleExplosion(ev.x, ev.y, ev.w, ev.h);
            if (inGame) sounds.playWallDestroyed();
            break;

          case 'return_to_lobby':
            document.getElementById('lobby-modal')?.classList.remove('hidden');
            document.getElementById('podium-modal')?.classList.add('hidden');
            document.getElementById('respawn-modal')?.classList.add('hidden');
            document.getElementById('spectator-bar')?.classList.add('hidden');
            this.hasJoined = false;
            sounds.stopSynthwaveBGM();
            sounds.stopAllAudio();
            this.showAnnouncement('RETURNING TO LOBBY...');
            break;
        }
      }
    }

    // Update Local Player HUD
    const me = state.players.find(p => p.id === this.localPlayerId);
    if (me) {
      document.getElementById('hud-player-name').innerText = me.name;
      document.getElementById('hud-player-title').innerText = `«${me.title || 'Cadet'}»`;
      
      const hpEl = document.getElementById('hud-hp-num');
      if (hpEl) hpEl.innerText = `${Math.round(me.health)} / ${me.maxHealth}`;
      document.getElementById('hud-hp-bar').style.width = Math.max(0, (me.health / me.maxHealth) * 100) + '%';

      const shieldEl = document.getElementById('hud-shield-num');
      if (shieldEl) shieldEl.innerText = `${Math.round(me.shield)} / ${me.maxShield}`;
      document.getElementById('hud-shield-bar').style.width = Math.max(0, (me.shield / me.maxShield) * 100) + '%';

      // Dash recovery gauge
      const dashFill = document.getElementById('hud-dash-fill');
      const dashStatus = document.getElementById('hud-dash-status');
      if (dashFill && dashStatus) {
        if (typeof me.dashCooldownRemaining !== 'number' || me.dashCooldownRemaining <= 0.05) {
          dashFill.style.width = '100%';
          dashFill.classList.add('ready');
          dashStatus.innerText = 'READY';
          dashStatus.classList.add('ready');
        } else {
          const cdFrac = Math.max(0, Math.min(1, 1 - (me.dashCooldownRemaining / 1.5)));
          dashFill.style.width = Math.round(cdFrac * 100) + '%';
          dashFill.classList.remove('ready');
          dashStatus.innerText = `${me.dashCooldownRemaining.toFixed(1)}s`;
          dashStatus.classList.remove('ready');
        }
      }

      // Parry recovery gauge
      const parryFill = document.getElementById('hud-parry-fill');
      const parryStatus = document.getElementById('hud-parry-status');
      if (parryFill && parryStatus) {
        if (typeof me.parryCooldownRemaining !== 'number' || me.parryCooldownRemaining <= 0.05) {
          parryFill.style.width = '100%';
          parryFill.classList.add('ready');
          parryStatus.innerText = 'READY';
          parryStatus.classList.add('ready');
        } else {
          const cdFrac = Math.max(0, Math.min(1, 1 - (me.parryCooldownRemaining / 2.2)));
          parryFill.style.width = Math.round(cdFrac * 100) + '%';
          parryFill.classList.remove('ready');
          parryStatus.innerText = `${me.parryCooldownRemaining.toFixed(1)}s`;
          parryStatus.classList.remove('ready');
        }
      }

      // Super charge gauge
      const superPct = Math.min(100, Math.round(me.superCharge));
      const superNum = document.getElementById('hud-super-num');
      if (superNum) superNum.innerText = superPct + '%';
      const superBar = document.getElementById('hud-super-bar');
      if (superBar) {
        superBar.style.width = superPct + '%';
        if (superPct >= 100) {
          superBar.style.boxShadow = '0 0 15px #ffe600, 0 0 25px #ffe600';
        } else {
          superBar.style.boxShadow = '0 0 8px #ffe600';
        }
      }

      // Weapon dock sync
      this.updateWeaponDock(me.weapon, state.gameMode, me.gunGameTier);

      // Death and Spectator Overlay
      const respawnModal = document.getElementById('respawn-modal');
      const respawnCount = document.getElementById('respawn-countdown');
      const spectatorBar = document.getElementById('spectator-bar');

      if (!me.isAlive) {
        if (respawnModal) respawnModal.classList.remove('hidden');
        if (respawnCount) respawnCount.innerText = Math.ceil(me.respawnTimer);
        if (spectatorBar) spectatorBar.classList.remove('hidden');

        // Resolve spectate target if unset or died
        const living = state.players.filter(p => p.isAlive && p.id !== this.localPlayerId);
        let targetExists = living.some(p => p.id === this.spectateTargetId);
        if (this.spectateTargetId === 'boss' && state.pve?.boss && state.pve.boss.health > 0) {
          targetExists = true;
        }

        if (!targetExists) {
          if (living.length > 0) {
            this.spectateTargetId = living[0].id;
          } else if (state.pve?.boss && state.pve.boss.health > 0) {
            this.spectateTargetId = 'boss';
          } else {
            this.spectateTargetId = null;
          }
        }

        const specNameEl = document.getElementById('spec-target-name');
        if (specNameEl) {
          if (this.spectateTargetId === 'boss') {
            specNameEl.innerText = 'GOLIATH CORE [BOSS]';
          } else {
            const tgt = state.players.find(p => p.id === this.spectateTargetId);
            specNameEl.innerText = tgt ? tgt.name : 'AWAITING TARGET';
          }
        }
      } else {
        if (respawnModal) respawnModal.classList.add('hidden');
        if (spectatorBar) spectatorBar.classList.add('hidden');
        this.spectateTargetId = null;
      }
    }

    // Team scores
    const teamScoresEl = document.getElementById('team-scores');
    if (state.gameMode === 'teams' && state.teamScores) {
      teamScoresEl.classList.remove('hidden');
      const sRed = document.getElementById('score-red');
      const sBlue = document.getElementById('score-blue');
      if (sRed) sRed.innerText = state.teamScores.red ?? state.teamScores.magenta ?? 0;
      if (sBlue) sBlue.innerText = state.teamScores.blue ?? state.teamScores.cyan ?? 0;
    } else {
      teamScoresEl?.classList.add('hidden');
    }

    // PvE Goliath Boss HUD
    const bossHud = document.getElementById('boss-hud');
    if (state.gameMode === 'pve' && state.pve?.boss) {
      bossHud.classList.remove('hidden');
      const boss = state.pve.boss;
      const hpPct = Math.max(0, Math.min(100, (boss.health / boss.maxHealth) * 100));
      const bossBar = document.getElementById('boss-hp-bar');
      const bossText = document.getElementById('boss-hp-text');
      const bossPhase = document.getElementById('boss-phase-badge');

      if (bossBar) bossBar.style.width = `${hpPct}%`;
      if (bossText) bossText.innerText = `${Math.round(boss.health)} / ${boss.maxHealth} HP`;
      if (bossPhase) {
        bossPhase.innerText = boss.phase === 3 ? 'PHASE 3: RADIAL MELTDOWN' :
                              boss.phase === 2 ? 'PHASE 2: OVERDRIVE CORE' :
                              'PHASE 1: DORMANT SHIELD';
      }
    } else {
      bossHud?.classList.add('hidden');
    }

    // Cyber Infection HUD
    const infectionHud = document.getElementById('infection-hud');
    if (state.gameMode === 'infection' && state.infection) {
      infectionHud.classList.remove('hidden');
      const survEl = document.getElementById('inf-survivors-count');
      const infEl = document.getElementById('inf-infected-count');
      const timerEl = document.getElementById('inf-timer');

      if (survEl) survEl.innerText = state.infection.survivors ?? 0;
      if (infEl) infEl.innerText = state.infection.infected ?? 0;
      if (timerEl) timerEl.innerText = `${Math.ceil(state.infection.timeRemaining || 0)}s`;
    } else {
      infectionHud?.classList.add('hidden');
    }

    // Battle Royale HUD
    const brHud = document.getElementById('br-hud');
    if (state.gameMode === 'battleroyale' && state.battleRoyale) {
      brHud?.classList.remove('hidden');
      const aliveEl = document.getElementById('br-alive-count');
      const phaseEl = document.getElementById('br-phase-label');
      const timerEl = document.getElementById('br-timer');

      if (aliveEl) aliveEl.innerText = `${state.battleRoyale.aliveCount} / ${state.battleRoyale.totalCount}`;
      if (phaseEl) phaseEl.innerText = state.battleRoyale.isClosing ? 'STORM CLOSING' : `PHASE ${state.battleRoyale.phase}`;
      if (timerEl) timerEl.innerText = `${state.battleRoyale.phaseTimer}s`;
    } else {
      brHud?.classList.add('hidden');
    }

    // Lobby Team Lock badge
    const teamLockBadge = document.getElementById('team-lock-notice');
    if (teamLockBadge) {
      if (state.gameMode === 'teams') teamLockBadge.classList.remove('hidden');
      else teamLockBadge.classList.add('hidden');
    }

    this.updateLeaderboard(state.players);
  }

  updateMapModeHUD(mapId, mode) {
    const mapNames = {
      core: 'SECTOR 01: THE CORE',
      labyrinth: 'SECTOR 02: NEON LABYRINTH',
      colosseum: 'SECTOR 03: HYPER RING',
      pinball: 'SECTOR 04: PINBALL CITADEL',
      hypergrid: 'SECTOR 05: CYBER METROPOLIS',
      vortex_abyss: 'SECTOR 06: SINGULARITY CORE',
      megacity: 'SECTOR 07: NEO-VERIDIA MEGA WARZONE'
    };
    const modeNames = {
      ffa: 'FREE FOR ALL (FFA)',
      teams: 'TEAM DM (RED VS BLUE)',
      pve: 'PVE BOSS RAID (GOLIATH CORE)',
      gungame: 'GUN GAME (8 TIERS)',
      infection: 'CYBER INFECTION',
      battleroyale: 'BATTLE ROYALE (APEX LAST STANDING)'
    };

    const mapTitle = mapNames[mapId] || mapId.toUpperCase();
    const modeTitle = modeNames[mode] || mode.toUpperCase();

    const mapEl = document.getElementById('hud-map-name');
    const modeEl = document.getElementById('hud-mode-name');
    if (mapEl) mapEl.innerText = mapTitle;
    if (modeEl) modeEl.innerText = modeTitle;

    const guestMap = document.getElementById('guest-map-display');
    const guestMode = document.getElementById('guest-mode-display');
    if (guestMap) guestMap.innerText = mapTitle;
    if (guestMode) guestMode.innerText = modeTitle;
  }

  updateLeaderboard(players) {
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl) return;

    if (!Array.isArray(players) || players.length === 0) {
      listEl.innerHTML = '<div class="lb-entry"><span class="lb-name" style="color:var(--text-dim);">AWAITING PILOTS...</span><span class="lb-score">--</span></div>';
      return;
    }

    const sorted = [...players].filter(p => p && typeof p.score === 'number').sort((a, b) => b.score - a.score).slice(0, 5);
    if (sorted.length === 0) {
      listEl.innerHTML = '<div class="lb-entry"><span class="lb-name" style="color:var(--text-dim);">AWAITING PILOTS...</span><span class="lb-score">--</span></div>';
      return;
    }

    listEl.innerHTML = sorted.map((p, idx) => {
      const isMe = p.id === this.localPlayerId ? 'me' : '';
      const crown = p.isCrownKing ? '👑 ' : `${idx + 1}. `;
      const botTag = p.isBot ? ' 🤖' : '';
      return `
        <div class="lb-entry ${isMe}">
          <span class="lb-name">${crown}${p.name || 'Pilot'}${botTag}</span>
          <span class="lb-score">${p.score || 0}</span>
        </div>
      `;
    }).join('');
  }

  addKillFeedEntry(ev) {
    const kf = document.getElementById('killfeed');
    if (!kf) return;

    const item = document.createElement('div');
    item.className = 'killfeed-item';
    item.innerHTML = `<span style="color:${ev.killerColor}">${ev.killerName}</span> ${icons.elimination} <span style="color:${ev.victimColor}">${ev.victimName}</span>`;

    kf.prepend(item);
    setTimeout(() => item.remove(), 4500);
  }

  showAnnouncement(text) {
    const banner = document.getElementById('announcement-banner');
    const bannerText = document.getElementById('banner-text');
    if (!banner || !bannerText) return;

    bannerText.innerText = text;
    banner.classList.remove('hidden');

    if (this.bannerTimeout) clearTimeout(this.bannerTimeout);
    this.bannerTimeout = setTimeout(() => banner.classList.add('hidden'), 2800);
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = currentTime;

    if (!this.hasJoined && this.hangarCanvas) {
      const rect = this.hangarCanvas.getBoundingClientRect();
      const rw = Math.round(rect.width) || 280;
      const rh = Math.round(rect.height) || 180;
      if (this.hangarCanvas.width !== rw || this.hangarCanvas.height !== rh) {
        this.hangarCanvas.width = rw;
        this.hangarCanvas.height = rh;
      }
      this.renderer.drawHangarMech(this.hangarCanvas, this.selectedClass, this.selectedColor, currentTime);
    }

    // Render with manual aim angle & mouse position for crisp cyber reticle + pass spectator camera target
    this.renderer.render(this.latestState, this.localPlayerId, dt, {
      aimAngle: this.inputs?.aimAngle || 0,
      mouse: this.inputs?.mouse || { x: 0, y: 0 }
    }, this.spectateTargetId);

    requestAnimationFrame((t) => this.loop(t));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new OverclockClient();
});
