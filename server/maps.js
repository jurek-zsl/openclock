/**
 * Map configurations & dynamic hazard definitions for Neon Clash
 */

export const MAPS = {
  core: {
    id: 'core',
    name: 'Sector 01: The Core',
    desc: 'Balanced tactical arena with central reactor and quadrant forts',
    width: 2600,
    height: 2600,
    kothZone: { x: 1300, y: 1300, radius: 170 },
    obstacles: [
      // Central Hub
      { id: 'c1', x: 1200, y: 1080, w: 200, h: 40, type: 'bouncy' },
      { id: 'c2', x: 1200, y: 1480, w: 200, h: 40, type: 'bouncy' },
      { id: 'c3', x: 1080, y: 1200, w: 40, h: 200, type: 'bouncy' },
      { id: 'c4', x: 1480, y: 1200, w: 40, h: 200, type: 'bouncy' },

      // Quadrant Forts - Top Left
      { id: 'tl1', x: 500, y: 500, w: 220, h: 40, type: 'solid' },
      { id: 'tl2', x: 500, y: 500, w: 40, h: 220, type: 'solid' },
      { id: 'tl3', x: 760, y: 680, w: 140, h: 40, type: 'bouncy' },

      // Quadrant Forts - Top Right
      { id: 'tr1', x: 1880, y: 500, w: 220, h: 40, type: 'solid' },
      { id: 'tr2', x: 2060, y: 500, w: 40, h: 220, type: 'solid' },
      { id: 'tr3', x: 1700, y: 680, w: 140, h: 40, type: 'bouncy' },

      // Quadrant Forts - Bottom Left
      { id: 'bl1', x: 500, y: 2060, w: 220, h: 40, type: 'solid' },
      { id: 'bl2', x: 500, y: 1880, w: 40, h: 220, type: 'solid' },
      { id: 'bl3', x: 760, y: 1880, w: 140, h: 40, type: 'bouncy' },

      // Quadrant Forts - Bottom Right
      { id: 'br1', x: 1880, y: 2060, w: 220, h: 40, type: 'solid' },
      { id: 'br2', x: 2060, y: 1880, w: 40, h: 220, type: 'solid' },
      { id: 'br3', x: 1700, y: 1880, w: 140, h: 40, type: 'bouncy' },

      // Pillars
      { id: 'p1', x: 1250, y: 450, w: 100, h: 100, type: 'solid' },
      { id: 'p2', x: 1250, y: 2050, w: 100, h: 100, type: 'solid' },
      { id: 'p3', x: 450, y: 1250, w: 100, h: 100, type: 'solid' },
      { id: 'p4', x: 2050, y: 1250, w: 100, h: 100, type: 'solid' },
      // Destructible Energy Walls
      { id: 'd1', x: 1200, y: 760, w: 200, h: 36, type: 'destructible', hp: 160, maxHp: 160 },
      { id: 'd2', x: 1200, y: 1800, w: 200, h: 36, type: 'destructible', hp: 160, maxHp: 160 },
    ],
    portals: [
      { id: 'pt1', x: 360, y: 1300, targetX: 2240, targetY: 1300, radius: 36, color: '#00f7ff' },
      { id: 'pt2', x: 2240, y: 1300, targetX: 360, targetY: 1300, radius: 36, color: '#ff8800' }
    ],
    barrels: [
      { id: 'br1', x: 1000, y: 1000, health: 30, maxHealth: 30, radius: 20 },
      { id: 'br2', x: 1600, y: 1000, health: 30, maxHealth: 30, radius: 20 },
      { id: 'br3', x: 1000, y: 1600, health: 30, maxHealth: 30, radius: 20 },
      { id: 'br4', x: 1600, y: 1600, health: 30, maxHealth: 30, radius: 20 },
    ],
    speedPads: [
      { id: 'sp1', x: 950, y: 1300, w: 70, h: 70, angle: 0, boost: 700 },
      { id: 'sp2', x: 1650, y: 1300, w: 70, h: 70, angle: Math.PI, boost: 700 },
      { id: 'sp3', x: 1300, y: 950, w: 70, h: 70, angle: Math.PI / 2, boost: 700 },
      { id: 'sp4', x: 1300, y: 1650, w: 70, h: 70, angle: -Math.PI / 2, boost: 700 },
    ],
    laserGates: [
      { id: 'lg1', x1: 450, y1: 1450, x2: 450, y2: 1750, active: true, timer: 0, interval: 4.5 },
      { id: 'lg2', x1: 2150, y1: 850, x2: 2150, y2: 1150, active: true, timer: 2.2, interval: 4.5 }
    ],
    powerupSpawns: [
      { x: 1300, y: 1300, type: 'crown_boost' },
      { x: 610, y: 610, type: 'shield' },
      { x: 1990, y: 610, type: 'speed' },
      { x: 610, y: 1990, type: 'trishot' },
      { x: 1990, y: 1990, type: 'heal' },
      { x: 1300, y: 600, type: 'weapon_crate' },
      { x: 1300, y: 2000, type: 'weapon_crate' },
    ]
  },

  labyrinth: {
    id: 'labyrinth',
    name: 'Sector 02: Neon Labyrinth',
    desc: 'Dense cyber corridors, tight choke points, and ricochet alleys',
    width: 2600,
    height: 2600,
    kothZone: { x: 1300, y: 1300, radius: 150 },
    obstacles: [
      // Central Chamber
      { id: 'l_c1', x: 1100, y: 1050, w: 400, h: 40, type: 'solid' },
      { id: 'l_c2', x: 1100, y: 1510, w: 400, h: 40, type: 'solid' },
      { id: 'l_c3', x: 1050, y: 1100, w: 40, h: 400, type: 'solid' },
      { id: 'l_c4', x: 1510, y: 1100, w: 40, h: 400, type: 'solid' },

      // Outer Ring Mazes
      { id: 'l_m1', x: 500, y: 900, w: 350, h: 50, type: 'bouncy' },
      { id: 'l_m2', x: 500, y: 1650, w: 350, h: 50, type: 'bouncy' },
      { id: 'l_m3', x: 1750, y: 900, w: 350, h: 50, type: 'bouncy' },
      { id: 'l_m4', x: 1750, y: 1650, w: 350, h: 50, type: 'bouncy' },

      // Cross partitions
      { id: 'l_p1', x: 900, y: 450, w: 50, h: 400, type: 'solid' },
      { id: 'l_p2', x: 1650, y: 450, w: 50, h: 400, type: 'solid' },
      { id: 'l_p3', x: 900, y: 1750, w: 50, h: 400, type: 'solid' },
      { id: 'l_p4', x: 1650, y: 1750, w: 50, h: 400, type: 'solid' },

      // Bouncy corner wedges
      { id: 'l_b1', x: 350, y: 350, w: 120, h: 120, type: 'bouncy' },
      { id: 'l_b2', x: 2130, y: 350, w: 120, h: 120, type: 'bouncy' },
      { id: 'l_b3', x: 350, y: 2130, w: 120, h: 120, type: 'bouncy' },
      { id: 'l_b4', x: 2130, y: 2130, w: 120, h: 120, type: 'bouncy' },
    ],
    speedPads: [
      { id: 'sp1', x: 1300, y: 450, w: 70, h: 70, angle: Math.PI / 2, boost: 750 },
      { id: 'sp2', x: 1300, y: 2150, w: 70, h: 70, angle: -Math.PI / 2, boost: 750 },
      { id: 'sp3', x: 450, y: 1300, w: 70, h: 70, angle: 0, boost: 750 },
      { id: 'sp4', x: 2150, y: 1300, w: 70, h: 70, angle: Math.PI, boost: 750 },
    ],
    laserGates: [
      { id: 'lg1', x1: 1200, y1: 1050, x2: 1400, y2: 1050, active: true, timer: 0, interval: 3.5 },
      { id: 'lg2', x1: 1200, y1: 1550, x2: 1400, y2: 1550, active: true, timer: 1.75, interval: 3.5 },
      { id: 'lg3', x1: 1050, y1: 1200, x2: 1050, y2: 1400, active: true, timer: 0.8, interval: 3.5 },
      { id: 'lg4', x1: 1550, y1: 1200, x2: 1550, y2: 1400, active: true, timer: 2.5, interval: 3.5 }
    ],
    powerupSpawns: [
      { x: 1300, y: 1300, type: 'super_orb' },
      { x: 600, y: 1300, type: 'shield' },
      { x: 2000, y: 1300, type: 'trishot' },
      { x: 1300, y: 600, type: 'speed' },
      { x: 1300, y: 2000, type: 'heal' },
    ]
  },

  colosseum: {
    id: 'colosseum',
    name: 'Sector 03: Hyper Ring Colosseum',
    desc: 'High-speed circular velocity arena with peripheral booster tracks',
    width: 2800,
    height: 2800,
    kothZone: { x: 1400, y: 1400, radius: 210 },
    obstacles: [
      // Central Hazard Ring Pillars
      { id: 'c_p1', x: 1100, y: 1100, w: 80, h: 80, type: 'bouncy' },
      { id: 'c_p2', x: 1620, y: 1100, w: 80, h: 80, type: 'bouncy' },
      { id: 'c_p3', x: 1100, y: 1620, w: 80, h: 80, type: 'bouncy' },
      { id: 'c_p4', x: 1620, y: 1620, w: 80, h: 80, type: 'bouncy' },

      // Outer Octagonal Shield Barriers
      { id: 'c_w1', x: 700, y: 400, w: 400, h: 40, type: 'solid' },
      { id: 'c_w2', x: 1700, y: 400, w: 400, h: 40, type: 'solid' },
      { id: 'c_w3', x: 700, y: 2360, w: 400, h: 40, type: 'solid' },
      { id: 'c_w4', x: 1700, y: 2360, w: 400, h: 40, type: 'solid' },
      { id: 'c_w5', x: 400, y: 700, w: 40, h: 400, type: 'solid' },
      { id: 'c_w6', x: 400, y: 1700, w: 40, h: 400, type: 'solid' },
      { id: 'c_w7', x: 2360, y: 700, w: 40, h: 400, type: 'solid' },
      { id: 'c_w8', x: 2360, y: 1700, w: 40, h: 400, type: 'solid' },
    ],
    speedPads: [
      // Orbiting clockwise boost tracks!
      { id: 'sp1', x: 1400, y: 350, w: 80, h: 80, angle: 0, boost: 900 },
      { id: 'sp2', x: 2450, y: 1400, w: 80, h: 80, angle: Math.PI / 2, boost: 900 },
      { id: 'sp3', x: 1400, y: 2450, w: 80, h: 80, angle: Math.PI, boost: 900 },
      { id: 'sp4', x: 350, y: 1400, w: 80, h: 80, angle: -Math.PI / 2, boost: 900 },
      { id: 'sp5', x: 900, y: 900, w: 70, h: 70, angle: Math.PI / 4, boost: 700 },
      { id: 'sp6', x: 1900, y: 1900, w: 70, h: 70, angle: -3 * Math.PI / 4, boost: 700 },
    ],
    laserGates: [
      { id: 'lg1', x1: 1350, y1: 850, x2: 1450, y2: 850, active: true, timer: 0, interval: 4.0 },
      { id: 'lg2', x1: 1350, y1: 1950, x2: 1450, y2: 1950, active: true, timer: 2.0, interval: 4.0 }
    ],
    powerupSpawns: [
      { x: 1400, y: 1400, type: 'crown_boost' },
      { x: 750, y: 750, type: 'shield' },
      { x: 2050, y: 750, type: 'weapon_crate' },
      { x: 750, y: 2050, type: 'speed' },
      { x: 2050, y: 2050, type: 'trishot' },
    ]
  },

  pinball: {
    id: 'pinball',
    name: 'Sector 04: Pinball Citadel',
    desc: 'Bouncy bumper paradise that flings tanks and amplifies ricochets',
    width: 2600,
    height: 2600,
    kothZone: { x: 1300, y: 1300, radius: 160 },
    obstacles: [
      // Super bouncy diamond bumpers
      { id: 'pb1', x: 1250, y: 800, w: 100, h: 100, type: 'bouncy' },
      { id: 'pb2', x: 1250, y: 1700, w: 100, h: 100, type: 'bouncy' },
      { id: 'pb3', x: 800, y: 1250, w: 100, h: 100, type: 'bouncy' },
      { id: 'pb4', x: 1700, y: 1250, w: 100, h: 100, type: 'bouncy' },

      // Mid-field bumpers
      { id: 'pb5', x: 850, y: 850, w: 120, h: 60, type: 'bouncy' },
      { id: 'pb6', x: 1630, y: 850, w: 120, h: 60, type: 'bouncy' },
      { id: 'pb7', x: 850, y: 1690, w: 120, h: 60, type: 'bouncy' },
      { id: 'pb8', x: 1630, y: 1690, w: 120, h: 60, type: 'bouncy' },

      // Slanted wall bumpers
      { id: 'pb9', x: 450, y: 450, w: 250, h: 50, type: 'bouncy' },
      { id: 'pb10', x: 1900, y: 450, w: 250, h: 50, type: 'bouncy' },
      { id: 'pb11', x: 450, y: 2100, w: 250, h: 50, type: 'bouncy' },
      { id: 'pb12', x: 1900, y: 2100, w: 250, h: 50, type: 'bouncy' },
    ],
    portals: [
      { id: 'pt_pb1', x: 450, y: 1300, targetX: 2150, targetY: 1300, radius: 36, color: '#00f7ff' },
      { id: 'pt_pb2', x: 2150, y: 1300, targetX: 450, targetY: 1300, radius: 36, color: '#ff8800' }
    ],
    barrels: [
      { id: 'pb_b1', x: 1050, y: 1050, health: 30, maxHealth: 30, radius: 20 },
      { id: 'pb_b2', x: 1550, y: 1050, health: 30, maxHealth: 30, radius: 20 },
      { id: 'pb_b3', x: 1050, y: 1550, health: 30, maxHealth: 30, radius: 20 },
      { id: 'pb_b4', x: 1550, y: 1550, health: 30, maxHealth: 30, radius: 20 },
    ],
    speedPads: [
      { id: 'sp1', x: 1300, y: 500, w: 80, h: 80, angle: Math.PI / 2, boost: 800 },
      { id: 'sp2', x: 1300, y: 2100, w: 80, h: 80, angle: -Math.PI / 2, boost: 800 },
      { id: 'sp3', x: 500, y: 1300, w: 80, h: 80, angle: 0, boost: 800 },
      { id: 'sp4', x: 2100, y: 1300, w: 80, h: 80, angle: Math.PI, boost: 800 },
    ],
    laserGates: [
      { id: 'lg1', x1: 1050, y1: 1300, x2: 1200, y2: 1300, active: true, timer: 0, interval: 3.0 },
      { id: 'lg2', x1: 1400, y1: 1300, x2: 1550, y2: 1300, active: true, timer: 1.5, interval: 3.0 }
    ],
    powerupSpawns: [
      { x: 1300, y: 1300, type: 'super_orb' },
      { x: 800, y: 800, type: 'weapon_crate' },
      { x: 1800, y: 800, type: 'shield' },
      { x: 800, y: 1800, type: 'trishot' },
      { x: 1800, y: 1800, type: 'speed' },
    ]
  },

  hypergrid: {
    id: 'hypergrid',
    name: 'Sector 05: Cyber Metropolis',
    desc: 'High-tech urban avenues, skyscraper blocks, transit jump-lanes, and commercial plazas',
    width: 3000,
    height: 3000,
    kothZone: { x: 1500, y: 1500, radius: 180 },
    obstacles: [
      // Central Plaza Obelisks
      { id: 'hg_c1', x: 1350, y: 1350, w: 70, h: 70, type: 'solid' },
      { id: 'hg_c2', x: 1580, y: 1350, w: 70, h: 70, type: 'solid' },
      { id: 'hg_c3', x: 1350, y: 1580, w: 70, h: 70, type: 'solid' },
      { id: 'hg_c4', x: 1580, y: 1580, w: 70, h: 70, type: 'solid' },

      // North & South Skyscraper Towers
      { id: 'hg_t1', x: 900, y: 550, w: 350, h: 100, type: 'solid' },
      { id: 'hg_t2', x: 1750, y: 550, w: 350, h: 100, type: 'solid' },
      { id: 'hg_t3', x: 900, y: 2350, w: 350, h: 100, type: 'solid' },
      { id: 'hg_t4', x: 1750, y: 2350, w: 350, h: 100, type: 'solid' },

      // East & West Corporate Wings
      { id: 'hg_w1', x: 550, y: 900, w: 100, h: 350, type: 'solid' },
      { id: 'hg_w2', x: 550, y: 1750, w: 100, h: 350, type: 'solid' },
      { id: 'hg_w3', x: 2350, y: 900, w: 100, h: 350, type: 'solid' },
      { id: 'hg_w4', x: 2350, y: 1750, w: 100, h: 350, type: 'solid' },

      // Destructible Security Barricades
      { id: 'hg_d1', x: 1350, y: 1050, w: 300, h: 40, type: 'destructible', hp: 180, maxHp: 180 },
      { id: 'hg_d2', x: 1350, y: 1910, w: 300, h: 40, type: 'destructible', hp: 180, maxHp: 180 },
      { id: 'hg_d3', x: 1050, y: 1350, w: 40, h: 300, type: 'destructible', hp: 180, maxHp: 180 },
      { id: 'hg_d4', x: 1910, y: 1350, w: 40, h: 300, type: 'destructible', hp: 180, maxHp: 180 },

      // Bouncy Neon Bumpers in Alleyways
      { id: 'hg_b1', x: 900, y: 900, w: 80, h: 80, type: 'bouncy' },
      { id: 'hg_b2', x: 2020, y: 900, w: 80, h: 80, type: 'bouncy' },
      { id: 'hg_b3', x: 900, y: 2020, w: 80, h: 80, type: 'bouncy' },
      { id: 'hg_b4', x: 2020, y: 2020, w: 80, h: 80, type: 'bouncy' }
    ],
    portals: [
      { id: 'pt_hg1', x: 550, y: 1500, targetX: 2450, targetY: 1500, radius: 40, color: '#00f7ff' },
      { id: 'pt_hg2', x: 2450, y: 1500, targetX: 550, targetY: 1500, radius: 40, color: '#ff0055' }
    ],
    barrels: [
      { id: 'hg_br1', x: 1150, y: 1150, health: 30, maxHealth: 30, radius: 20 },
      { id: 'hg_br2', x: 1850, y: 1150, health: 30, maxHealth: 30, radius: 20 },
      { id: 'hg_br3', x: 1150, y: 1850, health: 30, maxHealth: 30, radius: 20 },
      { id: 'hg_br4', x: 1850, y: 1850, health: 30, maxHealth: 30, radius: 20 }
    ],
    speedPads: [
      { id: 'hg_sp1', x: 1500, y: 400, w: 80, h: 80, angle: Math.PI / 2, boost: 820 },
      { id: 'hg_sp2', x: 1500, y: 2600, w: 80, h: 80, angle: -Math.PI / 2, boost: 820 },
      { id: 'hg_sp3', x: 400, y: 1500, w: 80, h: 80, angle: 0, boost: 820 },
      { id: 'hg_sp4', x: 2600, y: 1500, w: 80, h: 80, angle: Math.PI, boost: 820 }
    ],
    laserGates: [
      { id: 'hg_lg1', x1: 1200, y1: 850, x2: 1400, y2: 850, active: true, timer: 0, interval: 4.0 },
      { id: 'hg_lg2', x1: 1600, y1: 850, x2: 1800, y2: 850, active: true, timer: 2.0, interval: 4.0 },
      { id: 'hg_lg3', x1: 1200, y1: 2150, x2: 1400, y2: 2150, active: true, timer: 1.0, interval: 4.0 },
      { id: 'hg_lg4', x1: 1600, y1: 2150, x2: 1800, y2: 2150, active: true, timer: 3.0, interval: 4.0 }
    ],
    powerupSpawns: [
      { x: 1500, y: 1500, type: 'crown_boost' },
      { x: 1500, y: 750, type: 'weapon_crate' },
      { x: 1500, y: 2250, type: 'weapon_crate' },
      { x: 750, y: 1500, type: 'shield' },
      { x: 2250, y: 1500, type: 'heal' },
      { x: 900, y: 900, type: 'speed' },
      { x: 2100, y: 2100, type: 'trishot' }
    ]
  },

  vortex_abyss: {
    id: 'vortex_abyss',
    name: 'Sector 06: Singularity Core',
    desc: 'Dark matter research reactor encircled by laser traps, magnetic bridges, and heavy firepower',
    width: 2800,
    height: 2800,
    kothZone: { x: 1400, y: 1400, radius: 170 },
    obstacles: [
      // Concentric Circular Chambers
      { id: 'va_c1', x: 1180, y: 950, w: 440, h: 45, type: 'solid' },
      { id: 'va_c2', x: 1180, y: 1805, w: 440, h: 45, type: 'solid' },
      { id: 'va_c3', x: 950, y: 1180, w: 45, h: 440, type: 'solid' },
      { id: 'va_c4', x: 1805, y: 1180, w: 45, h: 440, type: 'solid' },

      // Perimeter Reactor Walls
      { id: 'va_p1', x: 500, y: 500, w: 400, h: 50, type: 'bouncy' },
      { id: 'va_p2', x: 1900, y: 500, w: 400, h: 50, type: 'bouncy' },
      { id: 'va_p3', x: 500, y: 2250, w: 400, h: 50, type: 'bouncy' },
      { id: 'va_p4', x: 1900, y: 2250, w: 400, h: 50, type: 'bouncy' },

      // Destructible Energy Cores
      { id: 'va_d1', x: 1350, y: 1180, w: 100, h: 40, type: 'destructible', hp: 160, maxHp: 160 },
      { id: 'va_d2', x: 1350, y: 1580, w: 100, h: 40, type: 'destructible', hp: 160, maxHp: 160 }
    ],
    portals: [
      { id: 'pt_va1', x: 700, y: 700, targetX: 2100, targetY: 2100, radius: 36, color: '#bf00ff' },
      { id: 'pt_va2', x: 2100, y: 2100, targetX: 700, targetY: 700, radius: 36, color: '#00f7ff' }
    ],
    barrels: [
      { id: 'va_b1', x: 1400, y: 800, health: 30, maxHealth: 30, radius: 22 },
      { id: 'va_b2', x: 1400, y: 2000, health: 30, maxHealth: 30, radius: 22 },
      { id: 'va_b3', x: 800, y: 1400, health: 30, maxHealth: 30, radius: 22 },
      { id: 'va_b4', x: 2000, y: 1400, health: 30, maxHealth: 30, radius: 22 }
    ],
    speedPads: [
      { id: 'va_sp1', x: 1400, y: 450, w: 75, h: 75, angle: Math.PI / 2, boost: 780 },
      { id: 'va_sp2', x: 1400, y: 2350, w: 75, h: 75, angle: -Math.PI / 2, boost: 780 },
      { id: 'va_sp3', x: 450, y: 1400, w: 75, h: 75, angle: 0, boost: 780 },
      { id: 'va_sp4', x: 2350, y: 1400, w: 75, h: 75, angle: Math.PI, boost: 780 }
    ],
    laserGates: [
      { id: 'va_lg1', x1: 1300, y1: 1000, x2: 1500, y2: 1000, active: true, timer: 0, interval: 3.2 },
      { id: 'va_lg2', x1: 1300, y1: 1800, x2: 1500, y2: 1800, active: true, timer: 1.6, interval: 3.2 }
    ],
    powerupSpawns: [
      { x: 1400, y: 1400, type: 'super_orb' },
      { x: 600, y: 1400, type: 'shield' },
      { x: 2200, y: 1400, type: 'heal' },
      { x: 1400, y: 600, type: 'weapon_crate' },
      { x: 1400, y: 2200, type: 'trishot' }
    ]
  },

  megacity: {
    id: 'megacity',
    name: 'Sector 07: Neo-Veridia Mega Warzone',
    desc: 'Colossal 5000x5000 multi-district battleground engineered for massive combat & Battle Royale',
    width: 5000,
    height: 5000,
    kothZone: { x: 2500, y: 2500, radius: 250 },
    obstacles: [
      // 1. CENTRAL APEX CITADEL (Center: 2500, 2500)
      { id: 'mc_c1', x: 2300, y: 2200, w: 400, h: 50, type: 'solid' },
      { id: 'mc_c2', x: 2300, y: 2750, w: 400, h: 50, type: 'solid' },
      { id: 'mc_c3', x: 2200, y: 2300, w: 50, h: 400, type: 'solid' },
      { id: 'mc_c4', x: 2750, y: 2300, w: 50, h: 400, type: 'solid' },

      // 2. NORTH INDUSTRIAL SLUMS (Dense barricades & cover: 2500, 1000)
      { id: 'mc_n1', x: 2100, y: 800, w: 800, h: 60, type: 'solid' },
      { id: 'mc_n2', x: 1800, y: 1200, w: 400, h: 50, type: 'destructible', hp: 200, maxHp: 200 },
      { id: 'mc_n3', x: 2800, y: 1200, w: 400, h: 50, type: 'destructible', hp: 200, maxHp: 200 },
      { id: 'mc_n4', x: 2400, y: 600, w: 200, h: 200, type: 'solid' },
      { id: 'mc_n5', x: 1500, y: 900, w: 60, h: 500, type: 'solid' },
      { id: 'mc_n6', x: 3440, y: 900, w: 60, h: 500, type: 'solid' },

      // 3. SOUTH CYBER PORT (Transit & warehouse docks: 2500, 4000)
      { id: 'mc_s1', x: 2000, y: 3900, w: 1000, h: 70, type: 'solid' },
      { id: 'mc_s2', x: 1700, y: 4200, w: 500, h: 50, type: 'destructible', hp: 220, maxHp: 220 },
      { id: 'mc_s3', x: 2800, y: 4200, w: 500, h: 50, type: 'destructible', hp: 220, maxHp: 220 },
      { id: 'mc_s4', x: 2350, y: 4400, w: 300, h: 100, type: 'solid' },
      { id: 'mc_s5', x: 1400, y: 3700, w: 70, h: 600, type: 'solid' },
      { id: 'mc_s6', x: 3530, y: 3700, w: 70, h: 600, type: 'solid' },

      // 4. WEST BOUNCING MATRIX (Yellow deflection arrays: 1000, 2500)
      { id: 'mc_w1', x: 800, y: 2000, w: 120, h: 120, type: 'bouncy' },
      { id: 'mc_w2', x: 1200, y: 2000, w: 120, h: 120, type: 'bouncy' },
      { id: 'mc_w3', x: 800, y: 2880, w: 120, h: 120, type: 'bouncy' },
      { id: 'mc_w4', x: 1200, y: 2880, w: 120, h: 120, type: 'bouncy' },
      { id: 'mc_w5', x: 600, y: 2450, w: 800, h: 60, type: 'bouncy' },
      { id: 'mc_w6', x: 970, y: 2200, w: 60, h: 600, type: 'bouncy' },

      // 5. EAST REACTOR COMPLEX (High tech containment: 4000, 2500)
      { id: 'mc_e1', x: 3800, y: 2100, w: 500, h: 60, type: 'solid' },
      { id: 'mc_e2', x: 3800, y: 2840, w: 500, h: 60, type: 'solid' },
      { id: 'mc_e3', x: 3600, y: 2300, w: 60, h: 400, type: 'solid' },
      { id: 'mc_e4', x: 4400, y: 2300, w: 60, h: 400, type: 'solid' },
      { id: 'mc_e5', x: 3950, y: 2450, w: 200, h: 100, type: 'destructible', hp: 240, maxHp: 240 },

      // Quadrant Outposts
      { id: 'mc_q1', x: 1200, y: 1200, w: 250, h: 250, type: 'solid' },
      { id: 'mc_q2', x: 3550, y: 1200, w: 250, h: 250, type: 'solid' },
      { id: 'mc_q3', x: 1200, y: 3550, w: 250, h: 250, type: 'solid' },
      { id: 'mc_q4', x: 3550, y: 3550, w: 250, h: 250, type: 'solid' }
    ],
    portals: [
      { id: 'pt_mc1', x: 800, y: 800, targetX: 4200, targetY: 4200, radius: 45, color: '#00f7ff' },
      { id: 'pt_mc2', x: 4200, y: 4200, targetX: 800, targetY: 800, radius: 45, color: '#ff0055' },
      { id: 'pt_mc3', x: 800, y: 4200, targetX: 4200, targetY: 800, radius: 45, color: '#00ff66' },
      { id: 'pt_mc4', x: 4200, y: 800, targetX: 800, targetY: 4200, radius: 45, color: '#ffe600' }
    ],
    barrels: [
      // Slums cache
      { id: 'mc_b1', x: 2300, y: 1100, health: 30, maxHealth: 30, radius: 24 },
      { id: 'mc_b2', x: 2700, y: 1100, health: 30, maxHealth: 30, radius: 24 },
      // Cyber Port cache
      { id: 'mc_b3', x: 2200, y: 4100, health: 30, maxHealth: 30, radius: 24 },
      { id: 'mc_b4', x: 2800, y: 4100, health: 30, maxHealth: 30, radius: 24 },
      // Citadel perimeter
      { id: 'mc_b5', x: 2050, y: 2500, health: 30, maxHealth: 30, radius: 24 },
      { id: 'mc_b6', x: 2950, y: 2500, health: 30, maxHealth: 30, radius: 24 },
      // Reactor perimeter
      { id: 'mc_b7', x: 3850, y: 2400, health: 30, maxHealth: 30, radius: 24 },
      { id: 'mc_b8', x: 4250, y: 2600, health: 30, maxHealth: 30, radius: 24 }
    ],
    speedPads: [
      // Central highway crosses
      { id: 'mc_sp1', x: 2500, y: 1600, w: 90, h: 90, angle: Math.PI / 2, boost: 900 },
      { id: 'mc_sp2', x: 2500, y: 3400, w: 90, h: 90, angle: -Math.PI / 2, boost: 900 },
      { id: 'mc_sp3', x: 1600, y: 2500, w: 90, h: 90, angle: 0, boost: 900 },
      { id: 'mc_sp4', x: 3400, y: 2500, w: 90, h: 90, angle: Math.PI, boost: 900 },
      // Perimeter booster strips
      { id: 'mc_sp5', x: 600, y: 600, w: 90, h: 90, angle: Math.PI / 4, boost: 950 },
      { id: 'mc_sp6', x: 4400, y: 4400, w: 90, h: 90, angle: -3 * Math.PI / 4, boost: 950 }
    ],
    laserGates: [
      { id: 'mc_lg1', x1: 2350, y1: 1900, x2: 2650, y2: 1900, active: true, timer: 0, interval: 4.5 },
      { id: 'mc_lg2', x1: 2350, y1: 3100, x2: 2650, y2: 3100, active: true, timer: 2.25, interval: 4.5 },
      { id: 'mc_lg3', x1: 3750, y1: 2300, x2: 3750, y2: 2700, active: true, timer: 1.0, interval: 4.0 },
      { id: 'mc_lg4', x1: 4300, y1: 2300, x2: 4300, y2: 2700, active: true, timer: 3.0, interval: 4.0 }
    ],
    powerupSpawns: [
      // Apex Center
      { x: 2500, y: 2500, type: 'crown_boost' },
      { x: 2500, y: 2050, type: 'super_orb' },
      { x: 2500, y: 2950, type: 'super_orb' },
      // North & South
      { x: 2500, y: 900, type: 'weapon_crate' },
      { x: 2500, y: 4300, type: 'weapon_crate' },
      { x: 2000, y: 900, type: 'heal' },
      { x: 3000, y: 900, type: 'shield' },
      { x: 2000, y: 4300, type: 'trishot' },
      { x: 3000, y: 4300, type: 'speed' },
      // West & East
      { x: 900, y: 2500, type: 'weapon_crate' },
      { x: 4100, y: 2500, type: 'weapon_crate' },
      { x: 900, y: 2000, type: 'shield' },
      { x: 900, y: 3000, type: 'heal' },
      { x: 4100, y: 2000, type: 'trishot' },
      { x: 4100, y: 3000, type: 'speed' },
      // Outer Quadrants
      { x: 1200, y: 1200, type: 'super_orb' },
      { x: 3800, y: 1200, type: 'weapon_crate' },
      { x: 1200, y: 3800, type: 'weapon_crate' },
      { x: 3800, y: 3800, type: 'super_orb' }
    ]
  }
};
