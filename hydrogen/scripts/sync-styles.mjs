import fs from 'node:fs';

let css = fs.readFileSync('../src/styles.css', 'utf8');
css = css.replace('@import "tailwindcss" source(none);', '@import "tailwindcss";');
css = css.replace('@source "../src";', '@source "../";');
fs.writeFileSync('app/styles/tailwind.css', css, 'utf8');
console.log('tailwind.css synced successfully! Length:', css.length);
