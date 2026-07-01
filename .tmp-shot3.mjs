import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000';
const width = parseInt(process.argv[3] || '1440', 10);
const height = parseInt(process.argv[4] || '900', 10);
const out = process.argv[5];
const theme = process.argv[6];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
if (theme === 'dark') await page.emulateMedia({ colorScheme: 'dark' });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < scrollHeight; y += 400) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(100);
}
await page.waitForTimeout(300);

const el = await page.locator('section:has-text("Conecte a qualquer fonte de dados")');
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await el.screenshot({ path: out });

await browser.close();
