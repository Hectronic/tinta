// Capturas del editor para la documentación.
// Uso: NODE_PATH=/ruta/a/node_modules node scripts/capturas.mjs
// SPDX-License-Identifier: GPL-3.0-or-later

import { spawn } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

function loadPuppeteer() {
  const anchor = process.env.PUPPETEER_CORE || "/tmp/tinta-shot/package.json";
  if (!fs.existsSync(anchor)) {
    throw new Error("Instala puppeteer-core y apunta PUPPETEER_CORE a su package.json. Ver docs/desarrollo.md");
  }
  return createRequire(anchor)("puppeteer-core");
}

const puppeteer = loadPuppeteer();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "screenshots");
const chrome = process.env.CHROME || "/usr/bin/google-chrome";
const port = 8765;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Une puntos de control con un arco de coseno, para que el trazo
// parezca una firma y no una polilínea.
function smooth(controls, steps = 10) {
  const out = [];
  for (let i = 0; i < controls.length - 1; i++) {
    const [x0, y0] = controls[i];
    const [x1, y1] = controls[i + 1];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const u = (1 - Math.cos(t * Math.PI)) / 2;
      out.push([x0 + (x1 - x0) * u, y0 + (y1 - y0) * u]);
    }
  }
  out.push(controls[controls.length - 1]);
  return out;
}

function signatureAt(x, y, w, h) {
  const controls = [
    [0.02, 0.62],
    [0.08, 0.18],
    [0.14, 0.70],
    [0.18, 0.82],
    [0.24, 0.22],
    [0.32, 0.74],
    [0.40, 0.30],
    [0.48, 0.66],
    [0.56, 0.46],
    [0.68, 0.58],
    [0.82, 0.50],
    [0.96, 0.54],
  ];
  return smooth(controls, 8).map(([px, py]) => [x + px * w, y + py * h]);
}

async function stroke(page, selector, points) {
  const handle = await page.$(selector);
  const box = await handle.boundingBox();
  const abs = points.map(([x, y]) => ({
    x: box.x + x * box.width,
    y: box.y + y * box.height,
  }));
  await page.mouse.move(abs[0].x, abs[0].y);
  await page.mouse.down();
  for (const point of abs.slice(1)) {
    await page.mouse.move(point.x, point.y, { steps: 2 });
  }
  await page.mouse.up();
}

async function hideChrome(page) {
  await page.evaluate(() => {
    const toast = document.getElementById("toast");
    if (toast) toast.hidden = true;
    const veil = document.getElementById("veil");
    if (veil) veil.hidden = true;
    const cursor = document.getElementById("brush-cursor");
    if (cursor) cursor.hidden = true;
  });
  await page.mouse.move(24, 18);
}

async function openExample(page) {
  const bytes = fs.readFileSync(path.join(root, "examples", "autorizacion.pdf"));
  const b64 = bytes.toString("base64");
  await page.evaluate(async (data, name) => {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    await window.tinta.openBytes(bytes, name);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await window.tinta.getState && null;
  }, b64, "autorizacion.pdf");
  await page.waitForFunction(() => {
    const canvas = document.getElementById("pdf-canvas");
    return canvas && canvas.width > 20 && !document.getElementById("stage").hidden;
  });
  await page.evaluate(async () => {
    const fitPage = document.getElementById("fit-page");
    fitPage.click();
  });
  await sleep(500);
  await page.waitForFunction(() => document.querySelectorAll(".widget").length >= 4, { timeout: 8000 });
  await sleep(250);
}

async function shot(page, name) {
  await hideChrome(page);
  await sleep(120);
  const file = path.join(outDir, name);
  await page.screenshot({ path: file });
  console.log(file);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
    cwd: root,
    stdio: "ignore",
  });
  await sleep(400);
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--font-render-hinting=medium",
      "--force-color-profile=srgb",
    ],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.evaluateOnNewDocument(() => {
      window.webkit = { messageHandlers: { tinta: { postMessage() {} } } };
    });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "networkidle0" });
    await page.waitForFunction(() => window.tinta && window.pdfjsLib);
    await shot(page, "01-inicio.png");

    await openExample(page);
    await page.click("#tool-highlight");
    await stroke(page, "#live-canvas", [
      [0.055, 0.255],
      [0.18, 0.252],
      [0.32, 0.256],
      [0.46, 0.250],
    ]);
    await page.click("#tool-pen");
    await stroke(page, "#live-canvas", [
      [0.08, 0.86],
      [0.10, 0.80],
      [0.12, 0.755],
      [0.145, 0.84],
      [0.165, 0.875],
      [0.19, 0.78],
      [0.215, 0.75],
      [0.24, 0.83],
      [0.265, 0.87],
      [0.295, 0.79],
      [0.325, 0.825],
      [0.365, 0.84],
      [0.40, 0.855],
    ]);
    await sleep(150);
    await shot(page, "02-editor.png");

    await page.click("#sign-btn");
    await page.waitForSelector("#pad-dialog[open]");
    await sleep(250);
    await stroke(page, "#pad-canvas", [
      [0.16, 0.62],
      [0.20, 0.42],
      [0.25, 0.58],
      [0.29, 0.36],
      [0.34, 0.66],
      [0.40, 0.44],
      [0.46, 0.58],
      [0.52, 0.50],
      [0.60, 0.54],
      [0.70, 0.52],
      [0.78, 0.56],
    ]);
    await sleep(150);
    await shot(page, "03-firma.png");
    await page.click("#pad-close");
    await sleep(150);

    await openExample(page);
    await page.evaluate(() => {
      function fill(name, value) {
        const el = document.querySelector(`[data-field="${name}"]`);
        if (!el) return;
        el.focus();
        if (el.type === "checkbox") el.checked = !!value;
        else el.value = value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
      fill("Nombre", "Ana García");
      fill("Documento", "00000000A");
      fill("Fecha", "22/10/2026");
      fill("Medio", "En mano");
      fill("Acepto", true);
    });
    await sleep(200);
    await shot(page, "04-campos.png");
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
