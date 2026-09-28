import fs from "node:fs";

async function run() {
  const xml = await fetch("http://localhost:8080/sitemap.xml").then((r) => r.text());
  const locs = (xml.match(/<loc>(.*?)<\/loc>/g) || []).map((l) => l.replace(/<\/?loc>/g, ""));
  console.log(`Crawling ${locs.length} URLs from sitemap...`);

  const results = [];
  for (const url of locs) {
    const path = url.replace("https://mumbaibazar.com", "");
    try {
      const res = await fetch("http://localhost:8080" + (path || "/"));
      const html = await res.text();
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      const descMatch =
        html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i) ||
        html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["'][^>]*>/i);
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const cleanH1 = h1Match ? h1Match[1].replace(/<[^>]*>/g, "").trim() : "";

      results.push({
        url,
        path: path || "/",
        status: res.status,
        title: titleMatch ? titleMatch[1].trim() : "",
        description: descMatch ? descMatch[1].trim() : "",
        h1: cleanH1,
      });
      process.stdout.write(".");
    } catch (err) {
      results.push({
        url,
        path: path || "/",
        status: 0,
        error: err.message,
      });
      process.stdout.write("X");
    }
  }
  console.log("\nDone crawling.");
  fs.writeFileSync("baseline-inventory.json", JSON.stringify(results, null, 2), "utf8");
  console.log(`Saved baseline-inventory.json with ${results.length} records.`);
}

run();
