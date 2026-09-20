import { GameRenderer } from './renderer.js';
import { sounds } from './audio.js';

class BroadcastSpectator {
  constructor() {
    this.canvas = document.getElementById('spectate-canvas');
    this.renderer = new GameRenderer(this.canvas, null);
    this.audio = sounds;

    this.socket = null;
    this.latestState = null;
    this.targetId = null;
    this.autoDirector = true;
    this.directorTimer = 0;
    this.audioPlaying = false;

    // UI elements
    this.elMatchTag = document.getElementById('spectate-match-tag');
    this.elTimer = document.getElementById('round-timer-display');
    this.elStandings = document.getElementById('spectate-standings-body');
    this.elKillfeed = document.getElementById('killfeed');
    this.elFocusName = document.getElementById('focus-name');
    this.elFocusMech = document.getElementById('focus-mech');
    this.elFocusHp = document.getElementById('focus-hp');
    this.elFocusShield = document.getElementById('focus-shield');
    this.elFocusStreak = document.getElementById('focus-streak');
    this.elFocusWeapon = document.getElementById('focus-weapon');
    this.elModeLabel = document.getElementById('camera-mode-label');

    this.btnAuto = document.getElementById('btn-auto-cam');
    this.btnCycle = document.getElementById('btn-next-target');
    this.btnFullscreen = document.getElementById('btn-fullscreen');
    this.btnAudio = document.getElementById('btn-audio');

    this.bindEvents();
    this.connect();
    this.startRenderLoop();
  }

  bindEvents() {
    this.btnAuto.addEventListener('click', () => {
      this.autoDirector = !this.autoDirector;
      this.btnAuto.classList.toggle('active', this.autoDirector);
      this.elModeLabel.textContent = this.autoDirector ? '[AUTO AI]' : '[MANUAL]';
      if (this.autoDirector) this.evaluateDirectorTarget(true);
    });

    this.btnCycle.addEventListener('click', () => {
      this.cycleTarget();
    });

    this.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    this.btnAudio.addEventListener('click', () => {
      this.audio.init();
      this.audioPlaying = !this.audioPlaying;
      if (this.audioPlaying) {
        this.audio.startBGM();
        this.btnAudio.textContent = 'BGM: ON';
        this.btnAudio.classList.add('active');
      } else {
        this.audio.stopBGM();
        this.btnAudio.textContent = 'BGM: OFF';
        this.btnAudio.classList.remove('active');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.cycleTarget();
      } else if (e.code === 'KeyA') {
        this.btnAuto.click();
      } else if (e.code === 'KeyF') {
        this.btnFullscreen.click();
      }
    });
  }

  cycleTarget() {
    if (!this.latestState || !this.latestState.players) return;
    this.autoDirector = false;
    this.btnAuto.classList.remove('active');
    this.elModeLabel.textContent = '[MANUAL]';

    const alive = this.latestState.players.filter(p => p.isAlive);
    if (alive.length === 0) return;

    const currentIndex = alive.findIndex(p => p.id === this.targetId);
    const nextIndex = (currentIndex + 1) % alive.length;
    this.targetId = alive[nextIndex].id;
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.socket = new WebSocket(`${protocol}//${window.location.host}`);

    this.socket.onopen = () => {
      console.log('📡 Connected to OVERCLOCK Broadcast server');
    };

    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'welcome') {
          if (msg.currentMap) this.renderer.setMapConfig(msg.currentMap);
        } else if (msg.type === 'map_change') {
          if (msg.map) this.renderer.setMapConfig(msg.map);
        } else if (msg.type === 'state') {
          this.handleStateUpdate(msg.data);
        }
      } catch (e) {
        console.error('Broadcast message error:', e);
      }
    };

    this.socket.onclose = () => {
      setTimeout(() => this.connect(), 2000);
    };
  }

  handleStateUpdate(state) {
    this.latestState = state;

    if (state.obstacles && this.renderer) {
      this.renderer.updateObstacles(state.obstacles);
    }

    // Dispatch game events for audio/effects
    if (state.events && state.events.length > 0) {
      for (const ev of state.events) {
        if (ev.type === 'kill') {
          this.addKillfeedItem(ev.killerName, ev.victimName, ev.weapon, ev.isHeadshot);
        } else if (ev.type === 'announcer_call') {
          this.audio.speak(ev.voice || ev.text);
        } else if (ev.type === 'wall_destroyed' && this.renderer) {
          this.renderer.addWallRubbleExplosion(ev.x, ev.y, ev.w, ev.h);
        }
      }
    }

    // Update match info
    const modeName = (state.gameMode || 'ffa').toUpperCase();
    const mapName = (state.mapId || 'core').toUpperCase();
    this.elMatchTag.textContent = `${modeName} // MAP: ${mapName}`;

    // Update round timer
    const totalSecs = state.roundTimer || 0;
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    this.elTimer.textContent = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.elTimer.classList.toggle('timer-warning', totalSecs <= 30);

    // Update Standings
    this.updateStandings(state.players);

    // Update Focused Pilot Details
    this.updateFocusCard(state);
  }

  updateStandings(players) {
    if (!players) return;
    const sorted = [...players].sort((a, b) => (b.kills || 0) - (a.kills || 0)).slice(0, 5);
    this.elStandings.innerHTML = sorted.map((p, i) => `
      <div class="standings-row ${i === 0 ? 'leader' : ''}">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px;">
          ${i + 1}. ${p.name}
        </span>
        <span style="font-family:var(--font-display);color:${p.id === this.targetId ? 'var(--cyan)' : 'inherit'}">
          ${p.kills || 0}
        </span>
      </div>
    `).join('');
  }

  updateFocusCard(state) {
    let target = null;
    if (this.targetId) {
      target = state.players.find(p => p.id === this.targetId && p.isAlive);
    }

    // If target died or not set, evaluate
    if (!target) {
      this.evaluateDirectorTarget(true);
      target = state.players.find(p => p.id === this.targetId && p.isAlive);
    }

    if (target) {
      this.elFocusName.textContent = target.name;
      this.elFocusMech.textContent = (target.mechClass || 'SPECTRE').toUpperCase();
      this.elFocusHp.textContent = `${target.health}/${target.maxHealth}`;
      this.elFocusShield.textContent = `${target.shield}/${target.maxShield}`;
      this.elFocusStreak.textContent = target.streak || 0;
      this.elFocusWeapon.textContent = (target.weapon || 'blaster').toUpperCase();
    } else if (state.pve?.boss && state.pve.boss.isAlive) {
      this.elFocusName.textContent = 'GOLIATH CORE BOSS';
      this.elFocusMech.textContent = 'BOSS';
      this.elFocusHp.textContent = `${state.pve.boss.health}/${state.pve.boss.maxHealth}`;
      this.elFocusShield.textContent = `${state.pve.boss.shield}/${state.pve.boss.maxShield}`;
      this.elFocusStreak.textContent = 'TITAN';
      this.elFocusWeapon.textContent = 'QUAD CANNON';
    } else {
      this.elFocusName.textContent = 'NO ACTIVE TARGET';
      this.elFocusMech.textContent = 'SEARCHING';
      this.elFocusHp.textContent = '--';
      this.elFocusShield.textContent = '--';
      this.elFocusStreak.textContent = '0';
      this.elFocusWeapon.textContent = '--';
    }
  }

  evaluateDirectorTarget(force = false) {
    if (!this.latestState || !this.latestState.players) return;
    const alive = this.latestState.players.filter(p => p.isAlive);
    if (alive.length === 0) {
      if (this.latestState.pve?.boss && this.latestState.pve.boss.isAlive) {
        this.targetId = this.latestState.pve.boss.id;
      }
      return;
    }

    // Score each pilot based on combat intensity
    let bestPilot = null;
    let highestScore = -Infinity;

    for (const p of alive) {
      let score = 0;
      score += (p.kills || 0) * 10;
      score += (p.streak || 0) * 25;
      if (p.isCrownKing) score += 40;
      if (p.isSuperActive) score += 50;
      if (p.health < 45) score += 20; // Critical combat

      // Distance to other players (crowded action)
      for (const other of alive) {
        if (other.id !== p.id) {
          const d = Math.hypot(p.x - other.x, p.y - other.y);
          if (d < 350) score += 15;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestPilot = p;
      }
    }

    if (bestPilot) {
      this.targetId = bestPilot.id;
    }
  }

  addKillfeedItem(killer, victim, weapon, isHeadshot) {
    const item = document.createElement('div');
    item.className = 'killfeed-item';
    item.innerHTML = `<b>${killer}</b> <span style="color:var(--pink)">➔</span> <b>${victim}</b> <span style="color:var(--yellow)">[${weapon}]</span>`;
    this.elKillfeed.appendChild(item);
    setTimeout(() => {
      if (item.parentNode) item.parentNode.removeChild(item);
    }, 4500);
  }

  startRenderLoop() {
    let lastTime = performance.now();

    const loop = (nowTime) => {
      const dt = Math.min((nowTime - lastTime) / 1000, 0.05);
      lastTime = nowTime;

      // Smart Director AI timing
      if (this.autoDirector) {
        this.directorTimer += dt;
        if (this.directorTimer >= 4.5) {
          this.directorTimer = 0;
          this.evaluateDirectorTarget();
        }
      }

      if (this.latestState) {
        this.renderer.render(this.latestState, null, dt, {}, this.targetId);
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new BroadcastSpectator();
});
