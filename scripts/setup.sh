#!/usr/bin/env bash
# Greeny portfolio - first-run setup (macOS / Linux)
# Usage: bash scripts/setup.sh
set -euo pipefail

say() { printf '\033[32m==> %s\033[0m\n' "$1"; }
warn() { printf '\033[33m!!  %s\033[0m\n' "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }

say "Checking Node.js"
if ! have node; then
  warn "Node.js not found. Install Node 22+ (https://nodejs.org) and re-run."
  exit 1
fi
NODE_VERSION="$(node -v | sed 's/^v//')"
say "Node $NODE_VERSION"
if [ "$(echo "$NODE_VERSION" | cut -d. -f1)" -lt 22 ]; then
  warn "HyperFrames needs Node 22+. The website itself is static and runs anywhere."
fi

say "Checking Git"
if have git; then git --version; else warn "Install Git (https://git-scm.com)."; fi

say "Checking FFmpeg (video skills only)"
if have ffmpeg; then
  ffmpeg -version | head -n 1
else
  if have brew; then
    say "Installing FFmpeg with Homebrew"
    brew install ffmpeg
  elif have apt-get; then
    say "Installing FFmpeg with apt"
    sudo apt-get update && sudo apt-get install -y ffmpeg
  else
    warn "Install FFmpeg manually: https://ffmpeg.org/download.html"
  fi
fi

say "Checking Chrome or Chromium (Hallmark browser checks)"
CHROME=""
for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/usr/bin/google-chrome" \
  "/usr/bin/google-chrome-stable" \
  "/usr/bin/chromium" \
  "/usr/bin/chromium-browser" \
  "$HOME/.cache/puppeteer/chrome"; do
  if [ -e "$candidate" ]; then CHROME="$candidate"; break; fi
done
if [ -n "$CHROME" ]; then
  say "Browser found: $CHROME"
elif have brew; then
  say "Installing Google Chrome with Homebrew"
  brew install --cask google-chrome
else
  warn "Install Google Chrome or Chromium."
fi

say "Checking puppeteer-core (Hallmark screenshots)"
if npm root -g | xargs -I{} test -d "{}/puppeteer-core"; then
  say "puppeteer-core present"
else
  say "Installing puppeteer-core globally"
  npm install -g puppeteer-core
fi

say "Checking repo skills"
SKILL_COUNT="$(find .agents/skills -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')"
if [ "${SKILL_COUNT:-0}" -gt 0 ]; then
  say "$SKILL_COUNT skills already vendored in .agents/skills (nothing to install)"
else
  warn "Skills missing. Restore them with: npx skills@latest experimental_install"
fi

say "Configuring Codex skill budget"
CODEX_DIR="$HOME/.codex"
CODEX_CONFIG="$CODEX_DIR/config.toml"
mkdir -p "$CODEX_DIR"
if [ -f "$CODEX_CONFIG" ] && grep -Eq '^[[:space:]]*\[skills\]' "$CODEX_CONFIG"; then
  say "Codex skill budget already configured"
else
  printf '\n[skills]\nmax_context_tokens = 10000\n' >> "$CODEX_CONFIG"
  say "Added [skills] max_context_tokens = 10000 to $CODEX_CONFIG"
fi

say "Setup complete."
printf '\n\033[36mServe the site:   npx serve .\033[0m\n'
printf '\033[36mOpen:             http://localhost:3000\033[0m\n'
printf '\033[36mDeploy:           push to main, then GitHub repo Settings > Pages > Deploy from a branch > main / (root)\033[0m\n'
printf '\033[36mUpdate skills:    npx skills@latest update -p -y\033[0m\n'
