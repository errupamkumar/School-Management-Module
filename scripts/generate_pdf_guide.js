const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const OUTPUT_HTML = path.join(__dirname, '..', 'docs', 'Vidyalaya-School-Management-System-Demo-Guide.html');
const OUTPUT_PDF = path.join(__dirname, '..', 'docs', 'Vidyalaya-School-Management-System-Demo-Guide.pdf');

function getImageBase64(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing image: ${filePath}`);
    return '';
  }
  const buffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

function buildHtml() {
  const images = {
    login: getImageBase64('01_login_page.png'),
    adminModern: getImageBase64('02_admin_dashboard_modern.png'),
    adminClassic: getImageBase64('03_admin_dashboard_classic.png'),
    studentMgmt: getImageBase64('04_student_management.png'),
    admission: getImageBase64('05_new_admission.png'),
    feeCollect: getImageBase64('06_fee_collection.png'),
    feeDues: getImageBase64('07_fee_dues.png'),
    attendance: getImageBase64('08_attendance_management.png'),
    exams: getImageBase64('09_exam_management.png'),
    notifications: getImageBase64('10_notifications_center.png'),
    chat: getImageBase64('11_school_chat.png'),
    teacherDash: getImageBase64('12_teacher_dashboard.png'),
    parentPortal: getImageBase64('13_parent_portal.png'),
    studentPortal: getImageBase64('14_student_portal.png'),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vidyalaya School Management ERP - Comprehensive User & Demo Guide</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    :root {
      --primary: #1e40af;
      --primary-light: #3b82f6;
      --primary-dark: #1e3a8a;
      --secondary: #0f766e;
      --accent: #f59e0b;
      --text-main: #0f172a;
      --text-muted: #475569;
      --border: #e2e8f0;
      --bg-card: #ffffff;
      --bg-soft: #f8fafc;
      --badge-admin: #4338ca;
      --badge-teacher: #059669;
      --badge-parent: #7c3aed;
      --badge-student: #2563eb;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--text-main);
      background-color: #ffffff;
      line-height: 1.6;
      font-size: 13.5px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      padding: 32px 36px;
      page-break-after: always;
      position: relative;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Cover Page */
    .cover-container {
      min-height: 980px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 2px solid var(--border);
      border-radius: 20px;
      padding: 56px 48px;
      background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f5f3ff 100%);
      position: relative;
      overflow: hidden;
    }

    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(30, 64, 175, 0.1);
      color: var(--primary);
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 24px;
    }

    .cover-title {
      font-size: 38px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin-bottom: 12px;
    }

    .cover-title span {
      background: linear-gradient(135deg, #1e40af 0%, #4338ca 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 17px;
      color: var(--text-muted);
      max-width: 620px;
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin: 30px 0;
    }

    .feature-chip {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      backdrop-filter: blur(10px);
    }

    .feature-chip-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #eff6ff;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      flex-shrink: 0;
    }

    .feature-chip h4 {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 3px;
    }

    .feature-chip p {
      font-size: 12px;
      color: #64748b;
      line-height: 1.4;
    }

    .cover-footer {
      border-top: 1px solid var(--border);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12px;
      color: #64748b;
    }

    /* Section Styling */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .section-title-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-number {
      background: var(--primary);
      color: #ffffff;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.01em;
    }

    .role-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-admin { background: #e0e7ff; color: #3730a3; }
    .badge-teacher { background: #d1fae5; color: #065f46; }
    .badge-parent { background: #ede9fe; color: #5b21b6; }
    .badge-student { background: #dbeafe; color: #1e40af; }
    .badge-universal { background: #f1f5f9; color: #334155; }

    .desc-box {
      background: var(--bg-soft);
      border-left: 4px solid var(--primary);
      border-radius: 0 10px 10px 0;
      padding: 14px 18px;
      margin-bottom: 18px;
      font-size: 13px;
      color: #334155;
    }

    .desc-box p {
      margin-bottom: 6px;
    }

    .desc-box p:last-child {
      margin-bottom: 0;
    }

    .screenshot-frame {
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
      margin-bottom: 16px;
      background: #ffffff;
    }

    .screenshot-frame-header {
      background: #f1f5f9;
      border-bottom: 1px solid #e2e8f0;
      padding: 8px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }

    .window-dots {
      display: flex;
      gap: 5px;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #cbd5e1;
    }

    .dot.red { background: #f87171; }
    .dot.yellow { background: #fbbf24; }
    .dot.green { background: #34d399; }

    .screenshot-img {
      width: 100%;
      height: auto;
      display: block;
    }

    .key-points-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 14px;
    }

    .key-point-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
    }

    .key-point-card h5 {
      font-size: 12px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .key-point-card p {
      font-size: 11.5px;
      color: #64748b;
      line-height: 1.35;
    }

    /* Table styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12.5px;
    }

    th {
      background: #f8fafc;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 10px 14px;
      border-bottom: 2px solid #e2e8f0;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    td {
      padding: 10px 14px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #fafafa;
    }

    .code-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 2px 6px;
      border-radius: 4px;
      color: #0f172a;
    }

    .two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .two-col-grid .screenshot-frame {
      margin-bottom: 0;
    }

    .workflow-steps {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 12px 0;
    }

    .workflow-step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 6px;
    }

    .workflow-step-num {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #eff6ff;
      color: var(--primary);
      font-weight: 700;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .workflow-step-text {
      font-size: 12px;
      color: #334155;
    }

    .workflow-step-text strong {
      color: #0f172a;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER PAGE -->
  <div class="page">
    <div class="cover-container">
      <div>
        <div class="cover-badge">
          <span>Enterprise School ERP Documentation</span>
        </div>
        <h1 class="cover-title">विद्यालय (Vidyalaya)<br><span>School Management System</span></h1>
        <p class="cover-subtitle">
          Comprehensive End-to-End Product Demonstration & Architecture Manual. Covering complete operational workflows from Super Admin governance to Classroom Teachers, Fee Counters, Parents, and Student self-service portals.
        </p>

        <div class="cover-grid">
          <div class="feature-chip">
            <div class="feature-chip-icon">👑</div>
            <div>
              <h4>Super Admin Governance</h4>
              <p>Institutional oversight, user role security, analytics KPIs, admission pipelines, and curriculum masters.</p>
            </div>
          </div>
          <div class="feature-chip">
            <div class="feature-chip-icon">💳</div>
            <div>
              <h4>Multi-Head Fee Engine</h4>
              <p>Instant thermal receipts, pending dues tracking, concession allocation, and automated financial ledgers.</p>
            </div>
          </div>
          <div class="feature-chip">
            <div class="feature-chip-icon">👨‍🏫</div>
            <div>
              <h4>Teacher Academic Suite</h4>
              <p>One-tap biometric/manual attendance, homework assignments, test grading, and schedule timetables.</p>
            </div>
          </div>
          <div class="feature-chip">
            <div class="feature-chip-icon">👨‍👩‍👧</div>
            <div>
              <h4>Parent & Student Portals</h4>
              <p>Real-time progress cards, fee receipts, digital study materials, campus notices, and encrypted chat.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="desc-box" style="margin-bottom: 20px;">
          <strong>Included in this Document:</strong> Complete photographic proof with live UI captures of every primary interface, credential matrices, role permissions, modern vs classic view switching, and step-by-step user operation guides.
        </div>
        <div class="cover-footer">
          <div>
            <strong>Document Reference:</strong> VDY-ERP-DEMO-2026-v2.4<br>
            <strong>Environment:</strong> Localhost Production Build (Next.js 14 + PostgreSQL / Prisma)
          </div>
          <div style="text-align: right;">
            <strong>Target Audience:</strong> School Principals, Administrators, Trustees & IT Staff<br>
            <strong>Generated Date:</strong> September 2026
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- PAGE 2: CREDENTIAL MATRIX & ARCHITECTURE -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">★</div>
        <h2 class="section-title">Demo Access Credentials & Role Matrix</h2>
      </div>
      <span class="role-badge badge-universal">Security Reference</span>
    </div>

    <div class="desc-box">
      The Vidyalaya ERP implements strict Role-Based Access Control (RBAC) enforced via NextAuth.js cryptographic sessions and Edge Middleware. Each account is isolated to its authorized domain with automatic navigation routing.
    </div>

    <table>
      <thead>
        <tr>
          <th>User Role</th>
          <th>Demo Login Email</th>
          <th>Password</th>
          <th>Landing Route</th>
          <th>Access Scope</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="role-badge badge-admin">Super Admin</span></td>
          <td><span class="code-badge">admin@vidyalaya.com</span></td>
          <td><span class="code-badge">admin123</span></td>
          <td><span class="code-badge">/dashboard/admin</span></td>
          <td>Full institutional access, campus settings, user creation, fee ledger, reports.</td>
        </tr>
        <tr>
          <td><span class="role-badge badge-teacher">Class Teacher</span></td>
          <td><span class="code-badge">teacher@school.com</span></td>
          <td><span class="code-badge">Teacher@123</span></td>
          <td><span class="code-badge">/dashboard/teacher</span></td>
          <td>Assigned class attendance, homework, exams grading, student reports, chat.</td>
        </tr>
        <tr>
          <td><span class="role-badge badge-admin">Accountant</span></td>
          <td><span class="code-badge">accountant@school.com</span></td>
          <td><span class="code-badge">Accountant@123</span></td>
          <td><span class="code-badge">/fees/collect</span></td>
          <td>Fee collection counter, thermal print receipts, dues list, expense vouchers.</td>
        </tr>
        <tr>
          <td><span class="role-badge badge-parent">Parent / Guardian</span></td>
          <td><span class="code-badge">parent@school.com</span></td>
          <td><span class="code-badge">Parent@123</span></td>
          <td><span class="code-badge">/dashboard/parent</span></td>
          <td>Ward attendance, fee dues & online payment, exam marks card, event calendar.</td>
        </tr>
        <tr>
          <td><span class="role-badge badge-student">Student</span></td>
          <td><span class="code-badge">student@school.com</span></td>
          <td><span class="code-badge">Student@123</span></td>
          <td><span class="code-badge">/dashboard/student</span></td>
          <td>Self attendance record, upcoming exams, homework submissions, digital library.</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #1e293b;">Role Permission Hierarchy</h3>
      <div class="key-points-grid">
        <div class="key-point-card">
          <h5>🛡️ Administrative Shield</h5>
          <p>Super Admins can switch between high-velocity analytical Modern Mode and dense data-first Classic Mode with one click.</p>
        </div>
        <div class="key-point-card">
          <h5>🔒 Edge Route Protection</h5>
          <p>Any unauthorized attempt by students or parents to access administrative URLs instantly redirects back to authenticated portals.</p>
        </div>
        <div class="key-point-card">
          <h5>⚡ Instant Bi-Directional Chat</h5>
          <p>Direct communication channel connecting teachers and parents for real-time progress discussions without third-party apps.</p>
        </div>
      </div>
    </div>

    <div style="margin-top: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; margin-bottom: 8px; color: #1e293b;">System Architecture Stack</h3>
      <p style="font-size: 12.5px; color: #475569; margin-bottom: 12px;">Built with enterprise-ready open web technologies designed for zero downtime and rapid multi-campus scaling:</p>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-weight: 700; font-size: 12px;">Next.js 14 App Router</div>
          <div style="font-size: 11px; color: #64748b;">React Server Components</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-weight: 700; font-size: 12px;">Prisma ORM</div>
          <div style="font-size: 11px; color: #64748b;">PostgreSQL Database</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-weight: 700; font-size: 12px;">Tailwind CSS</div>
          <div style="font-size: 11px; color: #64748b;">Dark & Classic Themes</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-weight: 700; font-size: 12px;">NextAuth v4</div>
          <div style="font-size: 11px; color: #64748b;">JWT Role-Based Auth</div>
        </div>
      </div>
    </div>
  </div>

  <!-- PAGE 3: AUTHENTICATION & LOGIN -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">01</div>
        <h2 class="section-title">Authentication & Unified Login Gateway</h2>
      </div>
      <span class="role-badge badge-universal">Universal Access</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/login</span></p>
      <p>The Vidyalaya entry portal provides a secure, unified single-sign-on (SSO) experience for all five system personas. The system detects user credentials, validates password hashes via BCrypt, and transparently routes the authenticated user to their role-specific dashboard.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Unified Authentication Screen (Desktop 1440x900)</span>
        <span>http://localhost:3000/login</span>
      </div>
      <img src="${images.login}" class="screenshot-img" alt="Login Page">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>🔐 High-Entropy Security</h5>
        <p>Password toggle visibility, rate-limiting protection, and encrypted JWT session cookies with HttpOnly flags.</p>
      </div>
      <div class="key-point-card">
        <h5>🧭 Smart Dynamic Routing</h5>
        <p>Root redirection engine inspects the JWT payload and directs users directly to Admin, Teacher, Parent, or Student views.</p>
      </div>
      <div class="key-point-card">
        <h5>🎨 Bilingual Brand Identity</h5>
        <p>Showcases Indian school branding in Devanagari and English with dynamic gradient backdrop styling.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 4: ADMIN DASHBOARD MODERN VIEW -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">02</div>
        <h2 class="section-title">Super Admin Dashboard — Modern Analytics View</h2>
      </div>
      <span class="role-badge badge-admin">Super Admin / Principal</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/dashboard/admin</span></p>
      <p>The Modern Dashboard view provides executive leadership with a 360-degree real-time pulse of the institution. It highlights vital financial health, student-teacher ratios, attendance metrics, interactive quick-action shortcuts, and financial charts.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Executive Analytics View (Modern Glassmorphic Cards)</span>
        <span>http://localhost:3000/dashboard/admin</span>
      </div>
      <img src="${images.adminModern}" class="screenshot-img" alt="Admin Dashboard Modern">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>📊 Instant KPI Metrics</h5>
        <p>Live count of total enrolled students, faculty count, today's attendance percentage, and monthly fee collections.</p>
      </div>
      <div class="key-point-card">
        <h5>⚡ Instant Quick Actions</h5>
        <p>One-click direct links to Register Admission, Collect Fees, Mark Attendance, and Send Mass Broadcasts.</p>
      </div>
      <div class="key-point-card">
        <h5>🌓 Header Controls</h5>
        <p>Integrated Dark Mode toggle, Classic View switcher, notification bell with unread badge count, and user profile drawer.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 5: ADMIN DASHBOARD CLASSIC VIEW -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">03</div>
        <h2 class="section-title">Super Admin Dashboard — Classic Data-First View</h2>
      </div>
      <span class="role-badge badge-admin">Super Admin / Operations</span>
    </div>

    <div class="desc-box">
      <p><strong>Switch Action:</strong> Top-right header toggle <span class="code-badge">Classic View</span></p>
      <p>Recognizing that veteran school clerks and operators prefer dense data layouts without large decorative charts, Vidyalaya includes a specialized "Classic View". This view organizes modules into tabular clusters for rapid keyboard-friendly navigation.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>High-Density Operational View (Compact Tables & Ledgers)</span>
        <span>http://localhost:3000/dashboard/admin (Classic Mode Active)</span>
      </div>
      <img src="${images.adminClassic}" class="screenshot-img" alt="Admin Dashboard Classic">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>🗂️ Dense Module Grid</h5>
        <p>Grouped by Student Office, Fee Accounts, Academic Operations, Examination Cell, and Campus Administration.</p>
      </div>
      <div class="key-point-card">
        <h5>⚡ Zero Distraction Workflow</h5>
        <p>Streamlined layout for low-latency desktop computers commonly deployed in school administrative back-offices.</p>
      </div>
      <div class="key-point-card">
        <h5>🔄 Dynamic Mode Persistence</h5>
        <p>Switch between Modern and Classic views anytime without page reloads; session remembers preference.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 6: STUDENT MANAGEMENT -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">04</div>
        <h2 class="section-title">Student Information System (SIS)</h2>
      </div>
      <span class="role-badge badge-admin">Admin / Registrar</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/students</span></p>
      <p>Central repository for every student profile in the school. Features real-time search, multi-parameter filtering (by Class, Section, Gender, Status), batch export to Excel/CSV, and comprehensive student profile dossiers.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Student Directory with Filter Pills & Action Menus</span>
        <span>http://localhost:3000/students</span>
      </div>
      <img src="${images.studentMgmt}" class="screenshot-img" alt="Student Management">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>🔍 Instant Live Search</h5>
        <p>Search by student name, roll number, admission number, or guardian mobile number in real time.</p>
      </div>
      <div class="key-point-card">
        <h5>🏷️ Class & Section Filtering</h5>
        <p>Filter through Pre-Primary up to Senior Secondary Class 12 with active section division tracking.</p>
      </div>
      <div class="key-point-card">
        <h5>📄 Student Ledger & Profile</h5>
        <p>View complete fee payment history, past exam report cards, and attendance log from individual action buttons.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 7: NEW ADMISSION WORKFLOW -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">05</div>
        <h2 class="section-title">Online & Counter Admission Enrollment</h2>
      </div>
      <span class="role-badge badge-admin">Admin / Admissions</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/admission/new</span></p>
      <p>Streamlined multi-section student onboarding form capturing academic details, student biodata, Aadhaar number, parent/guardian occupation, emergency contacts, medical records, and previous school transfer certificates (TC).</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Structured Multi-Section Student Admission Form</span>
        <span>http://localhost:3000/admission/new</span>
      </div>
      <img src="${images.admission}" class="screenshot-img" alt="New Admission">
    </div>

    <div class="workflow-steps">
      <div class="workflow-step">
        <div class="workflow-step-num">1</div>
        <div class="workflow-step-text"><strong>Academic Allocation:</strong> Choose Academic Year, target Class (Nursery to 12th), Section, and auto-generated Roll Number.</div>
      </div>
      <div class="workflow-step">
        <div class="workflow-step-num">2</div>
        <div class="workflow-step-text"><strong>Student Demographics:</strong> First/Last Name, Gender, Date of Birth, Blood Group, Religion, Category, and Aadhaar identification.</div>
      </div>
      <div class="workflow-step">
        <div class="workflow-step-num">3</div>
        <div class="workflow-step-text"><strong>Guardian & Contact:</strong> Father's/Mother's name, annual family income, registered mobile number for SMS alerts, and permanent residential address.</div>
      </div>
    </div>
  </div>

  <!-- PAGE 8: FEE COLLECTION COUNTER -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">06</div>
        <h2 class="section-title">Fee Collection Counter & Receipt Engine</h2>
      </div>
      <span class="role-badge badge-admin">Accountant / Cashier</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/fees/collect</span></p>
      <p>High-speed fee collection interface engineered for busy school fee counters. The cashier searches for a student, instantly inspects pending fee heads (Tuition, Transport, Computer Lab, Annual Sports), applies concessions, and generates instant printable thermal receipts.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Counter Fee Terminal with Head Breakdown & Mode Selection</span>
        <span>http://localhost:3000/fees/collect</span>
      </div>
      <img src="${images.feeCollect}" class="screenshot-img" alt="Fee Collection">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>🧾 Itemized Fee Breakdown</h5>
        <p>Automatic computation of tuition fee, transport charges, lab maintenance, and late fine calculation.</p>
      </div>
      <div class="key-point-card">
        <h5>💳 Multi-Payment Modes</h5>
        <p>Supports Cash, UPI / QR Code, Net Banking, Cheque, and Debit/Credit Cards with transaction reference tracking.</p>
      </div>
      <div class="key-point-card">
        <h5>🖨️ Instant Thermal Receipts</h5>
        <p>Generates clean PDF and 80mm thermal receipts with school seal, transaction timestamp, and digital signature.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 9: FEE DUES MANAGEMENT -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">07</div>
        <h2 class="section-title">Fee Dues Monitoring & Defaulter Tracking</h2>
      </div>
      <span class="role-badge badge-admin">Admin / Finance</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/fees/dues</span></p>
      <p>Executive finance ledger summarizing total outstanding dues across the school. Allows filtering by class and section to generate automated fee reminder notices and analyze collection efficiency trends.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Pending Fee Ledger with Defaulter Details and Class Totals</span>
        <span>http://localhost:3000/fees/dues</span>
      </div>
      <img src="${images.feeDues}" class="screenshot-img" alt="Fee Dues">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>📉 Total Outstanding Card</h5>
        <p>Aggregate overdue balances across all classes with instant calculation of total pending receivables.</p>
      </div>
      <div class="key-point-card">
        <h5>📢 Automated SMS Reminders</h5>
        <p>Send bulk reminder notifications to registered parents' mobile numbers before fee due deadlines.</p>
      </div>
      <div class="key-point-card">
        <h5>📥 Export Defaulter Lists</h5>
        <p>One-click CSV/Excel export for accountant audits and management review meetings.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 10: ATTENDANCE MANAGEMENT -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">08</div>
        <h2 class="section-title">Daily Attendance & Roster Management</h2>
      </div>
      <span class="role-badge badge-teacher">Teachers & Admin</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/attendance</span></p>
      <p>Daily roll call interface supporting both manual single-tap marking and automated biometric machine sync. Teachers select their class and section to record Present (P), Absent (A), Late (L), or Half-Day (HD) status.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Classroom Attendance Roster with Real-Time Summary Stats</span>
        <span>http://localhost:3000/attendance</span>
      </div>
      <img src="${images.attendance}" class="screenshot-img" alt="Attendance Management">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>⚡ One-Click "Mark All Present"</h5>
        <p>Saves teachers time by defaulting all students to present, allowing quick toggling of only the absentees.</p>
      </div>
      <div class="key-point-card">
        <h5>📲 Absentee Parent Alerts</h5>
        <p>Optionally triggers automated SMS/push notification to parents when a child is marked absent without prior leave.</p>
      </div>
      <div class="key-point-card">
        <h5>📈 Monthly Percentage Tracker</h5>
        <p>Maintains running attendance percentages required for CBSE/ICSE exam admit card eligibility checks.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 11: EXAM MANAGEMENT -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">09</div>
        <h2 class="section-title">Examinations & Marksheet Ledger</h2>
      </div>
      <span class="role-badge badge-admin">Exam Cell / Teachers</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/exams</span></p>
      <p>End-to-end examination management covering term exam scheduling, timetable generation, hall tickets, marks entry by subject teachers, grade calculation according to CBSE/State Board rubrics, and automated report card printing.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Examination Schedules, Subject Papers, and Grading Thresholds</span>
        <span>http://localhost:3000/exams</span>
      </div>
      <img src="${images.exams}" class="screenshot-img" alt="Exam Management">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>📅 Term & Unit Test Schemes</h5>
        <p>Configure Periodic Tests, Half-Yearly, Pre-Boards, and Annual Examinations with passing criteria.</p>
      </div>
      <div class="key-point-card">
        <h5>🧮 Automatic Grade Calculation</h5>
        <p>Automatic mapping of scores into standard CBSE grades (A1, A2, B1, B2) with GPA computation.</p>
      </div>
      <div class="key-point-card">
        <h5>🖨️ Printable Report Cards</h5>
        <p>Generate institutional report cards complete with teacher remarks, co-scholastic grades, and principal stamp.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 12: NOTIFICATIONS & SCHOOL CHAT -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">10</div>
        <h2 class="section-title">Real-Time Communications & Campus Chat</h2>
      </div>
      <span class="role-badge badge-universal">All Campus Personas</span>
    </div>

    <div class="desc-box">
      <p><strong>Routes:</strong> <span class="code-badge">/notifications</span> & <span class="code-badge">/chat</span></p>
      <p>Eliminates external unmonitored WhatsApp groups by providing an in-app school communication hub. Broadcast urgent announcements, emergency holiday alerts, and maintain audited direct message channels between teachers and parents.</p>
    </div>

    <div class="two-col-grid">
      <div class="screenshot-frame">
        <div class="screenshot-frame-header">
          <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
          <span>Notifications & Circulars</span>
        </div>
        <img src="${images.notifications}" class="screenshot-img" alt="Notifications Center">
      </div>

      <div class="screenshot-frame">
        <div class="screenshot-frame-header">
          <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
          <span>In-App Real-Time Chat</span>
        </div>
        <img src="${images.chat}" class="screenshot-img" alt="School Chat">
      </div>
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>📢 Role-Targeted Broadcasts</h5>
        <p>Target circulars to All School, Teachers only, Parents only, or specific Class divisions with attachments.</p>
      </div>
      <div class="key-point-card">
        <h5>💬 Secure Teacher-Parent Chat</h5>
        <p>Facilitates parent-teacher collaboration while preserving personal phone number privacy.</p>
      </div>
      <div class="key-point-card">
        <h5>🔔 Real-Time Header Bell</h5>
        <p>Instant notification badge in the global navigation bar alerts users of newly published notices.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 13: TEACHER DASHBOARD -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">11</div>
        <h2 class="section-title">Teacher Academic Portal</h2>
      </div>
      <span class="role-badge badge-teacher">Class Teacher / Subject Teacher</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/dashboard/teacher</span> | <strong>Login:</strong> <span class="code-badge">teacher@school.com</span></p>
      <p>Dedicated workspace for classroom instructors. Displays today's teaching timetable, pending homework reviews, assigned class attendance summary, and direct links to update marks and syllabus progression.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Teacher Portal Dashboard (Timetable, Quick Actions & Assigned Classes)</span>
        <span>http://localhost:3000/dashboard/teacher</span>
      </div>
      <img src="${images.teacherDash}" class="screenshot-img" alt="Teacher Dashboard">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>⏰ Daily Period Timetable</h5>
        <p>Instant view of current day's lecture slots, assigned room numbers, and subject curricula.</p>
      </div>
      <div class="key-point-card">
        <h5>📚 Homework Assignment Hub</h5>
        <p>Create and distribute digital assignments, define submission deadlines, and evaluate student work.</p>
      </div>
      <div class="key-point-card">
        <h5>📝 Fast Marksheet Entry</h5>
        <p>Quick spreadsheet-like marksheet entry matrix to record test scores efficiently after evaluations.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 14: PARENT PORTAL -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">12</div>
        <h2 class="section-title">Parent Guardian Portal</h2>
      </div>
      <span class="role-badge badge-parent">Parents / Guardians</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/dashboard/parent</span> | <strong>Login:</strong> <span class="code-badge">parent@school.com</span></p>
      <p>Empowers parents with comprehensive transparency into their child's academic journey. Features child attendance percentage, upcoming examination dates, fee dues with online receipt verification, and school events calendar.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Parent Dashboard (Ward Performance, Fee Dues & School Calendar)</span>
        <span>http://localhost:3000/dashboard/parent</span>
      </div>
      <img src="${images.parentPortal}" class="screenshot-img" alt="Parent Portal">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>🎓 Ward Information Profile</h5>
        <p>Displays enrolled child's class, section, class teacher name, and school identity card credentials.</p>
      </div>
      <div class="key-point-card">
        <h5>💳 Transparent Fee Status</h5>
        <p>Clear visibility into paid receipts and outstanding quarter dues to eliminate late fee surprises.</p>
      </div>
      <div class="key-point-card">
        <h5>📅 School Event Calendar</h5>
        <p>Notices for upcoming examinations, Parent-Teacher Meetings (PTM), and scheduled festive holidays.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 15: STUDENT PORTAL -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">13</div>
        <h2 class="section-title">Student Self-Service Learning Portal</h2>
      </div>
      <span class="role-badge badge-student">Students</span>
    </div>

    <div class="desc-box">
      <p><strong>Route:</strong> <span class="code-badge">/dashboard/student</span> | <strong>Login:</strong> <span class="code-badge">student@school.com</span></p>
      <p>Designed for student engagement and academic autonomy. Enables students to review homework submissions, check weekly timetables, inspect personal attendance percentages, and download digital syllabus materials.</p>
    </div>

    <div class="screenshot-frame">
      <div class="screenshot-frame-header">
        <div class="window-dots"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
        <span>Student Workspace (Homework, Attendance Percentage & Exam Schedule)</span>
        <span>http://localhost:3000/dashboard/student</span>
      </div>
      <img src="${images.studentPortal}" class="screenshot-img" alt="Student Portal">
    </div>

    <div class="key-points-grid">
      <div class="key-point-card">
        <h5>📖 Homework Checklist</h5>
        <p>Track pending and completed homework assignments across Mathematics, Science, and Languages.</p>
      </div>
      <div class="key-point-card">
        <h5>🗓️ Weekly Class Timetable</h5>
        <p>Access daily class routine, teacher allocations, and lab schedule right from mobile or tablet.</p>
      </div>
      <div class="key-point-card">
        <h5>📊 Performance & Badges</h5>
        <p>Inspect academic test scores, class rank standing, and co-curricular achievement recognitions.</p>
      </div>
    </div>
  </div>

  <!-- PAGE 16: CONCLUSION & SUMMARY -->
  <div class="page">
    <div class="section-header">
      <div class="section-title-wrap">
        <div class="section-number">★</div>
        <h2 class="section-title">Executive Summary & Production Deployment</h2>
      </div>
      <span class="role-badge badge-universal">Implementation Summary</span>
    </div>

    <div class="desc-box">
      The Vidyalaya School ERP delivers a unified, modern, and reliable solution for Indian academic institutions. By replacing fragmented spreadsheets and manual ledgers, the platform establishes complete institutional governance.
    </div>

    <div style="margin: 20px 0;">
      <h3 style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #1e293b;">Core Value Deliverables</h3>
      <table style="margin-top: 0;">
        <thead>
          <tr>
            <th>Module</th>
            <th>Primary Benefit</th>
            <th>Impact on School Operations</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Admission & SIS</strong></td>
            <td>Paperless onboarding & digital student dossiers</td>
            <td>Eliminates 90% manual paperwork during admission season.</td>
          </tr>
          <tr>
            <td><strong>Fee Collection Engine</strong></td>
            <td>Multi-head accounting & thermal receipting</td>
            <td>Prevents fee leakage, eliminates reconciliation delays.</td>
          </tr>
          <tr>
            <td><strong>Attendance Tracker</strong></td>
            <td>One-tap class register & absentee parent alerts</td>
            <td>Increases student safety and improves parent trust.</td>
          </tr>
          <tr>
            <td><strong>Exam Cell & Grading</strong></td>
            <td>Automated CBSE rubrics & report card printing</td>
            <td>Reduces exam processing time from 2 weeks to 2 hours.</td>
          </tr>
          <tr>
            <td><strong>Real-Time Chat & Circulars</strong></td>
            <td>Integrated audited campus messaging</td>
            <td>Centralizes communication, protecting personal privacy.</td>
          </tr>
          <tr>
            <td><strong>Role-Based Portals</strong></td>
            <td>Tailored views for Admin, Teacher, Parent & Student</td>
            <td>Fosters collaborative student growth and accountability.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top: 24px; padding: 20px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px;">
      <h4 style="font-size: 13px; font-weight: 800; color: #1e40af; margin-bottom: 6px;">Next Steps for Institutional Onboarding</h4>
      <p style="font-size: 12px; color: #1e3a8a; line-height: 1.5;">
        To onboard a new school branch or academic session, configure the institutional profile in <code>/settings</code>, import faculty and student lists via the bulk CSV importer, set up fee structures in <code>/fees</code>, and issue automated login credentials to staff, parents, and students.
      </p>
    </div>

    <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 11px;">
      Vidyalaya School ERP System • Document Compiled with Puppeteer • Confidential & Proprietary
    </div>
  </div>

</body>
</html>
`;
}

async function main() {
  console.log('1. Building HTML Demo Guide...');
  const htmlContent = buildHtml();
  fs.writeFileSync(OUTPUT_HTML, htmlContent, 'utf8');
  console.log(`Saved HTML guide to: ${OUTPUT_HTML} (${(htmlContent.length / 1024 / 1024).toFixed(2)} MB)`);

  console.log('2. Launching Chrome for PDF generation...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  console.log('3. Loading HTML content into browser...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('4. Rendering PDF document...');
  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm',
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 8px; color: #94a3b8; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between; font-family: sans-serif;">
        <span>Vidyalaya School Management ERP — Demo & Walkthrough Guide</span>
        <span>Confidential</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 8px; color: #94a3b8; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between; font-family: sans-serif;">
        <span>Role Workflows: Admin to Student</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();

  const stats = fs.statSync(OUTPUT_PDF);
  console.log(`5. PDF generated successfully!`);
  console.log(`Path: ${OUTPUT_PDF}`);
  console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
