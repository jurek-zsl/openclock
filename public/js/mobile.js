const mobileQuery = window.matchMedia('(pointer: coarse)');
const portraitQuery = window.matchMedia('(orientation: portrait)');

function isMobileDevice() {
  return mobileQuery.matches || navigator.maxTouchPoints > 0;
}

async function lockLandscape({ fullscreen = false } = {}) {
  if (!isMobileDevice()) return false;

  if (fullscreen && !document.fullscreenElement && document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    } catch {
      // iOS and embedded browsers may not allow programmatic fullscreen.
    }
  }

  if (screen.orientation?.lock) {
    try {
      await screen.orientation.lock('landscape');
      return true;
    } catch {
      // Orientation locking generally requires an installed PWA or fullscreen.
    }
  }

  return !portraitQuery.matches;
}

function syncOrientationGate() {
  const gate = document.getElementById('orientation-gate');
  const mobile = isMobileDevice();
  const portrait = portraitQuery.matches;

  document.body.classList.toggle('mobile-device', mobile);
  document.body.classList.toggle('mobile-portrait', mobile && portrait);
  if (gate) gate.hidden = !mobile || !portrait;
}

function initLobbyTabs() {
  const scroller = document.querySelector('.lobby-columns');
  const tabs = [...document.querySelectorAll('.mobile-lobby-tab')];
  if (!scroller || tabs.length === 0) return;

  const sections = tabs.map((tab) => document.getElementById(tab.dataset.mobileLobbyTarget)).filter(Boolean);

  const selectTab = (index) => {
    tabs.forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', String(tabIndex === index));
      tab.tabIndex = tabIndex === index ? 0 : -1;
    });

    sections.forEach((section, sectionIndex) => {
      section.classList.toggle('mobile-active', sectionIndex === index);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      selectTab(index);
    });

    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });

  selectTab(0);
}

function initInstallPrompt() {
  const button = document.getElementById('btn-install-pwa');
  if (!button) return;

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    button.classList.remove('hidden');
  });

  button.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') button.classList.add('hidden');
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => button.classList.add('hidden'));
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((error) => {
      console.warn('PWA service worker registration failed:', error);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  syncOrientationGate();
  initLobbyTabs();
  initInstallPrompt();
  registerServiceWorker();

  const rotateButton = document.getElementById('btn-rotate-landscape');
  rotateButton?.addEventListener('click', async () => {
    const locked = await lockLandscape({ fullscreen: true });
    syncOrientationGate();
    if (!locked && portraitQuery.matches) {
      const copy = document.querySelector('.orientation-gate__copy');
      if (copy) copy.textContent = 'This browser cannot rotate automatically. Turn your device sideways to continue.';
    }
  });

  // Best effort on launch; browsers that require a gesture are retried after interaction.
  lockLandscape();
  document.addEventListener('pointerup', () => lockLandscape(), { once: true, passive: true });
});

portraitQuery.addEventListener?.('change', syncOrientationGate);
mobileQuery.addEventListener?.('change', syncOrientationGate);
window.addEventListener('orientationchange', syncOrientationGate);
document.addEventListener('fullscreenchange', () => {
  lockLandscape();
  syncOrientationGate();
});
