/**
 * Cyberpunk Vector Icon Library for OVERCLOCK
 * High-tech SVG vector icons matching the dark neon synthwave aesthetic
 */

export const icons = {
  // === WEAPON ICONS ===
  blaster: `<svg class="cyber-icon weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 13h11l3-4h4v6h-4l-3-2H7l-2 4H2l1-4z" fill="rgba(0, 247, 255, 0.2)"/>
    <line x1="17" y1="11" x2="22" y2="11" stroke="#00f7ff" stroke-width="2.5"/>
    <circle cx="9" cy="11" r="1.5" fill="#00f7ff"/>
  </svg>`,

  scatter: `<svg class="cyber-icon weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 13h10l4-3h6v6h-6l-4-3H5l-3 4z" fill="rgba(255, 0, 85, 0.2)"/>
    <line x1="18" y1="10" x2="23" y2="7" stroke="#ff0055"/>
    <line x1="19" y1="12" x2="24" y2="12" stroke="#ff0055" stroke-width="2"/>
    <line x1="18" y1="14" x2="23" y2="17" stroke="#ff0055"/>
  </svg>`,

  railgun: `<svg class="cyber-icon weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="10" width="18" height="4" rx="1" fill="rgba(0, 255, 102, 0.2)"/>
    <line x1="2" y1="8" x2="22" y2="8" stroke="#00ff66"/>
    <line x1="2" y1="16" x2="22" y2="16" stroke="#00ff66"/>
    <polygon points="17,6 23,12 17,18" fill="#00ff66"/>
    <line x1="7" y1="7" x2="7" y2="17" stroke="#00ff66"/>
    <line x1="12" y1="7" x2="12" y2="17" stroke="#00ff66"/>
  </svg>`,

  bouncing: `<svg class="cyber-icon weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5" fill="rgba(255, 230, 0, 0.25)"/>
    <path d="m3 19 6-6 4 4 8-10" stroke="#ffe600" stroke-width="2"/>
    <circle cx="21" cy="7" r="2.5" fill="#ffe600"/>
    <circle cx="9" cy="13" r="1.5" fill="#ffe600"/>
    <circle cx="13" cy="17" r="1.5" fill="#ffe600"/>
  </svg>`,

  rocket: `<svg class="cyber-icon weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="rgba(255, 136, 0, 0.25)"/>
    <circle cx="15" cy="9" r="1.5" fill="#ff8800"/>
  </svg>`,

  cryo: `<svg class="cyber-icon weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" stroke="#00e5ff"/>
    <line x1="2" y1="12" x2="22" y2="12" stroke="#00e5ff"/>
    <path d="m20 16-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4" stroke="#00e5ff"/>
    <circle cx="12" cy="12" r="2" fill="#00e5ff"/>
  </svg>`,

  flame: `<svg class="cyber-icon weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2c.5 3.5 3 5.5 5 8 2.5 3.2 2.5 7.5-.2 10.2A8 8 0 0 1 4.5 17c0-4 3.5-6.5 4.5-9 .8 2.5 2 3.5 3 3.5 0-3.5 0-7.5 0-9.5z" fill="rgba(255, 55, 0, 0.3)"/>
    <path d="M12 11c1 2 2 3 2 4.5a3 3 0 0 1-6 0c0-2 1.5-3.5 4-4.5z" fill="#ffaa00"/>
  </svg>`,

  seeker: `<svg class="cyber-icon weapon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9" stroke="#bf00ff" stroke-dasharray="3 3"/>
    <circle cx="12" cy="12" r="3" fill="#bf00ff"/>
    <polygon points="12,4 14,8 10,8" fill="#bf00ff"/>
    <polygon points="20,12 16,14 16,10" fill="#bf00ff"/>
    <polygon points="12,20 10,16 14,16" fill="#bf00ff"/>
    <polygon points="4,12 8,10 8,14" fill="#bf00ff"/>
  </svg>`,

  // === HUD & GAMEPLAY ICONS ===
  dash: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(255, 230, 0, 0.25)"/>
  </svg>`,

  superAbility: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" fill="rgba(191, 0, 255, 0.3)"/>
  </svg>`,

  eye: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3" fill="rgba(0, 247, 255, 0.4)"/>
    <circle cx="12" cy="12" r="1.2" fill="#fff"/>
  </svg>`,

  biohazard: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3" fill="#ff0055"/>
    <path d="M12 2a4 4 0 0 1 4 4c0 1.2-.5 2.3-1.3 3.1M12 2a4 4 0 0 0-4 4c0 1.2.5 2.3 1.3 3.1" stroke="#ff0055"/>
    <path d="M20.5 17a4 4 0 0 1-5.5.5c-.8-.7-1.3-1.8-1.3-3" stroke="#ff0055"/>
    <path d="M3.5 17a4 4 0 0 0 5.5.5c.8-.7 1.3-1.8 1.3-3" stroke="#ff0055"/>
    <circle cx="12" cy="12" r="8" stroke="#ff0055" stroke-dasharray="2 3"/>
  </svg>`,

  boss: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h16l-2 10-6 6-6-6L4 4z" fill="rgba(255, 0, 85, 0.3)"/>
    <circle cx="9" cy="9" r="1.5" fill="#ff0055"/>
    <circle cx="15" cy="9" r="1.5" fill="#ff0055"/>
    <line x1="8" y1="14" x2="16" y2="14" stroke="#ff0055" stroke-width="2"/>
  </svg>`,

  shield: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(0, 247, 255, 0.2)"/>
    <path d="M12 7v8M8 11h8"/>
  </svg>`,

  health: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="rgba(0, 255, 102, 0.25)"/>
  </svg>`,

  // Keyboard, UI & System Icons
  keyboard: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <line x1="6" y1="8" x2="6.01" y2="8" stroke-width="2.5"/>
    <line x1="10" y1="8" x2="10.01" y2="8" stroke-width="2.5"/>
    <line x1="14" y1="8" x2="14.01" y2="8" stroke-width="2.5"/>
    <line x1="18" y1="8" x2="18.01" y2="8" stroke-width="2.5"/>
    <line x1="8" y1="16" x2="16" y2="16"/>
  </svg>`,

  synth: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 12h3l2-6 3 12 3-9 2 6 2-3h5"/>
    <circle cx="10" cy="18" r="1" fill="currentColor"/>
    <circle cx="13" cy="9" r="1" fill="currentColor"/>
  </svg>`,

  sfx: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(0, 247, 255, 0.2)"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>`,

  sfxMuted: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>`,

  voice: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="rgba(0, 247, 255, 0.2)"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
  </svg>`,

  crt: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2.5"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
    <line x1="5" y1="8" x2="19" y2="8" stroke-dasharray="2 2" stroke-opacity="0.6"/>
  </svg>`,

  fullscreen: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3H4a1 1 0 0 0-1 1v4"/>
    <path d="M16 3h4a1 1 0 0 1 1 1v4"/>
    <path d="M8 21H4a1 1 0 0 1-1-1v-4"/>
    <path d="M16 21h4a1 1 0 0 0 1-1v-4"/>
  </svg>`,

  crown: `<svg class="cyber-icon crown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 19h20L19 7l-5 6-2-9-2 9-5-6-3 12z" fill="rgba(255, 230, 0, 0.25)"/>
    <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
    <line x1="2" y1="21" x2="22" y2="21" stroke-width="2"/>
  </svg>`,

  skull: `<svg class="cyber-icon skull-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C6.5 2 4 6 4 11c0 3.5 2 6 3 7v3h10v-3c1-1 3-3.5 3-7 0-5-2.5-9-8-9z" fill="rgba(255, 0, 85, 0.2)"/>
    <rect x="7" y="9" width="3.5" height="3" rx="1" fill="currentColor"/>
    <rect x="13.5" y="9" width="3.5" height="3" rx="1" fill="currentColor"/>
    <line x1="9" y1="18" x2="9" y2="21"/>
    <line x1="12" y1="18" x2="12" y2="21"/>
    <line x1="15" y1="18" x2="15" y2="21"/>
  </svg>`,

  hazard: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(255, 0, 85, 0.3)"/>
  </svg>`,

  crate: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" fill="rgba(255, 230, 0, 0.2)"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>`,

  refresh: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>`,

  trophy: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"/>
    <path d="M18 9h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3"/>
    <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" fill="rgba(255, 230, 0, 0.2)"/>
    <line x1="12" y1="16" x2="12" y2="20"/>
    <line x1="7" y1="20" x2="17" y2="20"/>
  </svg>`,

  elimination: `<svg class="cyber-icon elim-icon" viewBox="0 0 24 24" fill="none" stroke="#ff0055" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="4" y1="4" x2="20" y2="20"/>
    <line x1="20" y1="4" x2="4" y2="20"/>
    <circle cx="12" cy="12" r="2.5" fill="#ffe600" stroke="#ff0055"/>
  </svg>`,

  lock: `<svg class="cyber-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>`
};
