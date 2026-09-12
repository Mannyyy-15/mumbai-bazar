#!/usr/bin/env node
/**
 * Generates dist-mobile/index.html — the screen the native apps show when the
 * device is offline and mumbaibazar.com cannot be reached.
 *
 * Why this script exists
 * ---------------------
 * The fallback was hand-written and committed, sitting outside src/ where
 * neither the SEO guard nor any import could see it. It had duly drifted:
 *
 *   - "Authentic Sarees & Handloom Elegance" in the <title> — the exact
 *     unverifiable handloom claim scrubbed from the site months earlier;
 *   - closing time stated as 9:30 PM against 9:00 PM everywhere else;
 *   - "Nalasopara (W)" for a flagship that is in Nalasopara East.
 *
 * All three would have shipped inside both app binaries, where they are far
 * harder to correct than a web page: a copy fix becomes a store resubmission.
 *
 * So the facts now come from SITE and the outlet data, the same source the
 * website uses, and the template below carries placeholders rather than values.
 *
 * Run:  npm run build:mobile-fallback   (also runs as part of cap:sync)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not URL.pathname — the repo path contains spaces.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = join(ROOT, "dist-mobile", "index.template.html");
const OUTPUT = join(ROOT, "dist-mobile", "index.html");

/**
 * Read the handful of facts we need straight out of the TypeScript sources.
 *
 * Deliberately regex rather than importing: src/lib/seo.ts is TypeScript with
 * path aliases, so importing it from a plain node script would mean pulling in
 * a transpiler for four strings. The patterns are anchored to the exact literal
 * shapes, and the script fails loudly if any of them stops matching — which is
 * the signal to come and update it.
 */
function extract(file, pattern, label) {
  const src = readFileSync(join(ROOT, file), "utf8");
  const match = src.match(pattern);
  if (!match) {
    console.error(
      `\nbuild-mobile-fallback: could not read ${label} from ${file}.` +
        `\nThe source shape changed. Fix the pattern in this script rather than` +
        ` hardcoding the value back into the template.\n`,
    );
    process.exit(1);
  }
  return match[1];
}

const SEO = "src/lib/seo.ts";

const siteUrl = extract(SEO, /url:\s*"([^"]+)"/, "SITE.url");
const siteName = extract(SEO, /name:\s*"([^"]+)"/, "SITE.name");
const tagline = extract(SEO, /tagline:\s*"([^"]+)"/, "SITE.tagline");
const phone = extract(SEO, /phone:\s*"(\+[^"]+)"/, "SITE.phone");
const whatsapp = extract(SEO, /whatsapp:\s*"(\d+)"/, "SITE.whatsapp");
const hoursLabel = extract(SEO, /label:\s*"([^"]+)"/, "SITE.hours.label");

/** Published outlet areas, in file order, for the "visit our stores" line. */
function outletAreas() {
  const src = readFileSync(join(ROOT, "src/lib/locations.ts"), "utf8");
  const areas = [];
  // Walk each `slug:` ... up to the next `slug:` as one outlet record, and keep
  // only those that are both published and verified — an outlet without a
  // confirmed street address must never be advertised in the apps.
  const records = src.split(/\n\s*slug:\s*"/).slice(1);
  for (const record of records) {
    const area = record.match(/area:\s*"([^"]+)"/);
    const published = /published:\s*true/.test(record);
    const verified = /verified:\s*true/.test(record);
    if (area && published && verified) areas.push(area[1]);
  }
  if (!areas.length) {
    console.error("build-mobile-fallback: found no published outlets.");
    process.exit(1);
  }
  return areas;
}

const areas = outletAreas();

const replacements = {
  "{{SITE_URL}}": siteUrl,
  "{{SITE_NAME}}": siteName,
  "{{TAGLINE}}": tagline,
  "{{PHONE}}": phone,
  "{{PHONE_HREF}}": phone.replace(/\s/g, ""),
  "{{WHATSAPP}}": whatsapp,
  "{{HOURS}}": hoursLabel,
  "{{STORE_LINE}}": areas.join(" &bull; "),
};

let html = readFileSync(TEMPLATE, "utf8");
for (const [token, value] of Object.entries(replacements)) {
  html = html.split(token).join(value);
}

const leftover = html.match(/\{\{[A-Z_]+\}\}/g);
if (leftover) {
  console.error(
    `build-mobile-fallback: unreplaced placeholders: ${[...new Set(leftover)].join(", ")}`,
  );
  process.exit(1);
}

writeFileSync(OUTPUT, html, "utf8");
console.log(
  `build-mobile-fallback: wrote dist-mobile/index.html` +
    ` (${areas.length} outlets, hours "${hoursLabel}")`,
);
