const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function captureRole(email, password, targetPath, filename) {
  console.log(`Starting capture for ${email} -> ${targetPath}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.5 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await sleep(1000);

  const emailInput = await page.$('input[type="email"]');
  await emailInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await emailInput.type(email, { delay: 20 });

  const passInput = await page.$('input[type="password"]');
  await passInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await passInput.type(password, { delay: 20 });

  await sleep(300);
  await page.click('button[type="submit"]');

  await sleep(3000);
  console.log(`${email} URL after submitting login:`, page.url());

  await page.goto('http://localhost:3000' + targetPath, { waitUntil: 'networkidle0' });
  await sleep(2000);
  console.log(`${email} URL at dashboard:`, page.url());

  const screenshotPath = path.join(OUTPUT_DIR, filename);
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
}

async function run() {
  await captureRole('parent@school.com', 'Parent@123', '/dashboard/parent', '13_parent_portal.png');
  await captureRole('student@school.com', 'Student@123', '/dashboard/student', '14_student_portal.png');
  console.log('Done capturing parent and student portals!');
}

run().catch(console.error);
