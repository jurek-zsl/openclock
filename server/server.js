import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { getLocalIP, generateQRDataURL, printServerBanner } from './network-helper.js';
import { GameEngine, WEAPON_TYPES, MECH_CLASSES, GAME_MODES, BOT_DIFFICULTIES } from './game-engine.js';
import { MAPS } from './maps.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const HOST_PIN = '1510';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, '../public')));

app.get('/spectate', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/spectate.html'));
});

const localIP = getLocalIP();
let cachedQRDataUrl = null;

app.get('/api/info', async (req, res) => {
  const hostUrl = `http://${localIP}:${PORT}`;
  if (!cachedQRDataUrl) {
    cachedQRDataUrl = await generateQRDataURL(hostUrl);
  }
  res.json({
    localIP,
    port: PORT,
    url: hostUrl,
    qrCode: cachedQRDataUrl
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    maps: MAPS,
    weapons: WEAPON_TYPES,
    classes: MECH_CLASSES,
    gameModes: GAME_MODES,
    botDifficulties: BOT_DIFFICULTIES,
    mutators: engine.mutators,
    currentMap: engine.currentMapId,
    gameMode: engine.gameMode,
    botCount: engine.botCount,
    botDifficulty: engine.botDifficulty
  });
});

// Map of active client connections: socket -> { playerId, isHost, ip }
const clients = new Map();

function broadcast(snapshot) {
  const payload = JSON.stringify({ type: 'state', data: snapshot });
  for (const [ws] of clients.entries()) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

const engine = new GameEngine(broadcast);
let nextPlayerId = 1;

function isHostIp(ip) {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip === 'localhost' ||
    ip === localIP ||
    ip === `::ffff:${localIP}`
  );
}

wss.on('connection', (ws, req) => {
  const playerId = 'p_' + (nextPlayerId++);
  const rawIp = req.socket.remoteAddress || '';
  const isLocal = isHostIp(rawIp);

  let isGuestParam = false;
  try {
    const parsed = new URL(req.url, 'http://localhost');
    isGuestParam = parsed.searchParams.get('role') === 'guest';
  } catch (e) {}

  // Host if connected from server host IP OR if room has no active host (unless explicit test guest)
  const hasActiveHost = Array.from(clients.values()).some(c => c.isHost);
  let isHost = (isLocal || !hasActiveHost) && !isGuestParam;

  const clientInfo = { playerId, isHost, ip: rawIp };
  clients.set(ws, clientInfo);

  ws.send(JSON.stringify({
    type: 'welcome',
    playerId,
    isHost,
    maps: MAPS,
    gameModes: GAME_MODES,
    currentMap: engine.map,
    currentMapId: engine.currentMapId,
    gameMode: engine.gameMode,
    botCount: engine.botCount,
    botDifficulty: engine.botDifficulty,
    botDifficulties: BOT_DIFFICULTIES,
    mutators: engine.mutators,
    weapons: WEAPON_TYPES,
    classes: MECH_CLASSES
  }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);

      switch (msg.type) {
        case 'join': {
          engine.inLobby = false;
          const player = engine.addPlayer(
            playerId,
            msg.name,
            msg.color,
            msg.mechClass,
            msg.weapon,
            msg.title
          );
          ws.send(JSON.stringify({ type: 'joined', player, isHost: clientInfo.isHost }));
          break;
        }

        case 'input': {
          engine.handleInput(playerId, msg.data);
          break;
        }

        case 'super': {
          engine.handleInput(playerId, { super: true });
          break;
        }

        case 'parry': {
          engine.handleInput(playerId, { parry: true });
          break;
        }

        case 'emoji': {
          engine.handleInput(playerId, { emoji: msg.emoji });
          break;
        }

        case 'change_weapon': {
          engine.handleInput(playerId, { weapon: msg.weapon });
          break;
        }

        case 'set_mutator': {
          if (!clientInfo.isHost) {
            ws.send(JSON.stringify({ type: 'error', message: 'Only the Host can modify game mutators.' }));
            return;
          }
          engine.setMutator(msg.key, msg.value);
          break;
        }

        case 'return_to_lobby': {
          if (!clientInfo.isHost && !engine.podiumActive) {
            ws.send(JSON.stringify({ type: 'error', message: 'Only the Host can return to lobby during an active match.' }));
            return;
          }
          engine.returnToLobby();
          break;
        }

        case 'start_match': {
          if (!clientInfo.isHost) {
            ws.send(JSON.stringify({ type: 'error', message: 'Only the Host can start the match.' }));
            return;
          }
          engine.inLobby = false;
          engine.respawnAllPlayers();
          engine.initModeState();
          break;
        }

        // ================= HOST-ONLY ACTIONS =================
        case 'claim_host': {
          if (msg.pin === HOST_PIN) {
            clientInfo.isHost = true;
            ws.send(JSON.stringify({ type: 'host_promoted', isHost: true }));
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Incorrect Host Security PIN. Password is required.' }));
          }
          break;
        }

        case 'change_mode': {
          if (!clientInfo.isHost) {
            ws.send(JSON.stringify({ type: 'error', message: 'Only the Host can change the game mode.' }));
            return;
          }
          engine.setGameMode(msg.mode);
          break;
        }

        case 'change_map': {
          if (!clientInfo.isHost) {
            ws.send(JSON.stringify({ type: 'error', message: 'Only the Host can change the map.' }));
            return;
          }
          engine.loadMap(msg.mapId);
          const mapPayload = JSON.stringify({
            type: 'map_change',
            map: engine.map,
            mapId: engine.currentMapId
          });
          for (const [client] of clients.entries()) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(mapPayload);
            }
          }
          break;
        }

        case 'set_bots': {
          if (!clientInfo.isHost) {
            ws.send(JSON.stringify({ type: 'error', message: 'Only the Host can configure bots.' }));
            return;
          }
          engine.setBotCount(msg.count, msg.difficulty);
          break;
        }

        case 'set_bot_difficulty': {
          if (!clientInfo.isHost) {
            ws.send(JSON.stringify({ type: 'error', message: 'Only the Host can configure bots.' }));
            return;
          }
          engine.setBotDifficulty(msg.difficulty);
          break;
        }

        case 'host_action': {
          if (!clientInfo.isHost) {
            ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized: Host-only action.' }));
            return;
          }
          if (msg.action === 'sudden_death') engine.triggerSuddenDeath();
          else if (msg.action === 'mega_crate') engine.spawnMegaCrate();
          else if (msg.action === 'reset_scores') engine.resetScores();
          break;
        }

        case 'ping': {
          ws.send(JSON.stringify({ type: 'pong', clientTime: msg.time }));
          break;
        }
      }
    } catch (e) {
      console.error('Error handling socket message:', e);
    }
  });

  ws.on('close', () => {
    const wasHost = clientInfo.isHost;
    engine.removePlayer(playerId);
    clients.delete(ws);

    // If the host left and other clients exist, promote the next connected client
    if (wasHost && clients.size > 0) {
      for (const [nextWs, nextClient] of clients.entries()) {
        if (nextWs.readyState === WebSocket.OPEN) {
          nextClient.isHost = true;
          nextWs.send(JSON.stringify({ type: 'host_promoted', isHost: true }));
          break;
        }
      }
    }
  });

  ws.on('error', (err) => {
    console.error(`Socket error on client ${playerId}:`, err);
  });
});

server.listen(PORT, '0.0.0.0', async () => {
  await printServerBanner(PORT, localIP);
  console.log(` 🔑 Host Security PIN: ${HOST_PIN} (required to claim host privileges)\n`);
});
