#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, "app");

const EDUCATIONAL = ["app/lib/guides.ts", "app/routes/care-guide.tsx", "app/routes/about.tsx"];

const RULES = [
  {
    id: "fake-reviews",
    pattern: /aggregateRating|"reviewCount"|ratingValue/,
    allow: ["app/lib/structured-data.ts"],
    why: "Hardcoded ratings violate Google structured data policy.",
  },
  {
    id: "unverifiable-claims",
    pattern:
      // Widened 2026-09-29. The Hydrogen port reintroduced four claims the
      // previous pattern did not cover -- "master weaving clusters",
      // "Handcrafted ethnic wear", "ensure the authenticity", "master tailors"
      // -- and all four shipped to production. The terms below are the exact
      // wordings this project keeps regressing to.
      /100% Certified|100% Authentic|Pure Mulberry|Tested Gold|Silk Mark|Assured Authenticity|Authentic Loom|Handwoven Heritage|Heritage Pure Silk|master artisans|Master Weavers|master weav\\w*|master tailors|Handcrafted ethnic|handcrafted saree|ensure the authenticity|guarantee\\w*\\s+authentic|weaving clusters/i,
    allow: EDUCATIONAL,
    why: "Unverifiable claims violate Consumer Protection Act guidelines.",
  },
  {
    id: "placeholder-copy",
    pattern: /add saree details|lorem ipsum|TODO:|FIXME:/i,
    allow: [],
    why: "Placeholder text should never reach production.",
  },
  {
    id: "hardcoded-hours",
    pattern: /\d{1,2}:\d{2}\s*(AM|PM)|\d{1,2}\s*(AM|PM)\s*[-–—]|Mon\w*\s*[-–—]\s*Sat|open (?:daily|every day)[^.]{0,20}\d/i,
    allow: ["app/lib/seo.ts", "app/lib/guides.ts"],
    why: "Hours must derive strictly from SITE.hours.",
  },
  {
    id: "duplicate-store-entity",
    pattern: /localBusinessSchema/,
    allow: ["app/lib/structured-data.ts"],
    why: "Each shop must have exactly one entity.",
  },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const files = walk(APP);
const failures = [];

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
  console.log("Hydrogen SEO claim guard: clean across %d files.", files.length);
  process.exit(0);
}

console.error("\nHydrogen SEO claim guard FAILED — %d issue(s):\n", failures.length);
for (const f of failures) {
  console.error("  [%s] %s:%d  %s", f.rule.id, f.rel, f.line, f.text);
}
process.exit(1);
