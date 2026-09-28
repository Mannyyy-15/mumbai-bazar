const urls = [
  'http://localhost:3100/',
  'http://localhost:3100/shop',
  'http://localhost:3100/wedding-sarees',
  'http://localhost:3100/silk-sarees',
  'http://localhost:3100/new-arrivals',
  'http://localhost:3100/festive-edit',
  'http://localhost:3100/everyday-sarees',
  'http://localhost:3100/collections',
  'http://localhost:3100/products/meher-wine-banarasi-silk-saree',
  'http://localhost:3100/stores',
  'http://localhost:3100/stores/nalasopara',
  'http://localhost:3100/stores/virar',
  'http://localhost:3100/stores/bhayandar',
  'http://localhost:3100/stores/goregaon',
  'http://localhost:3100/sarees-in/vasai-virar',
  'http://localhost:3100/guides',
  'http://localhost:3100/guides/banarasi-saree-guide',
  'http://localhost:3100/about',
  'http://localhost:3100/our-story',
  'http://localhost:3100/contact',
  'http://localhost:3100/contact-information',
  'http://localhost:3100/faq',
  'http://localhost:3100/care-guide',
  'http://localhost:3100/trousseau-builder',
  'http://localhost:3100/privacy-policy',
  'http://localhost:3100/refund-policy',
  'http://localhost:3100/shipping-policy',
  'http://localhost:3100/shipping-returns',
  'http://localhost:3100/terms-of-service',
  'http://localhost:3100/legal-notice',
  'http://localhost:3100/robots.txt',
  'http://localhost:3100/sitemap.xml',
  'http://localhost:3100/llms.txt',
  'http://localhost:3100/.well-known/apple-app-site-association',
  'http://localhost:3100/.well-known/assetlinks.json'
];

async function run() {
  let failed = 0;
  console.log(`Testing ${urls.length} critical URLs against preview server...`);
  for (const u of urls) {
    try {
      const res = await fetch(u);
      const ct = res.headers.get('content-type') || '';
      if (res.status !== 200) {
        console.error(`FAIL [${res.status}]: ${u}`);
        failed++;
      } else {
        console.log(`OK [200]: ${u} (${ct})`);
      }
    } catch (e) {
      console.error(`ERROR: ${u} - ${e.message}`);
      failed++;
    }
  }
  console.log(`\nResult: ${urls.length - failed}/${urls.length} passed.`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
