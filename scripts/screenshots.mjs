// Dev helper: capture the portfolio at review sizes with system Chrome.
// Usage: node scripts/screenshots.mjs [outDir]
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

function loadPuppeteer() {
  const roots = [process.cwd()];
  try {
    roots.push(execSync("npm root -g", { encoding: "utf8" }).trim());
  } catch {}
  for (const root of roots) {
    try {
      return createRequire(join(root, "noop.js"))("puppeteer-core");
    } catch {}
  }
  console.error("puppeteer-core not found (local or global). Run: npm install -g puppeteer-core");
  process.exit(1);
}

const puppeteer = loadPuppeteer();

const chrome =
  process.env.CHROME_PATH ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  ].find((p) => existsSync(p));

if (!chrome) {
  console.error("Chrome not found. Set CHROME_PATH.");
  process.exit(1);
}

const out = process.argv[2] || "screenshots";
await mkdir(out, { recursive: true });

const BASE = process.env.SITE_URL || "http://localhost:3000";
const greeny = `${BASE}/projects/greeny/`;
const moti = `${BASE}/projects/moti-pulse/`;

const shots = [
  { name: "home-hero", url: `${BASE}/`, width: 1280, height: 800 },
  { name: "home-full", url: `${BASE}/`, width: 1280, height: 800, fullPage: true },
  { name: "home-wide", url: `${BASE}/`, width: 1920, height: 1080 },
  { name: "home-mobile", url: `${BASE}/`, width: 390, height: 844 },
  { name: "home-mobile-360", url: `${BASE}/`, width: 360, height: 780 },
  { name: "desktop-hero", url: greeny, width: 1280, height: 800, hash: "" },
  { name: "desktop-brief", url: greeny, width: 1280, height: 800, hash: "#brief" },
  { name: "desktop-system", url: greeny, width: 1280, height: 800, hash: "#system" },
  { name: "desktop-ui", url: greeny, width: 1280, height: 800, hash: "#ui" },
  { name: "desktop-ui-components", url: greeny, width: 1280, height: 800, hash: "#ui", offset: 640 },
  { name: "desktop-interface", url: greeny, width: 1280, height: 800, hash: "#interface" },
  { name: "desktop-brand", url: greeny, width: 1280, height: 800, hash: "#brand" },
  { name: "tablet-hero", url: greeny, width: 768, height: 1024, hash: "" },
  { name: "mobile-hero", url: greeny, width: 390, height: 844, hash: "" },
  { name: "mobile-interface", url: greeny, width: 390, height: 844, hash: "#interface" },
  { name: "moti-hero", url: moti, width: 1280, height: 800 },
  { name: "moti-full", url: moti, width: 1280, height: 800, fullPage: true },
  { name: "moti-research", url: moti, width: 1280, height: 800, hash: "#research" },
  { name: "moti-personas", url: moti, width: 1280, height: 800, hash: "#personas" },
  { name: "moti-interface", url: moti, width: 1280, height: 800, hash: "#interface" },
  { name: "moti-mobile", url: moti, width: 390, height: 844 },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  for (const shot of shots) {
    await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 1 });
    await page.goto(shot.url + (shot.hash || ""), { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.documentElement.style.scrollBehavior = "auto";
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      await new Promise((resolve) => setTimeout(resolve, 750));
    });
    if (shot.hash) {
      await page.evaluate((offset) => {
        const target = document.querySelector(location.hash);
        if (target) window.scrollTo(0, target.offsetTop - 72 + offset);
      }, shot.offset || 0);
    } else {
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await page.screenshot({ path: `${out}/${shot.name}.png`, fullPage: Boolean(shot.fullPage) });
    console.log(`${shot.name} ${shot.width}x${shot.height}`);
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(`horizontal overflow: ${overflow}px`);
  if (errors.length) console.log("console errors:\n" + errors.join("\n"));
} finally {
  await browser.close();
}
