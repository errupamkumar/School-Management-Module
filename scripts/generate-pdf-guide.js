/**
 * Vidyalaya School Management System - PDF Demo Guide Generator
 * Generates a comprehensive multi-page PDF walkthrough with embedded screenshots,
 * hierarchical indexing, tech stack, deployed URL, RBAC matrix, and new feature explanations.
 */

const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  console.log('Starting Vidyalaya PDF Demo Guide generation...');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm

  // Colors
  const COLOR_NAVY = [15, 23, 42];        // #0F172A
  const COLOR_PRIMARY = [99, 102, 241];    // #6366F1
  const COLOR_PURPLE = [124, 58, 237];     // #7C3AED
  const COLOR_EMERALD = [16, 185, 129];    // #10B981
  const COLOR_AMBER = [245, 158, 11];      // #F59E0B
  const COLOR_TEXT = [51, 65, 85];         // #334155
  const COLOR_MUTED = [100, 116, 139];     // #64748B
  const COLOR_BG_LIGHT = [248, 250, 252];  // #F8FAFC
  const COLOR_BORDER = [226, 232, 240];    // #E2E8F0

  // Helper to load image as base64 data URI
  function getImageDataUri(relPath) {
    try {
      const fullPath = path.resolve(__dirname, '..', relPath);
      if (fs.existsSync(fullPath)) {
        const buffer = fs.readFileSync(fullPath);
        const ext = path.extname(fullPath).toLowerCase().replace('.', '');
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        return `data:${mime};base64,${buffer.toString('base64')}`;
      }
    } catch (e) {
      console.warn(`Could not load image: ${relPath}`, e.message);
    }
    return null;
  }

  // Running Header & Footer for pages 2+
  function addHeaderAndFooter(pageNum, totalPages, sectionTitle) {
    if (pageNum === 1) return; // Skip cover page

    // Header
    doc.setFillColor(...COLOR_BG_LIGHT);
    doc.rect(0, 0, pageWidth, 14, 'F');
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.setLineWidth(0.8);
    doc.line(0, 14, pageWidth, 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_NAVY);
    doc.text('VIDYALAYA — SCHOOL MANAGEMENT SYSTEM', marginX, 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_PURPLE);
    doc.text(sectionTitle || 'System Walkthrough & Architecture', pageWidth / 2, 9, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLOR_EMERALD);
    doc.text('POWERED BY SRM ECO TECH', pageWidth - marginX, 9, { align: 'right' });

    // Footer
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.4);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text('Confidential & Educational Demo Guide • https://github.com/errupamkumar/School-Management-Module', marginX, pageHeight - 7);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - marginX, pageHeight - 7, { align: 'right' });
  }

  // Helper for Section Titles
  function drawSectionTitle(y, number, title, subtitle) {
    doc.setFillColor(...COLOR_NAVY);
    doc.roundedRect(marginX, y, contentWidth, 10, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${number}  ${title.toUpperCase()}`, marginX + 4, y + 6.8);

    if (subtitle) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text(subtitle, marginX, y + 14.5);
      return y + 17;
    }
    return y + 13;
  }

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  console.log('Generating Page 1: Cover Page...');

  // Top Dark Navy Hero Banner
  doc.setFillColor(...COLOR_NAVY);
  doc.rect(0, 0, pageWidth, 115, 'F');

  // Decorative Accent bar
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 115, pageWidth, 3, 'F');

  // Cover Logo / Icon
  doc.setFillColor(...COLOR_PURPLE);
  doc.roundedRect(marginX, 22, 20, 20, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('V', marginX + 10, 35, { align: 'center' });

  // Vidyalaya Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('VIDYALAYA', marginX + 25, 31);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('ENTERPRISE SCHOOL MANAGEMENT SYSTEM', marginX + 25, 38);

  // Big Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(248, 250, 252);
  doc.text('Next-Generation Cloud ERP & Academic Management Platform', marginX, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(148, 163, 184); // slate-400
  const coverDesc = 'A comprehensive, production-grade School ERP engineered specifically for Indian CBSE, ICSE, and State Board Institutions. Featuring dynamic dual dashboards, multi-campus governance, bilingual English/Hindi localization, and an intelligent AI Assistant Copilot.';
  doc.text(doc.splitTextToSize(coverDesc, contentWidth), marginX, 68);

  // SRM ECO TECH Branding Banner
  const srmLogoUri = getImageDataUri('public/srm-eco-tech.png');
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(marginX, 88, contentWidth, 20, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text('OFFICIAL TECHNOLOGY PARTNER', marginX + 6, 96);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text('Powered by SRM ECO TECH • Enterprise Scalability & Innovation', marginX + 6, 102);

  if (srmLogoUri) {
    doc.addImage(srmLogoUri, 'PNG', pageWidth - marginX - 42, 91, 38, 14);
  }

  // Bottom Content: Key Metadata & Information Grid
  let curY = 130;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_NAVY);
  doc.text('COMPREHENSIVE DEMO WALKTHROUGH & ARCHITECTURE GUIDE', marginX, curY);

  curY += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_TEXT);
  doc.text('Version 2.4 Enterprise Edition • Step-by-Step UI Verification • Role-Based Access Control', marginX, curY);

  curY += 12;

  // Metadata Table
  doc.autoTable({
    startY: curY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_NAVY,
      textColor: 255,
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.8,
      textColor: COLOR_TEXT,
      lineColor: COLOR_BORDER,
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45, textColor: COLOR_NAVY },
      1: { cellWidth: 137 },
    },
    head: [['Project Metadata', 'System Parameter & Repository Details']],
    body: [
      ['Live Deployed URL', 'https://school-management-module.vercel.app'],
      ['GitHub Repository', 'https://github.com/errupamkumar/School-Management-Module'],
      ['Tech Stack', 'Next.js 14 App Router, TypeScript 5, Tailwind CSS 3.4, Prisma ORM, PostgreSQL'],
      ['AI Copilot Engine', 'Google Gemini Cascade (3.5 Flash Lite, 3.6 Flash, 3.7 Flash) via REST API'],
      ['Security Framework', 'Role-Based Access Control (RBAC), NextAuth.js JWT, Strict Data Isolation'],
      ['Supported Curricula', 'CBSE (CCE), ICSE, State Boards (Nursery to Class 12, Academic Term April–March)'],
      ['Localization & Theme', 'Instant Bilingual Toggle (English / हिंदी) • Adaptive Dark / Light System Palette'],
      ['Published Documentation', 'docs/BRD-School-Management-System.md • docs/DEPLOYMENT_GUIDE.md'],
      ['Release Date', 'September 2026 • Production Release (Commit 8da3fc4 / b38cd40)'],
    ],
  });

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS (INDEX)
  // ==========================================
  doc.addPage();
  console.log('Generating Page 2: Table of Contents & Executive Summary...');

  curY = 22;
  curY = drawSectionTitle(curY, '1.0', 'Table of Contents & Hierarchical Index');

  const tocItems = [
    { num: '1.0', title: 'Executive Overview & System Vision', desc: 'Indian academic adaptation, SRM ECO TECH sponsorship, and core goals', page: '3' },
    { num: '2.0', title: 'Technology Stack & Multi-Layer Architecture', desc: 'Next.js 14, TypeScript, Tailwind, Prisma ORM, and Google Gemini integration', page: '3' },
    { num: '3.0', title: 'Role-Based Access Control (RBAC) Matrix', desc: 'Granular permissions for Super Admin, School Admin, Teacher, Accountant, Parent, Student', page: '4' },
    { num: '4.0', title: 'Demo User Accounts & Fast-Fill Credentials', desc: 'Pre-configured credentials and 1-click login quick-fill configuration', page: '4' },
    { num: '5.0', title: 'Step-by-Step Feature Walkthrough (Steps 1–11)', desc: 'Full application walkthrough with embedded high-resolution screenshots', page: '5–10' },
    { num: '  5.1', title: 'Step 1: Split-Screen Authentication & Role Fast-Fill', desc: 'Modern login screen, password hashing, and instant role testing', page: '5' },
    { num: '  5.2', title: 'Step 2: Dual Dashboard Architecture (Modern Analytics vs Classic ERP)', desc: 'KPI cards, Recharts visual trends, and high-density eSkooly management panel', page: '5' },
    { num: '  5.3', title: 'Step 3: Student Information System (SIS 360)', desc: 'Aadhaar, blood group, emergency contacts, filters, and Excel export', page: '6' },
    { num: '  5.4', title: 'Step 4: Multi-Step Online Admission Portal', desc: 'Applicant registration, automated Admission No, and document uploads', page: '6' },
    { num: '  5.5', title: 'Step 5: Fast Fee Collection Terminal with Instant PDF Receipts', desc: 'Head-wise fee collection, payment modes, and printable receipts', page: '7' },
    { num: '  5.6', title: 'Step 6: Defaulters & Outstanding Dues Tracker', desc: 'Automated overdue balances, penalty rules, and collection notices', page: '7' },
    { num: '  5.7', title: 'Step 7: Smart Daily & Biometric Attendance System', desc: 'Single-click roster marking, barcode/card scanning, and summary statistics', page: '8' },
    { num: '  5.8', title: 'Step 8: Examination Scheduling, Marks Entry & Report Cards', desc: 'Periodic tests, batch marks entry, GPA automations, and CBSE report cards', page: '8' },
    { num: '  5.9', title: 'Step 9: Instant Notification & SMS Broadcast Center', desc: 'Categorized circulars, MSG91 SMS gateway templates, and emergency alerts', page: '9' },
    { num: '  5.10', title: 'Step 10: Real-Time Inter-Role School Chat & Collaboration', desc: 'Direct and channel messaging for teachers, parents, students, and staff', page: '9' },
    { num: '  5.11', title: 'Step 11: Dedicated Role Portals: Teacher, Parent, Student', desc: 'Tailored experiences for classroom management, ward tracker, and study desk', page: '10' },
    { num: '6.0', title: 'Special Showcase: Intelligent AI Assistant Copilot', desc: 'Google Gemini integration, role-specific personas, voice wake, and RBAC data isolation', page: '11' },
    { num: '7.0', title: 'Cross-Device Mobile Responsiveness & Multi-Platform Usability', desc: 'Viewport optimization across Android/iOS phones, collapsible drawers, and touch UI', page: '12' },
    { num: '8.0', title: 'Quick Start, Local Development & Deployment Guide', desc: 'Prerequisites, environment setup, database seeding, and production build', page: '12' },
  ];

  doc.autoTable({
    startY: curY,
    margin: { left: marginX, right: marginX },
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: COLOR_TEXT,
      lineColor: COLOR_BORDER,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 16, textColor: COLOR_PRIMARY },
      1: { fontStyle: 'bold', cellWidth: 80, textColor: COLOR_NAVY },
      2: { cellWidth: 70, textColor: COLOR_MUTED },
      3: { fontStyle: 'bold', cellWidth: 16, halign: 'right', textColor: COLOR_PURPLE },
    },
    head: [['Index', 'Section Title', 'Description / Scope', 'Page']],
    headStyles: {
      fillColor: COLOR_BG_LIGHT,
      textColor: COLOR_NAVY,
      fontSize: 8,
      fontStyle: 'bold',
      lineColor: COLOR_BORDER,
      lineWidth: 0.2,
    },
    body: tocItems.map((item) => [item.num, item.title, item.desc, item.page]),
  });

  // Callout Box on Recent Upgrades
  const finalY = doc.lastAutoTable.finalY + 6;
  doc.setFillColor(243, 232, 255); // purple-50
  doc.setDrawColor(...COLOR_PURPLE);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, finalY, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PURPLE);
  doc.text('🚀 RECENT CORE UPGRADES HIGHLIGHT (SEPTEMBER 2026)', marginX + 4, finalY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_NAVY);
  const upNotes = [
    '• AI Assistant Copilot: Live Google Gemini cascade integration with role-specific personas and daily quota limits.',
    '• Strict Session-Based RBAC: Client role-switcher tabs removed. Non-admins strictly blocked from institutional financials.',
    '• Clean Markdown Formatting: Complete eradication of solid Unicode block character artifacts ("bullar").',
    '• Powered by SRM ECO TECH: Integrated official branding across headers, footers, sidebars, and login screens.',
  ];
  upNotes.forEach((note, idx) => {
    doc.text(note, marginX + 4, finalY + 10 + idx * 3.6);
  });

  // ==========================================
  // PAGE 3: TECH STACK & ARCHITECTURE
  // ==========================================
  doc.addPage();
  console.log('Generating Page 3: Technology Stack & System Architecture...');

  curY = 22;
  curY = drawSectionTitle(curY, '2.0', 'Technology Stack & System Architecture', 'Next-Generation Full-Stack Engineering for Educational Multi-Tenancy');

  const techRows = [
    ['Framework & Runtime', 'Next.js 14.2 (App Router) + Node.js 20', 'Server Components, Route Handlers, Optimized bundling, Fast Refresh'],
    ['Programming Language', 'TypeScript 5.4 (Strict Type Safety)', 'End-to-end interface validation across database, API routes, and UI components'],
    ['AI & LLM Engine', 'Google Gemini AI (REST API)', 'Multi-model cascade (3.5 Flash Lite, 3.6 Flash, 3.7 Flash) with daily rate limits'],
    ['UI & Styling System', 'Tailwind CSS 3.4 + Lucide React', 'Bilingual layouts, dark/light theme, custom glassmorphism & responsive breakpoints'],
    ['Database & ORM', 'PostgreSQL 15+ / MySQL + Prisma ORM 5.14', 'Relational database schema with 40+ models, migrations, and automated seeding'],
    ['Authentication & RBAC', 'NextAuth.js v4 + JWT + bcryptjs', 'Session tokens, cryptographic password hashing, role guards, and middleware'],
    ['Analytics & Charts', 'Recharts 2.12', 'Interactive revenue trend lines, monthly attendance bars, fee collection charts'],
    ['Document Export', 'jsPDF 2.5 + AutoTable + SheetJS (XLSX)', 'Client & server-side generation of fee receipts, report cards, ID cards, Excel exports'],
    ['Speech & Audio', 'HTML5 Web Speech API', 'Hands-free voice recognition, real-time speech-to-text, and voice wake listener'],
    ['Communication Gateways', 'Nodemailer SMTP + MSG91 SMS API', 'Automated email dispatch for circulars and transactional DLT-compliant SMS notifications'],
  ];

  doc.autoTable({
    startY: curY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    headStyles: { fillColor: COLOR_NAVY, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    styles: { fontSize: 7.5, cellPadding: 2.2, textColor: COLOR_TEXT, lineColor: COLOR_BORDER, lineWidth: 0.2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40, textColor: COLOR_NAVY },
      1: { fontStyle: 'bold', cellWidth: 55, textColor: COLOR_PRIMARY },
      2: { cellWidth: 87 },
    },
    head: [['System Domain', 'Technology & Library', 'Architectural Role & Key Benefit']],
    body: techRows,
  });

  // Architecture Narrative & Links
  const archY = doc.lastAutoTable.finalY + 6;
  doc.setFillColor(...COLOR_BG_LIGHT);
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, archY, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_NAVY);
  doc.text('ARCHITECTURE PRINCIPLES & DEPLOYMENT TOPOLOGY', marginX + 4, archY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_TEXT);
  const archDesc = [
    '• Multi-Tenant Domain Isolation: Each campus, academic year, and student roster is strictly partitioned with foreign key integrity.',
    '• Dual Dashboard Routing: Modern Analytics (Client-side interactive state) and Classic ERP (Server-rendered operational density).',
    '• Hybrid Rendering: Static page generation for documentation and high-speed dynamic server rendering for transactional records.',
    '• High-Availability Production Deployment: Fully optimized for zero-downtime deployment on Vercel, Docker containers, and Linux VPS.',
  ];
  archDesc.forEach((line, i) => {
    doc.text(line, marginX + 4, archY + 11 + i * 4);
  });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_PURPLE);
  doc.text('Live Deployment URL: https://school-management-module.vercel.app', marginX + 4, archY + 29);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('Source Repository: https://github.com/errupamkumar/School-Management-Module', marginX + 4, archY + 34);

  // ==========================================
  // PAGE 4: RBAC MATRIX & DEMO CREDENTIALS
  // ==========================================
  doc.addPage();
  console.log('Generating Page 4: Role-Based Access Control Matrix...');

  curY = 22;
  curY = drawSectionTitle(curY, '3.0', 'Role-Based Access Control (RBAC) Matrix', 'Enterprise Multi-Tier Permission Hierarchy & Fast-Fill Credentials');

  const rbacHeaders = ['Module / Privilege', 'Super Admin', 'School Admin', 'Teacher', 'Accountant', 'Parent', 'Student'];
  const rbacBody = [
    ['Campus & Global Settings', 'Full Access', 'View Only', 'No Access', 'No Access', 'No Access', 'No Access'],
    ['User & Staff Management', 'Full Access', 'Full Access', 'No Access', 'No Access', 'No Access', 'No Access'],
    ['Student Admissions & SIS', 'Full Access', 'Full Access', 'View Roster', 'No Access', 'No Access', 'No Access'],
    ['Fee Collection & Receipts', 'Full Access', 'Full Access', 'No Access', 'Full Access', 'Pay / View Ward', 'No Access'],
    ['Institutional Financials', 'Full Access', 'Full Access', 'Restricted', 'Full Access', 'Restricted', 'Restricted'],
    ['Attendance Marking', 'Full Access', 'Full Access', 'Assigned Class', 'No Access', 'View Ward', 'View Own'],
    ['Examination & Grading', 'Full Access', 'Full Access', 'Assigned Subject', 'No Access', 'View Ward', 'View Own'],
    ['Timetable & Homework', 'Full Access', 'Full Access', 'Create / Edit', 'No Access', 'View Ward', 'View Own'],
    ['Staff Payroll Processing', 'Full Access', 'Full Access', 'View Own Payslip', 'Prepare / Verify', 'No Access', 'No Access'],
    ['AI Assistant Copilot', 'Admin Copilot', 'Admin Copilot', 'Teacher Copilot', 'Admin Copilot', 'Parent Assistant', 'Study Companion'],
    ['Real-Time School Chat', 'All Channels', 'All Channels', 'Class Channels', 'Staff Channel', 'Teacher-Parent', 'Classmates'],
  ];

  doc.autoTable({
    startY: curY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    headStyles: { fillColor: COLOR_NAVY, textColor: 255, fontSize: 7.5, fontStyle: 'bold', halign: 'center' },
    styles: { fontSize: 7, cellPadding: 2, textColor: COLOR_TEXT, lineColor: COLOR_BORDER, lineWidth: 0.2, halign: 'center' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42, halign: 'left', textColor: COLOR_NAVY },
      1: { cellWidth: 23, textColor: COLOR_PURPLE, fontStyle: 'bold' },
      2: { cellWidth: 23 },
      3: { cellWidth: 24 },
      4: { cellWidth: 23 },
      5: { cellWidth: 23 },
      6: { cellWidth: 24 },
    },
    head: [rbacHeaders],
    body: rbacBody,
  });

  // Demo Credentials Section
  const credY = doc.lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_NAVY);
  doc.text('4.0 DEMO USER ACCOUNTS & FAST-FILL CREDENTIALS', marginX, credY);

  const credRows = [
    ['Super Admin', 'admin@school.com', 'Admin@123', 'Full institutional control, financial oversight, campus administration'],
    ['School Admin', 'admin@vidyalaya.com', 'admin123', 'Campus operations, student admissions, staff records & approvals'],
    ['Teacher', 'teacher@school.com', 'Teacher@123', 'Class attendance register, homework distribution, marks entry'],
    ['Parent', 'parent@school.com', 'Parent@123', 'Child attendance tracking, fee payment receipts, bus timings, leave'],
    ['Student', 'student@school.com', 'Student@123', 'Daily period timetable, pending homework assignments, exam datesheets'],
  ];

  doc.autoTable({
    startY: credY + 3,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    headStyles: { fillColor: COLOR_PRIMARY, textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    styles: { fontSize: 7, cellPadding: 2, textColor: COLOR_TEXT, lineColor: COLOR_BORDER, lineWidth: 0.2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 32, textColor: COLOR_NAVY },
      1: { fontStyle: 'bold', cellWidth: 42, textColor: COLOR_PURPLE },
      2: { cellWidth: 28 },
      3: { cellWidth: 80 },
    },
    head: [['Role Profile', 'Login Email', 'Password', 'Pre-Configured Scope & Privileges']],
    body: credRows,
  });

  // ==========================================
  // PAGE 5: STEP 1 & STEP 2 (LOGIN & DASHBOARD)
  // ==========================================
  doc.addPage();
  console.log('Generating Page 5: Step 1 & Step 2 Feature Walkthrough...');

  curY = 22;
  curY = drawSectionTitle(curY, '5.1', 'Step 1: Split-Screen Authentication & Role Fast-Fill');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_TEXT);
  const step1Text = 'The login screen features an enterprise split-screen aesthetic with Indian school branding. Users can authenticate securely via NextAuth.js or use the 1-click Demo Quick-Fill buttons (Admin, Teacher, Parent, Student) to test different permissions without manually typing credentials.';
  doc.text(doc.splitTextToSize(step1Text, contentWidth), marginX, curY);
  curY += 8;

  const img01 = getImageDataUri('docs/screenshots/01_login_page.png');
  if (img01) {
    doc.addImage(img01, 'PNG', marginX, curY, contentWidth, 54);
    curY += 57;
  }

  curY = drawSectionTitle(curY, '5.2', 'Step 2: Dual Dashboard Architecture (Modern vs Classic)');

  const step2Text = 'Vidyalaya pioneers a dual dashboard system: the Modern Analytics View displays real-time KPI metric cards, Recharts revenue trends, and live attendance gauges. The Classic View provides a high-density, eSkooly-style operational grid for rapid administrative execution.';
  doc.text(doc.splitTextToSize(step2Text, contentWidth), marginX, curY);
  curY += 8;

  const img02 = getImageDataUri('docs/screenshots/02_admin_dashboard_modern.png');
  const img03 = getImageDataUri('docs/screenshots/03_admin_dashboard_classic.png');
  if (img02 && img03) {
    const halfWidth = (contentWidth - 4) / 2;
    doc.addImage(img02, 'PNG', marginX, curY, halfWidth, 48);
    doc.addImage(img03, 'PNG', marginX + halfWidth + 4, curY, halfWidth, 48);
  }

  // ==========================================
  // PAGE 6: STEP 3 & STEP 4 (SIS & ADMISSION)
  // ==========================================
  doc.addPage();
  console.log('Generating Page 6: Step 3 & Step 4 Feature Walkthrough...');

  curY = 22;
  curY = drawSectionTitle(curY, '5.3', 'Step 3: Student Information System (SIS 360)');

  const step3Text = 'Comprehensive student directory with class and section filters, instant fuzzy search, and 360-degree profiles tracking Aadhaar numbers, blood groups, guardian contacts, and medical histories with 1-click Excel (.xlsx) export.';
  doc.text(doc.splitTextToSize(step3Text, contentWidth), marginX, curY);
  curY += 7;

  const img04 = getImageDataUri('docs/screenshots/04_student_management.png');
  if (img04) {
    doc.addImage(img04, 'PNG', marginX, curY, contentWidth, 54);
    curY += 58;
  }

  curY = drawSectionTitle(curY, '5.4', 'Step 4: Multi-Step Online Admission Portal');

  const step4Text = 'A guided 4-step onboarding wizard for enrolling new students: handles basic student demographic data, parent and guardian credentials, previous school academic history, and mandatory document verification with auto-generated Admission Numbers.';
  doc.text(doc.splitTextToSize(step4Text, contentWidth), marginX, curY);
  curY += 7;

  const img05 = getImageDataUri('docs/screenshots/05_new_admission.png');
  if (img05) {
    doc.addImage(img05, 'PNG', marginX, curY, contentWidth, 54);
  }

  // ==========================================
  // PAGE 7: STEP 5 & STEP 6 (FEES & DUES)
  // ==========================================
  doc.addPage();
  console.log('Generating Page 7: Step 5 & Step 6 Feature Walkthrough...');

  curY = 22;
  curY = drawSectionTitle(curY, '5.5', 'Step 5: Fast Fee Collection Terminal with Instant PDF Receipts');

  const step5Text = 'Point-of-sale style fee collection terminal supporting multiple payment modes (Cash, UPI, Net Banking, Cheque/DD). Generates official printable PDF receipts complete with institution logo, fee head itemization, and school seal.';
  doc.text(doc.splitTextToSize(step5Text, contentWidth), marginX, curY);
  curY += 7;

  const img06 = getImageDataUri('docs/screenshots/06_fee_collection.png');
  if (img06) {
    doc.addImage(img06, 'PNG', marginX, curY, contentWidth, 54);
    curY += 58;
  }

  curY = drawSectionTitle(curY, '5.6', 'Step 6: Defaulters & Outstanding Dues Tracker');

  const step6Text = 'Real-time financial dues monitor calculating pending balances, unpaid terms, and late fee penalties across classes. Provides automated WhatsApp and SMS notification triggers to alert parents directly.';
  doc.text(doc.splitTextToSize(step6Text, contentWidth), marginX, curY);
  curY += 7;

  const img07 = getImageDataUri('docs/screenshots/07_fee_dues.png');
  if (img07) {
    doc.addImage(img07, 'PNG', marginX, curY, contentWidth, 54);
  }

  // ==========================================
  // PAGE 8: STEP 7 & STEP 8 (ATTENDANCE & EXAMS)
  // ==========================================
  doc.addPage();
  console.log('Generating Page 8: Step 7 & Step 8 Feature Walkthrough...');

  curY = 22;
  curY = drawSectionTitle(curY, '5.7', 'Step 7: Smart Daily & Biometric Attendance System');

  const step7Text = 'Single-click attendance marking interface for teachers and administrators. Features automated summary metrics (Present, Absent, Late), manual roster grid entry, and integration support for biometric RFID/card scanners.';
  doc.text(doc.splitTextToSize(step7Text, contentWidth), marginX, curY);
  curY += 7;

  const img08 = getImageDataUri('docs/screenshots/08_attendance_management.png');
  if (img08) {
    doc.addImage(img08, 'PNG', marginX, curY, contentWidth, 54);
    curY += 58;
  }

  curY = drawSectionTitle(curY, '5.8', 'Step 8: Examination Scheduling, Marks Entry & Report Cards');

  const step8Text = 'Comprehensive assessment management: handles Periodic Tests, Term Exams, and Annual board grading. Allows bulk marks entry with automated GPA calculation and printable CBSE CCE-compliant report card PDFs.';
  doc.text(doc.splitTextToSize(step8Text, contentWidth), marginX, curY);
  curY += 7;

  const img09 = getImageDataUri('docs/screenshots/09_exam_management.png');
  if (img09) {
    doc.addImage(img09, 'PNG', marginX, curY, contentWidth, 54);
  }

  // ==========================================
  // PAGE 9: STEP 9 & STEP 10 (NOTICES & CHAT)
  // ==========================================
  doc.addPage();
  console.log('Generating Page 9: Step 9 & Step 10 Feature Walkthrough...');

  curY = 22;
  curY = drawSectionTitle(curY, '5.9', 'Step 9: Instant Notification & SMS Broadcast Center');

  const step9Text = 'Multi-channel communication hub enabling administrators to broadcast public circulars, staff alerts, and parent SMS messages using MSG91 and Fast2SMS DLT-compliant templates.';
  doc.text(doc.splitTextToSize(step9Text, contentWidth), marginX, curY);
  curY += 7;

  const img10 = getImageDataUri('docs/screenshots/10_notifications_center.png');
  if (img10) {
    doc.addImage(img10, 'PNG', marginX, curY, contentWidth, 54);
    curY += 58;
  }

  curY = drawSectionTitle(curY, '5.10', 'Step 10: Real-Time Inter-Role School Chat & Collaboration');

  const step10Text = 'Integrated in-app chat facilitating direct and channel communications between teachers, parents, students, and administration with instant messaging and message delivery receipts.';
  doc.text(doc.splitTextToSize(step10Text, contentWidth), marginX, curY);
  curY += 7;

  const img11 = getImageDataUri('docs/screenshots/11_school_chat.png');
  if (img11) {
    doc.addImage(img11, 'PNG', marginX, curY, contentWidth, 54);
  }

  // ==========================================
  // PAGE 10: STEP 11 (DEDICATED ROLE PORTALS)
  // ==========================================
  doc.addPage();
  console.log('Generating Page 10: Step 11 Dedicated Role Portals...');

  curY = 22;
  curY = drawSectionTitle(curY, '5.11', 'Step 11: Dedicated Role Portals: Teacher, Parent, Student');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_TEXT);
  const portalDesc = 'Each stakeholder role experiences a tailored interface respecting strict permission boundaries: Teachers manage class rosters and syllabus; Parents track ward progress and fee dues; Students access timetables and study desks.';
  doc.text(doc.splitTextToSize(portalDesc, contentWidth), marginX, curY);
  curY += 8;

  const img12 = getImageDataUri('docs/screenshots/12_teacher_dashboard.png');
  const img13 = getImageDataUri('docs/screenshots/13_parent_portal.png');
  const img14 = getImageDataUri('docs/screenshots/14_student_portal.png');

  const colWidth = (contentWidth - 6) / 3;

  if (img12 && img13 && img14) {
    doc.addImage(img12, 'PNG', marginX, curY, colWidth, 75);
    doc.addImage(img13, 'PNG', marginX + colWidth + 3, curY, colWidth, 75);
    doc.addImage(img14, 'PNG', marginX + (colWidth + 3) * 2, curY, colWidth, 75);
    curY += 78;
  }

  // Role Explanations Table beneath screenshots
  doc.autoTable({
    startY: curY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    headStyles: { fillColor: COLOR_NAVY, textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    styles: { fontSize: 7, cellPadding: 2, textColor: COLOR_TEXT, lineColor: COLOR_BORDER, lineWidth: 0.2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35, textColor: COLOR_PRIMARY },
      1: { cellWidth: 147 },
    },
    head: [['Role Portal', 'Primary Capabilities & Workflow Focus']],
    body: [
      ['👨‍🏫 Teacher Dashboard', 'Today’s schedule, class attendance status, homework distribution, syllabus progression, exam marks entry.'],
      ['👨‍👩‍👦 Parent Portal', 'Ward attendance percentage, Term 1 & 2 fee receipts, pending installment due dates, transport bus timings.'],
      ['🎓 Student Portal', 'Daily class timetable, homework deadline calendar, exam datesheet overview, digital ID card, study resources.'],
    ],
  });

  // ==========================================
  // PAGE 11: AI ASSISTANT COPILOT SHOWCASE
  // ==========================================
  doc.addPage();
  console.log('Generating Page 11: AI Assistant Copilot Special Showcase...');

  curY = 22;
  curY = drawSectionTitle(curY, '6.0', 'Special Showcase: Intelligent AI Assistant Copilot', 'Powered by Google Gemini & SRM ECO TECH • Role-Aware Persona Architecture');

  const img15 = getImageDataUri('docs/screenshots/15_ai_assistant.png');
  if (img15) {
    doc.addImage(img15, 'PNG', marginX, curY, contentWidth, 72);
    curY += 75;
  }

  // AI Feature Breakdown Grid
  doc.autoTable({
    startY: curY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    headStyles: { fillColor: COLOR_PURPLE, textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    styles: { fontSize: 7, cellPadding: 2, textColor: COLOR_TEXT, lineColor: COLOR_BORDER, lineWidth: 0.2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 44, textColor: COLOR_NAVY },
      1: { cellWidth: 138 },
    },
    head: [['AI Copilot Architectural Pillar', 'Production Implementation Details & Guardrail Enforcement']],
    body: [
      ['Dynamic Persona Engine', 'Assistant adapts its title, greetings, and system prompt dynamically: Admin Copilot, Teacher Copilot, Parent Portal Assistant, and Student Study Companion.'],
      ['Session-Based Strict RBAC', 'Privileges are resolved strictly from getServerSession(authOptions). Client role switcher tabs are removed. Malicious elevation via request body is blocked.'],
      ['Financial Data Isolation', 'Teachers, Parents, and Students are strictly blocked from institutional financials (e.g. ₹4.85L dues, school revenue, net profit, staff salaries).'],
      ['Eradication of "Bullar"', 'Multi-pass regex cleansers and Gemini prompt hardening guarantee zero raw solid Unicode blocks (█, ▇, ■, ▓) or ASCII bar artifacts.'],
      ['Google Gemini Cascade', 'Multi-model fallback cascade across gemini-3.5-flash-lite, gemini-3.6-flash, and gemini-3.7-flash ensuring 99.9% availability.'],
      ['Daily Token Quota Manager', '1,000,000 tokens/day rate-limiting with real-time UI balance tracker and midnight automated reset.'],
      ['Hands-Free Voice Wake', 'HTML5 Web Speech API integration allows speech-to-text queries and "Voice Wake" listening.'],
    ],
  });

  // ==========================================
  // PAGE 12: MOBILE, DEPLOYMENT & QUICK START
  // ==========================================
  doc.addPage();
  console.log('Generating Page 12: Mobile Experience, Deployment & Quick Start...');

  curY = 22;
  curY = drawSectionTitle(curY, '7.0', 'Cross-Device Mobile Responsiveness & Multi-Platform Usability');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_TEXT);
  const mobileDesc = 'Engineered for seamless accessibility across all Android smartphones, iPhones, iPads, and desktop displays. Features responsive navigation drawers with smooth animations, horizontally scrollable data tables (overflow-x-auto touch-scroll), mobile-optimized viewport meta tags, and touch-friendly forms.';
  doc.text(doc.splitTextToSize(mobileDesc, contentWidth), marginX, curY);
  curY += 10;

  curY = drawSectionTitle(curY, '8.0', 'Quick Start, Local Development & Deployment Guide');

  const setupSteps = [
    ['1. Clone Repository', 'git clone https://github.com/errupamkumar/School-Management-Module.git && cd School-Management-Module'],
    ['2. Environment Config', 'cp .env.example .env (Configure DATABASE_URL, NEXTAUTH_SECRET, GEMINI_API_KEY)'],
    ['3. Install Dependencies', 'npm install (Installs Next.js 14, React 18, Prisma ORM, Tailwind CSS, jsPDF, Recharts)'],
    ['4. Database Push & Seed', 'npm run db:push && npm run db:seed (Initializes 40+ tables, classes, fee heads, demo accounts)'],
    ['5. Start Dev Server', 'npm run dev (Runs local server at http://localhost:3000 with hot-reload enabled)'],
    ['6. Production Build', 'npm run build (Compiles 69 production routes with zero TypeScript or ESLint errors)'],
  ];

  doc.autoTable({
    startY: curY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    headStyles: { fillColor: COLOR_NAVY, textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    styles: { fontSize: 7, cellPadding: 2, textColor: COLOR_TEXT, lineColor: COLOR_BORDER, lineWidth: 0.2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40, textColor: COLOR_PRIMARY },
      1: { fontStyle: 'mono', cellWidth: 142 },
    },
    head: [['Setup Step', 'Command Line Execution & Description']],
    body: setupSteps,
  });

  // Final Sign-off Box
  const finalBoxY = doc.lastAutoTable.finalY + 8;
  doc.setFillColor(...COLOR_BG_LIGHT);
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.6);
  doc.roundedRect(marginX, finalBoxY, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_NAVY);
  doc.text('PROJECT LINKS & OFFICIAL VERIFICATION', marginX + 4, finalBoxY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_TEXT);
  doc.text('• Live Web Application: https://school-management-module.vercel.app', marginX + 4, finalBoxY + 12);
  doc.text('• GitHub Source Code: https://github.com/errupamkumar/School-Management-Module', marginX + 4, finalBoxY + 17);
  doc.text('• Technology Sponsor: Powered by SRM ECO TECH (Official Branding Certified)', marginX + 4, finalBoxY + 22);
  doc.text('• License: Open-source MIT License • Developed for Educational Institutes Worldwide', marginX + 4, finalBoxY + 27);

  // Apply running headers and footers across all pages
  const totalPages = doc.getNumberOfPages();
  console.log(`Total PDF Pages generated: ${totalPages}`);

  const sectionTitles = [
    '', // page 1 cover
    '1.0 Table of Contents & Executive Summary',
    '2.0 Technology Stack & System Architecture',
    '3.0 Role-Based Access Control (RBAC) Matrix',
    '5.0 Step-by-Step Feature Walkthrough (Steps 1 & 2)',
    '5.0 Step-by-Step Feature Walkthrough (Steps 3 & 4)',
    '5.0 Step-by-Step Feature Walkthrough (Steps 5 & 6)',
    '5.0 Step-by-Step Feature Walkthrough (Steps 7 & 8)',
    '5.0 Step-by-Step Feature Walkthrough (Steps 9 & 10)',
    '5.0 Step-by-Step Feature Walkthrough (Step 11)',
    '6.0 Special Showcase: Intelligent AI Assistant Copilot',
    '7.0 & 8.0 Mobile Experience, Deployment & Quick Start',
  ];

  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderAndFooter(i, totalPages, sectionTitles[i - 1] || 'Vidyalaya System Demo Guide');
  }

  // Save the generated PDF
  const outputDir = path.resolve(__dirname, '..', 'docs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'Vidyalaya-School-Management-System-Demo-Guide.pdf');
  const pdfBytes = doc.output();
  fs.writeFileSync(outputPath, pdfBytes, 'binary');

  console.log(`✅ PDF successfully generated at: ${outputPath}`);
  console.log(`PDF File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

generatePDF().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
