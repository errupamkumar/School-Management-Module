const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak, PageNumber, TabStopType } = require('docx');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };
const accentColor = "1D4ED8";
const lightBg = "EFF6FF";
const headerBg = "1E40AF";

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 200 }, children: [new TextRun({ text, bold: true })] });
}

function para(text, opts = {}) {
  return new Paragraph({ spacing: { after: 120 }, ...opts, children: [new TextRun({ text, size: 22, font: "Arial", ...opts.run })] });
}

function boldPara(label, text) {
  return new Paragraph({ spacing: { after: 120 }, children: [
    new TextRun({ text: label, bold: true, size: 22, font: "Arial" }),
    new TextRun({ text, size: 22, font: "Arial" }),
  ]});
}

function codePara(text) {
  return new Paragraph({ spacing: { after: 80 }, shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
    children: [new TextRun({ text, size: 20, font: "Courier New" })] });
}

function tableRow(cells, isHeader = false) {
  return new TableRow({
    children: cells.map((text, i) => new TableCell({
      borders,
      margins: cellMargins,
      shading: isHeader ? { fill: headerBg, type: ShadingType.CLEAR } : (i === 0 ? { fill: lightBg, type: ShadingType.CLEAR } : undefined),
      width: { size: Math.floor(9360 / cells.length), type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: String(text), size: 20, font: "Arial", bold: isHeader, color: isHeader ? "FFFFFF" : "1F2937" })] })]
    }))
  });
}

function makeTable(headers, rows) {
  const colCount = headers.length;
  const colWidth = Math.floor(9360 / colCount);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: Array(colCount).fill(colWidth),
    rows: [tableRow(headers, true), ...rows.map(r => tableRow(r))]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ==============================
// BUILD THE DOCUMENT
// ==============================

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: accentColor },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "1E3A8A" },
        paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "374151" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets3", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ========================
    // COVER PAGE
    // ========================
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        new Paragraph({ spacing: { before: 3000 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "VIDYALAYA", size: 72, bold: true, font: "Arial", color: accentColor })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "School Management System", size: 36, font: "Arial", color: "4B5563" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: "Complete Documentation", size: 28, font: "Arial", color: "6B7280" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, border: { top: { style: BorderStyle.SINGLE, size: 6, color: accentColor, space: 20 } },
          children: [new TextRun({ text: "User Guide  |  Code Setup Guide  |  Hosting Guide", size: 24, font: "Arial", color: "374151" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: "Version 1.0  |  2025", size: 22, font: "Arial", color: "9CA3AF" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: "Designed for Indian Schools | CBSE / ICSE / State Board Compatible", size: 20, font: "Arial", color: "6B7280" })] }),
      ]
    },

    // ========================
    // TABLE OF CONTENTS
    // ========================
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Vidyalaya SMS - Documentation", size: 18, font: "Arial", color: "9CA3AF", italics: true })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", size: 18, font: "Arial" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial" })] })] }) },
      children: [
        heading("Table of Contents"),
        para("PART 1: USER GUIDE", { run: { bold: true, color: accentColor } }),
        para("  1.1 System Overview"),
        para("  1.2 Role-Based Access"),
        para("  1.3 Admin Dashboard"),
        para("  1.4 Admission Management"),
        para("  1.5 Student Management"),
        para("  1.6 Attendance Management"),
        para("  1.7 Fee Payment & Collection"),
        para("  1.8 Exam Management"),
        para("  1.9 Timetable Management"),
        para("  1.10 Staff & Salary Management"),
        para("  1.11 Notice Board & Communication"),
        para("  1.12 Transport Management"),
        para("  1.13 Reports & Analytics"),
        para(""),
        para("PART 2: CODE SETUP GUIDE", { run: { bold: true, color: accentColor } }),
        para("  2.1 Technology Stack"),
        para("  2.2 Prerequisites"),
        para("  2.3 Installation Steps"),
        para("  2.4 Database Setup"),
        para("  2.5 Environment Configuration"),
        para("  2.6 Running the Application"),
        para("  2.7 Project Structure"),
        para("  2.8 API Reference"),
        para(""),
        para("PART 3: HOSTING GUIDE", { run: { bold: true, color: accentColor } }),
        para("  3.1 Hosting Options for India"),
        para("  3.2 VPS Hosting (Recommended)"),
        para("  3.3 Cloud Hosting (AWS/GCP)"),
        para("  3.4 Railway / Render (Quick)"),
        para("  3.5 Domain & SSL Setup"),
        para("  3.6 Backup Strategy"),
        para("  3.7 Security Hardening"),
        para("  3.8 Cost Comparison"),
        pageBreak(),

        // ==============================
        // PART 1: USER GUIDE
        // ==============================
        heading("PART 1: USER GUIDE"),

        heading("1.1 System Overview", HeadingLevel.HEADING_2),
        para("Vidyalaya is a comprehensive School Management System built for Indian schools covering CBSE, ICSE, and State Boards. It provides 30+ modules covering every aspect of school operations from admission to certification."),
        para(""),
        makeTable(["Feature", "Description"], [
          ["Multi-Campus", "Manage multiple school branches from single system"],
          ["Bilingual", "Full Hindi and English language support"],
          ["Role-Based Access", "6 user roles with granular permissions"],
          ["Indian Fee System", "UPI, Cash, Cheque, DD, NEFT support with receipt generation"],
          ["CBSE/ICSE Grading", "A1-E grading system with automatic grade calculation"],
          ["Indian Calendar", "April-March academic year with Indian holidays"],
          ["SMS Integration", "MSG91/Textlocal for parent notifications"],
          ["Aadhaar Support", "Aadhaar number capture for students and parents"],
        ]),

        heading("1.2 Role-Based Access", HeadingLevel.HEADING_2),
        para("The system has 6 user roles, each with specific permissions:"),
        makeTable(["Role", "Access Level", "Key Functions"], [
          ["Super Admin", "Full System", "All modules, campus management, settings"],
          ["Admin", "Campus Level", "All modules within assigned campus"],
          ["Teacher", "Class Level", "Attendance, marks entry, homework, study materials"],
          ["Parent", "Child Data", "View attendance, fees, results, notices"],
          ["Student", "Own Data", "View timetable, homework, results, materials"],
          ["Accountant", "Finance", "Fee collection, accounting, salary processing"],
        ]),

        heading("1.3 Admin Dashboard", HeadingLevel.HEADING_2),
        para("The admin dashboard provides a complete overview of school operations at a glance. It shows:"),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Financial Summary: Dues amount, total income (year/month/today), total expense (year/month/today), profit this month", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Student Statistics: Total students with boys/girls breakdown, parent count, present today count", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Fee Collection Graph: Month-wise bar chart showing collected vs due amounts", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Quick Actions: Direct links to new admission, fee collection, attendance, notices, etc.", size: 22, font: "Arial" })] }),

        heading("1.4 Admission Management", HeadingLevel.HEADING_2),
        para("The admission module supports 5 workflows:"),
        boldPara("New Admission: ", "Complete 4-tab form capturing Student Information (name, gender, DOB, photo, signatures in Hindi & English, Aadhaar, religion, caste, category), Parent Information (father/mother details, ID card, occupation, income), Academic Information (campus, class, section, previous school, TC), and Student Address (street, village, post, police station/thana, city, district, state, pin code)."),
        boldPara("Bulk Admission: ", "Upload Excel file with student data for mass registration. Download template, fill data, upload and import."),
        boldPara("Admission Requests: ", "Online admission requests from parents with status tracking (Pending/Approved/Rejected)."),
        boldPara("Inquiries: ", "Track admission inquiries with follow-up and SMS capability."),
        boldPara("Print Admission Form: ", "Generate printable admission forms filtered by campus, class, section, and date range."),

        heading("1.5 Student Management", HeadingLevel.HEADING_2),
        para("Three sub-modules for comprehensive student lifecycle management:"),
        boldPara("Student Information: ", "Filter by campus, class, section, and type. View complete student profiles with edit, view, and delete options. Export data as Excel, CSV, or PDF. Print student lists."),
        boldPara("Student Promotion: ", "End-of-year batch promotion from one class to the next. Select students, choose target class, and promote with remarks."),
        boldPara("Student Transfer: ", "Transfer students between campuses or generate Transfer Certificates (TC)."),

        heading("1.6 Attendance Management", HeadingLevel.HEADING_2),
        para("Mark daily attendance for students with an intuitive click-to-toggle interface:"),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Select date, class, and section to load the student list", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Click student status to toggle: Present > Absent > Late > Half Day", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Use Quick Actions: 'All Present' or 'All Absent' for bulk marking", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Live counter shows P/A/L/H counts in real-time", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: "Save attendance. System prevents duplicate entries for same date.", size: 22, font: "Arial" })] }),

        heading("1.7 Fee Payment & Collection", HeadingLevel.HEADING_2),
        para("Complete fee management system designed for Indian schools:"),
        boldPara("Fee Structure: ", "Define fee types (Tuition, Exam, Transport, Computer, Library, Sports, Books, Uniform, Development, Annual) with frequency (Monthly/Quarterly/Half-Yearly/Yearly/One-Time), class-wise amounts, and late fine rules."),
        boldPara("Fee Collection: ", "Search student by admission number or name. View fee status. Record payment with amount, discount, late fine, payment mode (Cash, UPI, Bank Transfer, Cheque, Online, DD), transaction ID, and remarks. Auto-generates printable receipt with school header."),
        boldPara("Fee Reports: ", "Class-wise, month-wise, and student-wise fee collection reports with graphs. Export to Excel/PDF."),
        boldPara("Due List: ", "List of students with pending fees, filterable by class, amount range, and months overdue."),

        heading("1.8 Exam Management", HeadingLevel.HEADING_2),
        para("Full exam lifecycle management:"),
        boldPara("Create Exams: ", "Define exam name, type (Unit Test, Half Yearly, Annual, Pre-Board, Weekly Test), date range, and subjects with max marks, passing marks, exam date, time, and room assignment."),
        boldPara("Marks Entry: ", "Teachers enter marks subject-wise. Supports theory + practical split. Auto-calculates grades using CBSE grading (A1: 91-100, A2: 81-90, B1: 71-80, B2: 61-70, C1: 51-60, C2: 41-50, D: 33-40, E: Below 33)."),
        boldPara("Results: ", "Publish results for students and parents. Generate mark sheets, rank lists, and subject-wise analysis."),

        heading("1.9 Other Modules", HeadingLevel.HEADING_2),
        para("The system includes these additional modules:"),
        makeTable(["Module", "Key Features"], [
          ["Timetable", "Period-wise schedule for each class/section with teacher assignment"],
          ["Staff Management", "Teacher and non-teaching staff records with qualifications"],
          ["Salary Management", "Monthly salary processing with allowances and deductions"],
          ["Homework Diary", "Daily homework assignment with submission tracking"],
          ["Online Classes", "Zoom/Google Meet integration with recording links"],
          ["Study Materials (LMS)", "Upload PDFs, videos, documents for student access"],
          ["Transport", "Route management, stops, fares, driver details, student assignment"],
          ["Leave Management", "Leave requests and approvals for students and staff"],
          ["Noticeboard", "Publish notices targeted to specific roles and classes"],
          ["ID Card Generation", "Generate student/staff ID cards with photo and barcode"],
          ["Inventory", "Track school assets: furniture, electronics, sports equipment"],
          ["Certification", "Generate TC, Character Certificate, Bonafide Certificate"],
          ["Biometric", "Integration with fingerprint/RFID devices for attendance"],
          ["Reports", "Comprehensive analytics with charts and export options"],
          ["Campus Management", "Multi-branch configuration and settings"],
        ]),

        pageBreak(),

        // ==============================
        // PART 2: CODE SETUP GUIDE
        // ==============================
        heading("PART 2: CODE SETUP GUIDE"),

        heading("2.1 Technology Stack", HeadingLevel.HEADING_2),
        para("This stack is chosen for low maintenance cost, full security, and production-readiness:"),
        makeTable(["Layer", "Technology", "Why Chosen"], [
          ["Frontend", "Next.js 14 + React 18", "Server-side rendering, fast, SEO-friendly, free hosting options"],
          ["Styling", "Tailwind CSS", "Utility-first, zero runtime cost, minimal bundle size"],
          ["Backend", "Next.js API Routes", "Same codebase as frontend, no separate server needed"],
          ["Database", "PostgreSQL", "Free, robust, handles millions of records, ACID compliant"],
          ["ORM", "Prisma", "Type-safe queries, auto-migrations, visual database browser"],
          ["Auth", "NextAuth.js", "Secure JWT sessions, role-based access, production-ready"],
          ["Charts", "Recharts", "React-native charting, lightweight, responsive"],
          ["PDF/Excel", "jsPDF + SheetJS", "Client-side report generation, no server cost"],
          ["Language", "TypeScript", "Type safety prevents bugs, better IDE support"],
        ]),

        heading("2.2 Prerequisites", HeadingLevel.HEADING_2),
        para("Install these before starting:"),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "Node.js 18+ (LTS recommended) - download from nodejs.org", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "PostgreSQL 14+ - download from postgresql.org or use Supabase/Neon free tier", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "Git - for version control", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [new TextRun({ text: "VS Code (recommended) with Prisma and Tailwind extensions", size: 22, font: "Arial" })] }),

        heading("2.3 Installation Steps", HeadingLevel.HEADING_2),
        boldPara("Step 1: ", "Clone the project"),
        codePara("git clone https://github.com/your-org/school-management-system.git"),
        codePara("cd school-management-system"),
        para(""),
        boldPara("Step 2: ", "Install dependencies"),
        codePara("npm install"),
        para(""),
        boldPara("Step 3: ", "Set up environment variables"),
        codePara("cp .env.example .env"),
        para("Edit .env file with your database URL and secrets (see section 2.5)."),
        para(""),
        boldPara("Step 4: ", "Set up database"),
        codePara("npx prisma generate"),
        codePara("npx prisma db push"),
        codePara("npx prisma db seed"),
        para("This creates all tables and loads demo data with sample students, teachers, and classes."),
        para(""),
        boldPara("Step 5: ", "Start development server"),
        codePara("npm run dev"),
        para("Open http://localhost:3000 in your browser."),

        heading("2.5 Environment Configuration", HeadingLevel.HEADING_2),
        para("Configure the .env file with these settings:"),
        makeTable(["Variable", "Example Value", "Description"], [
          ["DATABASE_URL", "postgresql://user:pass@localhost:5432/school_db", "PostgreSQL connection string"],
          ["NEXTAUTH_SECRET", "your-random-secret-key-here", "Generate with: openssl rand -base64 32"],
          ["NEXTAUTH_URL", "http://localhost:3000", "Your app URL (change for production)"],
          ["SMTP_HOST", "smtp.gmail.com", "Email server for notifications"],
          ["SMTP_USER", "school@gmail.com", "Email account username"],
          ["SMTP_PASS", "app-password-here", "Gmail App Password (not regular password)"],
          ["SMS_API_KEY", "your-msg91-key", "MSG91 or Textlocal API key for SMS"],
        ]),

        heading("2.6 Demo Login Credentials", HeadingLevel.HEADING_2),
        makeTable(["Role", "Email", "Password"], [
          ["Super Admin", "admin@vidyalaya.com", "admin123"],
          ["Teacher", "teacher@vidyalaya.com", "teacher123"],
          ["Parent", "parent@vidyalaya.com", "parent123"],
        ]),

        heading("2.7 Project Structure", HeadingLevel.HEADING_2),
        codePara("school-management-system/"),
        codePara("  prisma/              - Database schema & seed data"),
        codePara("  src/"),
        codePara("    app/               - Next.js pages & API routes"),
        codePara("      api/             - Backend API endpoints"),
        codePara("      dashboard/       - Role-specific dashboards"),
        codePara("      admission/       - Admission management pages"),
        codePara("      students/        - Student management"),
        codePara("      attendance/      - Attendance marking"),
        codePara("      fees/            - Fee collection & reports"),
        codePara("      exams/           - Exam & marks management"),
        codePara("    components/        - Reusable UI components"),
        codePara("      layouts/         - Sidebar, Header, DashboardLayout"),
        codePara("      ui/              - StatCard, DataTable, Modal, etc."),
        codePara("    lib/               - Auth, Prisma, i18n, navigation"),
        codePara("    utils/             - Helper functions"),
        codePara("    types/             - TypeScript types"),

        heading("2.8 API Reference", HeadingLevel.HEADING_2),
        makeTable(["Endpoint", "Method", "Description"], [
          ["/api/auth/[...nextauth]", "POST", "Authentication (login/logout)"],
          ["/api/students", "GET/POST", "List/Create students"],
          ["/api/attendance", "GET/POST", "Get/Mark attendance"],
          ["/api/fees", "GET/POST", "Fee payments"],
          ["/api/exams", "GET/POST", "Exam management"],
          ["/api/exams/results", "POST", "Marks entry and grading"],
          ["/api/classes", "GET/POST", "Classes and sections"],
          ["/api/notices", "GET/POST", "School notices"],
          ["/api/expenses", "GET/POST", "Expense tracking"],
          ["/api/dashboard/stats", "GET", "Dashboard statistics"],
        ]),

        pageBreak(),

        // ==============================
        // PART 3: HOSTING GUIDE
        // ==============================
        heading("PART 3: HOSTING GUIDE"),

        heading("3.1 Hosting Options for India", HeadingLevel.HEADING_2),
        para("Here are the best hosting options ranked by cost-effectiveness for Indian schools:"),
        makeTable(["Option", "Monthly Cost", "Best For", "Difficulty"], [
          ["Railway.app", "Free - Rs 500", "Quick deployment, small schools", "Easy"],
          ["Render.com", "Free - Rs 600", "Small to medium schools", "Easy"],
          ["DigitalOcean VPS", "Rs 400 - 800", "Medium schools, full control", "Medium"],
          ["AWS Lightsail", "Rs 300 - 700", "Scalable, reliable", "Medium"],
          ["Hostinger VPS", "Rs 250 - 500", "Budget option, India servers", "Medium"],
          ["Vercel + Supabase", "Free - Rs 1500", "Best DX, auto-scaling", "Easy"],
          ["Self-hosted (School)", "Rs 0 (one-time)", "Own server on premises", "Hard"],
        ]),

        heading("3.2 VPS Hosting (Recommended: DigitalOcean)", HeadingLevel.HEADING_2),
        para("Best balance of cost, performance, and control for most Indian schools. Bangalore datacenter ensures low latency."),
        boldPara("Step 1: ", "Create a DigitalOcean Droplet"),
        new Paragraph({ numbering: { reference: "bullets2", level: 0 }, children: [new TextRun({ text: "Choose Ubuntu 22.04 LTS, Basic Plan, $4/month (Rs 330)", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets2", level: 0 }, children: [new TextRun({ text: "Select Bangalore (BLR1) datacenter for Indian users", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets2", level: 0 }, children: [new TextRun({ text: "Add SSH key for secure access", size: 22, font: "Arial" })] }),
        para(""),
        boldPara("Step 2: ", "Server setup commands"),
        codePara("ssh root@your-server-ip"),
        codePara("apt update && apt upgrade -y"),
        codePara("curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"),
        codePara("apt install -y nodejs postgresql nginx certbot python3-certbot-nginx"),
        para(""),
        boldPara("Step 3: ", "Configure PostgreSQL"),
        codePara("sudo -u postgres psql"),
        codePara("CREATE USER schooladmin WITH PASSWORD 'strong_password_here';"),
        codePara("CREATE DATABASE school_management OWNER schooladmin;"),
        codePara("\\q"),
        para(""),
        boldPara("Step 4: ", "Deploy application"),
        codePara("cd /var/www"),
        codePara("git clone your-repo-url school-app"),
        codePara("cd school-app"),
        codePara("npm install --production"),
        codePara("cp .env.example .env  # Edit with production values"),
        codePara("npx prisma generate && npx prisma db push && npx prisma db seed"),
        codePara("npm run build"),
        para(""),
        boldPara("Step 5: ", "Set up PM2 process manager"),
        codePara("npm install -g pm2"),
        codePara("pm2 start npm --name school-app -- start"),
        codePara("pm2 startup && pm2 save"),
        para(""),
        boldPara("Step 6: ", "Configure Nginx reverse proxy"),
        codePara("# /etc/nginx/sites-available/school-app"),
        codePara("server {"),
        codePara("    listen 80;"),
        codePara("    server_name yourdomain.com;"),
        codePara("    location / {"),
        codePara("        proxy_pass http://localhost:3000;"),
        codePara("        proxy_http_version 1.1;"),
        codePara("        proxy_set_header Upgrade $http_upgrade;"),
        codePara("        proxy_set_header Connection 'upgrade';"),
        codePara("        proxy_set_header Host $host;"),
        codePara("    }"),
        codePara("}"),

        heading("3.3 Quick Deploy: Railway.app", HeadingLevel.HEADING_2),
        para("Easiest option - deploy in 5 minutes:"),
        new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "Go to railway.app and sign in with GitHub", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "Click 'New Project' > 'Deploy from GitHub repo'", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "Add a PostgreSQL plugin (free tier available)", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "Set environment variables in Railway dashboard", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "numbers3", level: 0 }, children: [new TextRun({ text: "Railway auto-detects Next.js and deploys. Get URL in 3-5 minutes.", size: 22, font: "Arial" })] }),

        heading("3.5 Domain & SSL Setup", HeadingLevel.HEADING_2),
        para("Buy a .in domain from GoDaddy, Namecheap, or BigRock (Rs 200-500/year). Point DNS A record to your server IP."),
        codePara("# Free SSL with Let's Encrypt"),
        codePara("sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"),
        codePara("# Auto-renewal (already configured by certbot)"),
        codePara("sudo certbot renew --dry-run"),

        heading("3.6 Backup Strategy", HeadingLevel.HEADING_2),
        para("Critical for school data - set up automated daily backups:"),
        codePara("# Daily database backup script (/root/backup.sh)"),
        codePara("#!/bin/bash"),
        codePara("DATE=$(date +%Y%m%d)"),
        codePara("pg_dump -U schooladmin school_management > /backups/db_$DATE.sql"),
        codePara("gzip /backups/db_$DATE.sql"),
        codePara("find /backups -mtime +30 -delete  # Keep 30 days"),
        codePara(""),
        codePara("# Add to crontab: crontab -e"),
        codePara("0 2 * * * /root/backup.sh  # Run at 2 AM daily"),

        heading("3.7 Security Hardening", HeadingLevel.HEADING_2),
        para("Essential security steps for production:"),
        new Paragraph({ numbering: { reference: "bullets3", level: 0 }, children: [new TextRun({ text: "Change default passwords immediately after first login", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets3", level: 0 }, children: [new TextRun({ text: "Enable UFW firewall: ufw allow ssh, ufw allow http, ufw allow https, ufw enable", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets3", level: 0 }, children: [new TextRun({ text: "Disable root SSH login, use key-based authentication only", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets3", level: 0 }, children: [new TextRun({ text: "Set strong NEXTAUTH_SECRET (generate with: openssl rand -base64 32)", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets3", level: 0 }, children: [new TextRun({ text: "Use environment variables for all secrets - never commit .env to git", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets3", level: 0 }, children: [new TextRun({ text: "Enable rate limiting on API routes to prevent abuse", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets3", level: 0 }, children: [new TextRun({ text: "Keep Node.js, PostgreSQL, and OS updated with security patches", size: 22, font: "Arial" })] }),
        new Paragraph({ numbering: { reference: "bullets3", level: 0 }, children: [new TextRun({ text: "Configure PostgreSQL to accept connections only from localhost", size: 22, font: "Arial" })] }),

        heading("3.8 Cost Comparison Summary", HeadingLevel.HEADING_2),
        makeTable(["Component", "Free Option", "Paid Option (Monthly)"], [
          ["Hosting", "Railway free / Render free", "DigitalOcean Rs 330-660"],
          ["Database", "Supabase free / Neon free", "Managed PostgreSQL Rs 500-1000"],
          ["Domain", "Railway subdomain", ".in domain Rs 15-40/month"],
          ["SSL", "Let's Encrypt (free)", "Included with domain"],
          ["Email (SMTP)", "Gmail (500/day free)", "SendGrid Rs 0-800"],
          ["SMS", "MSG91 (free tier)", "Rs 200-500 for 1000 SMS"],
          ["Total Minimum", "Rs 0/month", "Rs 500-2000/month"],
        ]),
        para(""),
        para("For a typical school with 500-1500 students, the recommended setup (DigitalOcean + .in domain + free SSL + Gmail) costs approximately Rs 400-700 per month, which is significantly cheaper than any commercial school ERP software (typically Rs 5000-25000/month)."),
      ]
    },
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/school-ms/docs/Vidyalaya_SMS_Complete_Documentation.docx", buffer);
  console.log("Documentation generated successfully!");
});
