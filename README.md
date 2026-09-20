# ⚡ OPENCLOCK (self-hosted OVERCLOCK)

> A high-velocity multiplayer browser arena game built for instant play on any school or home Wi-Fi network. **Zero installation for players** — anyone with a phone, tablet, Chromebook, or laptop joins in seconds via browser.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue)
![Players](https://img.shields.io/badge/Players-2--16-cyan)
![Platform](https://img.shields.io/badge/Platform-Browser%20%7C%20Mobile%20%7C%20Desktop-purple)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [How Players Join](#-how-players-join)
- [Game Modes](#-game-modes)
- [Mech Chassis](#-mech-chassis)
- [Weapon Arsenal](#-weapon-arsenal)
- [Maps](#-maps)
- [Controls](#-controls)
- [Arena Hazards & Walls](#-arena-hazards--walls)
- [Bot AI](#-bot-ai)
- [Architecture](#-architecture--tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Instant LAN multiplayer** — no accounts, no downloads, no config for players
- **8 unique mech chassis** each with a distinct SUPER ability
- **8 weapons** with unique physics (piercing, bouncing, homing, explosive, freeze)
- **8 game modes** including Battle Royale with a shrinking storm ring
- **7 maps** including a 5000×5000 Mega Warzone for Battle Royale
- **AI bots** (5 difficulty tiers) with pathfinding, dashing, and super usage
- **Procedural synthwave BGM** — fully synthesized in Web Audio API, no audio files
- **Mobile-ready** with dual virtual joysticks and touch buttons
- **Host controls** — host can change maps, modes, spawn mega crates, trigger sudden death, and kick players mid-match
- **Spectator camera** at `/spectate` — broadcasts full match with AI-guided camera
- **QR Code** auto-generated on server launch for phone join links
- **CRT scanline filter**, neon glow visuals, screen shake, killfeed, and minimap radar
- **Zero external dependencies for players** — runs in any modern browser

---

## 🚀 Quick Start

### Requirements (Host Only)

- **[Node.js](https://nodejs.org) v18+** — the only install needed

### Windows

```
Double-click Overclock.bat
```

### macOS

```bash
chmod +x start-mac.command   # one-time only
double-click start-mac.command
```

### CLI (any platform)

```bash
npm install       # first time only
npm start
```

The server starts on **`http://localhost:3000`** and auto-opens your browser. The terminal shows your LAN IP and a QR code for phone players.

---

## 📱 How Players Join

1. Connect to the **same Wi-Fi network** as the host (school Wi-Fi, home router, or phone hotspot)
2. Scan the **QR code** shown on the host's screen — or open a browser and go to:
   ```
   http://<HOST-LOCAL-IP>:3000
   ```
3. Enter a **pilot callsign**, pick a **mech chassis**, customize your **neon hull glow**, select a **starting weapon**, and click **DEPLOY INTO ARENA**

> Players on phones, tablets, Chromebooks, and laptops all connect simultaneously with no install.

---

## 🎮 Game Modes

8 selectable modes. The host can switch modes and maps mid-session from the Host Panel (`H`).

1. **Free For All (FFA)**: High-speed individual deathmatch with round limits, MVP awards, and podium victory ceremonies.
2. **Team DM (Red vs Blue)**: Forced `#ff0055` (Red) vs `#00f7ff` (Blue) team balancing. Friendly fire disabled. First team to 25 eliminations claims victory.
3. **PvE Co-op Boss Raid**: All human pilots unite against waves of creep drones and the multi-phase colossal **Goliath Core Boss** (2500 HP, radial energy sweeps, and overdrive enrage).
4. **Gun Game (Escalation)**: Weapons locked from manual switching. Every elimination instantly advances the pilot to the next weapon tier (8 tiers). First to get a kill with the final weapon wins.
5. **Cyber Infection (Outbreak)**: 1 pilot awakens as Patient Zero with toxic glitch aura and speed boost. Tagged survivors are assimilated into infected hunters until 1 survivor remains or the clock expires.
6. **King of the Hill**: Capture and hold the central beacon zone to score. Contested zones pause scoring for both sides.
7. **Juggernaut Apex**: One pilot is crowned the Juggernaut with massively boosted stats. All others must destroy the Juggernaut to steal the power — and the crown.
8. **Battle Royale (Apex Last Standing)**: 1 life only — no respawns. A lethal cyber storm ring closes in across 4 escalating phases, forcing all pilots into a shrinking safe zone with rising DPS. Last mech standing wins.

---

## 🤖 Mech Chassis

8 fully playable chassis, each with unique stats and a charged SUPER ability:

| Chassis | Class | Speed | Hull | Shield | SUPER |
|---|---|---|---|---|---|
| **Spectre** | Scout | 370 | 85 | 45 | Quantum Cloak — full stealth + speed boost for 5s |
| **Titan** | Juggernaut | 265 | 135 | 80 | Seismic Stomp — 280px shockwave, 90 dmg + EMP disable 2.5s |
| **Viper** | Striker | 320 | 95 | 50 | Overclocked Berserk — 2.2× fire rate for 6s |
| **Vortex** | Tech | 310 | 100 | 50 | EMP Nova — 320px wave, disables all enemy weapons for 4s |
| **Chrono** | Time Warper | 330 | 90 | 45 | Temporal Recall — rewinds position + HP/shield 3.5s |
| **Aegis** | Bastion | 250 | 140 | 90 | Hex-Dome — 360° deployable barrier, 450 HP, 8s duration |
| **Phantom** | Infiltrator | 380 | 80 | 40 | Void Phase — phase through all solid walls for 5s |
| **Gravity** | Singularity | 295 | 110 | 60 | Black Hole — pulls all nearby mechs into vortex, 90 dmg, 4.5s |

---

## 🔫 Weapon Arsenal

All 8 weapons are unlocked by default. Players can switch with `1–8` or the scroll wheel.

| # | Weapon | Damage | Notes |
|---|---|---|---|
| 1 | **Pulse Cannon** | 24 | Rapid-fire balanced plasma |
| 2 | **Scattershot** | 15 × 5 pellets | Point-blank shotgun spread |
| 3 | **Neon Railgun** | 80 | Pierces through multiple mechs |
| 4 | **Plasma Ricochet** | 30 | Bounces off walls up to 4× |
| 5 | **Micro-Missile** | 85 (AOE 125px) | 0 self-damage — safe for rocket jumping |
| 6 | **Cryo Freeze Ray** | 14 | Slows target by 45% |
| 7 | **Plasma Flamethrower** | 9 (continuous) | Close-range cone spray |
| 8 | **Seeker Swarm** | 34 | Homing smart-darts with target lock |

### Rocket Jump
Fire the Micro-Missile into a nearby wall and take zero self-damage — the blast propels your mech at high speed for tactical repositioning.

### Parry / Deflect Shield
Press `C` or `V` to raise a 0.38s deflection field. Any projectile hitting the shield is reflected at **+35% speed and damage**.

---

## 🗺️ Maps

7 hand-crafted maps with distinct layouts, wall types, and hazards:

| Map | Size | Notes |
|---|---|---|
| **Sector 01: The Core** | 2600×2600 | Classic symmetric arena |
| **Sector 02: Neon Labyrinth** | 2600×2600 | Tight corridors, portal clusters |
| **Sector 03: Hyper Ring Colosseum** | 2800×2800 | Circular ring design, laser gates |
| **Sector 04: Pinball Citadel** | 2600×2600 | Dense bouncy wall coverage |
| **Sector 05: Cyber Metropolis** | 3000×3000 | Multi-lane urban grid |
| **Sector 06: Singularity Core** | 2800×2800 | Portal-heavy, barrel clusters |
| **Sector 07: Neo-Veridia Mega Warzone** | **5000×5000** | Battle Royale mega map |

---

## 🕹️ Controls

### Desktop / Laptop

| Input | Action |
|---|---|
| `W A S D` | Move mech |
| Mouse / Touchpad | Aim crosshair |
| `Left Click` or `J` | Fire weapon |
| `Space` / `Shift` / `K` | Thruster dash |
| `Q` / `F` / `L` | Activate SUPER ability |
| `C` / `V` | Parry / Deflect shield |
| `1–8` or Scroll Wheel | Switch weapon |
| `Arrow Keys` | Twin-stick keyboard aim + auto-fire |
| `E` | Open comms emoji wheel |
| `H` | Host controls panel (host only) |
| `A` / `D` (when dead) | Cycle spectator camera |

### Mobile / Tablet

| Input | Action |
|---|---|
| Left joystick | Steer mech |
| Right joystick | Aim + auto-fire |
| DASH button | Thruster boost |
| SUPER button | Class ability |
| COMMS button | Emoji wheel |

---

## 🧱 Arena Hazards & Walls

| Type | Colour | Effect |
|---|---|---|
| **Solid Wall** | Dark | Indestructible cover |
| **Destructible Wall** | 🟧 Orange | Takes damage, shows cracks, collapses into rubble |
| **Bouncy Wall** | 🟨 Yellow | Launches mechs at 920+ px/s; projectiles reflect at +35% velocity |
| **Fuel Barrel** | 🛢️ Red | Explodes on hit; chain-reaction with adjacent barrels |
| **Quantum Portal** | 🌀 Cyan | 0.38s warp charge → instant teleport to paired portal |
| **Speed Booster** | ⏩ Green | Launches mech at 1250+ px/s; accelerates projectiles +30% |
| **Laser Gate** | 🚨 Red beam | Oscillating security beam, 16 dmg/hit on contact |
| **Storm Ring** (BR) | ⚡ Electric | Closing electromagnetic storm, 6→30 DPS outside safe zone |

---

## 🤖 Bot AI

Add AI bots from the Host Panel with 5 difficulty tiers:

| Difficulty | Behaviour |
|---|---|
| **Harmless** | Passive training dummies — never shoot |
| **Easy** | Inaccurate aim, slow reactions, no dashes |
| **Medium** | Moderate aim, occasional dash and super usage |
| **Hard** | Predictive aim, aggressive strafing, frequent supers |
| **Extreme** | Pinpoint tracking, near-instant reactions, lethal combos |

---

## 🛠️ Architecture & Tech Stack

### Backend
- **Node.js** + **Express** — static file serving
- **ws** — WebSocket server (35Hz game state broadcast)
- **qrcode** — auto-generated QR code on server start
- **Authoritative server** — all game logic runs server-side; clients are dumb renderers

### Frontend
- **Canvas 2D API** — all rendering: mechs, projectiles, particles, HUD
- **Web Audio API** — fully procedural synthwave BGM synthesizer + all SFX (zero audio files)
- **Web Speech API** — robotic voice announcer for killstreaks (DOUBLE KILL, RAMPAGE, UNSTOPPABLE…)
- **WebSockets** — client→server input at 35Hz, server→client state snapshots

### Netcode
- 35Hz snapshot replication with **client-side linear interpolation** for smooth 60+ FPS rendering
- Camera instantly snaps on large teleport jumps to prevent visual drag
- Input dead-reckoning for momentary packet loss

### File Structure

```
openclock/
├── server/
│   ├── server.js          # WebSocket + HTTP server
│   ├── game-engine.js     # All game logic (authoritative)
│   ├── maps.js            # All 7 map definitions
│   └── network-helper.js  # IP detection + QR code
├── public/
│   ├── index.html         # Main game client
│   ├── spectate.html      # Spectator camera page
│   ├── js/
│   │   ├── main.js        # Client loop, input, UI
│   │   ├── renderer.js    # Canvas rendering engine
│   │   └── audio.js       # Synthesizer + SFX engine
│   └── css/
│       └── style.css      # Full cyberpunk UI theme
├── Overclock.bat          # Windows one-click launcher
├── start-mac.command      # macOS one-click launcher
└── package.json
```

---

## 🤝 Contributing

Contributions welcome! To get started:

```bash
git clone https://github.com/jurek-zsl/openclock.git
cd openclock
npm install
npm start
```

Open `http://localhost:3000` to play locally. Open a second tab to test multiplayer.

### Ideas for Contributions
- New map layouts (`server/maps.js`)
- New mech chassis or SUPER abilities (`server/game-engine.js`)
- New weapon types
- Mobile UX improvements
- Spectator camera enhancements
- Localization / i18n

Please open an issue before submitting large PRs.

---

## 📄 License

MIT — free to use, modify, and distribute. See [`LICENSE`](LICENSE) for details.

---

<p align="center">
  Built for LAN parties, school days, and anyone who likes going fast. ⚡
</p>
