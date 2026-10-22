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

// Catmull-Rom: el ratón de la captura sigue una curva, no una polilínea.
function smooth(controls, steps = 14) {
  const pts = [controls[0], ...controls, controls[controls.length - 1]];
  const out = [];
  for (let i = 1; i < pts.length - 2; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const x = 0.5 * (
        2 * p1[0]
        + (-p0[0] + p2[0]) * t
        + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2
        + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
      );
      const y = 0.5 * (
        2 * p1[1]
        + (-p0[1] + p2[1]) * t
        + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2
        + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
      );
      out.push([x, y]);
    }
  }
  out.push(controls[controls.length - 1]);
  return out;
}

function signatureAt(x, y, w, h) {
  const controls = [
    [0.00, 0.78],
    [0.07, 0.22],
    [0.13, 0.08],
    [0.20, 0.62],
    [0.26, 0.84],
    [0.34, 0.16],
    [0.42, 0.58],
    [0.52, 0.70],
    [0.68, 0.64],
    [0.86, 0.68],
    [1.00, 0.70],
  ];
  return smooth(controls).map(([px, py]) => [x + px * w, y + py * h]);
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
    await stroke(page, "#live-canvas", signatureAt(0.085, 0.768, 0.20, 0.095));
    await page.click("#date-btn");
    await sleep(180);
    await page.evaluate(() => {
      const st = window.tinta.getState();
      const items = st.ink[st.pageIndex] || [];
      const text = items.find((item) => item.type === "text");
      if (text) {
        text.x = 0.30;
        text.y = 0.808;
        text.w = 0.20;
      }
      st.selectedId = null;
      setTool("pen");
      paintInkDisplay();
    });
    await shot(page, "02-editor.png");

    await page.click("#sign-btn");
    await page.waitForSelector("#pad-dialog[open]");
    await sleep(250);
    await stroke(page, "#pad-canvas", signatureAt(0.12, 0.22, 0.64, 0.40));
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
