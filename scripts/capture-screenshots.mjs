#!/usr/bin/env node
/**
 * Captura screenshots de páginas públicas para docs/screenshots/
 * Uso: node scripts/capture-screenshots.mjs [baseUrl]
 */
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "docs", "screenshots");

const pages = [
  { path: "/", name: "landing", themes: ["dark", "light"] },
  { path: "/login", name: "login", themes: ["dark"] },
  { path: "/demo", name: "demo-dashboard", themes: ["dark"] },
];

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Instale Playwright: npx playwright install chromium");
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();

  for (const page of pages) {
    for (const theme of page.themes) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        colorScheme: theme,
      });
      const tab = await context.newPage();
      await tab.goto(`${baseUrl}${page.path}`, { waitUntil: "networkidle" });
      await tab.waitForTimeout(500);
      const file = join(outDir, `${page.name}-${theme}.png`);
      await tab.screenshot({ path: file, fullPage: page.path === "/demo" });
      console.log(`Salvo: ${file}`);
      await context.close();
    }
  }

  await browser.close();
  console.log("Concluído.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
