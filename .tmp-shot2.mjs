import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000';
const width = parseInt(process.argv[3] || '1440', 10);
const height = parseInt(process.argv[4] || '900', 10);
const outPrefix = process.argv[5];
const theme = process.argv[6];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
if (theme === 'dark') await page.emulateMedia({ colorScheme: 'dark' });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

// scroll through the whole page gradually so IntersectionObserver-based reveals fire
const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < scrollHeight; y += 400) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

await page.screenshot({ path: `${outPrefix}-full.png`, fullPage: true });

console.log('errors:', JSON.stringify(errors));
await browser.close();
