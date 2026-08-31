#!/usr/bin/env node
/**
 * SEO regression guard.
 *
 * This repo has demonstrably backslid on the same handful of issues more than
 * once: the handloom / purity claims have been removed and have reappeared, and
 * a fabricated `aggregateRating` was hardcoded into the product schema despite a
 * helper existing that specifically warned against it.
 *
 * Upstream `main` is written to by a concurrent agent several times an hour, so
 * "remember not to do that" is not a control. This is.
 *
 * Run it after any merge, and in CI:
 *     node scripts/check-seo-claims.mjs
 *
 * Exits 1 on any hit. Every rule below has a `why` explaining the consequence,
 * so whoever trips it can judge the fix rather than just silencing the check.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not URL.pathname — the repo path contains spaces, which
// pathname leaves percent-encoded.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");

/**
 * Files where a term is legitimate. The editorial guides teach people how to
 * identify handloom and pure silk — that is education about the category, not a
 * claim about our stock, and scrubbing it would gut the site's best content.
 */
const EDUCATIONAL = ["src/lib/guides.ts", "src/routes/care-guide.tsx", "src/routes/about.tsx"];

const RULES = [
  {
    id: "fake-reviews",
    pattern: /aggregateRating|"reviewCount"|ratingValue/,
    allow: [
      // The opt-in helper is fine; it only runs on real, on-page reviews.
      "src/lib/structured-data.ts",
    ],
    why:
      "Hardcoded ratings violate Google's structured data policy twice over (markup not visible to readers, reviews not written by customers) and risk a manual action that strips rich results across the whole domain. Use withReviews() only when real, server-rendered reviews exist.",
  },
  {
    id: "unverifiable-claims",
    pattern:
      /100% Certified|100% Authentic|Pure Mulberry|Tested Gold|Silk Mark|Assured Authenticity|Authentic Loom|Handwoven Heritage|Heritage Pure Silk|master artisans|Master Weavers/i,
    allow: EDUCATIONAL,
    why:
      "These assert fibre content, certification or provenance about goods being sold, across a catalogue that does not support them. Beyond the E-E-A-T damage, they are misleading-advertisement exposure under India's Consumer Protection Act. Say what is true instead: 8 stores since 2009, drape before you buy, 7-day returns.",
  },
  {
    id: "placeholder-copy",
    pattern: /add saree details|lorem ipsum|TODO:|FIXME:/i,
    allow: [],
    why: "Placeholder text reached production once already, on an indexable product page that was in the sitemap.",
  },
  {
    id: "hardcoded-hours",
    /*
     * Any clock time written as literal text outside the single source of truth.
     *
     * The colon-less form ("10 AM - 9 PM") is matched explicitly: the original
     * pattern required HH:MM and so missed nine hardcoded strings, including a
     * /contact page still advertising 8 PM after the rest of the site had moved
     * to 9 PM. That is exactly the inconsistency this rule exists to prevent.
     */
    pattern: /\d{1,2}:\d{2}\s*(AM|PM)|\d{1,2}\s*(AM|PM)\s*[-–—]|Mon\w*\s*[-–—]\s*Sat|open (?:daily|every day)[^.]{0,20}\d/i,
    allow: ["src/lib/seo.ts", "src/lib/guides.ts"],
    why:
      "Hours must derive from SITE.hours. The site once stated three different sets at once, so an AI assistant asked 'are you open Sunday?' had even odds of sending a customer to a shut shop.",
  },
  {
    id: "duplicate-store-entity",
    pattern: /localBusinessSchema/,
    allow: ["src/lib/structured-data.ts"],
    why:
      "This emitted a second ClothingStore node for the flagship on every page, competing with the store page's own entity. Each shop must have exactly one @id — use outletSchema().",
  },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith("routeTree.gen.ts")) out.push(full);
  }
  return out;
}

const files = walk(SRC);
const failures = [];

/**
 * Blank out comments so the notes explaining why a claim was REMOVED do not
 * themselves trip the rule that removed it. Tracks block state across lines,
 * because JSX comments ({\/* ... *\/}) span lines without a leading "*".
 */
function stripComments(lines) {
  let inBlock = false;
  return lines.map((line) => {
    let out = line;
    if (inBlock) {
      const close = out.indexOf("*/");
      if (close === -1) return "";
      out = out.slice(close + 2);
      inBlock = false;
    }
    // Remove any complete /* ... */ spans on this line.
    out = out.replace(/\/\*[\s\S]*?\*\//g, "");
    const open = out.indexOf("/*");
    if (open !== -1) {
      inBlock = true;
      out = out.slice(0, open);
    }
    return out.replace(/\/\/.*$/, "");
  });
}

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const raw = readFileSync(file, "utf8").split(/\r?\n/);
  const code = stripComments(raw);

  for (const rule of RULES) {
    if (rule.allow.includes(rel)) continue;
    code.forEach((line, i) => {
      if (rule.pattern.test(line)) {
        failures.push({ rule, rel, line: i + 1, text: raw[i].trim().slice(0, 100) });
      }
    });
  }
}

if (failures.length === 0) {
  console.log("SEO claim guard: clean across %d files.", files.length);
  process.exit(0);
}

const byRule = new Map();
for (const f of failures) {
  if (!byRule.has(f.rule.id)) byRule.set(f.rule.id, { rule: f.rule, hits: [] });
  byRule.get(f.rule.id).hits.push(f);
}

console.error("\nSEO claim guard FAILED — %d issue(s):\n", failures.length);
for (const { rule, hits } of byRule.values()) {
  console.error("  [%s]", rule.id);
  console.error("  %s\n", rule.why);
  for (const h of hits) console.error("    %s:%d  %s", h.rel, h.line, h.text);
  console.error("");
}
process.exit(1);
