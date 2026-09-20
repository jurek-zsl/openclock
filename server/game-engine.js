/**
 * Advanced Game Engine for OVERCLOCK (Cyberpunk Tactical LAN Brawler)
 * Supports 5 Core Modes: FFA (w/ Round Limits & Podium), Team Deathmatch (Red vs Blue),
 * PvE Boss Raid (Goliath Core Boss & Creep Drones), Gun Game (Escalation), and Cyber Infection.
 */

import { MAPS } from './maps.js';

export const TICK_RATE = 35;

export const MECH_CLASSES = {
  spectre: {
    id: 'spectre',
    name: 'Spectre [Scout]',
    desc: 'Hyper-agile hovercraft with stealth cloaking overdrive',
    speed: 370,
    health: 85,
    shield: 45,
    dashCooldown: 1.9,
    superType: 'stealth'
  },
  titan: {
    id: 'titan',
    name: 'Titan [Juggernaut]',
    desc: 'Heavy fortified quad-track hull with Seismic Shockwave',
    speed: 265,
    health: 135,
    shield: 80,
    dashCooldown: 3.2,
    superType: 'stomp'
  },
  viper: {
    id: 'viper',
    name: 'Viper [Striker]',
    desc: 'Fast dual-barrel chassis with Rapid Overclock Berserk',
    speed: 320,
    health: 95,
    shield: 50,
    reloadBuff: 0.78,
    dashCooldown: 2.3,
    superType: 'berserk'
  },
  vortex: {
    id: 'vortex',
    name: 'Vortex [Tech]',
    desc: 'Sleek delta-wing craft with EMP Weapon Disabling Pulse',
    speed: 310,
    health: 100,
    shield: 50,
    dashCooldown: 2.6,
    superType: 'emp'
  },
  chrono: {
    id: 'chrono',
    name: 'Chrono [Time Warper]',
    desc: 'Temporal craft with 3.5s Time Rewind & stat restoration',
    speed: 330,
    health: 90,
    shield: 45,
    dashCooldown: 2.2,
    superType: 'recall'
  },
  aegis: {
    id: 'aegis',
    name: 'Aegis [Bastion]',
    desc: 'Heavy shield craft with Deployable 360° Hex-Dome Barrier',
    speed: 250,
    health: 140,
    shield: 90,
    dashCooldown: 3.4,
    superType: 'hexdome'
  },
  phantom: {
    id: 'phantom',
    name: 'Phantom [Infiltrator]',
    desc: 'Void phase hovercraft that phases through walls & obstacles',
    speed: 380,
    health: 80,
    shield: 40,
    dashCooldown: 1.8,
    superType: 'phase'
  },
  gravity: {
    id: 'gravity',
    name: 'Gravity [Singularity]',
    desc: 'Gravitational manipulator with Black Hole Implosion Vortex',
    speed: 295,
    health: 110,
    shield: 60,
    dashCooldown: 2.8,
    superType: 'vortex_singularity'
  }
};

export const WEAPON_TYPES = {
  blaster: {
    id: 'blaster',
    name: 'Pulse Cannon',
    damage: 24,
    speed: 1050,
    cooldown: 180,
    radius: 5,
    maxRange: 1200,
    color: '#00ffff'
  },
  scatter: {
    id: 'scatter',
    name: 'Scattershot',
    damage: 15,
    pellets: 5,
    spread: 0.38,
    speed: 850,
    cooldown: 460,
    radius: 4,
    maxRange: 750,
    color: '#ff0055'
  },
  railgun: {
    id: 'railgun',
    name: 'Neon Railgun',
    damage: 80,
    speed: 2300,
    cooldown: 980,
    radius: 4,
    maxRange: 1900,
    pierce: true,
    color: '#00ff66'
  },
  bouncing: {
    id: 'bouncing',
    name: 'Plasma Ricochet',
    damage: 30,
    speed: 880,
    cooldown: 340,
    radius: 7,
    maxBounces: 4,
    maxRange: 1600,
    color: '#ffff00'
  },
  rocket: {
    id: 'rocket',
    name: 'Micro-Missile',
    damage: 85,
    splashRadius: 125,
    speed: 560,
    cooldown: 900,
    radius: 9,
    maxRange: 1400,
    explosive: true,
    color: '#ff8800'
  },
  cryo: {
    id: 'cryo',
    name: 'Cryo Freeze Ray',
    damage: 14,
    speed: 1200,
    cooldown: 120,
    radius: 5,
    maxRange: 900,
    color: '#00e5ff',
    slowEffect: 0.45
  },
  flame: {
    id: 'flame',
    name: 'Plasma Flamethrower',
    damage: 9,
    speed: 680,
    cooldown: 65,
    radius: 12,
    maxRange: 450,
    color: '#ff3700',
    spread: 0.42
  },
  seeker: {
    id: 'seeker',
    name: 'Seeker Swarm',
    damage: 34,
    speed: 620,
    cooldown: 650,
    radius: 6,
    maxRange: 1300,
    color: '#bf00ff',
    homing: true
  }
};

export const GUN_GAME_TIERS = [
  'blaster', 'cryo', 'scatter', 'bouncing', 'flame', 'rocket', 'seeker', 'railgun'
];

export const GAME_MODES = {
  ffa: { id: 'ffa', name: 'Free For All', desc: 'Score 15 kills or lead the round timer to win' },
  teams: { id: 'teams', name: 'Team Deathmatch (Red vs Blue)', desc: 'Red vs Blue clash to 25 eliminations' },
  pve: { id: 'pve', name: 'PvE Boss Raid (Co-op)', desc: 'Unite against creep swarms and the Goliath Core Boss' },
  gungame: { id: 'gungame', name: 'Gun Game (Escalation)', desc: 'Level up weapons on each kill. Master all 8 tiers to win' },
  infection: { id: 'infection', name: 'Cyber Infection', desc: 'Survive the round or assimilate all pilots into the virus' },
  koth: { id: 'koth', name: 'King of the Hill', desc: 'Capture and hold the central beacon zone' },
  juggernaut: { id: 'juggernaut', name: 'Juggernaut Apex', desc: 'Destroy the juggernaut to claim apex power' },
  battleroyale: { id: 'battleroyale', name: 'Battle Royale (Apex Survival)', desc: 'Last mech standing wins. 1 life, shrinking cyber storm ring, high-tier weapon drops.' }
};

export const BOT_DIFFICULTIES = {
  harmless: {
    id: 'harmless',
    name: 'Harmless (Dummy)',
    desc: 'Passive training dummies. Never shoot, move slowly, zero threat.',
    aimError: 1.2,
    reactionTime: [0.8, 1.4],
    speedMultiplier: 0.4,
    canShoot: false,
    shootingRange: 0,
    burstChance: 0,
    canDash: false,
    canSuper: false,
    leadTarget: false
  },
  easy: {
    id: 'easy',
    name: 'Easy (Casual)',
    desc: 'Forgiving opponents. Inaccurate aim, slow reactions, infrequent bursts, no dashes.',
    aimError: 0.55,
    reactionTime: [0.6, 1.0],
    speedMultiplier: 0.65,
    canShoot: true,
    shootingRange: 450,
    burstChance: 0.35,
    canDash: false,
    canSuper: false,
    leadTarget: false
  },
  medium: {
    id: 'medium',
    name: 'Medium (Standard)',
    desc: 'Standard AI combatants. Moderate aim, tactical movement, occasional dash and super.',
    aimError: 0.18,
    reactionTime: [0.3, 0.5],
    speedMultiplier: 0.88,
    canShoot: true,
    shootingRange: 750,
    burstChance: 0.75,
    canDash: true,
    dashChance: 0.4,
    canSuper: true,
    superChance: 0.5,
    leadTarget: false
  },
  hard: {
    id: 'hard',
    name: 'Hard (Veteran)',
    desc: 'Veteran mechs. Sharp predictive aim, aggressive strafing, tactical dashes and supers.',
    aimError: 0.06,
    reactionTime: [0.15, 0.28],
    speedMultiplier: 1.0,
    canShoot: true,
    shootingRange: 950,
    burstChance: 0.95,
    canDash: true,
    dashChance: 0.7,
    canSuper: true,
    superChance: 0.85,
    leadTarget: true
  },
  extreme: {
    id: 'extreme',
    name: 'Extreme (Lethal)',
    desc: 'Unforgiving cyber assassins. Pinpoint predictive tracking, fast dodging, lethal combo supers.',
    aimError: 0.015,
    reactionTime: [0.08, 0.16],
    speedMultiplier: 1.08,
    canShoot: true,
    shootingRange: 1150,
    burstChance: 1.0,
    canDash: true,
    dashChance: 0.9,
    canSuper: true,
    superChance: 0.95,
    leadTarget: true
  }
};

const BOT_NAMES = [
  'Cipher [AI]', 'Nexus [AI]', 'V-100 [AI]', 'Aegis [AI]',
  'Spectre-X [AI]', 'Zero-One [AI]', 'Oblivion [AI]', 'Hyperion [AI]'
];

export class GameEngine {
  constructor(broadcastCallback) {
    this.broadcast = broadcastCallback;
    this.players = new Map();
    this.projectiles = [];
    this.powerups = [];
    this.events = [];
    this.nextProjId = 1;
    this.nextPowerupId = 1;
    this.lastTick = Date.now();

    // Match & Game Mode
    this.gameMode = 'ffa';
    this.teamScores = { red: 0, blue: 0, cyan: 0, magenta: 0 };
    this.roundTimer = 180;
    this.podiumActive = false;
    this.podiumTimer = 0;
    this.podiumData = null;

    this.juggernautId = null;
    this.kothLeaderId = null;
    this.botCount = 0;
    this.botDifficulty = 'medium';
    this.botIds = [];

    // Host Custom Game Mutators
    this.mutators = {
      speed: 1.0,
      infiniteDash: false,
      unlimitedSupers: false,
      vampirism: false,
      instagib: false,
      bouncingHell: false,
      weaponLock: null,
      lowFriction: false
    };

    // Deployable Abilities
    this.deployableHexDomes = [];
    this.singularityVortices = [];
    this.inLobby = false;

    // PvE Boss & Creeps State
    this.pveState = {
      boss: null,
      creeps: [],
      bossWaveTimer: 0,
      waveActive: false
    };

    // Cyber Infection State
    this.infectionState = {
      patientZeroTimer: 8.0,
      patientZeroChosen: false
    };

    // Battle Royale State
    this.brState = null;

    this.currentMapId = 'core';
    this.loadMap('core');

    this.intervalId = setInterval(() => this.update(), 1000 / TICK_RATE);
  }

  setMutator(key, value) {
    if (this.mutators.hasOwnProperty(key)) {
      if (key === 'weaponLock' && (!value || value === 'none' || value === '')) {
        value = null;
      }
      this.mutators[key] = value;
      this.events.push({
        type: 'mutator_changed',
        key,
        value,
        mutators: this.mutators
      });
      this.events.push({
        type: 'announcer_call',
        text: `MUTATOR: ${key.toUpperCase()} ➔ ${String(value || 'UNLOCKED').toUpperCase()}`,
        voice: `Mutator updated`
      });
    }
  }

  returnToLobby() {
    this.podiumActive = false;
    this.podiumData = null;
    this.inLobby = true;
    this.resetScores();
    if (this.map && this.map.obstacles) {
      for (const obs of this.map.obstacles) {
        if (obs.type === 'destructible') {
          obs.hp = obs.maxHp || 160;
          obs.isDestroyed = false;
        }
      }
    }
    this.respawnAllPlayers();
    this.initModeState();
    this.events.push({
      type: 'return_to_lobby'
    });
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  loadMap(mapId) {
    const mapDef = MAPS[mapId] || MAPS.core;
    this.currentMapId = mapDef.id;
    this.map = JSON.parse(JSON.stringify(mapDef));
    if (this.map.obstacles) {
      for (const obs of this.map.obstacles) {
        if (obs.type === 'destructible') {
          const maxHp = obs.maxHp || obs.hp || 160;
          obs.maxHp = maxHp;
          obs.hp = maxHp;
          obs.isDestroyed = false;
        }
      }
    }
    this.suddenDeathActive = false;
    this.suddenDeathRadius = Math.max(this.map.width, this.map.height) / 2;
    this.initPowerups();
    this.respawnAllPlayers();
    this.initModeState();
  }

  respawnAllPlayers() {
    for (const p of this.players.values()) {
      const spawn = this.getSafeSpawnPoint();
      const mClass = MECH_CLASSES[p.mechClass] || MECH_CLASSES.spectre;
      p.x = spawn.x;
      p.y = spawn.y;
      p.health = mClass.health;
      p.shield = mClass.shield;
      p.isAlive = true;
      p.invulnerableTimer = 2.0;
      p.dashCooldown = 0;
      p.isEmpDisabled = 0;
      p.isStealthed = false;
    }
  }

  setGameMode(mode) {
    if (['ffa', 'teams', 'pve', 'gungame', 'infection', 'koth', 'juggernaut', 'battleroyale'].includes(mode)) {
      this.gameMode = mode;
      this.resetScores();
      this.initModeState();
      this.events.push({ type: 'mode_change', mode: this.gameMode });
    }
  }

  initModeState() {
    this.roundTimer = (this.gameMode === 'infection') ? 120 : (this.gameMode === 'battleroyale' ? 300 : 180);
    this.teamScores = { red: 0, blue: 0, cyan: 0, magenta: 0 };
    this.podiumActive = false;
    this.podiumData = null;

    if (this.gameMode === 'teams') {
      let toggle = true;
      for (const p of this.players.values()) {
        p.team = toggle ? 'red' : 'blue';
        p.color = p.team === 'red' ? '#ff0055' : '#00f7ff';
        toggle = !toggle;
      }
    } else if (this.gameMode === 'pve') {
      for (const p of this.players.values()) {
        p.team = 'blue';
        p.color = '#00f7ff';
      }
      this.initPvE();
    } else if (this.gameMode === 'gungame') {
      for (const p of this.players.values()) {
        p.gunGameTier = 0;
        p.weapon = GUN_GAME_TIERS[0];
      }
    } else if (this.gameMode === 'infection') {
      for (const p of this.players.values()) {
        p.team = 'survivor';
        p.isInfected = false;
        p.color = '#00f7ff';
      }
      this.infectionState = {
        patientZeroTimer: 8.0,
        patientZeroChosen: false
      };
      this.events.push({
        type: 'announcer_call',
        text: '☣️ CYBER INFECTION IMMINENT! PATIENT ZERO IN 8s! ☣️',
        voice: 'Cyber infection detected! Patient Zero arrives in eight seconds!'
      });
    } else if (this.gameMode === 'juggernaut') {
      this.selectRandomJuggernaut();
    } else if (this.gameMode === 'battleroyale') {
      const mapW = this.map.width;
      const mapH = this.map.height;
      const initialRadius = Math.max(mapW, mapH) * 0.52;
      const targetRadius = initialRadius * 0.55;
      const safeX = mapW * (0.35 + Math.random() * 0.3);
      const safeY = mapH * (0.35 + Math.random() * 0.3);

      this.brState = {
        phase: 1,
        phaseTimer: 35.0,
        currentRadius: initialRadius,
        targetRadius: targetRadius,
        safeX: safeX,
        safeY: safeY,
        dps: 6,
        isClosing: false
      };
      this.suddenDeathActive = true;
      this.suddenDeathRadius = initialRadius;
      this.suddenDeathCx = safeX;
      this.suddenDeathCy = safeY;

      for (const p of this.players.values()) {
        p.team = null;
        p.color = p.color || '#00f7ff';
        p.respawnTimer = 0;
      }
      this.respawnAllPlayers();

      this.events.push({
        type: 'announcer_call',
        text: '⚡ BATTLE ROYALE APEX SURVIVAL! 1 LIFE! ⚡',
        voice: 'Battle Royale! Survive and conquer!'
      });
    }
  }

  initPvE() {
    const cx = this.map.width / 2;
    const cy = this.map.height / 2;

    this.pveState = {
      boss: {
        id: 'goliath_boss',
        name: 'GOLIATH [CORE BOSS]',
        x: cx,
        y: cy,
        angle: 0,
        turretAngle: 0,
        radius: 56,
        health: 2500,
        maxHealth: 2500,
        shield: 500,
        maxShield: 500,
        isAlive: true,
        isEnraged: false,
        attackTimer: 0,
        missileTimer: 3.5,
        laserSweepTimer: 0,
        sweepAngle: 0
      },
      creeps: []
    };

    const offsets = [
      { x: -500, y: -500 }, { x: 500, y: -500 },
      { x: -500, y: 500 }, { x: 500, y: 500 },
      { x: 0, y: -650 }, { x: 0, y: 650 }
    ];
    for (let i = 0; i < offsets.length; i++) {
      this.pveState.creeps.push({
        id: `creep_${i + 1}`,
        name: `DRONE-0${i + 1}`,
        x: cx + offsets[i].x,
        y: cy + offsets[i].y,
        vx: 0,
        vy: 0,
        angle: 0,
        radius: 18,
        health: 60,
        maxHealth: 60,
        isAlive: true,
        respawnTimer: 0,
        attackCooldown: 1.0 + Math.random() * 0.8
      });
    }

    this.events.push({
      type: 'announcer_call',
      text: '⚠️ WARNING: COLOSSAL GOLIATH BOSS DETECTED! ⚠️',
      voice: 'Warning! Colossal Goliath Boss engaged! All pilots cooperate!'
    });
  }

  setBotDifficulty(difficulty) {
    if (!BOT_DIFFICULTIES[difficulty]) return;
    this.botDifficulty = difficulty;
    const diffDef = BOT_DIFFICULTIES[difficulty];
    this.events.push({
      type: 'bot_difficulty_changed',
      difficulty: this.botDifficulty,
      name: diffDef.name
    });
    this.events.push({
      type: 'announcer_call',
      text: `🤖 BOT PROTOCOL: ${diffDef.name.toUpperCase()}`,
      voice: `Bot difficulty set to ${diffDef.name}`
    });
  }

  setBotCount(targetCount, difficulty = null) {
    targetCount = Math.max(0, Math.min(8, targetCount));
    this.botCount = targetCount;
    if (difficulty && BOT_DIFFICULTIES[difficulty]) {
      this.botDifficulty = difficulty;
    }

    while (this.botIds.length > targetCount) {
      const id = this.botIds.pop();
      this.players.delete(id);
    }

    const classes = ['spectre', 'titan', 'viper', 'vortex'];
    const weapons = ['blaster', 'scatter', 'railgun', 'bouncing', 'rocket', 'cryo', 'seeker'];
    const colors = ['#00f7ff', '#ff0055', '#00ff66', '#ffe600', '#bf00ff', '#ff5500'];

    while (this.botIds.length < targetCount) {
      const idx = this.botIds.length;
      const botId = `bot_${idx + 1}`;
      const name = BOT_NAMES[idx % BOT_NAMES.length];
      const mClass = classes[idx % classes.length];
      const wp = weapons[idx % weapons.length];
      const col = colors[idx % colors.length];

      this.addPlayer(botId, name, col, mClass, wp, 'AI Synthetic');
      const botPlayer = this.players.get(botId);
      if (botPlayer) {
        botPlayer.isBot = true;
        botPlayer.botDecisionTimer = 0;
      }
      this.botIds.push(botId);
    }

    this.events.push({ type: 'bots_updated', count: this.botCount, difficulty: this.botDifficulty });
  }

  triggerSuddenDeath() {
    if (this.suddenDeathActive) {
      this.stopSuddenDeath();
      return;
    }
    this.suddenDeathActive = true;
    this.suddenDeathTimer = 0;
    this.suddenDeathRadius = Math.max(this.map.width, this.map.height) / 2;
    this.events.push({
      type: 'sudden_death_started'
    });
    this.events.push({
      type: 'announcer_call',
      text: '⚠️ SUDDEN DEATH LASER APOCALYPSE! ⚠️',
      voice: 'Sudden Death engaged! Retreat inside the safe ring!'
    });
  }

  stopSuddenDeath() {
    this.suddenDeathActive = false;
    this.suddenDeathTimer = 0;
    this.suddenDeathRadius = Math.max(this.map.width, this.map.height) / 2;
    for (const p of this.players.values()) {
      p.stormDamageAcc = 0;
    }
    this.events.push({
      type: 'sudden_death_ended'
    });
  }

  spawnMegaCrate() {
    const cx = this.map.width / 2;
    const cy = this.map.height / 2;
    this.powerups.push({
      id: this.nextPowerupId++,
      x: cx,
      y: cy,
      type: 'crown_boost',
      active: true,
      respawnTimer: 0
    });
    this.events.push({
      type: 'mega_crate_spawned',
      x: cx,
      y: cy
    });
  }

  resetScores() {
    this.stopSuddenDeath();
    this.roundTimer = (this.gameMode === 'infection') ? 120 : (this.gameMode === 'battleroyale' ? 300 : 180);
    this.podiumActive = false;
    this.podiumData = null;

    for (const p of this.players.values()) {
      p.score = 0;
      p.kills = 0;
      p.deaths = 0;
      p.streak = 0;
      p.maxStreak = 0;
      p.damageDealt = 0;
      p.comboCount = 0;
      if (this.gameMode === 'gungame') {
        p.gunGameTier = 0;
        p.weapon = GUN_GAME_TIERS[0];
      }
      if (this.gameMode === 'infection') {
        p.isInfected = false;
        p.team = 'survivor';
        p.color = '#00f7ff';
      }
      if (this.gameMode === 'battleroyale') {
        p.team = null;
        p.isAlive = true;
        p.health = p.maxHealth;
        p.shield = p.maxShield;
        p.respawnTimer = 0;
      }
    }
    if (this.gameMode === 'battleroyale') {
      this.initModeState();
    }
    this.teamScores = { red: 0, blue: 0, cyan: 0, magenta: 0 };
    this.events.push({ type: 'scores_reset' });
  }

  selectRandomJuggernaut() {
    const alivePlayers = Array.from(this.players.values()).filter(p => p.isAlive);
    if (alivePlayers.length > 0) {
      const chosen = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      this.juggernautId = chosen.id;
      chosen.health = 500;
      chosen.maxHealth = 500;
      chosen.shield = 100;
      this.events.push({
        type: 'juggernaut_born',
        playerId: chosen.id,
        playerName: chosen.name
      });
    }
  }

  initPowerups() {
    this.powerups = [];
    if (this.map.powerupSpawns) {
      this.map.powerupSpawns.forEach((sp) => {
        this.powerups.push({
          id: this.nextPowerupId++,
          x: sp.x,
          y: sp.y,
          type: sp.type,
          active: true,
          respawnTimer: 0
        });
      });
    }
  }

  addPlayer(id, name, color, mechClass = 'spectre', weapon = 'blaster', title = 'Cadet') {
    if (this.inLobby) this.inLobby = false;
    const spawn = this.getSafeSpawnPoint();
    const mClass = MECH_CLASSES[mechClass] || MECH_CLASSES.spectre;
    const initialWeapon = WEAPON_TYPES[weapon] ? weapon : 'blaster';

    let assignedTeam = null;
    let assignedColor = color || '#00f7ff';

    if (this.gameMode === 'teams') {
      let redCount = 0, blueCount = 0;
      for (const p of this.players.values()) {
        if (p.team === 'red') redCount++;
        else if (p.team === 'blue') blueCount++;
      }
      assignedTeam = redCount <= blueCount ? 'red' : 'blue';
      assignedColor = assignedTeam === 'red' ? '#ff0055' : '#00f7ff';
    } else if (this.gameMode === 'pve') {
      assignedTeam = 'blue';
      assignedColor = '#00f7ff';
    } else if (this.gameMode === 'infection') {
      assignedTeam = 'survivor';
      assignedColor = '#00f7ff';
    }

    const player = {
      id,
      name: name || 'Pilot',
      title: title || 'Cadet',
      color: assignedColor,
      team: assignedTeam,
      mechClass: mClass.id,
      weapon: this.gameMode === 'gungame' ? GUN_GAME_TIERS[0] : initialWeapon,
      gunGameTier: 0,
      isInfected: false,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      angle: 0,
      turretAngle: 0,
      radius: 24,
      health: mClass.health,
      maxHealth: mClass.health,
      shield: mClass.shield,
      maxShield: mClass.shield,
      speed: mClass.speed,
      dashCooldown: 0,
      maxDashCooldown: mClass.dashCooldown,
      dashActiveTimer: 0,
      superCharge: 0,
      isSuperActive: false,
      superTimer: 0,
      isStealthed: false,
      isEmpDisabled: 0,
      invulnerableTimer: 2.0,
      slowUntil: 0,
      score: 0,
      kills: 0,
      deaths: 0,
      streak: 0,
      maxStreak: 0,
      damageDealt: 0,
      lastKillTime: 0,
      comboCount: 0,
      isAlive: true,
      respawnTimer: 0,
      powerupEffects: {
        speedUntil: 0,
        trishotUntil: 0
      },
      currentEmoji: null,
      emojiExpires: 0,
      parryWindowTimer: 0,
      parryCooldown: 0,
      isPhasing: false,
      portalCooldown: 0,
      portalWarpTimer: 0,
      portalWarpTarget: null,
      bouncyTimer: 0,
      boostPadTimer: 0,
      history: [],
      inputs: {
        up: false, down: false, left: false, right: false,
        shooting: false, aimAngle: 0, joyX: 0, joyY: 0
      }
    };

    if (this.mutators.weaponLock && this.mutators.weaponLock !== 'none' && WEAPON_TYPES[this.mutators.weaponLock]) {
      player.weapon = this.mutators.weaponLock;
    }

    this.players.set(id, player);

    if (this.gameMode === 'juggernaut' && !this.juggernautId) {
      this.juggernautId = player.id;
      player.health = 500;
      player.maxHealth = 500;
    }

    return player;
  }

  removePlayer(id) {
    this.players.delete(id);
    const botIdx = this.botIds.indexOf(id);
    if (botIdx !== -1) this.botIds.splice(botIdx, 1);

    if (this.juggernautId === id) {
      this.selectRandomJuggernaut();
    }
  }

  tryParry(player) {
    if (!player || !player.isAlive || player.isEmpDisabled > 0 || player.parryCooldown > 0 || (player.portalWarpTimer && player.portalWarpTimer > 0)) return;
    player.parryWindowTimer = 0.38;
    player.parryCooldown = 2.2;
    this.events.push({
      type: 'parry_activated',
      playerId: player.id,
      x: player.x,
      y: player.y,
      color: player.color
    });
  }

  handleInput(id, inputData) {
    const player = this.players.get(id);
    if (!player || !player.isAlive) return;

    if (inputData.movement) {
      player.inputs.up = !!inputData.movement.up;
      player.inputs.down = !!inputData.movement.down;
      player.inputs.left = !!inputData.movement.left;
      player.inputs.right = !!inputData.movement.right;
      player.inputs.joyX = inputData.movement.joyX || 0;
      player.inputs.joyY = inputData.movement.joyY || 0;
    }

    if (typeof inputData.aimAngle === 'number') {
      player.turretAngle = inputData.aimAngle;
    }

    if (typeof inputData.shooting === 'boolean') {
      player.inputs.shooting = inputData.shooting;
    }

    if (inputData.dash) {
      this.tryDash(player);
    }

    if (inputData.parry) {
      this.tryParry(player);
    }

    if (inputData.super) {
      this.tryActivateSuper(player);
    }

    if (inputData.weapon && WEAPON_TYPES[inputData.weapon]) {
      // In Gun Game, weapon switching is locked to tier
      if (this.gameMode !== 'gungame' && (!this.mutators.weaponLock || this.mutators.weaponLock === 'none')) {
        player.weapon = inputData.weapon;
      }
    }

    if (inputData.emoji) {
      player.currentEmoji = inputData.emoji;
      player.emojiExpires = Date.now() + 3500;
      this.events.push({
        type: 'emoji',
        playerId: player.id,
        emoji: inputData.emoji
      });
    }
  }

  tryDash(player) {
    if (this.mutators.infiniteDash) {
      player.dashCooldown = 0;
    }
    if (player.dashCooldown <= 0 && player.isAlive && player.isEmpDisabled <= 0 && (!player.portalWarpTimer || player.portalWarpTimer <= 0)) {
      player.dashActiveTimer = 0.22;
      player.dashCooldown = player.maxDashCooldown;

      this.events.push({
        type: 'dash',
        x: player.x,
        y: player.y,
        angle: player.angle,
        color: player.color
      });
    }
  }

  tryActivateSuper(player) {
    if (player.superCharge >= 100 && player.isAlive && player.isEmpDisabled <= 0 && (!player.portalWarpTimer || player.portalWarpTimer <= 0)) {
      player.superCharge = 0;
      const mClass = MECH_CLASSES[player.mechClass] || MECH_CLASSES.spectre;
      const superType = mClass.superType;

      this.events.push({
        type: 'super_activated',
        superType,
        playerId: player.id,
        playerName: player.name,
        color: player.color,
        x: player.x,
        y: player.y
      });

      if (superType === 'stealth') {
        player.isStealthed = true;
        player.superTimer = 5.0;
      } else if (superType === 'stomp') {
        this.events.push({ type: 'explosion', x: player.x, y: player.y, radius: 220 });
        for (const enemy of this.players.values()) {
          if (enemy.id !== player.id && enemy.isAlive && !this.isTeammate(player, enemy)) {
            const d = Math.hypot(enemy.x - player.x, enemy.y - player.y);
            if (d < 280) {
              this.applyDamage(enemy, 90, player.id, 'super_stomp');
              enemy.isEmpDisabled = 2.5;
            }
          }
        }
        if (this.gameMode === 'pve' && this.pveState.boss && this.pveState.boss.isAlive) {
          const d = Math.hypot(this.pveState.boss.x - player.x, this.pveState.boss.y - player.y);
          if (d < 300) {
            this.applyDamageToBoss(this.pveState.boss, 150, player.id);
          }
        }
      } else if (superType === 'berserk') {
        player.isSuperActive = true;
        player.superTimer = 6.0;
      } else if (superType === 'emp') {
        this.events.push({ type: 'explosion', x: player.x, y: player.y, radius: 260 });
        for (const enemy of this.players.values()) {
          if (enemy.id !== player.id && enemy.isAlive && !this.isTeammate(player, enemy)) {
            const d = Math.hypot(enemy.x - player.x, enemy.y - player.y);
            if (d < 320) {
              enemy.isEmpDisabled = 4.0;
              this.applyDamage(enemy, 35, player.id, 'emp_pulse');
            }
          }
        }
      } else if (superType === 'recall') {
        // Chrono 3.5s Time Rewind
        if (player.history && player.history.length > 0) {
          const past = player.history[0];
          player.x = past.x;
          player.y = past.y;
          player.health = Math.max(player.health, past.health);
          player.shield = Math.max(player.shield, past.shield);
        }
        this.events.push({
          type: 'time_recall',
          playerId: player.id,
          x: player.x,
          y: player.y,
          color: '#00ffff'
        });
      } else if (superType === 'hexdome') {
        // Aegis 360-degree Barrier Dome
        this.deployableHexDomes.push({
          id: `dome_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          ownerId: player.id,
          x: player.x,
          y: player.y,
          radius: 140,
          health: 450,
          maxHealth: 450,
          lifetime: 8.0,
          color: '#00e5ff'
        });
        this.events.push({
          type: 'hexdome_deployed',
          playerId: player.id,
          x: player.x,
          y: player.y,
          radius: 140
        });
      } else if (superType === 'phase') {
        // Phantom Void Infiltration
        player.isPhasing = true;
        player.superTimer = 5.0;
        this.events.push({
          type: 'phase_active',
          playerId: player.id,
          x: player.x,
          y: player.y
        });
      } else if (superType === 'vortex_singularity') {
        // Gravity Black Hole Implosion
        const targetDist = 260;
        const vx = player.x + Math.cos(player.turretAngle || player.angle) * targetDist;
        const vy = player.y + Math.sin(player.turretAngle || player.angle) * targetDist;
        this.singularityVortices.push({
          id: `vortex_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          ownerId: player.id,
          x: vx,
          y: vy,
          radius: 260,
          pullStrength: 420,
          lifetime: 4.5,
          damage: 90,
          color: '#bf00ff'
        });
        this.events.push({
          type: 'singularity_spawned',
          playerId: player.id,
          x: vx,
          y: vy,
          radius: 260
        });
      }
    }
  }

  isTeammate(p1, p2) {
    if (!p1 || !p2) return false;
    if (this.gameMode === 'teams') {
      return p1.team && p2.team && p1.team === p2.team;
    }
    if (this.gameMode === 'pve') {
      return true; // All human and friendly bot pilots cooperate in PvE
    }
    if (this.gameMode === 'infection') {
      return (p1.isInfected && p2.isInfected) || (!p1.isInfected && !p2.isInfected);
    }
    return false;
  }

  getSafeSpawnPoint() {
    const w = this.map.width;
    const h = this.map.height;
    const cx = w / 2;
    const cy = h / 2;

    for (let attempts = 0; attempts < 40; attempts++) {
      let x, y;
      if (this.suddenDeathActive) {
        const rad = Math.random() * (this.suddenDeathRadius - 100);
        const ang = Math.random() * Math.PI * 2;
        x = cx + Math.cos(ang) * rad;
        y = cy + Math.sin(ang) * rad;
      } else {
        x = 160 + Math.random() * (w - 320);
        y = 160 + Math.random() * (h - 320);
      }

      const hitObstacle = this.map.obstacles.some(obs => {
        if (obs.isDestroyed) return false;
        return x > obs.x - 70 && x < obs.x + obs.w + 70 &&
               y > obs.y - 70 && y < obs.y + obs.h + 70;
      });

      if (!hitObstacle) return { x, y };
    }
    return { x: cx, y: cy };
  }

  update(forcedDt) {
    const now = Date.now();
    const dt = forcedDt !== undefined ? forcedDt : Math.min((now - this.lastTick) / 1000, 0.08);
    this.lastTick = now;

    if (this.podiumActive) {
      this.podiumTimer -= dt;
      if (this.podiumTimer <= 0) {
        this.returnToLobby();
      }
      const snapshot = this.createSnapshot(null);
      if (this.broadcast) this.broadcast(snapshot);
      this.events = [];
      return;
    }

    this.updateBots(dt, now);
    this.updateSuddenDeath(dt);
    this.updateHazards(dt);
    this.updatePlayers(dt, now);
    this.updateDeployableHexDomes(dt);
    this.updateSingularityVortices(dt);
    this.updateProjectiles(dt);
    this.updatePowerups(dt);
    this.updateGameModeLogic(dt, now);

    let crownKingId = null;
    let highestScore = 0;

    if (this.gameMode === 'koth') {
      crownKingId = this.kothLeaderId;
    } else if (this.gameMode === 'juggernaut') {
      crownKingId = this.juggernautId;
    } else {
      for (const p of this.players.values()) {
        if (p.isAlive && p.score > highestScore) {
          highestScore = p.score;
          crownKingId = p.id;
        }
      }
    }

    const snapshot = this.createSnapshot(crownKingId);
    if (this.broadcast) this.broadcast(snapshot);
    this.events = [];
  }

  updateGameModeLogic(dt, now) {
    // Round timer
    if (this.roundTimer > 0) {
      this.roundTimer -= dt;
      if (this.roundTimer <= 0) {
        if (this.gameMode === 'infection') {
          this.triggerMatchEnded(null, 'infection_survivor_win', 'survivors');
        } else {
          this.triggerMatchEnded(null, 'round_timeout');
        }
        return;
      }
    }

    if (this.gameMode === 'pve') {
      this.updatePvE(dt, now);
    } else if (this.gameMode === 'infection') {
      this.updateInfection(dt, now);
    } else if (this.gameMode === 'koth' && this.map.kothZone) {
      const zone = this.map.kothZone;
      let controllingPlayer = null;

      for (const p of this.players.values()) {
        if (!p.isAlive) continue;
        const d = Math.hypot(p.x - zone.x, p.y - zone.y);
        if (d < zone.radius) {
          p.score += Math.round(12 * dt);
          controllingPlayer = p;
        }
      }
      this.kothLeaderId = controllingPlayer ? controllingPlayer.id : null;
    }
  }

  updatePvE(dt, now) {
    const boss = this.pveState.boss;

    if (boss && boss.isAlive) {
      let nearestPlayer = null;
      let nearestDist = Infinity;

      for (const p of this.players.values()) {
        if (p.isAlive) {
          const d = Math.hypot(p.x - boss.x, p.y - boss.y);
          if (d < nearestDist) {
            nearestDist = d;
            nearestPlayer = p;
          }
        }
      }

      if (nearestPlayer) {
        boss.turretAngle = Math.atan2(nearestPlayer.y - boss.y, nearestPlayer.x - boss.x);
      }
      boss.angle += dt * 0.35;

      if (boss.health <= 1250 && !boss.isEnraged) {
        boss.isEnraged = true;
        this.events.push({
          type: 'announcer_call',
          text: '🔥 GOLIATH CORE ENRAGED! MAXIMUM POWER! 🔥',
          voice: 'Goliath Core Enraged! Maximum firepower unleashed!'
        });
        this.events.push({ type: 'explosion', x: boss.x, y: boss.y, radius: 180 });
      }

      boss.attackTimer -= dt;
      if (boss.attackTimer <= 0 && nearestPlayer && nearestDist < 1400) {
        boss.attackTimer = boss.isEnraged ? 0.32 : 0.48;
        const spread = 0.09;
        this.spawnBossBullet(boss.x, boss.y, boss.turretAngle - spread, 18, '#ff0055');
        this.spawnBossBullet(boss.x, boss.y, boss.turretAngle + spread, 18, '#ff0055');
      }

      boss.missileTimer -= dt;
      if (boss.missileTimer <= 0) {
        boss.missileTimer = boss.isEnraged ? 3.2 : 4.8;
        const count = boss.isEnraged ? 12 : 8;
        for (let i = 0; i < count; i++) {
          const a = boss.angle + (i * Math.PI * 2) / count;
          this.spawnBossBullet(boss.x, boss.y, a, 30, '#ff8800', true);
        }
        this.events.push({ type: 'explosion', x: boss.x, y: boss.y, radius: 60 });
      }

      if (boss.isEnraged) {
        boss.laserSweepTimer = (boss.laserSweepTimer || 0) + dt;
        boss.sweepAngle = (boss.sweepAngle || 0) + dt * 1.6;
        for (let ray = 0; ray < 4; ray++) {
          const rayA = boss.sweepAngle + (ray * Math.PI) / 2;
          const rayLen = 580;
          for (const p of this.players.values()) {
            if (!p.isAlive || p.invulnerableTimer > 0) continue;
            const d = Math.hypot(p.x - boss.x, p.y - boss.y);
            if (d < rayLen) {
              let diff = Math.atan2(p.y - boss.y, p.x - boss.x) - rayA;
              while (diff < -Math.PI) diff += Math.PI * 2;
              while (diff > Math.PI) diff -= Math.PI * 2;
              if (Math.abs(diff) < 0.14) {
                this.applyDamage(p, Math.round(dt * 75), 'goliath_boss', 'boss_laser');
              }
            }
          }
        }
      }
    }

    for (const creep of this.pveState.creeps) {
      if (!creep.isAlive) {
        creep.respawnTimer -= dt;
        if (creep.respawnTimer <= 0) {
          creep.isAlive = true;
          creep.health = creep.maxHealth;
          const cx = this.map.width / 2;
          const cy = this.map.height / 2;
          const a = Math.random() * Math.PI * 2;
          creep.x = cx + Math.cos(a) * 600;
          creep.y = cy + Math.sin(a) * 600;
        }
        continue;
      }

      let target = null;
      let targetDist = Infinity;
      for (const p of this.players.values()) {
        if (p.isAlive) {
          const d = Math.hypot(p.x - creep.x, p.y - creep.y);
          if (d < targetDist) {
            targetDist = d;
            target = p;
          }
        }
      }

      if (target) {
        const toAngle = Math.atan2(target.y - creep.y, target.x - creep.x);
        creep.angle = toAngle;
        const speed = 210;
        creep.x += Math.cos(toAngle) * speed * dt;
        creep.y += Math.sin(toAngle) * speed * dt;

        creep.attackCooldown -= dt;
        if (creep.attackCooldown <= 0 && targetDist < 650) {
          creep.attackCooldown = 0.9 + Math.random() * 0.4;
          this.spawnBossBullet(creep.x, creep.y, toAngle, 12, '#ff0055');
        }
      }
    }
  }

  spawnBossBullet(x, y, angle, damage, color, explosive = false) {
    this.projectiles.push({
      id: this.nextProjId++,
      ownerId: 'goliath_boss',
      startX: x,
      startY: y,
      x: x + Math.cos(angle) * 35,
      y: y + Math.sin(angle) * 35,
      vx: Math.cos(angle) * (explosive ? 520 : 750),
      vy: Math.sin(angle) * (explosive ? 520 : 750),
      radius: explosive ? 8 : 5,
      damage,
      maxRange: 1300,
      color,
      explosive,
      splashRadius: explosive ? 90 : 0,
      hitPlayers: new Set()
    });
  }

  applyDamageToBoss(boss, damage, attackerId) {
    if (!boss.isAlive) return;
    const attacker = this.players.get(attackerId);
    if (attacker) {
      attacker.damageDealt = (attacker.damageDealt || 0) + damage;
      attacker.score += Math.round(damage * 0.5);
      this.events.push({
        type: 'hit_confirmed',
        playerId: attacker.id,
        target: 'boss',
        damage: Math.round(damage)
      });
    }

    if (boss.shield > 0) {
      boss.shield -= damage;
      if (boss.shield < 0) {
        boss.health += boss.shield;
        boss.shield = 0;
      }
    } else {
      boss.health -= damage;
    }

    this.events.push({
      type: 'damage_number',
      x: boss.x + (Math.random() * 30 - 15),
      y: boss.y - 20,
      damage: Math.round(damage)
    });

    if (boss.health <= 0) {
      boss.health = 0;
      boss.isAlive = false;
      this.events.push({
        type: 'explosion',
        x: boss.x,
        y: boss.y,
        radius: 260
      });
      this.events.push({
        type: 'announcer_call',
        text: '🏆 GOLIATH CORE DESTROYED! PVE VICTORY! 🏆',
        voice: 'Goliath Core Destroyed! Outstanding teamwork pilots! Victory achieved!'
      });
      this.triggerMatchEnded(attackerId, 'boss_defeated');
    }
  }

  applyDamageToCreep(creep, damage, attackerId) {
    if (!creep.isAlive) return;
    const attacker = this.players.get(attackerId);
    if (attacker) {
      attacker.damageDealt = (attacker.damageDealt || 0) + damage;
      attacker.score += 35;
      this.events.push({
        type: 'hit_confirmed',
        playerId: attacker.id,
        target: 'creep',
        damage: Math.round(damage)
      });
    }

    creep.health -= damage;
    if (creep.health <= 0) {
      creep.health = 0;
      creep.isAlive = false;
      creep.respawnTimer = 10.0;
      if (attacker) attacker.kills += 1;
      this.events.push({
        type: 'explosion',
        x: creep.x,
        y: creep.y,
        radius: 45
      });
    }
  }

  updateInfection(dt, now) {
    if (!this.infectionState.patientZeroChosen) {
      this.infectionState.patientZeroTimer -= dt;
      if (this.infectionState.patientZeroTimer <= 0) {
        const alive = Array.from(this.players.values()).filter(p => p.isAlive);
        if (alive.length > 0) {
          const pz = alive[Math.floor(Math.random() * alive.length)];
          pz.isInfected = true;
          pz.team = 'infected';
          pz.color = '#00ff66';
          pz.health = 220;
          pz.maxHealth = 220;
          pz.weapon = 'flame';
          this.infectionState.patientZeroChosen = true;
          this.events.push({
            type: 'announcer_call',
            text: `☣️ PATIENT ZERO: ${pz.name.toUpperCase()} UNLEASHED! ☣️`,
            voice: `Patient Zero has awakened! Run for your lives survivors!`
          });
          this.events.push({
            type: 'super_activated',
            superType: 'berserk',
            playerId: pz.id,
            playerName: pz.name,
            color: '#00ff66',
            x: pz.x,
            y: pz.y
          });
        }
      }
    } else {
      this.checkInfectionWinCondition();
    }
  }

  checkInfectionWinCondition() {
    let survivors = 0;
    let infected = 0;
    for (const p of this.players.values()) {
      if (p.isAlive) {
        if (p.isInfected) infected++;
        else survivors++;
      }
    }

    if (this.infectionState.patientZeroChosen && survivors === 0 && infected > 0) {
      this.events.push({
        type: 'announcer_call',
        text: '☣️ ALL PILOTS INFECTED! THE VIRUS PREVAILS! ☣️',
        voice: 'All pilots infected! The virus prevails!'
      });
      this.triggerMatchEnded(null, 'infection_infected_win', 'infected');
    }
  }

  triggerMatchEnded(winnerId, reason, winningTeam = null) {
    if (this.podiumActive) return;
    this.podiumActive = true;
    this.podiumTimer = 8.0;

    let sorted;
    if (this.gameMode === 'battleroyale' && winnerId) {
      const winnerPlayer = this.players.get(winnerId);
      const others = Array.from(this.players.values()).filter(p => p.id !== winnerId).sort((a, b) => b.kills - a.kills || b.score - a.score);
      sorted = winnerPlayer ? [winnerPlayer, ...others] : others;
    } else {
      sorted = Array.from(this.players.values()).sort((a, b) => b.kills - a.kills || b.score - a.score);
    }

    const first = sorted[0] ? { id: sorted[0].id, name: sorted[0].name, kills: sorted[0].kills, score: sorted[0].score, color: sorted[0].color, title: sorted[0].title } : null;
    const second = sorted[1] ? { id: sorted[1].id, name: sorted[1].name, kills: sorted[1].kills, score: sorted[1].score, color: sorted[1].color, title: sorted[1].title } : null;
    const third = sorted[2] ? { id: sorted[2].id, name: sorted[2].name, kills: sorted[2].kills, score: sorted[2].score, color: sorted[2].color, title: sorted[2].title } : null;

    const mostDamage = Array.from(this.players.values()).sort((a, b) => (b.damageDealt || 0) - (a.damageDealt || 0))[0];
    const topStreak = Array.from(this.players.values()).sort((a, b) => (b.maxStreak || 0) - (a.maxStreak || 0))[0];

    const fullLeaderboard = sorted.map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      name: p.name,
      kills: p.kills || 0,
      deaths: p.deaths || 0,
      damage: Math.round(p.damageDealt || 0),
      score: p.score || 0,
      color: p.color || '#00f7ff',
      isBot: !!p.isBot,
      isCrownKing: !!p.isCrownKing
    }));

    this.podiumData = {
      active: true,
      reason,
      winningTeam,
      first,
      second,
      third,
      top3: [first, second, third].filter(Boolean),
      leaderboard: fullLeaderboard,
      mvps: [
        { label: 'APEX SLAYER', name: first ? first.name : 'None', value: `${first ? first.kills : 0} Kills` },
        { label: 'HEAVY ARTILLERY', name: mostDamage ? mostDamage.name : 'None', value: `${mostDamage ? Math.round(mostDamage.damageDealt || 0) : 0} DMG` },
        { label: 'UNTOUCHABLE', name: topStreak ? topStreak.name : 'None', value: `${topStreak ? topStreak.maxStreak || 0 : 0} Streak` }
      ]
    };

    let announcementVoice = 'Match Complete! Outstanding Performance!';
    if (this.gameMode === 'battleroyale') {
      announcementVoice = first ? `Apex Champion! ${first.name} wins Battle Royale!` : 'Battle Royale Complete!';
    } else if (winningTeam) {
      announcementVoice = `${winningTeam.toUpperCase()} Team Victory!`;
    }

    this.events.push({
      type: 'match_ended',
      podium: this.podiumData,
      voice: announcementVoice
    });
  }

  updateBots(dt, now) {
    const diff = BOT_DIFFICULTIES[this.botDifficulty] || BOT_DIFFICULTIES.medium;

    for (const botId of this.botIds) {
      const bot = this.players.get(botId);
      if (!bot || !bot.isAlive) continue;

      // Anti-stuck obstacle avoidance for bots
      const dMoved = Math.hypot(bot.x - (bot.prevX ?? bot.x), bot.y - (bot.prevY ?? bot.y));
      bot.prevX = bot.x;
      bot.prevY = bot.y;

      const hasMoveIntent = (Math.abs(bot.inputs.joyX) > 0.1 || Math.abs(bot.inputs.joyY) > 0.1);
      if (hasMoveIntent && dMoved < 22 * dt) {
        bot.stuckTimer = (bot.stuckTimer || 0) + dt;
        if (bot.stuckTimer > 0.22) {
          if (!bot.stuckDir) bot.stuckDir = (Math.random() < 0.5 ? 1 : -1);
          const curMoveAngle = Math.atan2(bot.inputs.joyY, bot.inputs.joyX);
          const escapeAngle = curMoveAngle + (Math.PI / 2) * bot.stuckDir;
          bot.inputs.joyX = Math.cos(escapeAngle);
          bot.inputs.joyY = Math.sin(escapeAngle);

          if (bot.stuckTimer > 0.55 && bot.dashCooldown <= 0) {
            this.tryDash(bot);
            bot.stuckTimer = 0;
            bot.stuckDir = -bot.stuckDir;
          }
        }
      } else {
        bot.stuckTimer = 0;
        bot.stuckDir = null;
      }

      bot.botDecisionTimer = (bot.botDecisionTimer || 0) - dt;
      if (bot.botDecisionTimer <= 0) {
        // Dynamic reaction time per difficulty tier
        const [rMin, rMax] = diff.reactionTime || [0.3, 0.5];
        bot.botDecisionTimer = rMin + Math.random() * (rMax - rMin);

        // Harmless mode: passive target dummies that wander slowly and never attack
        if (diff.id === 'harmless') {
          bot.inputs.shooting = false;
          if (Math.random() < 0.45) {
            const wanderAngle = Math.random() * Math.PI * 2;
            bot.inputs.joyX = Math.cos(wanderAngle);
            bot.inputs.joyY = Math.sin(wanderAngle);
            bot.turretAngle = wanderAngle;
          } else if (Math.random() < 0.35) {
            bot.inputs.joyX = 0;
            bot.inputs.joyY = 0;
          }
          continue;
        }

        let nearestTarget = null;
        let minDist = Infinity;

        if (this.gameMode === 'pve') {
          if (this.pveState.boss && this.pveState.boss.isAlive) {
            nearestTarget = this.pveState.boss;
            minDist = Math.hypot(this.pveState.boss.x - bot.x, this.pveState.boss.y - bot.y);
          }
        } else {
          for (const other of this.players.values()) {
            if (other.id === bot.id || !other.isAlive || other.isStealthed || this.isTeammate(bot, other)) continue;
            const d = Math.hypot(other.x - bot.x, other.y - bot.y);
            if (d < minDist) {
              minDist = d;
              nearestTarget = other;
            }
          }
        }

        if (nearestTarget) {
          // Aim calculation
          let targetX = nearestTarget.x;
          let targetY = nearestTarget.y;

          // Predictive target velocity leading for Hard & Extreme
          if (diff.leadTarget) {
            const bulletSpeed = (WEAPON_TYPES[bot.weapon] || WEAPON_TYPES.blaster).speed || 1000;
            const flightTime = minDist / Math.max(1, bulletSpeed);
            targetX += (nearestTarget.vx || 0) * flightTime;
            targetY += (nearestTarget.vy || 0) * flightTime;
          }

          let aimAngle = Math.atan2(targetY - bot.y, targetX - bot.x);

          // Add difficulty spread error (Easy: ~31° spread, Medium: ~10°, Hard: ~3.4°, Extreme: <1°)
          if (diff.aimError > 0) {
            aimAngle += (Math.random() * 2 - 1) * diff.aimError;
          }
          bot.turretAngle = aimAngle;

          // Shooting logic
          if (diff.canShoot && minDist <= diff.shootingRange) {
            bot.inputs.shooting = Math.random() <= diff.burstChance;
          } else {
            bot.inputs.shooting = false;
          }

          // Movement logic
          if (diff.id === 'easy') {
            // Easy bots frequently hesitate, wander casually or drift gently
            if (Math.random() < 0.28) {
              bot.inputs.joyX = 0;
              bot.inputs.joyY = 0;
            } else {
              const moveAngle = Math.atan2(nearestTarget.y - bot.y, nearestTarget.x - bot.x);
              if (minDist > 380) {
                bot.inputs.joyX = Math.cos(moveAngle);
                bot.inputs.joyY = Math.sin(moveAngle);
              } else if (minDist < 170) {
                bot.inputs.joyX = -Math.cos(moveAngle);
                bot.inputs.joyY = -Math.sin(moveAngle);
              } else {
                bot.inputs.joyX = Math.cos(moveAngle + Math.PI * 0.4);
                bot.inputs.joyY = Math.sin(moveAngle + Math.PI * 0.4);
              }
            }
          } else if (diff.id === 'medium') {
            // Medium bots approach and circle-strafe
            const angleTo = Math.atan2(nearestTarget.y - bot.y, nearestTarget.x - bot.x);
            if (minDist > 320) {
              bot.inputs.joyX = Math.cos(angleTo);
              bot.inputs.joyY = Math.sin(angleTo);
            } else {
              bot.inputs.joyX = Math.cos(angleTo + Math.PI / 2);
              bot.inputs.joyY = Math.sin(angleTo + Math.PI / 2);
            }
          } else {
            // Hard & Extreme: tactical strafe, maintaining weapon engagement distance
            const angleTo = Math.atan2(nearestTarget.y - bot.y, nearestTarget.x - bot.x);
            const optimalRange = (bot.weapon === 'scatter' || bot.weapon === 'flame') ? 220 : 440;
            const strafeDir = (bot.strafeFlip = (bot.strafeFlip || 1) * (Math.random() < 0.15 ? -1 : 1));

            if (minDist > optimalRange + 100) {
              bot.inputs.joyX = Math.cos(angleTo + 0.3 * strafeDir);
              bot.inputs.joyY = Math.sin(angleTo + 0.3 * strafeDir);
            } else if (minDist < optimalRange - 80) {
              bot.inputs.joyX = -Math.cos(angleTo + 0.3 * strafeDir);
              bot.inputs.joyY = -Math.sin(angleTo + 0.3 * strafeDir);
            } else {
              bot.inputs.joyX = Math.cos(angleTo + (Math.PI / 2) * strafeDir);
              bot.inputs.joyY = Math.sin(angleTo + (Math.PI / 2) * strafeDir);
            }
          }

          // Super activation
          if (diff.canSuper && bot.superCharge >= 100) {
            const superChance = diff.superChance || 0.5;
            if (Math.random() < superChance) {
              this.tryActivateSuper(bot);
            }
          }

          // Tactical dash
          if (diff.canDash && bot.dashCooldown <= 0) {
            const dashChance = diff.dashChance || 0.4;
            const triggerDash = (minDist < 220) || (minDist > 600 && Math.random() < 0.3);
            if (triggerDash && Math.random() < dashChance) {
              this.tryDash(bot);
            }
          }
        } else {
          // No targets in sight, drift towards center
          const cx = this.map.width / 2;
          const cy = this.map.height / 2;
          const angleTo = Math.atan2(cy - bot.y, cx - bot.x);
          bot.inputs.joyX = Math.cos(angleTo);
          bot.inputs.joyY = Math.sin(angleTo);
          bot.inputs.shooting = false;
        }
      }
    }
  }

  updateSuddenDeath(dt) {
    if (!this.suddenDeathActive) return;

    if (this.gameMode === 'battleroyale' && this.brState) {
      this.updateBattleRoyale(dt);
      return;
    }

    this.suddenDeathTimer = (this.suddenDeathTimer || 0) + dt;
    if (this.suddenDeathTimer > 50) {
      this.stopSuddenDeath();
      return;
    }

    this.suddenDeathRadius = Math.max(480, this.suddenDeathRadius - 18 * dt);

    const cx = this.suddenDeathCx ?? (this.map.width / 2);
    const cy = this.suddenDeathCy ?? (this.map.height / 2);

    for (const p of this.players.values()) {
      if (!p.isAlive || p.invulnerableTimer > 0) continue;
      const d = Math.hypot(p.x - cx, p.y - cy);
      if (d > this.suddenDeathRadius) {
        p.stormDamageAcc = (p.stormDamageAcc || 0) + 20 * dt;
        if (p.stormDamageAcc >= 10) {
          const dmg = Math.floor(p.stormDamageAcc);
          p.stormDamageAcc -= dmg;
          this.applyDamage(p, dmg, null, 'sudden_death_storm');
        }
      } else {
        p.stormDamageAcc = 0;
      }
    }
  }

  updateBattleRoyale(dt) {
    const br = this.brState;
    if (!br) return;

    br.phaseTimer -= dt;

    if (br.phaseTimer <= 0) {
      if (!br.isClosing) {
        br.isClosing = true;
        br.phaseTimer = 25.0; // 25s shrink phase
        this.events.push({
          type: 'announcer_call',
          text: `⚡ STORM ADVANCING! MOVE TO THE SAFE ZONE! ⚡`,
          voice: 'Storm advancing! Move to the safe zone!'
        });
      } else {
        br.isClosing = false;
        br.phase++;
        br.currentRadius = br.targetRadius;

        if (br.phase <= 4) {
          br.phaseTimer = 28.0; // 28s grace
          const shrinkFactor = br.phase === 2 ? 0.6 : (br.phase === 3 ? 0.5 : 0.4);
          br.targetRadius = Math.max(160, br.currentRadius * shrinkFactor);
          const maxShift = (br.currentRadius - br.targetRadius) * 0.4;
          br.safeX += (Math.random() * 2 - 1) * maxShift;
          br.safeY += (Math.random() * 2 - 1) * maxShift;
          br.safeX = Math.max(br.targetRadius + 100, Math.min(this.map.width - br.targetRadius - 100, br.safeX));
          br.safeY = Math.max(br.targetRadius + 100, Math.min(this.map.height - br.targetRadius - 100, br.safeY));
          br.dps = Math.min(25, br.dps + 5);
        } else {
          br.phaseTimer = 20.0;
          br.targetRadius = 60;
          br.dps = 30;
        }
      }
    }

    if (br.isClosing) {
      const shrinkSpeed = (br.currentRadius - br.targetRadius) / Math.max(1, br.phaseTimer);
      br.currentRadius = Math.max(br.targetRadius, br.currentRadius - shrinkSpeed * dt);
    }

    this.suddenDeathRadius = br.currentRadius;
    this.suddenDeathCx = br.safeX;
    this.suddenDeathCy = br.safeY;

    // Apply storm damage to any pilot outside current storm radius
    for (const p of this.players.values()) {
      if (!p.isAlive || p.invulnerableTimer > 0) continue;
      const d = Math.hypot(p.x - br.safeX, p.y - br.safeY);
      if (d > br.currentRadius) {
        p.stormDamageAcc = (p.stormDamageAcc || 0) + br.dps * dt;
        if (p.stormDamageAcc >= 6) {
          const dmg = Math.floor(p.stormDamageAcc);
          p.stormDamageAcc -= dmg;
          this.applyDamage(p, dmg, null, 'cyber_storm');
        }
      } else {
        p.stormDamageAcc = 0;
      }
    }
  }

  updateHazards(dt) {
    if (this.map.laserGates) {
      for (const lg of this.map.laserGates) {
        lg.timer += dt;
        if (lg.timer >= lg.interval) {
          lg.timer = 0;
          lg.active = !lg.active;
        }

        // 1.0s warning before turning lethal
        lg.warning = (!lg.active && lg.timer >= (lg.interval - 1.0));

        if (lg.active) {
          for (const player of this.players.values()) {
            if (!player.isAlive || player.invulnerableTimer > 0) continue;
            const dist = this.distToSegment({ x: player.x, y: player.y }, { x: lg.x1, y: lg.y1 }, { x: lg.x2, y: lg.y2 });
            if (dist < player.radius + 8) {
              player.laserHitCooldown = (player.laserHitCooldown || 0) - dt;
              if (player.laserHitCooldown <= 0) {
                player.laserHitCooldown = 0.18; // Hit every 180ms
                this.applyDamage(player, 16, null, 'laser_gate');

                // Repel player away from laser beam line
                const lineDx = lg.x2 - lg.x1;
                const lineDy = lg.y2 - lg.y1;
                const lineLen = Math.hypot(lineDx, lineDy) || 1;
                const normalX = -lineDy / lineLen;
                const normalY = lineDx / lineLen;
                const toPlayerX = player.x - lg.x1;
                const toPlayerY = player.y - lg.y1;
                const side = (toPlayerX * normalX + toPlayerY * normalY) >= 0 ? 1 : -1;

                player.vx += normalX * side * 420;
                player.vy += normalY * side * 420;

                this.events.push({
                  type: 'spark',
                  x: player.x,
                  y: player.y,
                  color: '#ff0055'
                });
              }
            }
          }
        }
      }
    }
  }

  distToSegment(p, v, w) {
    const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  updateDeployableHexDomes(dt) {
    if (!this.deployableHexDomes || this.deployableHexDomes.length === 0) return;
    const kept = [];
    for (const dome of this.deployableHexDomes) {
      dome.lifetime -= dt;
      if (dome.lifetime > 0 && dome.health > 0) {
        kept.push(dome);
      } else {
        this.events.push({
          type: 'hexdome_collapsed',
          domeId: dome.id,
          x: dome.x,
          y: dome.y
        });
      }
    }
    this.deployableHexDomes = kept;
  }

  updateSingularityVortices(dt) {
    if (!this.singularityVortices || this.singularityVortices.length === 0) return;
    const kept = [];
    for (const vortex of this.singularityVortices) {
      vortex.lifetime -= dt;
      if (vortex.lifetime > 0) {
        const owner = this.players.get(vortex.ownerId);
        for (const player of this.players.values()) {
          if (!player.isAlive || player.id === vortex.ownerId) continue;
          if (owner && this.isTeammate(owner, player)) continue;
          const dx = vortex.x - player.x;
          const dy = vortex.y - player.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < vortex.radius + 80) {
            const pull = (1 - (dist / (vortex.radius + 80))) * vortex.pullStrength * dt;
            player.vx += (dx / dist) * pull;
            player.vy += (dy / dist) * pull;
          }
        }
        for (const proj of this.projectiles) {
          if (proj.ownerId === vortex.ownerId) continue;
          const dx = vortex.x - proj.x;
          const dy = vortex.y - proj.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < vortex.radius) {
            const pull = 550 * dt;
            proj.vx += (dx / dist) * pull;
            proj.vy += (dy / dist) * pull;
          }
        }
        kept.push(vortex);
      } else {
        this.events.push({
          type: 'singularity_implosion',
          x: vortex.x,
          y: vortex.y,
          radius: vortex.radius
        });
        const owner = this.players.get(vortex.ownerId);
        for (const player of this.players.values()) {
          if (!player.isAlive || player.id === vortex.ownerId) continue;
          if (owner && this.isTeammate(owner, player)) continue;
          const dist = Math.hypot(vortex.x - player.x, vortex.y - player.y);
          if (dist < vortex.radius) {
            this.applyDamage(player, vortex.damage, vortex.ownerId, 'singularity');
          }
        }
      }
    }
    this.singularityVortices = kept;
  }

  explodeBarrel(barrel, attackerId) {
    const rad = barrel.splashRadius || 180;
    const dmg = barrel.damage || 110;
    this.events.push({
      type: 'barrel_explosion',
      x: barrel.x,
      y: barrel.y,
      radius: rad
    });
    this.events.push({
      type: 'barrel_exploded',
      x: barrel.x,
      y: barrel.y,
      radius: rad
    });
    for (const player of this.players.values()) {
      if (!player.isAlive || player.invulnerableTimer > 0) continue;
      const d = Math.hypot(barrel.x - player.x, barrel.y - player.y);
      if (d < rad + player.radius) {
        const falloff = 1 - (d / (rad + player.radius));
        const finalDmg = Math.round(dmg * Math.max(0.35, falloff));
        this.applyDamage(player, finalDmg, attackerId, 'barrel');
      }
    }
    if (this.gameMode === 'pve' && this.pveState.boss && this.pveState.boss.isAlive) {
      const d = Math.hypot(barrel.x - this.pveState.boss.x, barrel.y - this.pveState.boss.y);
      if (d < rad + this.pveState.boss.radius) {
        this.applyDamageToBoss(this.pveState.boss, dmg * 1.5, attackerId);
      }
    }

    // Detonate adjacent barrels (chain reaction)
    if (this.map && this.map.barrels) {
      for (const other of this.map.barrels) {
        if (other === barrel || other.exploded) continue;
        const distOther = Math.hypot(barrel.x - other.x, barrel.y - other.y);
        if (distOther < rad + other.radius) {
          other.exploded = true;
          this.explodeBarrel(other, attackerId);
        }
      }
    }

    // Damage nearby destructible obstacles
    if (this.map && this.map.obstacles) {
      for (const obs of this.map.obstacles) {
        if (obs.type === 'destructible' && !obs.isDestroyed) {
          if (this.circleRectCollision(barrel.x, barrel.y, rad, obs)) {
            const maxHp = obs.maxHp || 160;
            if (obs.hp === undefined) obs.hp = maxHp;
            obs.hp -= Math.round(dmg * 0.95);
            if (obs.hp <= 0) {
              obs.hp = 0;
              obs.isDestroyed = true;
              obs.destroyedAt = Date.now();
              this.events.push({
                type: 'wall_destroyed',
                id: obs.id,
                x: obs.x,
                y: obs.y,
                w: obs.w,
                h: obs.h
              });
            } else {
              this.events.push({
                type: 'wall_damaged',
                id: obs.id,
                x: barrel.x,
                y: barrel.y,
                hp: Math.round(obs.hp),
                maxHp: maxHp
              });
            }
          }
        }
      }
    }
  }

  updatePlayers(dt, now) {
    for (const player of this.players.values()) {
      if (!player.isAlive) {
        if (this.gameMode === 'battleroyale') {
          continue;
        }
        player.respawnTimer -= dt;
        if (player.respawnTimer <= 0) {
          const spawn = this.getSafeSpawnPoint();
          const mClass = MECH_CLASSES[player.mechClass] || MECH_CLASSES.spectre;
          player.x = spawn.x;
          player.y = spawn.y;
          player.health = mClass.health;
          player.shield = mClass.shield;
          player.isAlive = true;
          player.invulnerableTimer = 2.5;
          player.dashCooldown = 0;
          player.isEmpDisabled = 0;
          player.isStealthed = false;
        }
        continue;
      }

      if (player.invulnerableTimer > 0) player.invulnerableTimer -= dt;
      if (player.dashCooldown > 0) player.dashCooldown -= dt;
      if (player.dashActiveTimer > 0) player.dashActiveTimer -= dt;
      if (player.isEmpDisabled > 0) player.isEmpDisabled -= dt;
      if (player.parryCooldown > 0) player.parryCooldown -= dt;
      if (player.parryWindowTimer > 0) player.parryWindowTimer -= dt;
      if (player.portalCooldown > 0) player.portalCooldown -= dt;
      if (player.bouncyTimer > 0) player.bouncyTimer -= dt;
      if (player.boostPadTimer > 0) player.boostPadTimer -= dt;

      // Active portal warp transition (smooth & slower teleportation)
      let justWarped = false;
      if (player.portalWarpTimer > 0) {
        player.portalWarpTimer -= dt;
        player.vx *= 0.72;
        player.vy *= 0.72;
        if (player.portalWarpTarget) {
          const pull = Math.min(1.0, dt * 14);
          player.x += (player.portalWarpTarget.fromX - player.x) * pull;
          player.y += (player.portalWarpTarget.fromY - player.y) * pull;
        }

        if (player.portalWarpTimer <= 0) {
          if (player.portalWarpTarget) {
            const { destX, destY, fromX, fromY, color } = player.portalWarpTarget;
            player.x = destX;
            player.y = destY;
            player.vx = 0;
            player.vy = 0;
            player.portalCooldown = 2.2;
            player.invulnerableTimer = Math.max(player.invulnerableTimer, 0.45);
            this.events.push({
              type: 'portal_teleport',
              playerId: player.id,
              fromX,
              fromY,
              toX: destX,
              toY: destY,
              color: color || '#00f7ff'
            });
            player.portalWarpTarget = null;
            justWarped = true;
          }
          player.portalWarpTimer = 0;
        }
      }

      if (this.mutators.infiniteDash) {
        player.dashCooldown = 0;
      }
      if (this.mutators.unlimitedSupers) {
        player.superCharge = 100;
      }
      if (this.mutators.weaponLock && this.mutators.weaponLock !== 'none' && this.gameMode !== 'gungame') {
        player.weapon = this.mutators.weaponLock;
      }

      if (player.superTimer > 0) {
        player.superTimer -= dt;
        if (player.superTimer <= 0) {
          player.isSuperActive = false;
          player.isStealthed = false;
          player.isPhasing = false;
        }
      }

      // History buffer for Chrono Recall (track past 3.5s)
      if (!player.history) player.history = [];
      player.history.push({ x: player.x, y: player.y, health: player.health, shield: player.shield, time: now });
      while (player.history.length > 0 && now - player.history[0].time > 3500) {
        player.history.shift();
      }

      // Speed pads
      if (this.map.speedPads) {
        for (const sp of this.map.speedPads) {
          if (player.x > sp.x - sp.w / 2 && player.x < sp.x + sp.w / 2 &&
              player.y > sp.y - sp.h / 2 && player.y < sp.y + sp.h / 2) {
            const launchSpeed = Math.max(Math.hypot(player.vx, player.vy) * 1.35, 1250);
            player.vx = Math.cos(sp.angle) * launchSpeed;
            player.vy = Math.sin(sp.angle) * launchSpeed;
            player.boostPadTimer = 0.55;
            this.events.push({
              type: 'speed_boost',
              x: player.x,
              y: player.y,
              angle: sp.angle,
              color: '#00ff66'
            });
          }
        }
      }

      // Portals
      if (player.portalCooldown <= 0 && (!player.portalWarpTimer || player.portalWarpTimer <= 0) && this.map.portals) {
        for (const portal of this.map.portals) {
          const distPortal = Math.hypot(player.x - portal.x, player.y - portal.y);
          if (distPortal < portal.radius + player.radius) {
            let destX = portal.targetX;
            let destY = portal.targetY;
            if (destX === undefined && portal.targetId) {
              const destP = this.map.portals.find(p => p.id === portal.targetId);
              if (destP) {
                destX = destP.x;
                destY = destP.y;
              }
            }
            if (destX !== undefined && destY !== undefined) {
              player.portalWarpTimer = 0.38; // ~380ms deliberate smooth vortex charge
              player.portalWarpTarget = {
                destX,
                destY,
                fromX: portal.x,
                fromY: portal.y,
                color: portal.color || '#00f7ff'
              };
              this.events.push({
                type: 'portal_charge',
                playerId: player.id,
                x: portal.x,
                y: portal.y,
                color: portal.color || '#00f7ff'
              });
              break;
            }
          }
        }
      }

      // Movement input
      let moveX = 0, moveY = 0;
      if (player.portalWarpTimer > 0 || justWarped) {
        moveX = 0;
        moveY = 0;
      } else {
        if (player.inputs.up) moveY -= 1;
        if (player.inputs.down) moveY += 1;
        if (player.inputs.left) moveX -= 1;
        if (player.inputs.right) moveX += 1;

        if (player.inputs.joyX !== 0 || player.inputs.joyY !== 0) {
          moveX = player.inputs.joyX;
          moveY = player.inputs.joyY;
        }
      }

      const mag = Math.hypot(moveX, moveY);
      if (mag > 0) {
        moveX /= mag;
        moveY /= mag;
        player.angle = Math.atan2(moveY, moveX);
      }

      let speedMultiplier = 1.0;
      if (player.isBot) {
        const diffDef = BOT_DIFFICULTIES[this.botDifficulty] || BOT_DIFFICULTIES.medium;
        speedMultiplier *= (diffDef.speedMultiplier || 1.0);
      }
      if (player.powerupEffects.speedUntil > now) speedMultiplier *= 1.45;
      if (player.isSuperActive && player.mechClass === 'viper') speedMultiplier *= 1.35;
      if (player.isPhasing) speedMultiplier *= 1.25;
      if (player.slowUntil > now) speedMultiplier *= 0.55;
      if (player.isEmpDisabled > 0) speedMultiplier *= 0.4;
      if (player.isInfected) speedMultiplier *= 1.25;

      let currentSpeed = player.speed * speedMultiplier;
      if (this.mutators.speed) currentSpeed *= this.mutators.speed;
      if (player.dashActiveTimer > 0) currentSpeed *= 3.6;
      if (player.boostPadTimer > 0) currentSpeed *= 2.6;

      let accel = player.dashActiveTimer > 0 ? 3200 : 1800;
      if (player.rocketJumpTimer > 0) {
        player.rocketJumpTimer -= dt;
        accel = 380; // Soaring floaty momentum during rocket jump
      } else if (player.boostPadTimer > 0) {
        accel = 280; // Supersonic float momentum along boost pad runway
      } else if (player.bouncyTimer > 0) {
        accel = 320; // Float/preserve elastic bounce momentum!
      } else if (this.mutators.lowFriction) {
        accel = 360; // low-friction drift
      }

      const targetVx = moveX * currentSpeed;
      const targetVy = moveY * currentSpeed;

      player.vx += (targetVx - player.vx) * Math.min(1, accel * dt / currentSpeed);
      player.vy += (targetVy - player.vy) * Math.min(1, accel * dt / currentSpeed);

      let nextX = justWarped ? player.x : player.x + player.vx * dt;
      let nextY = justWarped ? player.y : player.y + player.vy * dt;

      // Obstacle collision (Phantom passes through obstacles when phasing!)
      if (!player.isPhasing) {
        for (const obs of this.map.obstacles) {
          if (obs.isDestroyed) continue;
          const inside = (nextX >= obs.x && nextX <= obs.x + obs.w && nextY >= obs.y && nextY <= obs.y + obs.h);
          if (inside) {
            const distLeft = nextX - obs.x;
            const distRight = (obs.x + obs.w) - nextX;
            const distTop = nextY - obs.y;
            const distBottom = (obs.y + obs.h) - nextY;
            const minDist = Math.min(distLeft, distRight, distTop, distBottom);

            if (minDist === distLeft) {
              nextX = obs.x - player.radius;
              if (obs.type === 'bouncy') {
                player.vx = -Math.max(Math.abs(player.vx) * 2.5, 920);
                player.bouncyTimer = 0.4;
              }
            } else if (minDist === distRight) {
              nextX = obs.x + obs.w + player.radius;
              if (obs.type === 'bouncy') {
                player.vx = Math.max(Math.abs(player.vx) * 2.5, 920);
                player.bouncyTimer = 0.4;
              }
            } else if (minDist === distTop) {
              nextY = obs.y - player.radius;
              if (obs.type === 'bouncy') {
                player.vy = -Math.max(Math.abs(player.vy) * 2.5, 920);
                player.bouncyTimer = 0.4;
              }
            } else {
              nextY = obs.y + obs.h + player.radius;
              if (obs.type === 'bouncy') {
                player.vy = Math.max(Math.abs(player.vy) * 2.5, 920);
                player.bouncyTimer = 0.4;
              }
            }
            if (obs.type === 'bouncy') {
              this.events.push({ type: 'bounce', x: nextX, y: nextY });
            }
          } else {
            const closestX = Math.max(obs.x, Math.min(nextX, obs.x + obs.w));
            const closestY = Math.max(obs.y, Math.min(nextY, obs.y + obs.h));
            const dx = nextX - closestX;
            const dy = nextY - closestY;
            const dist = Math.hypot(dx, dy);

            if (dist < player.radius) {
              const overlap = player.radius - dist;
              if (dist > 0.0001) {
                nextX += (dx / dist) * overlap;
                nextY += (dy / dist) * overlap;
              }
              if (obs.type === 'bouncy') {
                player.bouncyTimer = 0.4;
                if (Math.abs(dx) > Math.abs(dy)) {
                  player.vx = Math.sign(dx || 1) * Math.max(Math.abs(player.vx) * 2.5, 920);
                } else {
                  player.vy = Math.sign(dy || 1) * Math.max(Math.abs(player.vy) * 2.5, 920);
                }
                this.events.push({ type: 'bounce', x: closestX, y: closestY });
              }
            }
          }
        }
      }

      // Map bounds
      nextX = Math.max(player.radius, Math.min(this.map.width - player.radius, nextX));
      nextY = Math.max(player.radius, Math.min(this.map.height - player.radius, nextY));

      player.x = nextX;
      player.y = nextY;

      // Shooting logic
      if (player.inputs.shooting && player.isEmpDisabled <= 0 && (!player.portalWarpTimer || player.portalWarpTimer <= 0)) {
        this.tryShoot(player, now);
      }
    }
  }

  tryShoot(player, now) {
    const wp = WEAPON_TYPES[player.weapon] || WEAPON_TYPES.blaster;
    let effectiveCooldown = wp.cooldown;

    const mClass = MECH_CLASSES[player.mechClass];
    if (mClass && mClass.reloadBuff) effectiveCooldown *= mClass.reloadBuff;
    if (player.isSuperActive && player.mechClass === 'viper') effectiveCooldown *= 0.55;

    if (!player.lastShootTime || now - player.lastShootTime >= effectiveCooldown) {
      player.lastShootTime = now;
      const angle = player.turretAngle;

      this.events.push({
        type: 'shoot',
        weapon: wp.id,
        x: player.x,
        y: player.y,
        angle,
        color: wp.color
      });

      const hasTrishot = player.powerupEffects.trishotUntil > now;
      const angles = hasTrishot ? [angle - 0.2, angle, angle + 0.2] : [angle];

      for (const a of angles) {
        if (wp.id === 'scatter') {
          for (let i = 0; i < wp.pellets; i++) {
            const spreadAngle = a + (Math.random() - 0.5) * wp.spread;
            this.spawnProjectile(player, wp, spreadAngle);
          }
        } else if (wp.id === 'flame') {
          const spreadAngle = a + (Math.random() - 0.5) * wp.spread;
          this.spawnProjectile(player, wp, spreadAngle);
        } else {
          this.spawnProjectile(player, wp, a);
        }
      }
    }
  }

  spawnProjectile(player, wp, angle) {
    this.projectiles.push({
      id: this.nextProjId++,
      ownerId: player.id,
      weaponId: wp.id,
      startX: player.x,
      startY: player.y,
      x: player.x + Math.cos(angle) * 30,
      y: player.y + Math.sin(angle) * 30,
      vx: Math.cos(angle) * wp.speed,
      vy: Math.sin(angle) * wp.speed,
      radius: wp.radius,
      damage: wp.damage,
      maxRange: wp.maxRange,
      color: wp.color,
      bouncesLeft: wp.explosive ? 0 : ((wp.maxBounces || 0) + (this.mutators.bouncingHell ? 4 : 0)),
      pierce: !!wp.pierce,
      explosive: !!wp.explosive,
      splashRadius: wp.splashRadius || 0,
      slowEffect: wp.slowEffect || 0,
      homing: !!wp.homing,
      hitPlayers: new Set()
    });
  }

  updateProjectiles(dt) {
    const kept = [];
    const w = this.map.width;
    const h = this.map.height;

    for (const proj of this.projectiles) {
      if (proj.homing) {
        let nearestTarget = null;
        let minDist = Infinity;

        if (this.gameMode === 'pve' && proj.ownerId !== 'goliath_boss') {
          if (this.pveState.boss && this.pveState.boss.isAlive) {
            nearestTarget = this.pveState.boss;
            minDist = Math.hypot(this.pveState.boss.x - proj.x, this.pveState.boss.y - proj.y);
          }
        } else {
          for (const player of this.players.values()) {
            if (player.id === proj.ownerId || !player.isAlive || player.isStealthed) continue;
            const owner = this.players.get(proj.ownerId);
            if (owner && this.isTeammate(owner, player)) continue;
            const d = Math.hypot(player.x - proj.x, player.y - proj.y);
            if (d < minDist && d < 700) {
              minDist = d;
              nearestTarget = player;
            }
          }
        }

        if (nearestTarget) {
          const targetAngle = Math.atan2(nearestTarget.y - proj.y, nearestTarget.x - proj.x);
          const currentAngle = Math.atan2(proj.vy, proj.vx);
          let diff = targetAngle - currentAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          const newAngle = currentAngle + Math.sign(diff) * Math.min(Math.abs(diff), 3.5 * dt);
          const spd = Math.hypot(proj.vx, proj.vy);
          proj.vx = Math.cos(newAngle) * spd;
          proj.vy = Math.sin(newAngle) * spd;
        }
      }

      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // Check Portals for projectiles
      if (this.map.portals && !proj.justTeleported) {
        for (const portal of this.map.portals) {
          const distPortal = Math.hypot(proj.x - portal.x, proj.y - portal.y);
          if (distPortal < portal.radius + proj.radius) {
            let destX = portal.targetX;
            let destY = portal.targetY;
            if (destX === undefined && portal.targetId) {
              const destP = this.map.portals.find(p => p.id === portal.targetId);
              if (destP) {
                destX = destP.x;
                destY = destP.y;
              }
            }
            if (destX !== undefined && destY !== undefined) {
              proj.x = destX;
              proj.y = destY;
              proj.justTeleported = true;
              this.events.push({
                type: 'portal_teleport',
                fromX: portal.x,
                fromY: portal.y,
                toX: destX,
                toY: destY
              });
              break;
            }
          }
        }
      }

      // Speed pads acceleration for projectiles
      if (this.map.speedPads && !proj.explosive) {
        for (const sp of this.map.speedPads) {
          if (proj.x > sp.x - sp.w / 2 && proj.x < sp.x + sp.w / 2 &&
              proj.y > sp.y - sp.h / 2 && proj.y < sp.y + sp.h / 2) {
            if (proj.lastBoostPadId !== sp.id) {
              proj.lastBoostPadId = sp.id;
              const spd = Math.max(Math.hypot(proj.vx, proj.vy) * 1.3, 1100);
              proj.vx = Math.cos(sp.angle) * spd;
              proj.vy = Math.sin(sp.angle) * spd;
              proj.damage *= 1.2;
              this.events.push({
                type: 'speed_boost',
                x: proj.x,
                y: proj.y,
                angle: sp.angle,
                color: '#00ff66'
              });
            }
          }
        }
      }

      const dist = Math.hypot(proj.x - proj.startX, proj.y - proj.startY);
      if (dist > proj.maxRange) {
        if (proj.explosive) this.explodeRocket(proj);
        continue;
      }

      if (proj.x < 10 || proj.x > w - 10 || proj.y < 10 || proj.y > h - 10) {
        if (proj.explosive) {
          this.explodeRocket(proj);
          continue;
        } else if (proj.bouncesLeft > 0) {
          if (proj.x < 10 || proj.x > w - 10) proj.vx = -proj.vx;
          if (proj.y < 10 || proj.y > h - 10) proj.vy = -proj.vy;
          proj.bouncesLeft--;
          proj.damage *= 1.15;
          kept.push(proj);
          continue;
        } else {
          continue;
        }
      }

      let hitObs = false;
      for (const obs of this.map.obstacles) {
        if (obs.isDestroyed) continue;
        if (this.circleRectCollision(proj.x, proj.y, proj.radius, obs)) {
          hitObs = true;
          if (obs.type === 'destructible') {
            const maxHp = obs.maxHp || 160;
            if (obs.hp === undefined) obs.hp = maxHp;
            obs.hp -= proj.damage;
            if (obs.hp <= 0) {
              obs.hp = 0;
              obs.isDestroyed = true;
              obs.destroyedAt = Date.now();
              this.events.push({
                type: 'wall_destroyed',
                id: obs.id,
                x: obs.x,
                y: obs.y,
                w: obs.w,
                h: obs.h
              });
            } else {
              this.events.push({
                type: 'wall_damaged',
                id: obs.id,
                x: proj.x,
                y: proj.y,
                hp: Math.round(obs.hp),
                maxHp: maxHp
              });
            }
          }

          if (proj.explosive) {
            this.explodeRocket(proj);
            break;
          } else if (proj.bouncesLeft > 0 || obs.type === 'bouncy') {
            const bounceMult = obs.type === 'bouncy' ? 1.35 : 1.0;
            let reflectX = false;
            if (proj.x >= obs.x && proj.x <= obs.x + obs.w && proj.y >= obs.y && proj.y <= obs.y + obs.h) {
              const dL = proj.x - obs.x;
              const dR = (obs.x + obs.w) - proj.x;
              const dT = proj.y - obs.y;
              const dB = (obs.y + obs.h) - proj.y;
              const minD = Math.min(dL, dR, dT, dB);
              reflectX = (minD === dL || minD === dR);
            } else {
              const cx = Math.max(obs.x, Math.min(proj.x, obs.x + obs.w));
              const cy = Math.max(obs.y, Math.min(proj.y, obs.y + obs.h));
              const dx = proj.x - cx;
              const dy = proj.y - cy;
              reflectX = (Math.abs(dx) >= Math.abs(dy));
            }

            if (reflectX) {
              proj.vx = -proj.vx * bounceMult;
              if (proj.vx > 0) proj.x = obs.x + obs.w + proj.radius + 1;
              else proj.x = obs.x - proj.radius - 1;
            } else {
              proj.vy = -proj.vy * bounceMult;
              if (proj.vy > 0) proj.y = obs.y + obs.h + proj.radius + 1;
              else proj.y = obs.y - proj.radius - 1;
            }

            if (proj.bouncesLeft > 0) {
              proj.bouncesLeft--;
            } else if (obs.type === 'bouncy') {
              proj.wallBounceCount = (proj.wallBounceCount || 0) + 1;
              if (proj.wallBounceCount > 3) {
                this.events.push({ type: 'spark', x: proj.x, y: proj.y, color: proj.color });
                break;
              }
            }
            proj.damage *= 1.15;
            hitObs = false;
            this.events.push({ type: 'bounce', x: proj.x, y: proj.y });
            break;
          } else {
            this.events.push({ type: 'spark', x: proj.x, y: proj.y, color: proj.color });
            break;
          }
        }
      }
      if (hitObs) continue;

      // Hex-Dome barrier collision
      let hitDome = false;
      if (this.deployableHexDomes) {
        for (const dome of this.deployableHexDomes) {
          if (dome.health <= 0 || proj.ownerId === dome.ownerId) continue;
          const distDome = Math.hypot(proj.x - dome.x, proj.y - dome.y);
          if (distDome < dome.radius + proj.radius) {
            dome.health -= proj.damage;
            hitDome = true;
            this.events.push({ type: 'hexdome_hit', x: proj.x, y: proj.y, domeId: dome.id });
            if (proj.explosive) this.explodeRocket(proj);
            break;
          }
        }
      }
      if (hitDome) continue;

      // Barrels check
      let hitBarrel = false;
      if (this.map.barrels) {
        for (const barrel of this.map.barrels) {
          if (barrel.exploded) continue;
          const distB = Math.hypot(proj.x - barrel.x, proj.y - barrel.y);
          if (distB < barrel.radius + proj.radius) {
            barrel.exploded = true;
            this.explodeBarrel(barrel, proj.ownerId);
            if (proj.explosive) this.explodeRocket(proj);
            hitBarrel = true;
            break;
          }
        }
      }
      if (hitBarrel) continue;

      let shouldRemove = false;
      const owner = this.players.get(proj.ownerId);

      // Check Boss collision in PvE
      if (this.gameMode === 'pve' && this.pveState.boss && this.pveState.boss.isAlive) {
        const boss = this.pveState.boss;
        if (proj.ownerId !== boss.id && !proj.hitPlayers.has(boss.id)) {
          const distBoss = Math.hypot(proj.x - boss.x, proj.y - boss.y);
          if (distBoss < boss.radius + proj.radius) {
            proj.hitPlayers.add(boss.id);
            this.applyDamageToBoss(boss, proj.damage, proj.ownerId);
            if (proj.explosive) {
              this.explodeRocket(proj);
              shouldRemove = true;
            } else if (!proj.pierce) {
              shouldRemove = true;
              this.events.push({ type: 'hit', x: proj.x, y: proj.y, color: proj.color });
            }
          }
        }
      }

      // Check Creep collision in PvE
      if (this.gameMode === 'pve' && this.pveState.creeps) {
        for (const creep of this.pveState.creeps) {
          if (!creep.isAlive || proj.ownerId === creep.id || proj.ownerId === 'goliath_boss') continue;
          if (proj.hitPlayers.has(creep.id)) continue;
          const distCreep = Math.hypot(proj.x - creep.x, proj.y - creep.y);
          if (distCreep < creep.radius + proj.radius) {
            proj.hitPlayers.add(creep.id);
            this.applyDamageToCreep(creep, proj.damage, proj.ownerId);
            if (proj.explosive) {
              this.explodeRocket(proj);
              shouldRemove = true;
              break;
            } else if (!proj.pierce) {
              shouldRemove = true;
              this.events.push({ type: 'hit', x: proj.x, y: proj.y, color: proj.color });
              break;
            }
          }
        }
      }

      if (shouldRemove) continue;

      // Check Player collisions
      for (const player of this.players.values()) {
        if (player.id === proj.ownerId || !player.isAlive || player.invulnerableTimer > 0) continue;
        if (owner && this.isTeammate(owner, player)) continue;
        if (proj.hitPlayers.has(player.id)) continue;

        // Phasing players evade non-explosive shots
        if (player.isPhasing && !proj.explosive) continue;

        const distPlayer = Math.hypot(proj.x - player.x, proj.y - player.y);
        if (distPlayer < player.radius + proj.radius) {
          // Deflect / Parry Check!
          if (player.parryWindowTimer > 0) {
            proj.ownerId = player.id;
            proj.hitPlayers.clear();
            proj.vx = -proj.vx * 1.35;
            proj.vy = -proj.vy * 1.35;
            proj.damage *= 1.35;
            proj.color = '#ffe600';
            proj.isDeflected = true;
            player.superCharge = Math.min(100, player.superCharge + 25);
            this.events.push({
              type: 'parry_deflect',
              x: proj.x,
              y: proj.y,
              playerId: player.id,
              color: '#ffe600'
            });
            continue;
          }

          proj.hitPlayers.add(player.id);

          if (proj.slowEffect) {
            player.slowUntil = Date.now() + 2500;
          }

          this.applyDamage(player, proj.damage, proj.ownerId, proj.weaponId);

          if (proj.explosive) {
            this.explodeRocket(proj);
            shouldRemove = true;
            break;
          } else if (!proj.pierce) {
            shouldRemove = true;
            this.events.push({ type: 'hit', x: proj.x, y: proj.y, color: proj.color });
            break;
          }
        }
      }

      if (!shouldRemove) {
        kept.push(proj);
      }
    }

    this.projectiles = kept;
  }

  explodeRocket(proj) {
    this.events.push({
      type: 'explosion',
      x: proj.x,
      y: proj.y,
      radius: proj.splashRadius
    });

    const owner = this.players.get(proj.ownerId);
    for (const player of this.players.values()) {
      if (!player.isAlive) continue;

      // Rocket Jump / Self-Knockback: 0 self damage + massive repulsion!
      if (player.id === proj.ownerId) {
        const d = Math.hypot(player.x - proj.x, player.y - proj.y);
        const selfRepelRadius = Math.max(proj.splashRadius * 1.8, 260);
        if (d < selfRepelRadius + player.radius) {
          const angle = (d < 5) ? player.angle + Math.PI : Math.atan2(player.y - proj.y, player.x - proj.x);
          const impulse = 1450;
          player.vx += Math.cos(angle) * impulse;
          player.vy += Math.sin(angle) * impulse;
          player.rocketJumpTimer = 0.45; // Low friction flight phase
          this.events.push({
            type: 'rocket_jump',
            playerId: player.id,
            x: player.x,
            y: player.y
          });
        }
        continue;
      }

      if (player.invulnerableTimer > 0) continue;
      if (owner && this.isTeammate(owner, player)) continue;

      const d = Math.hypot(proj.x - player.x, proj.y - player.y);
      if (d < proj.splashRadius + player.radius) {
        const falloff = 1 - (d / (proj.splashRadius + player.radius));
        const dmg = Math.round(proj.damage * Math.max(0.3, falloff));
        this.applyDamage(player, dmg, proj.ownerId, 'rocket');
      }
    }

    // Damage nearby destructible obstacles
    if (this.map && this.map.obstacles) {
      for (const obs of this.map.obstacles) {
        if (obs.type === 'destructible' && !obs.isDestroyed) {
          if (this.circleRectCollision(proj.x, proj.y, proj.splashRadius, obs)) {
            const maxHp = obs.maxHp || 160;
            if (obs.hp === undefined) obs.hp = maxHp;
            obs.hp -= Math.round(proj.damage * 0.9);
            if (obs.hp <= 0) {
              obs.hp = 0;
              obs.isDestroyed = true;
              obs.destroyedAt = Date.now();
              this.events.push({
                type: 'wall_destroyed',
                id: obs.id,
                x: obs.x,
                y: obs.y,
                w: obs.w,
                h: obs.h
              });
            } else {
              this.events.push({
                type: 'wall_damaged',
                id: obs.id,
                x: proj.x,
                y: proj.y,
                hp: Math.round(obs.hp),
                maxHp: maxHp
              });
            }
          }
        }
      }
    }
  }

  circleRectCollision(cx, cy, radius, rect) {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) < (radius * radius);
  }

  applyDamage(victim, damage, attackerId, weaponId) {
    if (this.mutators.instagib) {
      damage *= 10;
    }
    const attacker = this.players.get(attackerId);

    let remainingDamage = damage;
    if (victim.shield > 0) {
      if (victim.shield >= remainingDamage) {
        victim.shield -= remainingDamage;
        remainingDamage = 0;
      } else {
        remainingDamage -= victim.shield;
        victim.shield = 0;
      }
    }

    victim.health -= remainingDamage;

    if (attacker && attacker.id !== victim.id) {
      attacker.damageDealt = (attacker.damageDealt || 0) + damage;
      this.events.push({
        type: 'hit_confirmed',
        playerId: attacker.id,
        target: 'player',
        damage: Math.round(damage)
      });
    }

    if (damage > 2) {
      this.events.push({
        type: 'damage_number',
        x: victim.x,
        y: victim.y,
        damage: Math.round(damage)
      });
    }

    if (victim.health <= 0 && victim.isAlive) {
      this.eliminatePlayer(victim, attacker, weaponId);
    }
  }

  eliminatePlayer(victim, attacker, weaponId) {
    victim.isAlive = false;
    victim.deaths += 1;
    victim.respawnTimer = (this.gameMode === 'battleroyale') ? 9999 : ((this.gameMode === 'infection' && victim.isInfected) ? 3.0 : 10.0);
    victim.streak = 0;
    victim.isSuperActive = false;
    victim.isStealthed = false;

    let points = 100;
    const isCrownVictim = this.players.get(victim.id)?.isCrownKing;

    if (attacker && attacker.id !== victim.id) {
      if (this.mutators.vampirism) {
        attacker.health = Math.min(attacker.maxHealth, attacker.health + Math.round(attacker.maxHealth * 0.5));
        attacker.shield = Math.min(attacker.maxShield, attacker.shield + Math.round(attacker.maxShield * 0.5));
        this.events.push({
          type: 'vampirism_heal',
          playerId: attacker.id,
          x: attacker.x,
          y: attacker.y
        });
      }

      attacker.kills += 1;
      attacker.streak += 1;
      attacker.maxStreak = Math.max(attacker.maxStreak || 0, attacker.streak);
      attacker.superCharge = Math.min(100, attacker.superCharge + 25);

      const now = Date.now();
      if (now - attacker.lastKillTime < 4500) {
        attacker.comboCount = (attacker.comboCount || 1) + 1;
      } else {
        attacker.comboCount = 1;
      }
      attacker.lastKillTime = now;

      if (attacker.comboCount > 1) {
        points *= attacker.comboCount;
        let voiceText = '';
        if (attacker.comboCount === 2) voiceText = 'Double Kill!';
        else if (attacker.comboCount === 3) voiceText = 'Triple Kill!';
        else if (attacker.comboCount === 4) voiceText = 'Mega Kill!';
        else voiceText = 'Overclock Rampage!';

        this.events.push({
          type: 'announcer_call',
          text: `🔥 ${voiceText.toUpperCase()} 🔥`,
          voice: voiceText,
          playerId: attacker.id
        });
      }

      if (isCrownVictim) points += 150;
      attacker.score += points;

      // Mode specifics on kill
      if (this.gameMode === 'gungame') {
        attacker.gunGameTier = (attacker.gunGameTier || 0) + 1;
        if (attacker.gunGameTier >= GUN_GAME_TIERS.length) {
          this.events.push({
            type: 'announcer_call',
            text: `VICTORY! ${attacker.name.toUpperCase()} COMPLETED GUN GAME!`,
            voice: 'Victory! Champion of Gun Game!'
          });
          this.triggerMatchEnded(attacker.id, 'gungame_win');
        } else {
          attacker.weapon = GUN_GAME_TIERS[attacker.gunGameTier];
          this.events.push({
            type: 'tier_up',
            playerId: attacker.id,
            tier: attacker.gunGameTier,
            weapon: attacker.weapon,
            voice: `Tier Up! ${WEAPON_TYPES[attacker.weapon].name} unlocked!`
          });
        }
      } else if (this.gameMode === 'infection') {
        if (attacker.isInfected && !victim.isInfected) {
          victim.isInfected = true;
          victim.team = 'infected';
          victim.color = '#00ff66';
          this.events.push({
            type: 'announcer_call',
            text: `☣️ ${victim.name.toUpperCase()} INFECTED! ☣️`,
            voice: `${victim.name} infected!`
          });
        }
        this.checkInfectionWinCondition();
      } else if (this.gameMode === 'teams' && attacker.team) {
        this.teamScores[attacker.team] = (this.teamScores[attacker.team] || 0) + 1;
        if (this.teamScores[attacker.team] >= 25) {
          this.triggerMatchEnded(attacker.id, 'teams_win', attacker.team);
        }
      } else if (this.gameMode === 'ffa') {
        if (attacker.kills >= 15) {
          this.triggerMatchEnded(attacker.id, 'ffa_score_limit');
        }
      }
    }

    if (this.gameMode === 'juggernaut') {
      if (this.juggernautId === victim.id) {
        if (attacker && attacker.id !== victim.id) {
          this.juggernautId = attacker.id;
          attacker.health = 500;
          attacker.maxHealth = 500;
          attacker.shield = 100;
          this.events.push({
            type: 'juggernaut_born',
            playerId: attacker.id,
            playerName: attacker.name
          });
        } else {
          this.selectRandomJuggernaut();
        }
      }
    }

    if (this.gameMode === 'battleroyale') {
      const alivePlayers = Array.from(this.players.values()).filter(p => p.isAlive);
      if (alivePlayers.length === 1) {
        const winner = alivePlayers[0];
        this.events.push({
          type: 'announcer_call',
          text: `🏆 APEX CHAMPION: ${winner.name.toUpperCase()}! 🏆`,
          voice: `Apex Champion! ${winner.name} is the last mech standing!`,
          playerId: winner.id
        });
        this.triggerMatchEnded(winner.id, 'battleroyale_win');
      } else if (alivePlayers.length === 0) {
        this.triggerMatchEnded(attacker ? attacker.id : victim.id, 'battleroyale_draw');
      }
    }

    this.events.push({
      type: 'kill',
      killerId: attacker ? attacker.id : null,
      killerName: attacker ? attacker.name : 'Sector Hazard',
      killerColor: attacker ? attacker.color : '#ff0055',
      victimId: victim.id,
      victimName: victim.name,
      victimColor: victim.color,
      weapon: weaponId,
      isCrownKill: isCrownVictim
    });

    this.events.push({
      type: 'explosion',
      x: victim.x,
      y: victim.y,
      radius: 95
    });
  }

  updatePowerups(dt) {
    for (const pu of this.powerups) {
      if (!pu.active) {
        pu.respawnTimer -= dt;
        if (pu.respawnTimer <= 0) {
          pu.active = true;
          this.events.push({
            type: 'powerup_spawned',
            x: pu.x,
            y: pu.y,
            powerupType: pu.type
          });
        }
        continue;
      }

      for (const player of this.players.values()) {
        if (!player.isAlive) continue;
        const d = Math.hypot(player.x - pu.x, player.y - pu.y);
        if (d < player.radius + 24) {
          this.applyPowerup(player, pu.type);
          pu.active = false;
          pu.respawnTimer = 16.0;

          this.events.push({
            type: 'powerup_pickup',
            playerId: player.id,
            powerupType: pu.type,
            x: pu.x,
            y: pu.y
          });
          break;
        }
      }
    }
  }

  applyPowerup(player, type) {
    const now = Date.now();
    switch (type) {
      case 'shield':
        player.shield = player.maxShield;
        break;
      case 'speed':
        player.powerupEffects.speedUntil = now + 9000;
        break;
      case 'trishot':
        player.powerupEffects.trishotUntil = now + 9000;
        break;
      case 'heal':
        player.health = player.maxHealth;
        break;
      case 'super_orb':
        player.superCharge = 100;
        break;
      case 'weapon_crate':
        if (this.gameMode !== 'gungame') {
          const advanced = ['railgun', 'scatter', 'bouncing', 'rocket', 'cryo', 'flame', 'seeker'];
          player.weapon = advanced[Math.floor(Math.random() * advanced.length)];
        }
        break;
      case 'crown_boost':
        player.score += 75;
        player.shield = player.maxShield;
        player.health = player.maxHealth;
        player.superCharge = 100;
        break;
    }
  }

  createSnapshot(crownKingId) {
    const playersArr = [];
    for (const p of this.players.values()) {
      p.isCrownKing = (p.id === crownKingId);
      playersArr.push({
        id: p.id,
        name: p.name,
        title: p.title,
        color: p.color,
        team: p.team,
        mechClass: p.mechClass,
        isBot: !!p.isBot,
        isInfected: !!p.isInfected,
        gunGameTier: p.gunGameTier || 0,
        x: Math.round(p.x),
        y: Math.round(p.y),
        angle: +p.angle.toFixed(2),
        turretAngle: +p.turretAngle.toFixed(2),
        health: Math.round(p.health),
        maxHealth: p.maxHealth,
        shield: Math.round(p.shield),
        maxShield: p.maxShield,
        dashCooldownRemaining: +Math.max(0, p.dashCooldown).toFixed(1),
        maxDashCooldown: p.maxDashCooldown,
        superCharge: Math.round(p.superCharge),
        score: p.score,
        kills: p.kills,
        deaths: p.deaths,
        weapon: p.weapon,
        isAlive: p.isAlive,
        isCrownKing: p.isCrownKing,
        isDashing: p.dashActiveTimer > 0,
        isSuperActive: p.isSuperActive,
        isStealthed: p.isStealthed,
        isPhasing: !!p.isPhasing,
        isParrying: p.parryWindowTimer > 0,
        parryCooldownRemaining: +Math.max(0, p.parryCooldown).toFixed(1),
        isWarping: (p.portalWarpTimer && p.portalWarpTimer > 0),
        isEmpDisabled: p.isEmpDisabled > 0,
        invulnerable: p.invulnerableTimer > 0,
        hasSpeedBuff: p.powerupEffects.speedUntil > Date.now(),
        hasTrishotBuff: p.powerupEffects.trishotUntil > Date.now(),
        currentEmoji: p.emojiExpires > Date.now() ? p.currentEmoji : null,
        respawnTimer: Math.ceil(p.respawnTimer)
      });
    }

    const projsArr = this.projectiles.map(pr => ({
      id: pr.id,
      x: Math.round(pr.x),
      y: Math.round(pr.y),
      vx: Math.round(pr.vx),
      vy: Math.round(pr.vy),
      color: pr.color,
      radius: pr.radius,
      isDeflected: !!pr.isDeflected
    }));

    const powerupsArr = this.powerups.filter(pu => pu.active).map(pu => ({
      id: pu.id,
      x: pu.x,
      y: pu.y,
      type: pu.type
    }));

    let survivorsLeft = 0;
    let infectedCount = 0;
    if (this.gameMode === 'infection') {
      for (const p of this.players.values()) {
        if (p.isAlive) {
          if (p.isInfected) infectedCount++;
          else survivorsLeft++;
        }
      }
    }

    return {
      t: Date.now(),
      mapId: this.currentMapId,
      gameMode: this.gameMode,
      teamScores: this.teamScores,
      botCount: this.botCount,
      botDifficulty: this.botDifficulty,
      roundTimer: Math.max(0, Math.ceil(this.roundTimer)),
      podium: this.podiumData,
      mutators: this.mutators,
      inLobby: this.inLobby,
      hexDomes: (this.deployableHexDomes || []).map(d => ({
        id: d.id,
        x: Math.round(d.x),
        y: Math.round(d.y),
        radius: d.radius,
        health: Math.round(d.health),
        maxHealth: d.maxHealth
      })),
      singularityVortices: (this.singularityVortices || []).map(v => ({
        id: v.id,
        x: Math.round(v.x),
        y: Math.round(v.y),
        radius: v.radius,
        lifetime: +v.lifetime.toFixed(1)
      })),
      portals: this.map.portals || [],
      barrels: (this.map.barrels || []).filter(b => !b.exploded).map(b => ({
        id: b.id,
        x: Math.round(b.x),
        y: Math.round(b.y),
        radius: b.radius
      })),
      obstacles: (this.map.obstacles || []).map(obs => ({
        id: obs.id,
        x: Math.round(obs.x),
        y: Math.round(obs.y),
        w: Math.round(obs.w),
        h: Math.round(obs.h),
        type: obs.type,
        hp: obs.hp !== undefined ? Math.round(obs.hp) : (obs.type === 'destructible' ? 160 : undefined),
        maxHp: obs.maxHp !== undefined ? Math.round(obs.maxHp) : (obs.type === 'destructible' ? 160 : undefined),
        isDestroyed: !!obs.isDestroyed
      })),
      pve: (this.gameMode === 'pve') ? {
        boss: this.pveState.boss ? {
          x: Math.round(this.pveState.boss.x),
          y: Math.round(this.pveState.boss.y),
          angle: +this.pveState.boss.angle.toFixed(2),
          turretAngle: +this.pveState.boss.turretAngle.toFixed(2),
          health: Math.round(this.pveState.boss.health),
          maxHealth: this.pveState.boss.maxHealth,
          shield: Math.round(this.pveState.boss.shield),
          maxShield: this.pveState.boss.maxShield,
          isAlive: this.pveState.boss.isAlive,
          isEnraged: this.pveState.boss.isEnraged,
          sweepAngle: +this.pveState.boss.sweepAngle.toFixed(2)
        } : null,
        creeps: this.pveState.creeps ? this.pveState.creeps.filter(c => c.isAlive).map(c => ({
          id: c.id,
          name: c.name,
          x: Math.round(c.x),
          y: Math.round(c.y),
          angle: +c.angle.toFixed(2),
          health: Math.round(c.health),
          maxHealth: c.maxHealth
        })) : []
      } : null,
      infection: (this.gameMode === 'infection') ? {
        survivorsLeft,
        infectedCount,
        patientZeroTimer: Math.max(0, Math.ceil(this.infectionState.patientZeroTimer)),
        patientZeroChosen: this.infectionState.patientZeroChosen
      } : null,
      suddenDeath: this.suddenDeathActive ? { 
        radius: Math.round(this.suddenDeathRadius),
        cx: Math.round(this.suddenDeathCx !== undefined ? this.suddenDeathCx : this.map.width / 2),
        cy: Math.round(this.suddenDeathCy !== undefined ? this.suddenDeathCy : this.map.height / 2),
        isBattleRoyale: this.gameMode === 'battleroyale'
      } : null,
      battleRoyale: (this.gameMode === 'battleroyale' && this.brState) ? {
        aliveCount: Array.from(this.players.values()).filter(p => p.isAlive).length,
        totalCount: this.players.size,
        phase: this.brState.phase,
        phaseTimer: Math.max(0, Math.ceil(this.brState.phaseTimer)),
        safeX: Math.round(this.brState.safeX),
        safeY: Math.round(this.brState.safeY),
        currentRadius: Math.round(this.brState.currentRadius),
        targetRadius: Math.round(this.brState.targetRadius),
        isClosing: this.brState.isClosing
      } : null,
      kothZone: this.map.kothZone,
      laserGates: this.map.laserGates ? this.map.laserGates.map(lg => ({ 
        id: lg.id, 
        active: lg.active, 
        warning: !!lg.warning, 
        x1: lg.x1, 
        y1: lg.y1, 
        x2: lg.x2, 
        y2: lg.y2 
      })) : [],
      players: playersArr,
      projectiles: projsArr,
      powerups: powerupsArr,
      events: this.events
    };
  }
}
