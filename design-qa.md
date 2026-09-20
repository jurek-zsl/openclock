# Mobile Design QA

- Source visual truth: `/Users/jurekzsl/Downloads/IMG_4684.PNG` (lobby) and `/Users/jurekzsl/Downloads/IMG_4685.PNG` (combat HUD)
- Implementation: `http://localhost:3001/`
- Browser-rendered evidence: Codex in-app browser capture at 844 × 390 CSS px (landscape phone)
- Source pixels: 2436 × 1125 each, representing an approximately 1218 × 562.5 CSS-pixel @2x capture
- Implementation pixels: 844 × 390 at device scale factor 1
- Density normalization: compared by matching the 2.165:1 landscape aspect ratio and app-owned content regions rather than raw pixel density
- State: lobby, loadout navigation, deployed combat HUD, host controls, and touch controls

## Full-view comparison evidence

The source lobby is vertically centered while taller than the viewport, so its top is unreachable and the user lands midway through the setup flow. The updated lobby starts at the safe-area top, uses a horizontally paged section layout at phone widths, keeps the current/next section visibly discoverable, and scrolls vertically without document-level horizontal overflow.

The source combat HUD stacks desktop status, leaderboard, weapon dock, and touch controls over the same lower area. The updated combat view reserves the top edge for status, leaderboard, and host controls; the bottom center for the weapon dock; and the lower corners for the two joysticks and action buttons. At 844 × 390, all persistent controls remained inside the viewport without collisions.

## Focused region comparison evidence

- Lobby header and first task: network/server status, product title, mobile section tabs, and Hangar begin at y=8; the first tab target is 44px high.
- Loadout: the nickname input renders at 16px to prevent iOS focus zoom; deploy remains a 50px action.
- Combat lower edge: eight compact weapon slots fit between the joystick zones.
- Combat upper edge: the compact player card, leaderboard, fullscreen, and host controls remain reachable without obscuring the arena center.

## Required fidelity surfaces

- Fonts and typography: Orbitron and Rajdhani remain unchanged. Mobile sizes are reduced only in dense HUD labels; form text is raised to 16px.
- Spacing and layout rhythm: existing neon panels, radii, borders, and grouping are preserved. Safe-area insets now anchor every viewport edge.
- Colors and visual tokens: the existing cyan, yellow, pink, purple, and dark-panel tokens remain unchanged.
- Image quality and asset fidelity: existing canvas-rendered arena, mech artwork, and LAN QR asset are unchanged.
- Copy and content: game content is unchanged. Only the landscape guidance, install action, and mobile lobby navigation labels were added.

## Comparison history

1. Earlier P1: lobby top clipped on short landscape viewports. Fix: top-aligned scroll container, dynamic viewport units, safe-area padding, and compact short-height rules. Post-fix evidence: lobby card top at 8px with no page-level horizontal overflow at 844 × 390.
2. Earlier P1: player card, weapon dock, and touch controls collided. Fix: compact upper status regions, bottom-center weapon dock, corner joystick zones, and minimap/killfeed removal on touch layouts. Post-fix evidence: deployed 844 × 390 capture shows distinct, non-overlapping zones.
3. Earlier P2: small touch targets and iOS input zoom risk. Fix: 44px minimum interactive targets, 50px primary action, 16px mobile form text, visible focus rings, and reduced-motion support. Post-fix evidence: computed first tab height is 44px and nickname input is 16px.
4. Follow-up P1: the base universal selector still applied `touch-action: none`, blocking native swipe scrolling on descendants. Fix: gesture blocking is now scoped to the game canvas and joystick surfaces, while lobby and modal scrollers explicitly allow `pan-x pan-y` with momentum scrolling. Post-fix evidence: at 844 × 390, an actual browser scroll moved the lobby from `scrollTop: 0` to `537`.

## Findings

No actionable P0, P1, or P2 visual differences remain for the requested mobile optimization. Browser orientation locking remains platform-controlled; the installed PWA declares landscape, supported browsers request a landscape lock, and unsupported browsers receive a clear rotate prompt.

## Implementation checklist

- [x] Landscape-first PWA manifest
- [x] Offline app-shell service worker
- [x] Mobile safe-area and dynamic viewport support
- [x] Phone lobby navigation and reachable vertical flow
- [x] Collision-free landscape combat HUD with host controls
- [x] Touch target, focus, zoom, and reduced-motion safeguards
- [x] Primary lobby-to-match flow tested
- [x] Vertical mobile scrolling tested with a browser gesture
- [x] Browser console checked with no warnings or errors

final result: passed
