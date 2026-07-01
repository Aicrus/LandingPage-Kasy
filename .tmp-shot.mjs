import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000';
const width = parseInt(process.argv[3] || '1440', 10);
const height = parseInt(process.argv[4] || '900', 10);
const out = process.argv[5];
const theme = process.argv[6]; // 'dark' or undefined

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
if (theme === 'dark') {
  await page.emulateMedia({ colorScheme: 'dark' });
}
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: out, fullPage: true });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
await browser.close();
console.log('done', out);
