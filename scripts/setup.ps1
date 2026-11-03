# Greeny portfolio - first-run setup (Windows)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
$ErrorActionPreference = "Stop"

function Say($m) { Write-Host "==> $m" -ForegroundColor Green }
function Warn($m) { Write-Host "!!  $m" -ForegroundColor Yellow }
function Have($c) { return $null -ne (Get-Command $c -ErrorAction SilentlyContinue) }

Say "Checking Node.js"
if (-not (Have node)) {
  Warn "Node.js not found. Install Node 22 or newer from https://nodejs.org, then re-run."
  exit 1
}
$nodeVersion = (node -v).TrimStart('v')
Say "Node $nodeVersion"
if ([int]($nodeVersion.Split('.')[0]) -lt 22) {
  Warn "HyperFrames needs Node 22+. The website itself is static and runs anywhere."
}

Say "Checking Git"
if (Have git) { Say ((git --version)) } else { Warn "Git missing. Install from https://git-scm.com." }

Say "Checking FFmpeg (video skills only)"
if (Have ffmpeg) {
  Say ((ffmpeg -version | Select-Object -First 1))
} elseif (Have winget) {
  Say "Installing FFmpeg with winget"
  winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements --disable-interactivity
  Warn "Open a new terminal after setup so FFmpeg is on PATH."
} else {
  Warn "Install FFmpeg manually: https://ffmpeg.org/download.html"
}

Say "Checking Google Chrome (Hallmark browser checks)"
$chromePaths = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($chrome) {
  Say "Chrome found: $chrome"
} elseif (Have winget) {
  Say "Installing Google Chrome with winget"
  winget install --id Google.Chrome -e --accept-source-agreements --accept-package-agreements --disable-interactivity
} else {
  Warn "Install Google Chrome from https://www.google.com/chrome/."
}

Say "Checking puppeteer-core (Hallmark screenshots)"
$npmGlobalRoot = (npm root -g).Trim()
if (Test-Path (Join-Path $npmGlobalRoot "puppeteer-core")) {
  Say "puppeteer-core present"
} else {
  Say "Installing puppeteer-core globally"
  npm install -g puppeteer-core
}

Say "Checking repo skills"
$skillCount = (Get-ChildItem -Directory .agents\skills -ErrorAction SilentlyContinue | Measure-Object).Count
if ($skillCount -gt 0) {
  Say "$skillCount skills already vendored in .agents/skills (nothing to install)"
} else {
  Warn "Skills missing. Restore them with: npx skills@latest experimental_install"
}

Say "Configuring Codex skill budget"
$codexDir = Join-Path $env:USERPROFILE ".codex"
$codexConfig = Join-Path $codexDir "config.toml"
if (-not (Test-Path $codexDir)) { New-Item -ItemType Directory -Force -Path $codexDir | Out-Null }
$configText = if (Test-Path $codexConfig) { Get-Content $codexConfig -Raw } else { "" }
if ($configText -notmatch "(?m)^\s*\[skills\]") {
  Add-Content -Path $codexConfig -Value "`n[skills]`nmax_context_tokens = 10000`n"
  Say "Added [skills] max_context_tokens = 10000 to $codexConfig"
} else {
  Say "Codex skill budget already configured"
}

Say "Setup complete."
Write-Host ""
Write-Host "Serve the site:   npx serve ." -ForegroundColor Cyan
Write-Host "Open:             http://localhost:3000" -ForegroundColor Cyan
Write-Host "Deploy:           push to main, then GitHub repo Settings > Pages > Deploy from a branch > main / (root)" -ForegroundColor Cyan
Write-Host "Update skills:    npx skills@latest update -p -y" -ForegroundColor Cyan
