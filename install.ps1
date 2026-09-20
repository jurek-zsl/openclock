# ==============================================================================
#  ⚡ OPENCLOCK // ONE-LINER INSTALLER (Windows PowerShell)
#  Clones repo, installs Node.js & npm (if needed), installs deps,
#  and creates a Desktop shortcut with custom game branding.
# ==============================================================================

$ErrorActionPreference = "Stop"

# Colors
function Write-Cyan   { param($Text) Write-Host $Text -ForegroundColor Cyan }
function Write-Pink   { param($Text) Write-Host $Text -ForegroundColor Magenta }
function Write-Green  { param($Text) Write-Host $Text -ForegroundColor Green }
function Write-Yellow { param($Text) Write-Host $Text -ForegroundColor Yellow }
function Write-Red    { param($Text) Write-Host $Text -ForegroundColor Red }

Clear-Host
Write-Cyan @"
   ██████╗ ██╗   ██╗███████╗██████╗  ██████╗██╗      ██████╗  ██████╗██╗  ██╗
  ██╔═══██╗██║   ██║██╔════╝██╔══██╗██╔════╝██║     ██╔═══██╗██╔════╝██║ ██╔╝
  ██║   ██║██║   ██║█████╗  ██████╔╝██║     ██║     ██║   ██║██║     █████╔╝ 
  ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██║     ██║     ██║   ██║██║     ██╔═██╗ 
  ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║╚██████╗███████╗╚██████╔╝╚██████╗██║  ██╗
   ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
"@

Write-Yellow "  >>> INSTALLER FOR WINDOWS // FAST & AUTOMATED SETUP <<<"
Write-Host ""

$RepoUrl = "https://github.com/jurek-zsl/openclock.git"
$RepoZipUrl = "https://github.com/jurek-zsl/openclock/archive/refs/heads/main.zip"

$InstallDir = if ($env:OPENCLOCK_DIR) { 
    $env:OPENCLOCK_DIR 
} elseif (Test-Path ".\server\server.js") { 
    (Get-Item -Path ".").FullName 
} else { 
    Join-Path $env:USERPROFILE "openclock" 
}

# Refresh PATH from registry
function Refresh-EnvPath {
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$userPath;$machinePath"
}

# ------------------------------------------------------------------------------
# 1. Check / Install Node.js & npm
# ------------------------------------------------------------------------------
Write-Cyan "[1/4] Checking Node.js runtime..."

Refresh-EnvPath
$nodeFound = Get-Command "node" -ErrorAction SilentlyContinue

$needNode = $false
if ($nodeFound) {
    try {
        $nodeVer = & node -v
        $nodeMajor = [int]($nodeVer -replace '^v([0-9]+).*','$1')
        if ($nodeMajor -ge 18) {
            Write-Green "[✓] Node.js $nodeVer detected at $($nodeFound.Source)"
        } else {
            Write-Yellow "[!] Node.js version is too old ($nodeVer). Upgrading..."
            $needNode = $true
        }
    } catch {
        $needNode = $true
    }
} else {
    $needNode = $true
}

if ($needNode) {
    Write-Yellow "[i] Node.js not detected or outdated. Installing Node.js LTS..."
    
    $installedViaWinget = $false
    $wingetFound = Get-Command "winget" -ErrorAction SilentlyContinue
    if ($wingetFound) {
        Write-Cyan "[i] Attempting installation via winget..."
        try {
            & winget install --id OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
            Refresh-EnvPath
            $nodeCheck = Get-Command "node" -ErrorAction SilentlyContinue
            if ($nodeCheck) { $installedViaWinget = $true }
        } catch {
            Write-Yellow "[!] Winget install skipped or failed, falling back to direct download."
        }
    }

    if (-not $installedViaWinget) {
        Write-Cyan "[i] Downloading standalone Node.js LTS package..."
        $nodeVer = "v20.18.0"
        $zipUrl = "https://nodejs.org/dist/$nodeVer/node-$nodeVer-win-x64.zip"
        $tempZip = Join-Path $env:TEMP "node-lts.zip"
        $nodeTargetDir = Join-Path $env:USERPROFILE ".openclock-node"

        Write-Cyan "[i] Downloading from $zipUrl..."
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
        Invoke-WebRequest -Uri $zipUrl -OutFile $tempZip -UseBasicParsing

        Write-Cyan "[i] Extracting Node.js binaries..."
        $tempExtract = Join-Path $env:TEMP "node_extract"
        if (Test-Path $tempExtract) { Remove-Item $tempExtract -Recurse -Force }
        Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force

        $extractedFolder = Get-ChildItem $tempExtract | Where-Object { $_.PSIsContainer } | Select-Object -First 1
        if (Test-Path $nodeTargetDir) { Remove-Item $nodeTargetDir -Recurse -Force }
        Move-Item -Path $extractedFolder.FullName -Destination $nodeTargetDir -Force

        Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
        Remove-Item $tempExtract -Recurse -Force -ErrorAction SilentlyContinue

        # Add to User PATH
        $currentUserPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if ($currentUserPath -notlike "*$nodeTargetDir*") {
            [Environment]::SetEnvironmentVariable("Path", "$nodeTargetDir;$currentUserPath", "User")
        }
        $env:Path = "$nodeTargetDir;$env:Path"
    }

    Refresh-EnvPath
    $nodeVer = & node -v
    Write-Green "[✓] Node.js $nodeVer successfully installed."
}

$npmFound = Get-Command "npm" -ErrorAction SilentlyContinue
if (-not $npmFound) {
    Write-Red "[ERROR] npm could not be found in PATH. Please reopen PowerShell."
    exit 1
}
$npmVer = & npm -v
Write-Green "[✓] npm v$npmVer ready."

# ------------------------------------------------------------------------------
# 2. Clone or Update Project
# ------------------------------------------------------------------------------
Write-Host ""
Write-Cyan "[2/4] Setting up OpenClock in: $InstallDir"

$gitFound = Get-Command "git" -ErrorAction SilentlyContinue

if (Test-Path (Join-Path $InstallDir ".git")) {
    Write-Yellow "[i] Existing git repository detected. Fetching latest updates..."
    & git -C $InstallDir pull
} elseif (Test-Path $InstallDir) {
    Write-Yellow "[i] Directory already exists. Re-syncing files..."
    if ($gitFound) {
        Remove-Item -Path $InstallDir -Recurse -Force
        & git clone $RepoUrl $InstallDir
    } else {
        $tempZip = Join-Path $env:TEMP "openclock-main.zip"
        Invoke-WebRequest -Uri $RepoZipUrl -OutFile $tempZip -UseBasicParsing
        Expand-Archive -Path $tempZip -DestinationPath $InstallDir -Force
        Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
    }
} else {
    if ($gitFound) {
        Write-Cyan "[i] Cloning repository via Git..."
        & git clone $RepoUrl $InstallDir
    } else {
        Write-Cyan "[i] Git not detected. Downloading repository ZIP..."
        $tempZip = Join-Path $env:TEMP "openclock-main.zip"
        $tempExtract = Join-Path $env:TEMP "openclock_extract"
        if (Test-Path $tempExtract) { Remove-Item $tempExtract -Recurse -Force }

        Invoke-WebRequest -Uri $RepoZipUrl -OutFile $tempZip -UseBasicParsing
        Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force

        $extractedFolder = Get-ChildItem $tempExtract | Where-Object { $_.PSIsContainer } | Select-Object -First 1
        New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
        Copy-Item -Path "$($extractedFolder.FullName)\*" -Destination $InstallDir -Recurse -Force

        Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
        Remove-Item $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# ------------------------------------------------------------------------------
# 3. Install NPM Dependencies
# ------------------------------------------------------------------------------
Write-Host ""
Write-Cyan "[3/4] Installing project dependencies (express, ws, qrcode)..."
Push-Location $InstallDir
try {
    & npm install
    Write-Green "[✓] Dependencies installed successfully."
} finally {
    Pop-Location
}

# ------------------------------------------------------------------------------
# 4. Create Desktop Shortcut
# ------------------------------------------------------------------------------
Write-Host ""
Write-Cyan "[4/4] Creating Desktop shortcut..."

$desktopPath = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopPath "Overclock.lnk"
$batPath = Join-Path $InstallDir "Overclock.bat"
$icoPath = Join-Path $InstallDir "public\favicon.ico"

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = $batPath
$Shortcut.WorkingDirectory = $InstallDir
if (Test-Path $icoPath) {
    $Shortcut.IconLocation = "$icoPath,0"
}
$Shortcut.Description = "OVERCLOCK - High-Octane Cyberpunk LAN Arena"
$Shortcut.Save()
Write-Green "[✓] Created Desktop shortcut: $shortcutPath"

# Also create Overclock.bat on Desktop if desired as a direct clicker
$desktopBatPath = Join-Path $desktopPath "Launch-Overclock.bat"
@"
@echo off
cd /d "$InstallDir"
call "$batPath"
"@ | Set-Content -Path $desktopBatPath -Encoding ASCII
Write-Green "[✓] Created Desktop batch launcher: $desktopBatPath"

# ------------------------------------------------------------------------------
# Finished
# ------------------------------------------------------------------------------
Write-Host ""
Write-Green "======================================================================"
Write-Green "   ⚡ OVERCLOCK SUCCESSFULLY INSTALLED! ⚡"
Write-Green "======================================================================"
Write-Host ""
Write-Host "To start playing:"
Write-Host "  1. Double-click " -NoNewline; Write-Yellow "Overclock" -NoNewline; Write-Host " shortcut on your Desktop"
Write-Host "  2. Or run: " -NoNewline; Write-Cyan "cd `"$InstallDir`"; .\Overclock.bat"
Write-Host ""
Write-Host "Browser tab favicon & icon branding have been enabled."
Write-Host ""

$launch = Read-Host "Would you like to launch Overclock right now? (Y/N)"
if ($launch -match '^[Yy]') {
    Start-Process $shortcutPath
}
