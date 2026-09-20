# ⚡ OVERCLOCK: HIGH-OCTANE CYBER ARENA

A premier, high-velocity multiplayer cyberpunk arcade combat game built for instant local play on school or home Wi-Fi networks. Zero installation needed for players—anyone with a phone, Chromebook, tablet, or laptop can join in seconds via browser.

---

## ⚡ 1-Click Fast Launchers (Mac & Windows)

### 🍏 On macOS:
- **Option 1 (Native App)**: Double-click **`Overclock.app`** right in this folder! It boots the server and opens your browser immediately.
- **Option 2 (Terminal Command)**: Double-click **`start-mac.command`** to see real-time server logs, glowing ASCII art, and school LAN address.

### 🪟 On Windows:
- **Option 1 (Batch Launcher)**: Double-click **`Overclock.bat`** (or `start-windows.bat`). It starts the server and opens your browser.
- **Option 2 (Silent Background)**: Double-click **`NeonClash-Silent.vbs`** to launch silently in the background with zero terminal clutter.

### 🐧 Cross-Platform / CLI:
```bash
npm start
```

---

## 🎮 5 Game Modes

1. **Free For All (FFA)**: High-speed individual deathmatch with round limits, MVP awards, and podium victory ceremonies.
2. **Team DM (Red vs Blue)**: Forced `#ff0055` (Red) vs `#00f7ff` (Blue) team balancing. Friendly fire disabled. First team to 25 eliminations claims victory.
3. **PvE Co-op Boss Raid**: All human pilots unite against waves of creep drones and the multi-phase colossal **Goliath Core Boss** (2500 HP, radial energy sweeps, and overdrive enrage).
4. **Gun Game (Escalation)**: Weapons locked from manual switching. Every elimination instantly advances the pilot to the next weapon tier (8 tiers). First to get a kill with the final weapon wins.
5. **Cyber Infection (Outbreak)**: 1 pilot awakens as Patient Zero with toxic glitch aura and speed boost. Tagged survivors are assimilated into infected hunters until 1 survivor remains or the clock expires.

---

## 📱 How Classmates Join

1. Make sure your classmates are connected to the **same school Wi-Fi network** (or your phone's mobile hotspot).
2. Look at the host screen or scan the **Laser QR Code** on the lobby screen with any phone camera.
3. Or open a browser (Chrome, Safari, Edge) and enter the URL:
   ```
   http://<YOUR-LOCAL-IP>:3000
   ```
4. Enter a pilot callsign, select a mech chassis (`Spectre`, `Titan`, `Viper`, `Vortex`), customize neon hull glow, and click **DEPLOY INTO ARENA**!

---

## 🕹️ Controls (Optimized for Laptop Touchpads & Keyboards)

### Laptop & Desktop
- **W, A, S, D**: Steer mech chassis
- **Touchpad Glide / Mouse**: Aim crosshair smoothly
- **J or Left Click**: Fire Weapon (no heavy trackpad clicking needed!)
- **Spacebar / Shift / K**: Thruster Dash
- **Q / F / L**: Activate Class SUPER Ability
- **1 - 8 / Scroll Wheel**: Tactical Weapon Dock selection
- **Arrow Keys**: Twin-Stick keyboard aim & auto-fire
- **Left / Right Arrow [A / D]**: Cycle living pilots or Goliath Boss in Spectator Camera when terminated (10s respawn timer)
- **E Key**: Open Tactical Comms wheel
- **H Key**: Open Host Match Operations (Host only)

### Mobile / Phone / Tablet
- **Left Thumb Virtual Joystick**: Steer chassis
- **Right Thumb Virtual Joystick**: Aim turret & auto-fire
- **DASH Button**: Boost thrusters
- **SUPER Button**: Unleash class super
- **COMMS Button**: Open tactical emoji wheel

---

## 🔫 8 Weapons & Custom Vector Arsenal

- **Pulse Cannon**: Rapid-fire plasma assault gun.
- **Scattershot**: 5-pellet shotgun spread for brutal close-quarters combat.
- **Neon Railgun**: High-velocity sniper beam that pierces straight through obstacles and targets.
- **Plasma Ricochet**: Bouncing energy spheres that ricochet off arena walls up to 4 times.
- **Micro-Missile**: Area-of-effect explosive rocket with splash radius.
- **Cryo Freeze Ray**: Chilling beam that damages and slows enemy chassis by 50%.
- **Flamethrower**: Continuous incinerating plasma cone for close crowd control.
- **Seeker Swarm**: Micro smart-darts that lock on and home toward nearest enemies.

---

## 🛠️ Architecture & Tech Stack

- **Netcode**: Sub-millisecond snapshot replication (35Hz) with client-side linear/hermite interpolation (lerp) for smooth 120+ FPS movement.
- **Audio & Speech**: Procedural Web Audio API synthesizer + robotic Web Speech API voice announcer for killstreaks ("DOUBLE KILL", "RAMPAGE", "UNSTOPPABLE").
- **Visuals**: AAA HUD combat rig with segmented HP/Shield, dash recovery gauge, vector weapon dock, spectator camera, and canvas geometric powerups.
- **Backend**: Node.js, Express, `ws` (WebSockets), `qrcode`.
