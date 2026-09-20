#!/usr/bin/env bash
cd "$(dirname "$0")"

# Configure PATH for Node
export PATH="/usr/local/bin:/opt/homebrew/bin:$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin:$PATH"

clear
echo -e "\033[1;36m"
echo "   ██████╗ ██╗   ██╗███████╗██████╗  ██████╗██╗      ██████╗  ██████╗██╗  ██╗"
echo "  ██╔═══██╗██║   ██║██╔════╝██╔══██╗██╔════╝██║     ██╔═══██╗██╔════╝██║ ██╔╝"
echo "  ██║   ██║██║   ██║█████╗  ██████╔╝██║     ██║     ██║   ██║██║     █████╔╝ "
echo "  ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██║     ██║     ██║   ██║██║     ██╔═██╗ "
echo "  ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║╚██████╗███████╗╚██████╔╝╚██████╗██║  ██╗"
echo "   ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝"
echo -e "\033[0m"
echo -e "\033[1;33m  >>> HIGH-OCTANE CYBERPUNK MULTIPLAYER ARENA // V3.0 <<<\033[0m"
echo ""

# Find Node
NODE_BIN="$(which node 2>/dev/null || true)"
if [ -z "$NODE_BIN" ]; then
  for candidate in /opt/homebrew/bin/node /usr/local/bin/node /usr/bin/node; do
    if [ -x "$candidate" ]; then
      NODE_BIN="$candidate"
      break
    fi
  done
fi

if [ -z "$NODE_BIN" ]; then
  echo -e "\033[1;31m[ERROR] Node.js is not installed!\033[0m"
  echo "Please install Node.js from https://nodejs.org/ to run the game."
  read -p "Press enter to exit..."
  exit 1
fi

# Detect Local IP
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo -e "\033[1;32m[✓] Node.js Runtime detected:\033[0m $("$NODE_BIN" -v)"
echo -e "\033[1;35m[👑 HOST URL]:\033[0m      http://localhost:3000"
echo -e "\033[1;36m[🌐 SCHOOL LAN]:\033[0m    http://${LOCAL_IP}:3000"
echo ""
echo -e "\033[1;33m[TIP]: Share the School LAN link above with classmates on the same Wi-Fi!\033[0m"
echo "Opening browser in 1 second..."
echo ""

# Launch Browser
(sleep 0.8 && open "http://localhost:3000") &

# Start Server
exec "$NODE_BIN" server/server.js
