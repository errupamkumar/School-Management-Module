const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loginUser(page, email, password) {
  console.log(`Logging in as: ${email}`);
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await sleep(1000);

  // Clear existing inputs
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((i) => (i.value = ''));
  });

  await page.type('input[type="email"], input[name="email"]', email, { delay: 30 });
  await page.type('input[type="password"], input[name="password"]', password, { delay: 30 });
  await sleep(500);

  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
  await sleep(2000);
}

async function main() {
  console.log('Launching browser with Chrome at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1.5 },
  });

  const page = await browser.newPage();

  try {
    // 1. Login Page
    console.log('1. Capturing Login Page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_login_page.png') });

    // 2. Admin Login
    console.log('2. Logging in as Admin...');
    await loginUser(page, 'admin@vidyalaya.com', 'admin123');

    // Admin Dashboard - Modern View
    console.log('3. Capturing Admin Dashboard (Modern View)...');
    await page.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_admin_dashboard_modern.png') });

    // Admin Dashboard - Classic View
    console.log('4. Capturing Admin Dashboard (Classic View)...');
    // Click on Classic View toggle button
    const toggled = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const classicBtn = buttons.find((b) => b.textContent && b.textContent.includes('Classic View'));
      if (classicBtn) {
        classicBtn.click();
        return true;
      }
      return false;
    });
    await sleep(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_admin_dashboard_classic.png') });

    // 5. Student Information Management
    console.log('5. Capturing Student Management (/students)...');
    await page.goto('http://localhost:3000/students', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_student_management.png') });

    // 6. New Admission Form
    console.log('6. Capturing New Admission Form (/admission/new)...');
    await page.goto('http://localhost:3000/admission/new', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_new_admission.png') });

    // 7. Fee Collection Counter
    console.log('7. Capturing Fee Collection Counter (/fees/collect)...');
    await page.goto('http://localhost:3000/fees/collect', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_fee_collection.png') });

    // 8. Pending Dues List
    console.log('8. Capturing Fee Dues (/fees/dues)...');
    await page.goto('http://localhost:3000/fees/dues', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07_fee_dues.png') });

    // 9. Attendance Management
    console.log('9. Capturing Attendance Management (/attendance)...');
    await page.goto('http://localhost:3000/attendance', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_attendance_management.png') });

    // 10. Exam Management
    console.log('10. Capturing Exam Management (/exams)...');
    await page.goto('http://localhost:3000/exams', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09_exam_management.png') });

    // 11. Notifications Center
    console.log('11. Capturing Notifications Center (/notifications)...');
    await page.goto('http://localhost:3000/notifications', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10_notifications_center.png') });

    // 12. School Chat & Communications
    console.log('12. Capturing School Chat (/chat)...');
    await page.goto('http://localhost:3000/chat', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '11_school_chat.png') });

    // Clear session cookies for next user
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');

    // 13. Teacher Dashboard
    console.log('13. Logging in as Teacher (teacher@school.com)...');
    await loginUser(page, 'teacher@school.com', 'Teacher@123');
    console.log('Capturing Teacher Dashboard (/dashboard/teacher)...');
    await page.goto('http://localhost:3000/dashboard/teacher', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '12_teacher_dashboard.png') });

    await client.send('Network.clearBrowserCookies');

    // 14. Parent Portal
    console.log('14. Logging in as Parent (parent@school.com)...');
    await loginUser(page, 'parent@school.com', 'Parent@123');
    console.log('Capturing Parent Portal (/dashboard/parent)...');
    await page.goto('http://localhost:3000/dashboard/parent', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '13_parent_portal.png') });

    await client.send('Network.clearBrowserCookies');

    // 15. Student Portal
    console.log('15. Logging in as Student (student@school.com)...');
    await loginUser(page, 'student@school.com', 'Student@123');
    console.log('Capturing Student Portal (/dashboard/student)...');
    await page.goto('http://localhost:3000/dashboard/student', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '14_student_portal.png') });

    console.log(' All screenshots captured successfully in:', OUTPUT_DIR);
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

main();
