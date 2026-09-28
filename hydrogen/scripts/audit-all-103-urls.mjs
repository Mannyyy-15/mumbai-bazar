import fs from 'node:fs';
import path from 'node:path';

const inventoryPath = path.resolve('../baseline-inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

console.log(`Starting crawl audit of all ${inventory.length} baseline URLs against Hydrogen...`);

const baseUrl = 'http://localhost:3100';
let passed = 0;
let failed = 0;
const errors = [];

async function audit() {
  for (const item of inventory) {
    const fullUrl = `${baseUrl}${item.path}`;
    try {
      const res = await fetch(fullUrl);
      if (res.status === 200) {
        passed++;
      } else {
        failed++;
        errors.push({ path: item.path, status: res.status, expected: item.status });
        console.error(`FAIL: ${item.path} -> ${res.status} (expected ${item.status})`);
      }
    } catch (err) {
      failed++;
      errors.push({ path: item.path, error: err.message });
      console.error(`ERROR: ${item.path} -> ${err.message}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`AUDIT COMPLETE: ${passed}/${inventory.length} passed (Failed: ${failed})`);
  console.log(`========================================`);

  if (failed > 0) {
    console.log('\nFailed paths:');
    console.table(errors);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 103 BASELINE SITEMAP URLS RETURN 200 OK ON SHOPIFY HYDROGEN!');
    process.exit(0);
  }
}

audit();
