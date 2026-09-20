import os from 'os';
import QRCode from 'qrcode';

/**
 * Detect the primary local network IPv4 address (e.g. Wi-Fi / Ethernet on school LAN)
 */
export function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Must be IPv4 and not internal/loopback
      const isIPv4 = net.family === 'IPv4' || net.family === 4;
      if (isIPv4 && !net.internal) {
        // Boost priority for standard wireless/ethernet interface names
        const lower = name.toLowerCase();
        let priority = 1;
        if (lower.includes('en0') || lower.includes('wlan0') || lower.includes('wi-fi')) priority = 3;
        else if (lower.includes('en') || lower.includes('eth')) priority = 2;

        candidates.push({ address: net.address, priority, name });
      }
    }
  }

  // Sort candidates by priority descending
  candidates.sort((a, b) => b.priority - a.priority);

  return candidates.length > 0 ? candidates[0].address : 'localhost';
}

/**
 * Generate a QR code as a base64 Data URL (SVG/PNG) for browser rendering
 */
export async function generateQRDataURL(url) {
  try {
    return await QRCode.toDataURL(url, {
      margin: 1,
      width: 250,
      color: {
        dark: '#00f7ff',
        light: '#070b19'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return null;
  }
}

/**
 * Generate terminal ASCII / unicode QR code
 */
export async function generateTerminalQR(url) {
  try {
    return await QRCode.toString(url, { type: 'terminal', small: true });
  } catch (err) {
    return '';
  }
}

/**
 * Print a vibrant terminal banner with the game status and join info
 */
export async function printServerBanner(port, localIP) {
  const localUrl = `http://localhost:${port}`;
  const networkUrl = `http://${localIP}:${port}`;
  const termQR = await generateTerminalQR(networkUrl);

  console.log('\n============================================================');
  console.log('   ⚡⚡ NEON CLASH: SCHOOL ARENA MULTIPLAYER SERVER ⚡⚡');
  console.log('============================================================');
  console.log(` 🎮 Host Machine:   ${localUrl}`);
  console.log(` 🚀 Classmates LAN: ${networkUrl}`);
  console.log('------------------------------------------------------------');
  console.log(' Classmates on the same school Wi-Fi can join instantly:');
  console.log(' 1. Open the URL above on their laptop/Chromebook');
  console.log(' 2. OR scan this QR code with their phone camera:\n');
  if (termQR) {
    console.log(termQR);
  }
  console.log('============================================================\n');
}
