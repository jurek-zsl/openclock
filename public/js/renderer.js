/**
 * Cyberpunk Canvas 2D Renderer for Neon Clash
 * Featuring 4 distinct Mech Chassis models, CRT scanline fx, dynamic hazards, and ambient embers.
 */

export class GameRenderer {
  constructor(canvas, minimapCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.minimapCanvas = minimapCanvas;
    this.mCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Camera
    this.camX = 1300;
    this.camY = 1300;
    this.targetCamX = 1300;
    this.targetCamY = 1300;
    this.shake = 0;

    // Particles & FX
    this.particles = [];
    this.floatingTexts = [];
    this.treadMarks = [];
    this.scorchMarks = [];
    this.ambientEmbers = [];
    this.crtFilterEnabled = true;
    this.interpolatedPlayers = new Map();
    this.hitmarkers = [];

    this.initEmbers();

    this.map = {
      width: 2600,
      height: 2600,
      obstacles: [],
      speedPads: [],
      laserGates: [],
      kothZone: null
    };

    window.addEventListener('resize', () => this.onResize());
  }

  initEmbers() {
    for (let i = 0; i < 45; i++) {
      this.ambientEmbers.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 20,
        speedY: -15 - Math.random() * 25,
        color: Math.random() > 0.5 ? '#00f7ff' : '#ff0055',
        alpha: 0.2 + Math.random() * 0.5
      });
    }
  }

  toggleCRT() {
    this.crtFilterEnabled = !this.crtFilterEnabled;
    const overlay = document.getElementById('crt-overlay');
    if (overlay) {
      overlay.style.display = this.crtFilterEnabled ? 'block' : 'none';
    }
    return this.crtFilterEnabled;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setMapConfig(mapConfig) {
    this.map = mapConfig;
  }

  updateObstacles(serverObstacles) {
    if (!serverObstacles) return;
    if (!this.map) this.map = {};
    this.map.obstacles = serverObstacles;
  }

  addWallRubbleExplosion(x, y, w, h) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    this.addScreenShake(15);

    // Heavy orange shockwave ring
    this.particles.push({
      type: 'shockwave',
      x: cx,
      y: cy,
      radius: 10,
      maxRadius: Math.max(w, h) * 0.95,
      color: '#ff5500',
      alpha: 1.0,
      decay: 2.0
    });

    // 28-36 flying jagged rubble chunks
    const chunkCount = 32;
    for (let i = 0; i < chunkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 260;
      this.particles.push({
        type: 'rubble',
        x: x + Math.random() * w,
        y: y + Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 9,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 8,
        color: Math.random() > 0.4 ? '#ff5500' : '#ffaa00',
        alpha: 1.0,
        decay: 0.9 + Math.random() * 0.8
      });
    }

    // High velocity sparks
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 240;
      this.particles.push({
        type: 'spark',
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.8 + Math.random() * 2.2,
        color: Math.random() > 0.4 ? '#ffaa00' : '#ffffff',
        alpha: 1.0,
        decay: 1.6 + Math.random() * 1.4
      });
    }

    // Smoke puffs
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 15 + Math.random() * 55;
      this.particles.push({
        type: 'smoke',
        x: cx + (Math.random() - 0.5) * (w * 0.5),
        y: cy + (Math.random() - 0.5) * (h * 0.5),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 12 + Math.random() * 16,
        color: 'rgba(30, 14, 6, 0.65)',
        alpha: 0.75,
        decay: 0.8 + Math.random() * 0.5
      });
    }
  }

  addWallHitSparks(x, y, hp, maxHp) {
    this.addSparks(x, y, '#ffaa00', 10);
    this.addDamageNumber(x, y - 10, 'CRACK!');
  }

  addScreenShake(amount) {
    this.shake = Math.min(this.shake + amount, 28);
  }

  addExplosion(x, y, radius = 65, color = '#ff5500') {
    this.addScreenShake(radius > 80 ? 16 : 9);

    this.particles.push({
      type: 'shockwave',
      x, y,
      radius: 6,
      maxRadius: radius,
      color,
      alpha: 1.0,
      decay: 2.2
    });

    const count = Math.round(radius * 0.4);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * (radius * 3.5);
      this.particles.push({
        type: 'spark',
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2.8,
        color: Math.random() > 0.4 ? color : '#ffffff',
        alpha: 1.0,
        decay: 1.2 + Math.random() * 1.6
      });
    }
  }

  addBarrelExplosion(x, y, radius = 180) {
    this.addScreenShake(24);

    // 1. Inner white-hot blazing shockwave
    this.particles.push({
      type: 'shockwave',
      x, y,
      radius: 12,
      maxRadius: radius * 0.72,
      color: '#ffffcc',
      alpha: 1.0,
      decay: 2.8
    });

    // 2. Outer fiery orange-red explosive shockwave
    this.particles.push({
      type: 'shockwave',
      x, y,
      radius: 18,
      maxRadius: radius,
      color: '#ff3700',
      alpha: 1.0,
      decay: 1.8
    });

    // 3. Barrel metallic canister shrapnel & debris chunks
    const chunkCount = 32;
    const colors = ['#ff5500', '#ff8800', '#2b0d00', '#ffaa00', '#d94400'];
    for (let i = 0; i < chunkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 320;
      this.particles.push({
        type: 'rubble',
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 0.9 + Math.random() * 0.7
      });
    }

    // 4. Dense billowing chemical fireball & dark smoke puffs
    const smokeCount = 20;
    for (let i = 0; i < smokeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 95;
      const isFire = Math.random() > 0.45;
      this.particles.push({
        type: 'smoke',
        x: x + (Math.random() - 0.5) * 24,
        y: y + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 14 + Math.random() * 18,
        color: isFire ? 'rgba(255, 80, 0, 0.75)' : 'rgba(35, 15, 6, 0.85)',
        alpha: 0.85,
        decay: 0.7 + Math.random() * 0.5
      });
    }

    // 5. High-velocity incendiary sparks
    const sparkCount = 36;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 280;
      this.particles.push({
        type: 'spark',
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.0 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#ff9900' : '#ffffaa',
        alpha: 1.0,
        decay: 1.4 + Math.random() * 1.5
      });
    }

    // 6. Ground scorch decal
    if (this.scorchMarks) {
      this.scorchMarks.push({
        x, y,
        radius: Math.min(radius * 0.65, 80),
        alpha: 1.0
      });
    }

    // 7. Floating impact text
    this.addDamageNumber(x, y - 24, '💥 BOOM!');
  }

  addPortalChargeFX(x, y, color = '#00f7ff') {
    // Swirling inward quantum energy particles
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 35 + Math.random() * 35;
      const speed = -(50 + Math.random() * 80);
      this.particles.push({
        type: 'spark',
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2,
        color,
        alpha: 1.0,
        decay: 2.2
      });
    }
  }

  addPortalWarpFX(fromX, fromY, toX, toY, color = '#00f7ff', isLocalPlayer = false) {
    this.addScreenShake(8);

    // Origin: Dematerialization collapsing shockwave
    this.particles.push({
      type: 'shockwave',
      x: fromX,
      y: fromY,
      radius: 8,
      maxRadius: 65,
      color,
      alpha: 1.0,
      decay: 2.5
    });

    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;
      this.particles.push({
        type: 'spark',
        x: fromX,
        y: fromY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.8 + Math.random() * 2,
        color: Math.random() > 0.5 ? color : '#ffffff',
        alpha: 1.0,
        decay: 2.0
      });
    }

    // Destination: Expanding rematerialization pulse
    this.particles.push({
      type: 'shockwave',
      x: toX,
      y: toY,
      radius: 6,
      maxRadius: 75,
      color: '#ffffff',
      alpha: 1.0,
      decay: 2.8
    });
    this.particles.push({
      type: 'shockwave',
      x: toX,
      y: toY,
      radius: 12,
      maxRadius: 85,
      color,
      alpha: 1.0,
      decay: 2.0
    });

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 160;
      this.particles.push({
        type: 'spark',
        x: toX,
        y: toY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2.2,
        color,
        alpha: 1.0,
        decay: 1.8
      });
    }

    if (isLocalPlayer) {
      // Instantly position camera target to new location smoothly
      this.targetCamX = toX;
      this.targetCamY = toY;
      this.camX = toX;
      this.camY = toY;
    }
  }

  addSparks(x, y, color = '#00f7ff', count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 140;
      this.particles.push({
        type: 'spark',
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 1.5,
        color,
        alpha: 1.0,
        decay: 2.5
      });
    }
  }

  addDamageNumber(x, y, damage, isShield = false) {
    this.floatingTexts.push({
      x: x + (Math.random() * 24 - 12),
      y: y - 10,
      text: '-' + damage,
      color: isShield ? '#00f7ff' : '#ff0055',
      alpha: 1.0,
      vy: -60
    });
  }

  addDashTrail(x, y, angle, color) {
    this.particles.push({
      type: 'ghost',
      x, y, angle, color,
      alpha: 0.75,
      decay: 3.8
    });
  }

  render(state, localPlayerId, dt = 0.016, inputHud = {}, spectateTargetId = null) {
    const ctx = this.ctx;
    const now = Date.now();

    const localPlayer = state.players.find(p => p.id === localPlayerId);
    if (localPlayer && localPlayer.isAlive) {
      const interp = this.interpolatedPlayers.get(localPlayerId);
      if (interp) {
        this.targetCamX = interp.x;
        this.targetCamY = interp.y;
      } else {
        this.targetCamX = localPlayer.x;
        this.targetCamY = localPlayer.y;
      }
    } else {
      // Spectator Mode Camera Tracking
      let targetEntity = null;
      if (spectateTargetId) {
        targetEntity = state.players.find(p => p.id === spectateTargetId && p.isAlive);
      }
      if (!targetEntity) {
        targetEntity = state.players.find(p => p.isAlive);
      }
      if (!targetEntity && state.pve?.boss && state.pve.boss.isAlive) {
        targetEntity = state.pve.boss;
      }
      if (targetEntity) {
        const interp = this.interpolatedPlayers.get(targetEntity.id);
        if (interp) {
          this.targetCamX = interp.x;
          this.targetCamY = interp.y;
        } else {
          this.targetCamX = targetEntity.x;
          this.targetCamY = targetEntity.y;
        }
      }
    }

    const distCam = Math.hypot(this.targetCamX - this.camX, this.targetCamY - this.camY);
    if (distCam > 500) {
      this.camX = this.targetCamX;
      this.camY = this.targetCamY;
    } else {
      const camFactor = 1 - Math.exp(-22 * dt);
      this.camX += (this.targetCamX - this.camX) * camFactor;
      this.camY += (this.targetCamY - this.camY) * camFactor;
    }

    let shakeX = 0, shakeY = 0;
    if (this.shake > 0.1) {
      shakeX = (Math.random() * 2 - 1) * this.shake;
      shakeY = (Math.random() * 2 - 1) * this.shake;
      this.shake *= 0.88;
    }

    // 1. Clear background
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    const viewOffsetX = this.width / 2 - this.camX + shakeX;
    const viewOffsetY = this.height / 2 - this.camY + shakeY;
    ctx.translate(viewOffsetX, viewOffsetY);

    // 2. World Features
    this.drawGrid(ctx);
    this.drawSuddenDeathZone(ctx, state.suddenDeath, now);
    this.drawKothZone(ctx, state.kothZone, now);
    this.drawSpeedPads(ctx, state.mapId, now);
    this.drawPortals(ctx, state.portals, now);
    this.drawBarrels(ctx, state.barrels, now);
    this.drawLaserGates(ctx, state.laserGates, now);
    this.drawArenaBounds(ctx);
    this.drawObstacles(ctx);
    this.drawHexDomes(ctx, state.hexDomes, now);
    this.drawSingularityVortices(ctx, state.singularityVortices, now);
    this.drawPowerups(ctx, state.powerups, now);
    this.drawTreadMarks(ctx, dt);
    this.drawScorchMarks(ctx, dt);

    // 3. Dynamic Entities
    if (state.pve) {
      if (state.pve.creeps) this.drawCreepDrones(ctx, state.pve.creeps, now);
      if (state.pve.boss) this.drawGoliathBoss(ctx, state.pve.boss, now);
    }
    this.drawPlayers(ctx, state.players, localPlayerId, state.gameMode, now, dt);
    this.drawProjectiles(ctx, state.projectiles);
    this.drawParticles(ctx, dt);
    this.drawFloatingTexts(ctx, dt);

    // 3.5 Holographic Aim Reticle (Active when Pilot is Alive)
    if (localPlayer && localPlayer.isAlive) {
      this.drawAimReticle(ctx, localPlayer, inputHud, now);
    }

    ctx.restore();

    // 4. Viewport Overlays (Hitmarkers, Ambient Embers & CRT Scanlines)
    this.drawHitmarkers(ctx, dt);
    this.drawAmbientEmbers(ctx, dt);
    if (this.crtFilterEnabled) {
      this.drawCRTFilter(ctx);
    }

    // 5. Minimap Radar
    if (this.mCtx) {
      this.drawMinimap(state, localPlayerId, now);
    }
  }

  drawGrid(ctx) {
    const gridSize = 100;
    const w = this.map.width;
    const h = this.map.height;

    ctx.strokeStyle = 'rgba(0, 247, 255, 0.04)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = 0; x <= w; x += gridSize) {
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += gridSize) {
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 247, 255, 0.15)';
    for (let x = 0; x <= w; x += gridSize * 2) {
      for (let y = 0; y <= h; y += gridSize * 2) {
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }
  }

  drawSuddenDeathZone(ctx, suddenDeath, now) {
    if (!suddenDeath) return;
    const cx = suddenDeath.cx !== undefined ? suddenDeath.cx : (this.map.width / 2);
    const cy = suddenDeath.cy !== undefined ? suddenDeath.cy : (this.map.height / 2);
    const r = suddenDeath.radius;

    ctx.save();
    // Storm border ring
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 4 + Math.sin(now * 0.01) * 2;
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Outer danger tint outside safe zone
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.map.width, this.map.height);
    ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(255, 0, 85, 0.08)';
    ctx.fill();
    ctx.restore();

    // Warning hazard text
    ctx.font = 'bold 16px Orbitron, sans-serif';
    ctx.fillStyle = '#ff0055';
    ctx.textAlign = 'center';
    const label = suddenDeath.isBattleRoyale 
      ? '⚡ BATTLE ROYALE // CYBER STORM ⚡' 
      : '⚠️ SUDDEN DEATH // STAY INSIDE RING ⚠️';
    ctx.fillText(label, cx, cy - r + 30);
    ctx.restore();
  }

  drawKothZone(ctx, zone, now) {
    if (!zone) return;

    ctx.save();
    const pulse = Math.sin(now * 0.004) * 6;
    const rot = (now * 0.001) % (Math.PI * 2);

    // Capture beacon circle
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius + pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 230, 0, 0.06)';
    ctx.fill();

    // Rotating holographic beacon runes
    ctx.save();
    ctx.translate(zone.x, zone.y);
    ctx.rotate(rot);
    ctx.strokeStyle = 'rgba(255, 230, 0, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-zone.radius * 0.7, -zone.radius * 0.7, zone.radius * 1.4, zone.radius * 1.4);
    ctx.restore();

    ctx.font = 'bold 12px Orbitron, sans-serif';
    ctx.fillStyle = '#ffe600';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ CAPTURE BEACON ⚡', zone.x, zone.y - zone.radius - 12);

    ctx.restore();
  }

  drawSpeedPads(ctx, mapId, now) {
    if (!this.map.speedPads) return;

    for (const sp of this.map.speedPads) {
      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.rotate(sp.angle);

      const hw = sp.w / 2;
      const hh = sp.h / 2;
      const pulse = Math.sin(now * 0.008) * 0.5 + 0.5;

      // Dark carbon base with glowing emerald gradient
      const grad = ctx.createLinearGradient(-hw, 0, hw, 0);
      grad.addColorStop(0, 'rgba(0, 255, 102, 0.08)');
      grad.addColorStop(0.5, `rgba(0, 255, 102, ${0.18 + pulse * 0.12})`);
      grad.addColorStop(1, 'rgba(0, 255, 150, 0.28)');
      ctx.fillStyle = grad;
      ctx.fillRect(-hw, -hh, sp.w, sp.h);

      // Outer neon border with glow
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 14 + pulse * 8;
      ctx.strokeRect(-hw, -hh, sp.w, sp.h);

      // Lateral booster guide rails
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-hw, -hh + 3);
      ctx.lineTo(hw, -hh + 3);
      ctx.moveTo(-hw, hh - 3);
      ctx.lineTo(hw, hh - 3);
      ctx.stroke();

      // Corner tech brackets
      const cLen = Math.min(10, hw * 0.35);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Top-left
      ctx.moveTo(-hw + cLen, -hh); ctx.lineTo(-hw, -hh); ctx.lineTo(-hw, -hh + cLen);
      // Bottom-left
      ctx.moveTo(-hw + cLen, hh); ctx.lineTo(-hw, hh); ctx.lineTo(-hw, hh - cLen);
      // Top-right
      ctx.moveTo(hw - cLen, -hh); ctx.lineTo(hw, -hh); ctx.lineTo(hw, -hh + cLen);
      // Bottom-right
      ctx.moveTo(hw - cLen, hh); ctx.lineTo(hw, hh); ctx.lineTo(hw, hh - cLen);
      ctx.stroke();

      // Multi-stage animated high-velocity chevrons (3 racing forward arrows)
      const arrowSpacing = sp.w * 0.32;
      const speedOffset = (now * 0.14) % arrowSpacing;

      for (let i = -1; i <= 2; i++) {
        const ax = -hw + i * arrowSpacing + speedOffset;
        if (ax < -hw + 8 || ax > hw - 8) continue;
        const alpha = Math.min(1, Math.max(0.15, (ax + hw) / sp.w));
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const arrowHeight = hh * 0.65;
        ctx.moveTo(ax - 10, -arrowHeight);
        ctx.lineTo(ax + 8, 0);
        ctx.lineTo(ax - 10, arrowHeight);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  drawPortals(ctx, portals, now) {
    if (!portals || portals.length === 0) return;
    for (const portal of portals) {
      ctx.save();
      ctx.translate(portal.x, portal.y);
      const rot = (now * 0.003) % (Math.PI * 2);
      ctx.rotate(rot);

      const color = portal.color || '#00f7ff';
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;

      ctx.beginPath();
      ctx.arc(0, 0, portal.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner swirling rings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, portal.radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.arc(0, 0, portal.radius, 0, Math.PI * 2);
      ctx.fill();

      // Portal label
      ctx.rotate(-rot);
      ctx.globalAlpha = 1.0;
      ctx.font = 'bold 9px Orbitron, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ WARP PORTAL ⚡', 0, -portal.radius - 8);
      ctx.restore();
    }
  }

  drawBarrels(ctx, barrels, now) {
    if (!barrels || barrels.length === 0) return;
    for (const b of barrels) {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Outer rim
      ctx.fillStyle = '#220800';
      ctx.strokeStyle = '#ff5500';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ff5500';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Hazard core
      const pulse = Math.sin(now * 0.008 + b.id) * 3;
      ctx.fillStyle = '#ff2200';
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(2, b.radius * 0.45 + pulse), 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('☣️', 0, 0);

      ctx.restore();
    }
  }

  drawLaserGates(ctx, gates, now) {
    if (!gates) return;

    for (const lg of gates) {
      ctx.save();

      // 1. Draw solid mechanical emitter pylons at both ends
      const endpoints = [{ x: lg.x1, y: lg.y1 }, { x: lg.x2, y: lg.y2 }];
      for (const ep of endpoints) {
        ctx.save();
        ctx.fillStyle = '#101424';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner glowing diode
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, 4, 0, Math.PI * 2);
        if (lg.active) {
          ctx.fillStyle = '#ff0055';
          ctx.shadowColor = '#ff0055';
          ctx.shadowBlur = 12;
        } else if (lg.warning) {
          const warnPulse = Math.sin(now * 0.03) > 0;
          ctx.fillStyle = warnPulse ? '#ffaa00' : '#442200';
          ctx.shadowColor = '#ffaa00';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#440011';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw beam
      if (lg.active) {
        // High voltage lethal beam
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 5 + Math.sin(now * 0.05) * 2;
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 22;

        ctx.beginPath();
        ctx.moveTo(lg.x1, lg.y1);
        ctx.lineTo(lg.x2, lg.y2);
        ctx.stroke();

        // White core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(lg.x1, lg.y1);
        ctx.lineTo(lg.x2, lg.y2);
        ctx.stroke();
      } else if (lg.warning) {
        // Warning flickering dashed beam
        const flash = (Math.floor(now * 0.015) % 2 === 0);
        ctx.strokeStyle = flash ? 'rgba(255, 170, 0, 0.85)' : 'rgba(255, 100, 0, 0.3)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = flash ? 14 : 4;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(lg.x1, lg.y1);
        ctx.lineTo(lg.x2, lg.y2);
        ctx.stroke();
      } else {
        // Dim idle guide line
        ctx.strokeStyle = 'rgba(255, 0, 85, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.moveTo(lg.x1, lg.y1);
        ctx.lineTo(lg.x2, lg.y2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  drawArenaBounds(ctx) {
    const w = this.map.width;
    const h = this.map.height;

    ctx.save();
    ctx.strokeStyle = '#00f7ff';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#00f7ff';
    ctx.shadowBlur = 16;
    ctx.strokeRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 0, 85, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-20, -20, w + 40, h + 40);
    ctx.restore();
  }

  drawObstacles(ctx) {
    if (!this.map || !this.map.obstacles) return;
    const now = Date.now();

    for (const obs of this.map.obstacles) {
      if (obs.type === 'destructible') {
        const isBroken = obs.isDestroyed || (obs.hp !== undefined && obs.hp <= 0);
        if (isBroken) {
          this.drawBrokenWall(ctx, obs, now);
        } else {
          this.drawDestructibleWall(ctx, obs, now);
        }
      } else {
        this.drawStandardObstacle(ctx, obs);
      }
    }
  }

  drawBrokenWall(ctx, obs, now) {
    ctx.save();

    const isHorizontal = obs.w >= obs.h;
    const stubLen = Math.min(26, Math.floor((isHorizontal ? obs.w : obs.h) * 0.22));

    // 1. Charred blast breach floor decal
    ctx.fillStyle = 'rgba(14, 7, 3, 0.76)';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

    // Scorched blast edge feathering
    ctx.strokeStyle = 'rgba(255, 60, 0, 0.16)';
    ctx.lineWidth = 4;
    ctx.strokeRect(obs.x - 2, obs.y - 2, obs.w + 4, obs.h + 4);

    // Faint glowing dashed hazard perimeter indicating former boundary
    ctx.strokeStyle = 'rgba(255, 85, 0, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
    ctx.setLineDash([]);

    // 2. Holographic Breach Stencil
    ctx.save();
    ctx.fillStyle = 'rgba(255, 110, 0, 0.45)';
    ctx.font = 'bold 10px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ff5500';
    ctx.shadowBlur = 6;
    const breachText = (obs.w < 120 || obs.h < 35) ? 'BREACH' : '⚠ BREACH // DESTROYED';
    ctx.fillText(breachText, obs.x + obs.w / 2, obs.y + obs.h / 2);
    ctx.restore();

    // 3. Jagged fractured wall ends (Rubble Stumps)
    // Deterministic pseudo-random seed based on obstacle coordinates
    let seed = Math.abs(Math.sin(obs.x * 12.9898 + obs.y * 78.233) * 43758.5453);
    const getRand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    if (isHorizontal) {
      // --- Left Jagged Stump ---
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y);
      ctx.lineTo(obs.x + stubLen - 6, obs.y);
      ctx.lineTo(obs.x + stubLen, obs.y + obs.h * 0.35);
      ctx.lineTo(obs.x + stubLen - 8, obs.y + obs.h * 0.65);
      ctx.lineTo(obs.x + stubLen - 2, obs.y + obs.h);
      ctx.lineTo(obs.x, obs.y + obs.h);
      ctx.closePath();

      ctx.fillStyle = '#220e05';
      ctx.fill();
      ctx.strokeStyle = '#ff5500';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff5500';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // --- Right Jagged Stump ---
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.w, obs.y);
      ctx.lineTo(obs.x + obs.w - stubLen + 6, obs.y);
      ctx.lineTo(obs.x + obs.w - stubLen + 2, obs.y + obs.h * 0.4);
      ctx.lineTo(obs.x + obs.w - stubLen + 8, obs.y + obs.h * 0.7);
      ctx.lineTo(obs.x + obs.w - stubLen, obs.y + obs.h);
      ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
      ctx.closePath();

      ctx.fillStyle = '#220e05';
      ctx.fill();
      ctx.strokeStyle = '#ff5500';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Exposed bent rebar wires
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffaa00';
      ctx.beginPath();
      ctx.moveTo(obs.x + stubLen - 3, obs.y + obs.h * 0.3);
      ctx.lineTo(obs.x + stubLen + 8, obs.y + obs.h * 0.2);
      ctx.lineTo(obs.x + stubLen + 14, obs.y + obs.h * 0.38);

      ctx.moveTo(obs.x + obs.w - stubLen + 3, obs.y + obs.h * 0.7);
      ctx.lineTo(obs.x + obs.w - stubLen - 9, obs.y + obs.h * 0.62);
      ctx.lineTo(obs.x + obs.w - stubLen - 15, obs.y + obs.h * 0.8);
      ctx.stroke();
    } else {
      // --- Top Jagged Stump ---
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y);
      ctx.lineTo(obs.x + obs.w, obs.y);
      ctx.lineTo(obs.x + obs.w, obs.y + stubLen - 6);
      ctx.lineTo(obs.x + obs.w * 0.65, obs.y + stubLen);
      ctx.lineTo(obs.x + obs.w * 0.35, obs.y + stubLen - 8);
      ctx.lineTo(obs.x, obs.y + stubLen - 2);
      ctx.closePath();

      ctx.fillStyle = '#220e05';
      ctx.fill();
      ctx.strokeStyle = '#ff5500';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff5500';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // --- Bottom Jagged Stump ---
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y + obs.h);
      ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
      ctx.lineTo(obs.x + obs.w, obs.y + obs.h - stubLen + 6);
      ctx.lineTo(obs.x + obs.w * 0.6, obs.y + obs.h - stubLen + 2);
      ctx.lineTo(obs.x + obs.w * 0.3, obs.y + obs.h - stubLen + 8);
      ctx.lineTo(obs.x, obs.y + obs.h - stubLen);
      ctx.closePath();

      ctx.fillStyle = '#220e05';
      ctx.fill();
      ctx.strokeStyle = '#ff5500';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Exposed bent rebar wires
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffaa00';
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.w * 0.3, obs.y + stubLen - 3);
      ctx.lineTo(obs.x + obs.w * 0.2, obs.y + stubLen + 9);
      ctx.lineTo(obs.x + obs.w * 0.38, obs.y + stubLen + 15);

      ctx.moveTo(obs.x + obs.w * 0.7, obs.y + obs.h - stubLen + 3);
      ctx.lineTo(obs.x + obs.w * 0.62, obs.y + obs.h - stubLen - 9);
      ctx.lineTo(obs.x + obs.w * 0.8, obs.y + obs.h - stubLen - 15);
      ctx.stroke();
    }

    // 4. Shattered Rubble Chunks scattered along the breach floor
    const chunkCount = Math.max(5, Math.min(12, Math.floor((isHorizontal ? obs.w : obs.h) / 25)));
    const gapStart = isHorizontal ? obs.x + stubLen + 4 : obs.y + stubLen + 4;
    const gapEnd = isHorizontal ? obs.x + obs.w - stubLen - 4 : obs.y + obs.h - stubLen - 4;
    const gapLen = Math.max(10, gapEnd - gapStart);

    for (let i = 0; i < chunkCount; i++) {
      const posFraction = (i + 0.5 + (getRand() - 0.5) * 0.4) / chunkCount;
      const mainPos = gapStart + posFraction * gapLen;
      const crossOffset = (getRand() - 0.5) * ((isHorizontal ? obs.h : obs.w) * 0.65);
      const cx = isHorizontal ? mainPos : (obs.x + obs.w / 2 + crossOffset);
      const cy = isHorizontal ? (obs.y + obs.h / 2 + crossOffset) : mainPos;
      const size = 5 + getRand() * 9;
      const angle = getRand() * Math.PI * 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Irregular polygonal slab
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, -size * 0.5);
      ctx.lineTo(size * 0.6, -size * 0.7);
      ctx.lineTo(size * 0.9, size * 0.4);
      ctx.lineTo(-size * 0.3, size * 0.8);
      ctx.closePath();

      ctx.fillStyle = '#261106';
      ctx.fill();
      ctx.strokeStyle = (i % 2 === 0) ? '#ff5500' : '#ff8800';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Glowing circuit vein on some chunks
      if (i % 3 === 0) {
        const pulse = 0.4 + 0.3 * Math.sin(now * 0.005 + i * 1.5);
        ctx.strokeStyle = `rgba(255, 170, 0, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-size * 0.4, 0);
        ctx.lineTo(size * 0.4, 0);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  drawDestructibleWall(ctx, obs, now) {
    ctx.save();

    const maxHp = obs.maxHp || 160;
    const hp = obs.hp !== undefined ? Math.max(0, obs.hp) : maxHp;
    const pct = Math.max(0, Math.min(1, hp / maxHp));

    // Base fill & glowing orange border
    ctx.fillStyle = '#1f0d05';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

    const pulseGlow = 10 + 4 * Math.sin(now * 0.004);
    ctx.strokeStyle = '#ff5500';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ff5500';
    ctx.shadowBlur = pulseGlow;
    ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

    // Hazard stripes
    ctx.strokeStyle = 'rgba(255, 85, 0, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = obs.x; x < obs.x + obs.w + obs.h; x += 20) {
      ctx.moveTo(x, obs.y);
      ctx.lineTo(x - obs.h, obs.y + obs.h);
    }
    ctx.stroke();

    // Structural fracture veins / fissures when damaged
    if (pct < 0.99) {
      ctx.save();
      let seed = Math.abs(Math.sin(obs.x * 17.13 + obs.y * 31.41) * 29481.12);
      const getRand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      const crackCount = pct < 0.35 ? 7 : (pct < 0.7 ? 4 : 2);
      ctx.lineWidth = pct < 0.35 ? 2.5 : 1.5;
      ctx.strokeStyle = pct < 0.35 ? '#ff2200' : (pct < 0.7 ? '#ff5500' : '#ffaa00');
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = pct < 0.35 ? 10 : 5;

      for (let c = 0; c < crackCount; c++) {
        const startX = obs.x + getRand() * obs.w;
        const startY = obs.y + getRand() * obs.h;
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        let currX = startX;
        let currY = startY;
        const segments = 3 + Math.floor(getRand() * 3);
        for (let s = 0; s < segments; s++) {
          currX += (getRand() - 0.5) * 32;
          currY += (getRand() - 0.5) * 24;
          currX = Math.max(obs.x + 2, Math.min(obs.x + obs.w - 2, currX));
          currY = Math.max(obs.y + 2, Math.min(obs.y + obs.h - 2, currY));
          ctx.lineTo(currX, currY);
        }
        ctx.stroke();
      }
      ctx.restore();

      // High-Tech Inset Integrity Bar
      const barW = Math.max(40, obs.w - 12);
      const barH = 6;
      const barX = obs.x + (obs.w - barW) / 2;
      const barY = obs.y + (obs.h - barH) / 2;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX - 2, barY - 2, barW + 4, barH + 4);

      // Bar fill with color grading: Green -> Yellow -> Crimson
      const barColor = pct > 0.6 ? '#00ff66' : (pct > 0.3 ? '#ffaa00' : '#ff0044');
      ctx.fillStyle = barColor;
      ctx.shadowColor = barColor;
      ctx.shadowBlur = 6;
      ctx.fillRect(barX, barY, barW * pct, barH);

      // Percentage label if wall has sufficient size
      if (obs.w >= 90 && obs.h >= 28) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.shadowBlur = 0;
        ctx.fillText(`INTEGRITY ${Math.round(pct * 100)}%`, obs.x + obs.w / 2, barY - 3);
      }
    }

    ctx.restore();
  }

  drawStandardObstacle(ctx, obs) {
    ctx.save();
    const isBouncy = obs.type === 'bouncy';
    const glowColor = isBouncy ? '#ffe600' : '#00a6ff';

    ctx.fillStyle = isBouncy ? '#161304' : '#090e1c';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = isBouncy ? 14 : 9;
    ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

    // Hazard stripes
    ctx.strokeStyle = isBouncy ? 'rgba(255, 230, 0, 0.16)' : 'rgba(0, 166, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = obs.x; x < obs.x + obs.w + obs.h; x += 20) {
      ctx.moveTo(x, obs.y);
      ctx.lineTo(x - obs.h, obs.y + obs.h);
    }
    ctx.stroke();

    ctx.restore();
  }

  drawHexDomes(ctx, domes, now) {
    if (!domes || domes.length === 0) return;
    for (const dome of domes) {
      ctx.save();
      ctx.translate(dome.x, dome.y);
      const color = '#00e5ff';

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';

      ctx.beginPath();
      ctx.arc(0, 0, dome.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Hexagon pattern overlay
      const sides = 6;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.lineWidth = 1.5;
      for (let r = dome.radius * 0.5; r <= dome.radius; r += dome.radius * 0.5) {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const a = (i * Math.PI) / 3;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Health bar above dome
      const bw = 54;
      const bh = 5;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(-bw / 2, -dome.radius - 12, bw, bh);
      const pct = Math.max(0, dome.health / dome.maxHealth);
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(-bw / 2, -dome.radius - 12, bw * pct, bh);

      ctx.restore();
    }
  }

  drawSingularityVortices(ctx, vortices, now) {
    if (!vortices || vortices.length === 0) return;
    for (const v of vortices) {
      ctx.save();
      ctx.translate(v.x, v.y);
      const rot = (now * 0.005) % (Math.PI * 2);
      ctx.rotate(rot);

      const color = '#bf00ff';
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, v.radius);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
      grad.addColorStop(0.35, 'rgba(191, 0, 255, 0.45)');
      grad.addColorStop(0.8, 'rgba(120, 0, 200, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, v.radius, 0, Math.PI * 2);
      ctx.fill();

      // Spiral arms
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      for (let arm = 0; arm < 4; arm++) {
        const offset = (arm * Math.PI) / 2;
        ctx.beginPath();
        for (let r = 12; r < v.radius; r += 10) {
          const a = offset + (r / v.radius) * Math.PI * 2.5;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (r === 12) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Event horizon core
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  }

  drawPowerups(ctx, powerups, now) {
    if (!powerups) return;

    for (const pu of powerups) {
      ctx.save();
      const bob = Math.sin(now * 0.005 + pu.id) * 4;
      const rot = (now * 0.002 + pu.id) % (Math.PI * 2);

      let color = '#ffe600';
      if (pu.type === 'shield') color = '#00f7ff';
      else if (pu.type === 'speed') color = '#ffe600';
      else if (pu.type === 'trishot') color = '#ff0055';
      else if (pu.type === 'heal') color = '#00ff66';
      else if (pu.type === 'super_orb') color = '#bf00ff';
      else if (pu.type === 'crown_boost') color = '#ffe600';
      else if (pu.type === 'weapon_crate') color = '#ff8800';

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, 24, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.translate(pu.x, pu.y + bob);
      ctx.rotate(rot);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.strokeRect(-12, -12, 24, 24);
      ctx.restore();

      // Custom Glowing Cyber Vector Glyph
      ctx.save();
      ctx.translate(pu.x, pu.y + bob);
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;

      if (pu.type === 'shield') {
        ctx.strokeStyle = '#00f7ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const px = Math.cos(a) * 10;
          const py = Math.sin(a) * 10;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = '#00f7ff';
        ctx.fillRect(-1.5, -4.5, 3, 9);
        ctx.fillRect(-4.5, -1.5, 9, 3);
      } else if (pu.type === 'speed') {
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-7, 3); ctx.lineTo(0, -5); ctx.lineTo(7, 3);
        ctx.moveTo(-7, 8); ctx.lineTo(0, 0); ctx.lineTo(7, 8);
        ctx.stroke();
      } else if (pu.type === 'trishot') {
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(0, 5, 3, 0, Math.PI * 2);
        ctx.arc(-6, -4, 2.8, 0, Math.PI * 2);
        ctx.arc(6, -4, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 5); ctx.lineTo(-6, -4);
        ctx.moveTo(0, 5); ctx.lineTo(6, -4);
        ctx.stroke();
      } else if (pu.type === 'heal') {
        ctx.fillStyle = '#00ff66';
        ctx.fillRect(-2.5, -8, 5, 16);
        ctx.fillRect(-8, -2.5, 16, 5);
      } else if (pu.type === 'super_orb') {
        ctx.fillStyle = '#bf00ff';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 === 0 ? 11 : 4.5;
          const a = (i * Math.PI) / 4;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else if (pu.type === 'crown_boost') {
        ctx.fillStyle = '#ffe600';
        ctx.beginPath();
        ctx.moveTo(-9, 5);
        ctx.lineTo(-10, -3);
        ctx.lineTo(-4, 0);
        ctx.lineTo(0, -6);
        ctx.lineTo(4, 0);
        ctx.lineTo(10, -3);
        ctx.lineTo(9, 5);
        ctx.closePath();
        ctx.fill();
      } else if (pu.type === 'weapon_crate') {
        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 2;
        ctx.strokeRect(-8, -8, 16, 16);
        ctx.beginPath();
        ctx.moveTo(-8, -8); ctx.lineTo(8, 8);
        ctx.moveTo(8, -8); ctx.lineTo(-8, 8);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore();
    }
  }

  drawTreadMarks(ctx, dt) {
    const kept = [];
    ctx.save();
    for (const tm of this.treadMarks) {
      tm.alpha -= dt * 0.16;
      if (tm.alpha > 0.01) {
        ctx.fillStyle = `rgba(0, 247, 255, ${tm.alpha * 0.25})`;
        ctx.fillRect(tm.x - 2, tm.y - 2, 4, 4);
        kept.push(tm);
      }
    }
    ctx.restore();
    this.treadMarks = kept;
  }

  drawScorchMarks(ctx, dt) {
    if (!this.scorchMarks || this.scorchMarks.length === 0) return;
    const kept = [];
    ctx.save();
    for (const sm of this.scorchMarks) {
      sm.alpha -= dt * 0.05; // Fades slowly over ~20s
      if (sm.alpha > 0.01) {
        const grad = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, sm.radius);
        grad.addColorStop(0, `rgba(18, 8, 4, ${sm.alpha * 0.65})`);
        grad.addColorStop(0.5, `rgba(32, 12, 5, ${sm.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
        ctx.fill();
        kept.push(sm);
      }
    }
    ctx.restore();
    this.scorchMarks = kept;
  }

  drawMechChassis(ctx, mClass, hullColor, angle, isDashing = false) {
    ctx.save();
    ctx.rotate(angle);

    if (mClass === 'titan') {
      // Heavy Armored Quad-Track Tank
      ctx.fillStyle = '#101524';
      ctx.fillRect(-26, -24, 52, 10);
      ctx.fillRect(-26, 14, 52, 10);
      ctx.strokeRect(-26, -24, 52, 10);
      ctx.strokeRect(-26, 14, 52, 10);

      ctx.fillStyle = '#0a0e1c';
      ctx.beginPath();
      ctx.roundRect(-20, -18, 40, 36, 4);
      ctx.fill();

      ctx.strokeStyle = hullColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = hullColor;
      ctx.shadowBlur = 12;
      ctx.stroke();
    } else if (mClass === 'viper') {
      // Sleek Dart / Striker Chassis
      ctx.fillStyle = '#0d1326';
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(-20, -18);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-20, 18);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = hullColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = hullColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
    } else if (mClass === 'vortex') {
      // Delta-wing Hovercraft
      ctx.fillStyle = '#080d1e';
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-18, -20);
      ctx.lineTo(-10, -6);
      ctx.lineTo(-10, 6);
      ctx.lineTo(-18, 20);
      ctx.closePath();
      ctx.fill();

      // Glowing core
      ctx.fillStyle = hullColor;
      ctx.beginPath();
      ctx.arc(-2, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = hullColor;
      ctx.strokeStyle = hullColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (mClass === 'chrono') {
      // Chrono [Time Warper]: Sleek circular temporal hover-disc with tachyon rings
      ctx.fillStyle = '#061624';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = hullColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = hullColor;
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Temporal hourglass / dial motif
      ctx.strokeStyle = 'rgba(0, 247, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -12); ctx.lineTo(10, 12);
      ctx.moveTo(10, -12); ctx.lineTo(-10, 12);
      ctx.moveTo(-10, -12); ctx.lineTo(10, -12);
      ctx.moveTo(-10, 12); ctx.lineTo(10, 12);
      ctx.stroke();
    } else if (mClass === 'aegis') {
      // Aegis [Bastion]: Heavy fortified hex-hull with reinforced prow
      ctx.fillStyle = '#081726';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = Math.cos(a) * 24;
        const py = Math.sin(a) * 24;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Front shield plates
      ctx.fillStyle = '#0d2238';
      ctx.fillRect(10, -16, 14, 32);

      ctx.strokeStyle = hullColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = hullColor;
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.strokeRect(10, -16, 14, 32);
    } else if (mClass === 'phantom') {
      // Phantom [Infiltrator]: Swept forward stealth raven wings
      ctx.fillStyle = '#140824';
      ctx.beginPath();
      ctx.moveTo(26, 0);
      ctx.lineTo(8, -16);
      ctx.lineTo(-22, -22);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-22, 22);
      ctx.lineTo(8, 16);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = hullColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = hullColor;
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Void core
      ctx.fillStyle = '#bf00ff';
      ctx.beginPath();
      ctx.arc(2, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (mClass === 'gravity') {
      // Gravity [Singularity]: Dark graviton chassis with concentric energy rings
      ctx.fillStyle = '#110920';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = hullColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = hullColor;
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Graviton ring arcs
      ctx.strokeStyle = '#bf00ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    } else {
      // Spectre (Scout hovercraft)
      ctx.fillStyle = '#10172d';
      ctx.fillRect(-20, -16, 40, 6);
      ctx.fillRect(-20, 10, 40, 6);

      ctx.fillStyle = '#0a0f20';
      ctx.beginPath();
      ctx.roundRect(-16, -12, 32, 24, 6);
      ctx.fill();

      ctx.strokeStyle = hullColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = hullColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }

    // Thruster Flame
    if (isDashing) {
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      ctx.moveTo(-18, -6);
      ctx.lineTo(-34 - Math.random() * 14, 0);
      ctx.lineTo(-18, 6);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  drawAimReticle(ctx, localPlayer, inputHud, now) {
    if (!localPlayer || !localPlayer.isAlive || !inputHud) return;

    ctx.save();

    let rx, ry;
    if (inputHud.mouse && inputHud.mouse.x !== undefined) {
      const viewOffsetX = Math.round(this.width / 2 - this.camX);
      const viewOffsetY = Math.round(this.height / 2 - this.camY);
      rx = inputHud.mouse.x - viewOffsetX;
      ry = inputHud.mouse.y - viewOffsetY;
    } else {
      rx = localPlayer.x + Math.cos(inputHud.aimAngle || 0) * 200;
      ry = localPlayer.y + Math.sin(inputHud.aimAngle || 0) * 200;
    }

    ctx.translate(rx, ry);

    // Sleek Cyan Cyber Reticle
    ctx.strokeStyle = 'rgba(0, 247, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f7ff';
    ctx.shadowBlur = 8;

    // Rotating dashed outer ring
    ctx.save();
    ctx.rotate(now * 0.001);
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Crosshair tick marks
    ctx.beginPath();
    ctx.moveTo(0, -6); ctx.lineTo(0, -18);
    ctx.moveTo(0, 6); ctx.lineTo(0, 18);
    ctx.moveTo(-6, 0); ctx.lineTo(-18, 0);
    ctx.moveTo(6, 0); ctx.lineTo(18, 0);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#00f7ff';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawCyberCrown(ctx, x, y, now) {
    ctx.save();
    ctx.translate(x, y);

    const pulse = 1.0 + Math.sin(now * 0.008) * 0.12;
    ctx.scale(pulse, pulse);

    // Golden halo glow
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(255, 230, 0, 0.35)';
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 2;

    // Angular geometric 5-prong crown
    ctx.beginPath();
    ctx.moveTo(-16, 8);
    ctx.lineTo(16, 8);
    ctx.lineTo(13, -3);
    ctx.lineTo(7, 3);
    ctx.lineTo(0, -10); // Apex point
    ctx.lineTo(-7, 3);
    ctx.lineTo(-13, -3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crown Base Line
    ctx.beginPath();
    ctx.moveTo(-16, 11);
    ctx.lineTo(16, 11);
    ctx.stroke();

    // Glowing Cyan Core Diamond
    ctx.fillStyle = '#00f7ff';
    ctx.shadowColor = '#00f7ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Apex gem
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -10, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawCyberSkull(ctx, x, y, now) {
    ctx.save();
    ctx.translate(x, y);

    const pulse = 1.0 + Math.sin(now * 0.012) * 0.12;
    ctx.scale(pulse, pulse);

    // Menacing red aura
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(255, 0, 85, 0.35)';
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 2;

    // Angular Cyber Skull Cranium
    ctx.beginPath();
    ctx.moveTo(-12, -8);
    ctx.lineTo(-7, -14);
    ctx.lineTo(7, -14);
    ctx.lineTo(12, -8);
    ctx.lineTo(10, 3);
    ctx.lineTo(6, 6);
    ctx.lineTo(6, 11);
    ctx.lineTo(-6, 11);
    ctx.lineTo(-6, 6);
    ctx.lineTo(-10, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Visor / Ocular Sensors
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 12;
    ctx.fillRect(-7, -4, 4, 3);
    ctx.fillRect(3, -4, 4, 3);

    // Teeth grill
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-4, 7); ctx.lineTo(-4, 11);
    ctx.moveTo(0, 7); ctx.lineTo(0, 11);
    ctx.moveTo(4, 7); ctx.lineTo(4, 11);
    ctx.stroke();

    ctx.restore();
  }

  drawHoloReaction(ctx, reaction, x, y, now) {
    if (!reaction) return;
    ctx.save();
    ctx.translate(x, y);

    const isText = reaction.length > 2 && !['crown', 'skull', 'flame', 'plasma', 'target', 'lightning', 'laugh', 'taunt', 'rocket', 'shield'].includes(reaction.toLowerCase());

    // Holographic Hexagonal Badge
    const w = isText ? Math.max(74, reaction.length * 9.5) : 34;
    const h = 26;
    const hw = w / 2;
    const hh = h / 2;
    const corner = 6;

    // Glowing Neon Border
    ctx.shadowColor = '#00f7ff';
    ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(6, 12, 30, 0.9)';
    ctx.strokeStyle = '#00f7ff';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(-hw + corner, -hh);
    ctx.lineTo(hw - corner, -hh);
    ctx.lineTo(hw, -hh + corner);
    ctx.lineTo(hw, hh - corner);
    ctx.lineTo(hw - corner, hh);
    ctx.lineTo(-hw + corner, hh);
    ctx.lineTo(-hw, hh - corner);
    ctx.lineTo(-hw, -hh + corner);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle scanline
    ctx.strokeStyle = 'rgba(0, 247, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-hw + 4, 0);
    ctx.lineTo(hw - 4, 0);
    ctx.stroke();

    // Render vector content
    const rKey = reaction.toLowerCase();
    if (rKey === 'crown' || reaction === '👑') {
      this.drawCyberCrown(ctx, 0, 0, now);
    } else if (rKey === 'skull' || reaction === '💀') {
      this.drawCyberSkull(ctx, 0, 0, now);
    } else if (rKey === 'flame' || rKey === 'plasma' || reaction === '🔥') {
      ctx.shadowColor = '#ffaa00';
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(0, 1, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      ctx.arc(0, 1, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (rKey === 'target' || reaction === '🎯') {
      ctx.strokeStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (rKey === 'lightning' || reaction === '⚡') {
      ctx.fillStyle = '#ffe600';
      ctx.shadowColor = '#ffe600';
      ctx.beginPath();
      ctx.moveTo(1, -7); ctx.lineTo(-4, 0); ctx.lineTo(0, 0);
      ctx.lineTo(-1, 7); ctx.lineTo(4, 0); ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    } else if (rKey === 'shield' || reaction === '🛡️') {
      ctx.strokeStyle = '#00f7ff';
      ctx.fillStyle = 'rgba(0, 247, 255, 0.3)';
      ctx.shadowColor = '#00f7ff';
      ctx.beginPath();
      ctx.moveTo(0, -7); ctx.lineTo(6, -4); ctx.lineTo(6, 2);
      ctx.lineTo(0, 7); ctx.lineTo(-6, 2); ctx.lineTo(-6, -4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (rKey === 'rocket' || reaction === '🚀') {
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.beginPath();
      ctx.moveTo(0, -7); ctx.lineTo(4, 4); ctx.lineTo(0, 2); ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();
    } else {
      // Tactical Callout Text (e.g. GG!, NICE SHOT!, DEFEND!)
      ctx.font = '900 10px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffe600';
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 10;
      ctx.fillText(reaction, 0, 1);
    }

    ctx.restore();
  }

  drawTurret(ctx, hullColor, turretAngle, isLocalPlayer = false) {
    ctx.save();
    ctx.rotate(turretAngle);

    ctx.fillStyle = '#1a223a';
    ctx.strokeStyle = hullColor;
    ctx.lineWidth = 2;
    ctx.fillRect(0, -4, 28, 8);
    ctx.strokeRect(0, -4, 28, 8);

    if (isLocalPlayer) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 247, 255, 0.28)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(28, 0);
      ctx.lineTo(750, 0);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = '#0a1024';
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawHangarMech(hangarCanvas, mClass, hullColor, now) {
    if (!hangarCanvas) return;
    const ctx = hangarCanvas.getContext('2d');
    if (!ctx) return;

    const w = hangarCanvas.width;
    const h = hangarCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 - 4;

    // 1. Holographic Pedestal
    const platformY = cy + 42;
    const rx = 65;
    const ry = 20;

    // Radial floor glow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, platformY, rx, ry, 0, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, platformY, 5, cx, platformY, rx);
    grad.addColorStop(0, 'rgba(0, 247, 255, 0.22)');
    grad.addColorStop(0.7, 'rgba(0, 247, 255, 0.06)');
    grad.addColorStop(1, 'rgba(0, 247, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Rotating dashed projection ring
    ctx.strokeStyle = hullColor;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = hullColor;
    ctx.shadowBlur = 8;
    ctx.setLineDash([8, 8]);
    ctx.lineDashOffset = -now * 0.02;
    ctx.beginPath();
    ctx.ellipse(cx, platformY, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Inner concentric ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.lineDashOffset = now * 0.015;
    ctx.beginPath();
    ctx.ellipse(cx, platformY, rx * 0.55, ry * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Subtle projection rays from pedestal to mech
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 247, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const pAngle = (now * 0.001) + (i * Math.PI / 2);
      const px = cx + Math.cos(pAngle) * rx * 0.85;
      const py = platformY + Math.sin(pAngle) * ry * 0.85;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(cx, cy);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Mech floating & rotating
    const bobbing = Math.sin(now * 0.003) * 4;
    const mechY = cy + bobbing;
    const rotationAngle = (now * 0.0009) % (Math.PI * 2);
    const turretAngle = rotationAngle + Math.sin(now * 0.002) * 0.35;

    ctx.save();
    ctx.translate(cx, mechY);
    ctx.scale(1.25, 1.25);
    this.drawMechChassis(ctx, mClass, hullColor, rotationAngle, true);
    this.drawTurret(ctx, hullColor, turretAngle, false);
    ctx.restore();

    // 3. Floating cyber particles
    ctx.save();
    ctx.fillStyle = hullColor;
    for (let i = 0; i < 6; i++) {
      const partSeed = (now * 0.0008 + i * 0.16) % 1;
      const partX = cx + (Math.sin(i * 137.5 + now * 0.002) * 60);
      const partY = platformY - (partSeed * 75);
      const partAlpha = Math.sin(partSeed * Math.PI) * 0.65;
      ctx.globalAlpha = partAlpha;
      ctx.beginPath();
      ctx.arc(partX, partY, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawPlayers(ctx, players, localPlayerId, gameMode, now, dt) {
    for (const player of players) {
      if (!player.isAlive) {
        this.interpolatedPlayers.delete(player.id);
        continue;
      }

      // Stealth invisibility:
      // Rivals see 100% NOTHING (completely invisible).
      // Spectator view (when localPlayerId is null) can see faint outline.
      if (player.isStealthed && player.id !== localPlayerId) {
        if (localPlayerId) {
          continue;
        }
      }

      // Smooth client-side netcode interpolation with dead reckoning
      let interp = this.interpolatedPlayers.get(player.id);
      if (!interp) {
        interp = { x: player.x, y: player.y, angle: player.angle, turretAngle: player.turretAngle };
        this.interpolatedPlayers.set(player.id, interp);
      } else {
        const distJump = Math.hypot(player.x - interp.x, player.y - interp.y);
        if (distJump > 260) {
          interp.x = player.x;
          interp.y = player.y;
        } else {
          interp.x += (player.vx || 0) * dt;
          interp.y += (player.vy || 0) * dt;

          const factor = Math.min(1.0, dt * 20);
          interp.x += (player.x - interp.x) * factor;
          interp.y += (player.y - interp.y) * factor;
        }

        const factor = Math.min(1.0, dt * 20);
        let dAngle = player.angle - interp.angle;
        while (dAngle < -Math.PI) dAngle += Math.PI * 2;
        while (dAngle > Math.PI) dAngle -= Math.PI * 2;
        interp.angle += dAngle * factor;

        let dTurret = player.turretAngle - interp.turretAngle;
        while (dTurret < -Math.PI) dTurret += Math.PI * 2;
        while (dTurret > Math.PI) dTurret -= Math.PI * 2;
        interp.turretAngle += dTurret * factor;
      }

      ctx.save();
      ctx.translate(interp.x, interp.y);

      // Portal dematerialization warp vortex effect
      if (player.isWarping) {
        ctx.save();
        ctx.strokeStyle = '#00f7ff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f7ff';
        ctx.shadowBlur = 16;
        const warpRot = (now * 0.018) % (Math.PI * 2);
        ctx.rotate(warpRot);
        ctx.beginPath();
        ctx.arc(0, 0, (player.radius || 20) + 9 + Math.sin(now * 0.02) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.globalAlpha *= 0.65;
      }

      // Stealth invisibility effect
      if (player.isStealthed) {
        ctx.globalAlpha = (player.id === localPlayerId) ? 0.28 : 0.12;
      }

      // Phantom Void Phase effect
      if (player.isPhasing) {
        ctx.globalAlpha = (player.id === localPlayerId) ? 0.45 : 0.25;
        ctx.shadowColor = '#bf00ff';
        ctx.shadowBlur = 18;
      }

      // Tread marks
      if (Math.hypot(player.vx || 0, player.vy || 0) > 20 && Math.random() > 0.65) {
        this.treadMarks.push({ x: interp.x, y: interp.y, alpha: 1.0 });
      }

      // 1. Invulnerability bubble
      if (player.invulnerable) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        const pulse = 28 + Math.sin(now * 0.015) * 4;
        ctx.arc(0, 0, pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Shield Bubble
      if (player.shield > 0) {
        ctx.save();
        const isRed = player.team === 'red' || player.team === 'magenta';
        ctx.strokeStyle = isRed ? '#ff0055' : '#00f7ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = isRed ? 'rgba(255, 0, 85, 0.08)' : 'rgba(0, 247, 255, 0.08)';
        ctx.fill();
        ctx.restore();
      }

      // 2.5 Golden Parry Barrier Shield
      if (player.isParrying) {
        ctx.save();
        ctx.strokeStyle = '#ffe600';
        ctx.fillStyle = 'rgba(255, 230, 0, 0.22)';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const px = Math.cos(a) * (player.radius + 10);
          const py = Math.sin(a) * (player.radius + 10);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // 3. Berserk Aura
      if (player.isSuperActive) {
        ctx.save();
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 12 + Math.sin(now * 0.03) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3.5 Cyber Infection Toxic Glitch Aura
      if (player.isInfected) {
        ctx.save();
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        const pulse = player.radius + 8 + Math.sin(now * 0.02) * 4;
        ctx.arc(0, 0, pulse, 0, Math.PI * 2);
        ctx.stroke();

        if (Math.random() > 0.45) {
          ctx.strokeStyle = '#ff0055';
          ctx.beginPath();
          const a = Math.random() * Math.PI * 2;
          ctx.moveTo(Math.cos(a) * pulse, Math.sin(a) * pulse);
          ctx.lineTo(Math.cos(a) * (pulse + 14), Math.sin(a) * (pulse + 14));
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Chassis Drawing per Mech Class
      const mClass = player.mechClass || 'spectre';
      const hullColor = player.isInfected ? '#00ff66' : (player.color || '#00f7ff');
      this.drawMechChassis(ctx, mClass, hullColor, interp.angle, player.isDashing);

      // 5. Turret & Laser Guideline
      this.drawTurret(ctx, hullColor, interp.turretAngle, player.id === localPlayerId);

      if (!player.isStealthed) {
        // 6. Custom Cyber Crown or Juggernaut Skull
        if (player.isCrownKing) {
          const crownBob = Math.sin(now * 0.008) * 3;
          if (gameMode === 'juggernaut') {
            this.drawCyberSkull(ctx, 0, -44 + crownBob, now);
          } else {
            this.drawCyberCrown(ctx, 0, -44 + crownBob, now);
          }
        }

        // 7. Floating Holographic Reaction Badge
        if (player.currentEmoji) {
          const emojiBob = Math.sin(now * 0.01) * 4;
          this.drawHoloReaction(ctx, player.currentEmoji, 0, -64 + emojiBob, now);
        }

        // 8. Player Nickname & Title
        ctx.font = 'bold 11px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = player.id === localPlayerId ? '#00f7ff' : '#ffffff';
        ctx.fillText(player.name, 0, -player.radius - 14);

        if (player.title) {
          ctx.font = '8px Orbitron, sans-serif';
          ctx.fillStyle = player.isInfected ? '#00ff66' : '#ffe600';
          ctx.fillText(player.isInfected ? '«INFECTED»' : `«${player.title}»`, 0, -player.radius - 26);
        }

        // Mini Health Bar
        const barW = 38;
        const barH = 4;
        const barY = -player.radius - 9;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(-barW / 2, barY, barW, barH);
        const hpPercent = Math.max(0, player.health / player.maxHealth);
        ctx.fillStyle = player.isInfected ? '#00ff66' : (hpPercent > 0.4 ? '#00ff66' : '#ff0055');
        ctx.fillRect(-barW / 2, barY, barW * hpPercent, barH);
      }

      ctx.restore();
    }
  }

  drawGoliathBoss(ctx, boss, now) {
    if (!boss || !boss.isAlive) return;

    ctx.save();
    ctx.translate(boss.x, boss.y);

    const isEnraged = boss.isEnraged;
    const coreColor = isEnraged ? '#ff0055' : '#00f7ff';

    // 1. Outer Heavy Armor Octagon
    ctx.save();
    ctx.rotate(boss.angle);
    ctx.fillStyle = '#0a0f1c';
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = isEnraged ? 4.5 : 3.5;
    ctx.shadowColor = coreColor;
    ctx.shadowBlur = isEnraged ? 25 : 15;

    const r = 56;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-r * 0.5, -r * 0.5, r, r);
    ctx.restore();

    // 2. Spinning Reactor Core
    ctx.save();
    ctx.rotate(-now * 0.003);
    ctx.fillStyle = coreColor;
    ctx.beginPath();
    ctx.arc(0, 0, 16 + Math.sin(now * 0.01) * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Quad Cannon Turret
    ctx.save();
    ctx.rotate(boss.turretAngle);
    ctx.fillStyle = '#141c2e';
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 2;

    ctx.fillRect(10, -18, 42, 7);
    ctx.strokeRect(10, -18, 42, 7);
    ctx.fillRect(10, -7, 46, 6);
    ctx.strokeRect(10, -7, 46, 6);
    ctx.fillRect(10, 2, 46, 6);
    ctx.strokeRect(10, 2, 46, 6);
    ctx.fillRect(10, 12, 42, 7);
    ctx.strokeRect(10, 12, 42, 7);

    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 4. Sweeping Lasers in Enraged Mode
    if (isEnraged) {
      ctx.save();
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 18;
      for (let ray = 0; ray < 4; ray++) {
        const rayA = (boss.sweepAngle || 0) + (ray * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rayA) * 580, Math.sin(rayA) * 580);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Mini Header & Boss HP Bar
    ctx.font = 'bold 12px Orbitron, sans-serif';
    ctx.fillStyle = isEnraged ? '#ff0055' : '#00f7ff';
    ctx.textAlign = 'center';
    ctx.fillText(isEnraged ? '⚠️ GOLIATH [ENRAGED] ⚠️' : 'GOLIATH [CORE BOSS]', 0, -r - 20);

    const bw = 90;
    const bh = 6;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-bw / 2, -r - 14, bw, bh);
    const hpPct = Math.max(0, boss.health / boss.maxHealth);
    ctx.fillStyle = isEnraged ? '#ff0055' : '#00ff66';
    ctx.fillRect(-bw / 2, -r - 14, bw * hpPct, bh);

    ctx.restore();
  }

  drawCreepDrones(ctx, creeps, now) {
    if (!creeps || creeps.length === 0) return;

    for (const creep of creeps) {
      ctx.save();
      ctx.translate(creep.x, creep.y);
      ctx.rotate(creep.angle);

      ctx.fillStyle = '#101420';
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-12, -12);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-12, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(4, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  addHitmarker(isCrit = false) {
    this.hitmarkers.push({
      alpha: 1.0,
      isCrit
    });
  }

  drawHitmarkers(ctx, dt) {
    if (!this.hitmarkers || this.hitmarkers.length === 0) return;
    const kept = [];
    const cx = this.width / 2;
    const cy = this.height / 2;

    for (const hm of this.hitmarkers) {
      hm.alpha -= dt * 6.5;
      if (hm.alpha > 0.01) {
        ctx.save();
        ctx.strokeStyle = hm.isCrit ? `rgba(255, 0, 85, ${hm.alpha})` : `rgba(255, 255, 255, ${hm.alpha})`;
        ctx.lineWidth = 2;
        const s = 6;
        const g = 4;
        ctx.beginPath();
        ctx.moveTo(cx - g, cy - g); ctx.lineTo(cx - g - s, cy - g - s);
        ctx.moveTo(cx + g, cy - g); ctx.lineTo(cx + g + s, cy - g - s);
        ctx.moveTo(cx - g, cy + g); ctx.lineTo(cx - g - s, cy + g + s);
        ctx.moveTo(cx + g, cy + g); ctx.lineTo(cx + g + s, cy + g + s);
        ctx.stroke();
        ctx.restore();
        kept.push(hm);
      }
    }
    this.hitmarkers = kept;
  }

  drawProjectiles(ctx, projectiles) {
    if (!projectiles) return;

    for (const proj of projectiles) {
      ctx.save();
      ctx.translate(proj.x, proj.y);

      ctx.strokeStyle = proj.color;
      ctx.fillStyle = proj.color;
      ctx.shadowColor = proj.color;
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, proj.radius * 0.45), 0, Math.PI * 2);
      ctx.fill();

      if (proj.isDeflected) {
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  drawParticles(ctx, dt) {
    const kept = [];
    for (const p of this.particles) {
      p.alpha -= dt * (p.decay || 1.0);
      if (p.alpha <= 0.01) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'shockwave') {
        p.radius += (p.maxRadius - p.radius) * 0.22;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'spark') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'ghost') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-18, -14, 36, 28);
      } else if (p.type === 'rubble') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation = (p.rotation || 0) + (p.vRot || 2) * dt;
        p.vx *= 0.94;
        p.vy *= 0.94;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = '#261106';
        ctx.strokeStyle = p.color || '#ff5500';
        ctx.lineWidth = 1.4;
        ctx.shadowColor = p.color || '#ff5500';
        ctx.shadowBlur = 4;
        const sz = p.size || 7;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.7, -sz * 0.5);
        ctx.lineTo(sz * 0.6, -sz * 0.6);
        ctx.lineTo(sz * 0.8, sz * 0.5);
        ctx.lineTo(-sz * 0.4, sz * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (p.type === 'smoke') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.radius = (p.radius || 12) + dt * 14;
        p.vx *= 0.96;
        p.vy *= 0.96;
        ctx.fillStyle = p.color || 'rgba(30, 14, 6, 0.65)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      kept.push(p);
    }
    this.particles = kept;
  }

  drawFloatingTexts(ctx, dt) {
    const kept = [];
    ctx.font = 'bold 14px Orbitron, sans-serif';
    ctx.textAlign = 'center';

    for (const ft of this.floatingTexts) {
      ft.y += ft.vy * dt;
      ft.alpha -= dt * 1.6;
      if (ft.alpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 8;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
        kept.push(ft);
      }
    }
    this.floatingTexts = kept;
  }

  drawAmbientEmbers(ctx, dt) {
    ctx.save();
    for (const ember of this.ambientEmbers) {
      ember.x += ember.speedX * dt;
      ember.y += ember.speedY * dt;

      if (ember.y < 0) {
        ember.y = this.height + 10;
        ember.x = Math.random() * this.width;
      }

      ctx.globalAlpha = ember.alpha;
      ctx.fillStyle = ember.color;
      ctx.fillRect(ember.x, ember.y, ember.size, ember.size);
    }
    ctx.restore();
  }

  drawCRTFilter(ctx) {
    ctx.save();
    // High-performance vignette (scanlines are rendered via GPU-accelerated CSS #crt-overlay)
    const grad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.height * 0.45,
      this.width / 2, this.height / 2, this.height * 0.8
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(3, 5, 12, 0.45)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  drawMinimap(state, localPlayerId, now) {
    const mCtx = this.mCtx;
    const mw = this.minimapCanvas.width;
    const mh = this.minimapCanvas.height;
    const scaleX = mw / this.map.width;
    const scaleY = mh / this.map.height;

    mCtx.fillStyle = '#040712';
    mCtx.fillRect(0, 0, mw, mh);

    if (this.map.obstacles) {
      mCtx.fillStyle = 'rgba(0, 166, 255, 0.25)';
      for (const obs of this.map.obstacles) {
        mCtx.fillRect(obs.x * scaleX, obs.y * scaleY, obs.w * scaleX, obs.h * scaleY);
      }
    }

    // KOTH beacon on minimap
    if (state.kothZone) {
      mCtx.strokeStyle = 'rgba(255, 230, 0, 0.5)';
      mCtx.beginPath();
      mCtx.arc(state.kothZone.x * scaleX, state.kothZone.y * scaleY, state.kothZone.radius * scaleX, 0, Math.PI * 2);
      mCtx.stroke();
    }

    // Sudden Death / Cyber Storm on minimap
    if (state.suddenDeath) {
      const scx = (state.suddenDeath.cx !== undefined ? state.suddenDeath.cx : this.map.width / 2) * scaleX;
      const scy = (state.suddenDeath.cy !== undefined ? state.suddenDeath.cy : this.map.height / 2) * scaleY;
      const sRadius = state.suddenDeath.radius * scaleX;

      mCtx.save();
      // Shrinking lethal storm boundary
      mCtx.strokeStyle = 'rgba(255, 0, 85, 0.85)';
      mCtx.lineWidth = 1.8;
      mCtx.beginPath();
      mCtx.arc(scx, scy, Math.max(1, sRadius), 0, Math.PI * 2);
      mCtx.stroke();

      // Next phase safe zone
      if (state.battleRoyale && state.battleRoyale.targetRadius) {
        const nextR = state.battleRoyale.targetRadius * scaleX;
        mCtx.strokeStyle = 'rgba(0, 255, 136, 0.65)';
        mCtx.lineWidth = 1.2;
        mCtx.setLineDash([2, 2]);
        mCtx.beginPath();
        mCtx.arc(scx, scy, Math.max(1, nextR), 0, Math.PI * 2);
        mCtx.stroke();
      }
      mCtx.restore();
    }

    // Sweep line
    const sweepAngle = (now * 0.002) % (Math.PI * 2);
    mCtx.strokeStyle = 'rgba(0, 247, 255, 0.15)';
    mCtx.beginPath();
    mCtx.moveTo(mw / 2, mh / 2);
    mCtx.lineTo(mw / 2 + Math.cos(sweepAngle) * mw, mh / 2 + Math.sin(sweepAngle) * mh);
    mCtx.stroke();

    // Players
    for (const p of state.players) {
      if (!p.isAlive || (p.isStealthed && p.id !== localPlayerId)) continue;

      const px = p.x * scaleX;
      const py = p.y * scaleY;

      if (p.isCrownKing) {
        mCtx.fillStyle = '#ffe600';
        mCtx.beginPath();
        mCtx.arc(px, py, 4.5, 0, Math.PI * 2);
        mCtx.fill();
      } else if (p.id === localPlayerId) {
        mCtx.fillStyle = '#00f7ff';
        mCtx.beginPath();
        mCtx.arc(px, py, 3.5, 0, Math.PI * 2);
        mCtx.fill();
      } else {
        mCtx.fillStyle = p.team === 'cyan' ? '#00f7ff' : (p.team === 'magenta' ? '#ff0055' : '#ff3366');
        mCtx.beginPath();
        mCtx.arc(px, py, 2.5, 0, Math.PI * 2);
        mCtx.fill();
      }
    }
  }
}
