# 🏫 Vidyalaya - Enterprise School Management System
## 📖 Comprehensive Step-by-Step Demo Walkthrough, Architecture, RBAC & New Features Guide

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75C2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Powered by SRM ECO TECH](https://img.shields.io/badge/Powered_by-SRM_ECO_TECH-00A86B?style=for-the-badge)](https://srmecotech.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.14-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

**Official PDF Document Available**:  
📄 **[Download Vidyalaya-School-Management-System-Demo-Guide.pdf](Vidyalaya-School-Management-System-Demo-Guide.pdf)** *(12 Pages, Complete UI Screenshots & Architectural Breakdown)*

**Live Deployed URL**: [https://school-management-module.vercel.app](https://school-management-module.vercel.app)  
**GitHub Source Code**: [https://github.com/errupamkumar/School-Management-Module](https://github.com/errupamkumar/School-Management-Module)

</div>

---

## 📑 Table of Contents & Hierarchical Index

- [1.0 Executive Overview & System Vision](#10-executive-overview--system-vision)
- [2.0 Technology Stack & Multi-Layer Architecture](#20-technology-stack--multi-layer-architecture)
- [3.0 Role-Based Access Control (RBAC) Matrix](#30-role-based-access-control-rbac-matrix)
- [4.0 Demo User Accounts & Fast-Fill Credentials](#40-demo-user-accounts--fast-fill-credentials)
- [5.0 Step-by-Step Feature Walkthrough with Screenshots](#50-step-by-step-feature-walkthrough-with-screenshots)
  - [5.1 Step 1: Split-Screen Authentication & Role Fast-Fill](#51-step-1-split-screen-authentication--role-fast-fill)
  - [5.2 Step 2: Dual Dashboard Architecture (Modern Analytics vs. Classic ERP Grid)](#52-step-2-dual-dashboard-architecture-modern-analytics-vs-classic-erp-grid)
  - [5.3 Step 3: Student Information System (SIS 360)](#53-step-3-student-information-system-sis-360)
  - [5.4 Step 4: Multi-Step Online Admission Portal](#54-step-4-multi-step-online-admission-portal)
  - [5.5 Step 5: Fast Fee Collection Terminal with Instant PDF Receipts](#55-step-5-fast-fee-collection-terminal-with-instant-pdf-receipts)
  - [5.6 Step 6: Defaulters & Outstanding Dues Tracker](#56-step-6-defaulters--outstanding-dues-tracker)
  - [5.7 Step 7: Smart Daily & Biometric Attendance System](#57-step-7-smart-daily--biometric-attendance-system)
  - [5.8 Step 8: Examination Scheduling, Marks Entry & Report Cards](#58-step-8-examination-scheduling-marks-entry--report-cards)
  - [5.9 Step 9: Multi-Channel Notifications & SMS Broadcast Center](#59-step-9-multi-channel-notifications--sms-broadcast-center)
  - [5.10 Step 10: Real-Time Inter-Role School Chat & Collaboration](#510-step-10-real-time-inter-role-school-chat--collaboration)
  - [5.11 Step 11: Dedicated Role Portals: Teacher, Parent, Student](#511-step-11-dedicated-role-portals-teacher-parent-student)
- [6.0 Special Showcase: Intelligent AI Assistant Copilot (Google Gemini & SRM ECO TECH)](#60-special-showcase-intelligent-ai-assistant-copilot-google-gemini--srm-eco-tech)
  - [6.1 Role-Specific Persona Engine](#61-role-specific-persona-engine)
  - [6.2 Strict Session-Based RBAC & Financial Data Protection](#62-strict-session-based-rbac--financial-data-protection)
  - [6.3 Eradication of Solid Block Characters ("Bullar")](#63-eradication-of-solid-block-characters-bullar)
  - [6.4 Multi-Model Gemini Cascade & 1,000,000 Tokens/Day Quota](#64-multi-model-gemini-cascade--1000000-tokensday-quota)
  - [6.5 Voice Wake & Web Speech Recognition](#65-voice-wake--web-speech-recognition)
- [7.0 Cross-Device Mobile Responsiveness & Multi-Platform Usability](#70-cross-device-mobile-responsiveness--multi-platform-usability)
- [8.0 Quick Start & Local Setup Guide](#80-quick-start--local-setup-guide)

---

## 1.0 Executive Overview & System Vision

**Vidyalaya** is an enterprise-grade cloud ERP platform designed specifically to meet the statutory, administrative, and academic needs of Indian educational institutes (affiliated with **CBSE**, **ICSE**, and **State Boards**).

### 🇮🇳 Core Indian Academic Compliance
- **Session Calendar**: Native alignment with April–March academic cycles.
- **CBSE CCE Evaluation**: Periodic Assessments, Half-Yearly, and Board Examination patterns.
- **Financial Standards**: Indian Rupee (`₹`) currency accounting, head-wise fee configurations, GST/DLT compliance.
- **Bilingual Interface**: Seamless 1-click switching between English and हिंदी across all modules.

### 🤝 Powered by SRM ECO TECH
The application officially integrates technology partnership branding from **SRM ECO TECH** across the authentication portal, main navigation sidebar, dashboard footer, and the AI Assistant Copilot interface.

---

## 2.0 Technology Stack & Multi-Layer Architecture

| System Layer | Technologies Deployed | Architectural Function |
| :--- | :--- | :--- |
| **Framework & Runtime** | [Next.js 14.2](https://nextjs.org/) (App Router) + Node.js 20 | Server Components, Route Handlers, High-speed SSR and Static Generation |
| **Type System** | [TypeScript 5.4](https://www.typescriptlang.org/) | End-to-end type safety spanning Database models, API contracts, and UI state |
| **AI Copilot Engine** | [Google Gemini](https://ai.google.dev/) (REST API) | Multi-model cascade (`gemini-3.5-flash-lite`, `gemini-3.6-flash`, `gemini-3.7-flash`) |
| **UI & Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + Lucide Icons | Responsive grid, dark/light theme, custom glassmorphism, touch breakpoints |
| **Database & ORM** | [Prisma 5.14](https://www.prisma.io/) + PostgreSQL 15+ / MySQL | 40+ relational data models, automated migrations, relational foreign keys |
| **Security & Auth** | [NextAuth.js v4](https://next-auth.js.org/) + bcryptjs | Secure JWT session management, password hashing, role-based route middleware |
| **Data Analytics** | [Recharts 2.12](https://recharts.org/) | Composable, responsive SVG charts for fee collection and attendance trends |
| **Export Engines** | [jsPDF](https://github.com/parallax/jsPDF) + AutoTable + SheetJS (XLSX) | Automated PDF receipts, CBSE report cards, ID cards, Excel spreadsheets |
| **Audio & Speech** | HTML5 Web Speech API | Real-time speech-to-text input and hands-free "Voice Wake" listener |
| **Communication** | Nodemailer SMTP + MSG91 SMS Gateway | Automated email circulars and DLT-approved transactional SMS notifications |

---

## 3.0 Role-Based Access Control (RBAC) Matrix

Vidyalaya strictly isolates data and administrative capabilities across 6 enterprise user roles:

| Module / Privilege | Super Admin | School Admin | Teacher | Accountant | Parent | Student |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Campus & Multi-Branch Settings** | ✅ Full | 👁️ View | ❌ | ❌ | ❌ | ❌ |
| **Staff & User Access Control** | ✅ Full | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Student Admissions & SIS 360** | ✅ Full | ✅ Full | 👁️ Roster | ❌ | ❌ | ❌ |
| **Fee Collection & PDF Receipts** | ✅ Full | ✅ Full | ❌ | ✅ Full | 👁️ Ward Fees | ❌ |
| **Institutional Financial Accounts** | ✅ Full | ✅ Full | 🚫 Blocked | ✅ Full | 🚫 Blocked | 🚫 Blocked |
| **Daily Attendance Marking** | ✅ Full | ✅ Full | ✅ Assigned Class | ❌ | 👁️ Ward | 👁️ Own |
| **Examination Scheduling & Grading** | ✅ Full | ✅ Full | ✅ Assigned Subject | ❌ | 👁️ Ward | 👁️ Own |
| **Master Timetable & Homework** | ✅ Full | ✅ Full | ✅ Create/Edit | ❌ | 👁️ Ward | 👁️ Own |
| **Staff Payroll & Salary Processing**| ✅ Full | ✅ Full | 👁️ Own Payslip | ✅ Prepare | ❌ | ❌ |
| **AI Assistant Copilot Persona** | 👑 Admin Copilot | 👑 Admin Copilot | 👨‍🏫 Teacher Copilot | 👑 Admin Copilot | 👨‍👩‍👦 Parent Assistant | 🎓 Study Companion |
| **Real-Time School Chat Channels** | ✅ All | ✅ All | ✅ Class/Staff | ✅ Staff | ✅ Teacher-Parent | ✅ Classmates |

---

## 4.0 Demo User Accounts & Fast-Fill Credentials

The database seeder automatically initializes realistic Indian school dummy data and pre-configured role accounts. On the login screen, click any of the **Demo Quick-Fill buttons** to authenticate instantly:

| Role Profile | Login Email | Password | Pre-Configured Scope & Privileges |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `admin@school.com` | `Admin@123` | Complete institutional control, financial oversight, campus administration |
| **🏫 School Admin** | `admin@vidyalaya.com` | `admin123` | Campus operations, student admissions, staff records & approvals |
| **👨‍🏫 Teacher** | `teacher@school.com` | `Teacher@123` | Class attendance register, homework distribution, marks entry |
| **👨‍👩‍👦 Parent** | `parent@school.com` | `Parent@123` | Child attendance tracking, fee payment receipts, bus timings, leave |
| **🎓 Student** | `student@school.com` | `Student@123` | Daily period timetable, pending homework assignments, exam datesheets |

---

## 5.0 Step-by-Step Feature Walkthrough with Screenshots

### 5.1 Step 1: Split-Screen Authentication & Role Fast-Fill
The authentication screen combines institutional security with modern design. Users can enter their credentials, select their preferred language (English/हिंदी), or use 1-click role fast-fill buttons.

<div align="center">
  <img src="screenshots/01_login_page.png" width="90%" alt="Login Screen" />
</div>

---

### 5.2 Step 2: Dual Dashboard Architecture (Modern Analytics vs. Classic ERP Grid)
Switch seamlessly between the **Modern Analytics View** (interactive KPI cards, Recharts revenue trends, live attendance status) and the **Classic ERP View** (high-density operational panels modeled after eSkooly).

<div align="center">
  <img src="screenshots/02_admin_dashboard_modern.png" width="48%" alt="Modern Dashboard View" />
  <img src="screenshots/03_admin_dashboard_classic.png" width="48%" alt="Classic Dashboard View" />
</div>

---

### 5.3 Step 3: Student Information System (SIS 360)
Manage student profiles with class/section filters, instant search, blood group, Aadhaar number, guardian contacts, and 1-click Excel export.

<div align="center">
  <img src="screenshots/04_student_management.png" width="90%" alt="Student Information System" />
</div>

---

### 5.4 Step 4: Multi-Step Online Admission Portal
A 4-step guided registration workflow for prospective students: Basic Info, Parent/Guardian Details, Academic History, and Document Verification with auto-generated Admission Numbers.

<div align="center">
  <img src="screenshots/05_new_admission.png" width="90%" alt="Online Admission Portal" />
</div>

---

### 5.5 Step 5: Fast Fee Collection Terminal with Instant PDF Receipts
Cashier point-of-sale terminal supporting Cash, UPI, Net Banking, and Cheque/DD with automatic balance computation and instant printable PDF receipts.

<div align="center">
  <img src="screenshots/06_fee_collection.png" width="90%" alt="Fee Collection Terminal" />
</div>

---

### 5.6 Step 6: Defaulters & Outstanding Dues Tracker
Real-time tracking of unpaid fees, overdue balances by class and section, penalty calculations, and 1-click WhatsApp/SMS notification triggers.

<div align="center">
  <img src="screenshots/07_fee_dues.png" width="90%" alt="Fee Defaulters & Dues Tracker" />
</div>

---

### 5.7 Step 7: Smart Daily & Biometric Attendance System
Single-click student and faculty attendance marking, summary statistics (Present, Absent, Late), manual roster grids, and biometric hardware sync logs.

<div align="center">
  <img src="screenshots/08_attendance_management.png" width="90%" alt="Attendance Management" />
</div>

---

### 5.8 Step 8: Examination Scheduling, Marks Entry & Report Cards
Examination datesheets, spreadsheet-style bulk marks entry, automated GPA calculation, and standardized printable CBSE CCE-compliant report card PDFs.

<div align="center">
  <img src="screenshots/09_exam_management.png" width="90%" alt="Examination & Grading System" />
</div>

---

### 5.9 Step 9: Multi-Channel Notifications & SMS Broadcast Center
Broadcast public circulars, staff alerts, and parent SMS messages using MSG91 and Fast2SMS DLT-compliant templates.

<div align="center">
  <img src="screenshots/10_notifications_center.png" width="90%" alt="Notifications & SMS Center" />
</div>

---

### 5.10 Step 10: Real-Time Inter-Role School Chat & Collaboration
Direct and channel messaging for teachers, parents, students, and staff with real-time delivery and message read receipts.

<div align="center">
  <img src="screenshots/11_school_chat.png" width="90%" alt="Real-Time School Chat" />
</div>

---

### 5.11 Step 11: Dedicated Role Portals: Teacher, Parent, Student
Tailored workspaces for each stakeholder:
- **👨‍🏫 Teacher Dashboard**: Today's schedule, class attendance status, homework distribution, syllabus progression.
- **👨‍👩‍👦 Parent Portal**: Ward attendance percentage, Term 1 & 2 fee receipts, pending installment due dates, transport bus timings.
- **🎓 Student Portal**: Daily class timetable, homework deadline calendar, exam datesheet overview, digital ID card.

<div align="center">
  <img src="screenshots/12_teacher_dashboard.png" width="31%" alt="Teacher Dashboard" />
  <img src="screenshots/13_parent_portal.png" width="31%" alt="Parent Portal" />
  <img src="screenshots/14_student_portal.png" width="31%" alt="Student Portal" />
</div>

---

## 6.0 Special Showcase: Intelligent AI Assistant Copilot (Google Gemini & SRM ECO TECH)

<div align="center">
  <img src="screenshots/15_ai_assistant.png" width="95%" alt="Vidyalaya AI Assistant Copilot" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
</div>

<br/>

Vidyalaya features an **Enterprise AI School Copilot** built using **Google Gemini** and powered by **SRM ECO TECH**.

### 6.1 Role-Specific Persona Engine
Unlike generic chatbots, the AI dynamically adapts its persona, greeting, title, and prompt instructions based on the logged-in user:
- 👑 **Admin Copilot** (*Executive School Assistant*): Monitors campus metrics, fee collection summaries, biometric attendance, and drafts broadcast announcements.
- 👨‍🏫 **Teacher Copilot** (*Academic & Classroom Assistant*): Evaluates class attendance rosters, drafts absent student follow-up notices, creates lesson plans, and blueprints exam rubrics.
- 👨‍👩‍👦 **Parent Portal Assistant** (*Student Care & Guardian Companion*): Provides ward attendance stats, Term 1/2 fee receipts, bus route timings, and leave application assistance.
- 🎓 **Student Study Companion** (*Learning & Timetable Assistant*): Checks period schedules, homework deadlines, exam datesheets, and explains study concepts.

### 6.2 Strict Session-Based RBAC & Financial Data Protection
- **No Client Privilege Elevation**: Role toggle buttons have been removed. Role and identity are resolved strictly from the authenticated NextAuth session (`getServerSession(authOptions)`).
- **Hard Financial Guardrails**: Teachers, Parents, and Students are strictly blocked from accessing institutional financial records (e.g., total fee dues ₹4.85L, revenue, profit, staff salaries).

### 6.3 Eradication of Solid Block Characters ("Bullar")
- Gemini prompts explicitly forbid solid block characters (`█`, `▇`, `■`, `▓`, `[██]`).
- Server-side multi-pass regex cleansing strips any bracketed blocks or lone solid blocks.
- [MarkdownRenderer.tsx](file:///d:/demoProject/School-Management-Module/src/components/ui/MarkdownRenderer.tsx) sanitizes all content so no raw block characters ever render in the UI.

### 6.4 Multi-Model Gemini Cascade & 1,000,000 Tokens/Day Quota
- Built with a cascade across `gemini-3.5-flash-lite`, `gemini-3.6-flash`, and `gemini-3.7-flash` for high availability.
- Enforces a 1,000,000 tokens/day rate-limit per user/IP with a real-time UI balance countdown.

### 6.5 Voice Wake & Web Speech Recognition
- Real-time Speech-to-Text input via the Web Speech API.
- Hands-free "Voice Wake" mode enabling users to speak directly to the copilot.

---

## 7.0 Cross-Device Mobile Responsiveness & Multi-Platform Usability

Vidyalaya is engineered for full cross-device responsiveness across smartphones (Android & iOS), tablets, and desktop displays:
- **Mobile Navigation Drawer**: Smooth slide-over navigation with overlay backdrop and touch gestures.
- **Breakpoint-Aware Data Tables**: Wrapped in `overflow-x-auto touch-scroll` to prevent horizontal viewport distortion.
- **Adaptive Viewport Headers**: User identity pills and badges automatically truncate long profile names on narrow screens.
- **Touch-Friendly Controls**: Large tap targets for attendance marking, fee collection, and chat inputs.

---

## 8.0 Quick Start & Local Setup Guide

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher
- **PostgreSQL Server** (or MySQL Server) running locally or hosted on Supabase / Neon / AWS RDS

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/errupamkumar/School-Management-Module.git
cd School-Management-Module
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Configure `DATABASE_URL`, `NEXTAUTH_SECRET`, and `GEMINI_API_KEY` in `.env`.

### 4. Initialize Database & Seed Sample Records
```bash
npm run db:push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

<div align="center">

**Vidyalaya - Enterprise School Management System**  
*Powered by SRM ECO TECH • Built with ❤️ for educational institutions worldwide.*

</div>
