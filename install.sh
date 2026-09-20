#!/usr/bin/env bash
# ==============================================================================
#  ⚡ OPENCLOCK // ONE-LINER INSTALLER (macOS)
#  Clones repo, installs Node.js & npm (if needed), installs deps,
#  and creates Desktop shortcuts with custom game branding.
# ==============================================================================

set -e

# ANSI Color Codes
CYAN='\033[1;36m'
PINK='\033[1;35m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m' # No Color

clear 2>/dev/null || true
echo -e "${CYAN}"
echo "   ██████╗ ██╗   ██╗███████╗██████╗  ██████╗██╗      ██████╗  ██████╗██╗  ██╗"
echo "  ██╔═══██╗██║   ██║██╔════╝██╔══██╗██╔════╝██║     ██╔═══██╗██╔════╝██║ ██╔╝"
echo "  ██║   ██║██║   ██║█████╗  ██████╔╝██║     ██║     ██║   ██║██║     █████╔╝ "
echo "  ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██║     ██║     ██║   ██║██║     ██╔═██╗ "
echo "  ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║╚██████╗███████╗╚██████╔╝╚██████╗██║  ██╗"
echo "   ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${YELLOW}  >>> INSTALLER FOR MACOS // FAST & AUTOMATED SETUP <<<${NC}"
echo ""

REPO_URL="https://github.com/jurek-zsl/openclock.git"
REPO_ZIP_URL="https://github.com/jurek-zsl/openclock/archive/refs/heads/main.tar.gz"

if [ -n "$OPENCLOCK_DIR" ]; then
  INSTALL_DIR="$OPENCLOCK_DIR"
elif [ -f "$(pwd)/server/server.js" ]; then
  INSTALL_DIR="$(pwd)"
else
  INSTALL_DIR="$HOME/openclock"
fi

# ------------------------------------------------------------------------------
# 1. Check / Install Node.js & npm
# ------------------------------------------------------------------------------
echo -e "${CYAN}[1/4] Checking Node.js runtime...${NC}"

# Add common Node paths
export PATH="$HOME/.openclock-node/bin:$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
if [ -d "$HOME/.nvm/versions/node" ]; then
  LATEST_NVM="$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -n 1 || true)"
  if [ -n "$LATEST_NVM" ]; then
    export PATH="$HOME/.nvm/versions/node/$LATEST_NVM/bin:$PATH"
  fi
fi

NODE_BIN="$(which node 2>/dev/null || true)"
NEED_NODE=0

if [ -n "$NODE_BIN" ]; then
  NODE_MAJOR="$("$NODE_BIN" -v 2>/dev/null | sed -E 's/v([0-9]+).*/\1/' || echo 0)"
  if [ "$NODE_MAJOR" -ge 18 ]; then
    echo -e "${GREEN}[✓] Node.js $("$NODE_BIN" -v) detected at $NODE_BIN${NC}"
  else
    echo -e "${YELLOW}[!] Node.js version is too old ($("$NODE_BIN" -v)). Upgrading...${NC}"
    NEED_NODE=1
  fi
else
  NEED_NODE=1
fi

if [ "$NEED_NODE" -eq 1 ]; then
  echo -e "${YELLOW}[i] Node.js not found or outdated. Installing Node.js LTS...${NC}"
  
  if which brew >/dev/null 2>&1; then
    echo -e "${CYAN}[i] Using Homebrew to install Node.js...${NC}"
    brew install node || true
  fi

  # Re-check node
  NODE_BIN="$(which node 2>/dev/null || true)"
  if [ -z "$NODE_BIN" ]; then
    echo -e "${CYAN}[i] Downloading standalone Node.js LTS binaries (no sudo required)...${NC}"
    ARCH="$(uname -m)"
    if [ "$ARCH" = "arm64" ]; then
      NODE_DIST_ARCH="darwin-arm64"
    else
      NODE_DIST_ARCH="darwin-x64"
    fi

    NODE_VERSION="v20.18.0"
    NODE_TAR="node-${NODE_VERSION}-${NODE_DIST_ARCH}.tar.gz"
    NODE_URL="https://nodejs.org/dist/${NODE_VERSION}/${NODE_TAR}"

    TMP_DIR="$(mktemp -d)"
    echo -e "${CYAN}[i] Downloading from $NODE_URL...${NC}"
    curl -fsSL "$NODE_URL" -o "$TMP_DIR/$NODE_TAR"
    
    mkdir -p "$HOME/.openclock-node"
    tar -xzf "$TMP_DIR/$NODE_TAR" -C "$HOME/.openclock-node" --strip-components=1
    rm -rf "$TMP_DIR"

    export PATH="$HOME/.openclock-node/bin:$PATH"
    NODE_BIN="$HOME/.openclock-node/bin/node"

    # Persist in shell profile
    for PROFILE in "$HOME/.zshrc" "$HOME/.bash_profile"; do
      if [ -f "$PROFILE" ] && ! grep -q ".openclock-node/bin" "$PROFILE"; then
        echo 'export PATH="$HOME/.openclock-node/bin:$PATH"' >> "$PROFILE"
      fi
    done
  fi

  echo -e "${GREEN}[✓] Successfully installed Node.js $("$NODE_BIN" -v)${NC}"
fi

NPM_BIN="$(which npm 2>/dev/null || true)"
if [ -z "$NPM_BIN" ]; then
  echo -e "${RED}[ERROR] npm could not be located in PATH.${NC}"
  exit 1
fi
echo -e "${GREEN}[✓] npm $($NPM_BIN -v) ready.${NC}"

# ------------------------------------------------------------------------------
# 2. Clone or Update Project
# ------------------------------------------------------------------------------
echo ""
echo -e "${CYAN}[2/4] Setting up OpenClock in: $INSTALL_DIR${NC}"

if [ -d "$INSTALL_DIR/.git" ]; then
  echo -e "${YELLOW}[i] Existing git repository detected. Fetching latest changes...${NC}"
  git -C "$INSTALL_DIR" pull --ff-only || true
elif [ -d "$INSTALL_DIR" ]; then
  echo -e "${YELLOW}[i] Directory $INSTALL_DIR exists. Updating files...${NC}"
  if which git >/dev/null 2>&1; then
    rm -rf "$INSTALL_DIR"
    git clone "$REPO_URL" "$INSTALL_DIR"
  else
    curl -fsSL "$REPO_ZIP_URL" | tar -xz -C "$INSTALL_DIR" --strip-components=1
  fi
else
  if which git >/dev/null 2>&1; then
    echo -e "${CYAN}[i] Cloning via Git...${NC}"
    git clone "$REPO_URL" "$INSTALL_DIR"
  else
    echo -e "${CYAN}[i] Git not found. Downloading repository package...${NC}"
    mkdir -p "$INSTALL_DIR"
    curl -fsSL "$REPO_ZIP_URL" | tar -xz -C "$INSTALL_DIR" --strip-components=1
  fi
fi

# Ensure launcher is executable
chmod +x "$INSTALL_DIR/start-mac.command"

# ------------------------------------------------------------------------------
# 3. Install NPM Dependencies
# ------------------------------------------------------------------------------
echo ""
echo -e "${CYAN}[3/4] Installing project dependencies (express, ws, qrcode)...${NC}"
(cd "$INSTALL_DIR" && "$NPM_BIN" install)
echo -e "${GREEN}[✓] Dependencies installed successfully.${NC}"

# ------------------------------------------------------------------------------
# 4. Create Desktop Shortcuts
# ------------------------------------------------------------------------------
echo ""
echo -e "${CYAN}[4/4] Creating Desktop shortcuts...${NC}"

# Detect Desktop Directory
DESKTOP_DIR="$HOME/Desktop"
if [ ! -d "$DESKTOP_DIR" ]; then
  DESKTOP_DIR="$(osascript -e 'tell application "Finder" to get POSIX path of (path to desktop folder)' 2>/dev/null || echo "$HOME/Desktop")"
fi

# 1. Create .command file on Desktop
COMMAND_SHORTCUT="$DESKTOP_DIR/OpenClock.command"
cat << EOF > "$COMMAND_SHORTCUT"
#!/usr/bin/env bash
cd "$INSTALL_DIR"
exec ./start-mac.command
EOF
chmod +x "$COMMAND_SHORTCUT"
echo -e "${GREEN}[✓] Created: $COMMAND_SHORTCUT${NC}"

# 2. Create native macOS .app bundle with game icon if osacompile exists
if which osacompile >/dev/null 2>&1; then
  APP_PATH="$DESKTOP_DIR/OpenClock.app"
  rm -rf "$APP_PATH"
  osacompile -o "$APP_PATH" -e "tell application \"Terminal\" to do script \"cd \\\"$INSTALL_DIR\\\" && ./start-mac.command\"" 2>/dev/null || true
  
  if [ -f "$INSTALL_DIR/public/favicon.icns" ] && [ -d "$APP_PATH/Contents/Resources" ]; then
    cp "$INSTALL_DIR/public/favicon.icns" "$APP_PATH/Contents/Resources/applet.icns"
    touch "$APP_PATH"
    echo -e "${GREEN}[✓] Created Native App with Cyberpunk Icon: $APP_PATH${NC}"
  fi
fi

# ------------------------------------------------------------------------------
# Installation Finished
# ------------------------------------------------------------------------------
echo ""
echo -e "${GREEN}======================================================================${NC}"
echo -e "${GREEN}   ⚡ OVERCLOCK SUCCESSFULLY INSTALLED! ⚡${NC}"
echo -e "${GREEN}======================================================================${NC}"
echo ""
echo -e "To start playing:"
echo -e "  1. Double-click ${YELLOW}OpenClock.command${NC} (or ${YELLOW}OpenClock.app${NC}) on your Desktop"
echo -e "  2. Or run: ${CYAN}cd \"$INSTALL_DIR\" && ./start-mac.command${NC}"
echo ""
echo -e "Browser tab favicon & icon branding have been enabled."
echo ""

# Ask to launch immediately if running in an interactive terminal
if [ -t 0 ] || [ -c /dev/tty ]; then
  read -p "Would you like to start Overclock right now? (y/n) " -n 1 -r </dev/tty || true
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$INSTALL_DIR"
    exec ./start-mac.command
  fi
fi
