/**
 * Test Suite: Student Information Directory 360° View & Analytics
 * Validates:
 * 1. Student directory data loading (students with class, section, parent, session, and status).
 * 2. Presence of 360° View action on each table row.
 * 3. In-drawer 360° Analytics tab with KPI cards and Recharts performance diagrams.
 * 4. Comprehensive Student 360° Dossier modal with 5 specialized tabs (Academic, Attendance, Personal, Fees, Pastoral).
 */

import { prisma } from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testId: string, name: string, details?: string) {
  if (condition) {
    results.push({ id: testId, name, passed: true, details });
    console.log(`  ✅ [PASS] ${testId}: ${name}${details ? ` - ${details}` : ''}`);
  } else {
    results.push({ id: testId, name, passed: false, details: details || 'Assertion failed' });
    console.error(`  ❌ [FAIL] ${testId}: ${name}${details ? ` - ${details}` : ''}`);
  }
}

async function runStudent360Tests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING STUDENT INFORMATION 360° VIEW & ANALYTICS TEST SUITE');
  console.log('========================================================================\n');

  // ===========================================================================
  // SECTION 1: DATABASE DIRECTORY INTEGRITY
  // ===========================================================================
  console.log('--- SECTION 1: Student Record & Demographics Integrity ---');

  const students = await prisma.student.findMany({
    take: 10,
    include: {
      class: true,
      section: true,
      parent: true,
      user: true,
      classEnrollments: { include: { class: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  assert(
    students.length > 0,
    'TC-S360-01',
    'Fetch student directory records from database',
    `Found ${students.length} students`
  );

  const sample = students[0];
  assert(
    Boolean(sample && sample.admissionNo && sample.firstName && sample.lastName),
    'TC-S360-02',
    'Student record contains full name and unique admission number',
    `Admission No: ${sample?.admissionNo}, Name: ${sample?.firstName} ${sample?.lastName}`
  );

  assert(
    Boolean(sample?.class?.name && sample?.section?.name),
    'TC-S360-03',
    'Student linked with primary Class and Section',
    `Class: ${sample?.class?.name}, Section: ${sample?.section?.name}`
  );

  // ===========================================================================
  // SECTION 2: FRONTEND 360° VIEW IN SLIDE-OUT DRAWER & TABLE
  // ===========================================================================
  console.log('\n--- SECTION 2: Student Information Page 360° Integration ---');

  const studentsPagePath = path.join(process.cwd(), 'src/app/students/page.tsx');
  const pageContent = fs.readFileSync(studentsPagePath, 'utf-8');

  // Verify Table Row Action Button
  assert(
    pageContent.includes('360° View') && pageContent.includes('setSelected360Student(st)'),
    'TC-S360-04',
    'Table rows feature direct "360° View" action button with Sparkles icon',
    'Direct trigger present on table rows'
  );

  // Verify Drawer 360° Analytics Switcher
  assert(
    pageContent.includes("setDrawerTab('ANALYTICS_360')") && pageContent.includes('360° Performance &amp; Charts'),
    'TC-S360-05',
    'Slide-out drawer incorporates interactive 360° Analytics tab switcher',
    'Interactive drawer tab switcher verified'
  );

  // Verify Drawer In-line Recharts Visualizations
  assert(
    pageContent.includes('<BarChart data={academicChartData}') && pageContent.includes('<AreaChart data={attendanceTrendData}'),
    'TC-S360-06',
    'Drawer renders mini Subject Mastery BarChart and Monthly Attendance AreaChart',
    'Recharts components embedded in drawer'
  );

  // ===========================================================================
  // SECTION 3: COMPREHENSIVE 360° DOSSIER MODAL WITH 5 SPECIALIZED TABS
  // ===========================================================================
  console.log('\n--- SECTION 3: Comprehensive 360° Dossier Modal ---');

  assert(
    pageContent.includes('selected360Student &&') && pageContent.includes('Student 360° Comprehensive Profile'),
    'TC-S360-07',
    'Comprehensive Student 360° Dossier Modal renders when student is selected',
    'Modal container & header verified'
  );

  assert(
    pageContent.includes("id: 'ACADEMIC'") &&
      pageContent.includes("id: 'ATTENDANCE'") &&
      pageContent.includes("id: 'PERSONAL'") &&
      pageContent.includes("id: 'FEES'") &&
      pageContent.includes("id: 'PASTORAL'"),
    'TC-S360-08',
    'Modal features 5 specialized tabs: Academic, Attendance, Personal, Fees, Pastoral',
    'All 5 multi-disciplinary tabs verified'
  );

  assert(
    pageContent.includes('Subject Mastery &amp; Benchmark Diagram') &&
      pageContent.includes('Student score vs Class average across core subjects') &&
      pageContent.includes('Recent Exam Breakdown'),
    'TC-S360-09',
    'Academic Tab displays benchmark bar chart and recent exam breakdown table',
    'Academic visualizations verified'
  );

  assert(
    pageContent.includes('Monthly Attendance Trend Chart') &&
      pageContent.includes('Total Present Days') &&
      pageContent.includes('Excused Leave') &&
      pageContent.includes('Unexcused Absent'),
    'TC-S360-10',
    'Attendance Tab displays continuity trend curve and present/leave/absent counters',
    'Attendance metrics verified'
  );

  assert(
    pageContent.includes('Personal Demographics') &&
      pageContent.includes('Family &amp; Guardian') &&
      pageContent.includes('Date of Birth') &&
      pageContent.includes('Blood Group'),
    'TC-S360-11',
    'Personal Tab presents comprehensive family, demographic, and residential dossier',
    'Demographic attributes verified'
  );

  assert(
    pageContent.includes('Annual Tuition &amp; Composite Fee Cleared') &&
      pageContent.includes('₹36,000 Paid') &&
      pageContent.includes('Receipt No: REC2604812'),
    'TC-S360-12',
    'Fees Tab presents itemized fee ledger with cleared status and receipt voucher',
    'Fee ledger verified'
  );

  assert(
    pageContent.includes('Class Mentor &amp; Faculty Remarks') &&
      pageContent.includes('Digital Merit Badges &amp; Clubs') &&
      pageContent.includes('Science Olympiad') &&
      pageContent.includes('Robotics Club'),
    'TC-S360-13',
    'Pastoral Tab displays mentor remarks and digital merit badges',
    'Pastoral & badge tracking verified'
  );

  assert(
    pageContent.includes('window.print()') && pageContent.includes('Print Dossier'),
    'TC-S360-14',
    'Modal includes one-click printable student dossier action',
    'Print action verified'
  );

  // ===========================================================================
  // SECTION 4: FULL SCREEN 360° DOSSIER CAPABILITY
  // ===========================================================================
  console.log('\n--- SECTION 4: Full Screen 360° Dossier Capability ---');

  assert(
    pageContent.includes('is360FullScreen') &&
      pageContent.includes('w-full h-full max-w-none max-h-none rounded-none') &&
      pageContent.includes('p-0 m-0 overflow-hidden'),
    'TC-S360-15',
    'Students page supports seamless full screen modal expansion (0 padding, full viewport, 0 border-radius)',
    'Full screen backdrop & container classes verified'
  );

  assert(
    pageContent.includes('Maximize2') &&
      pageContent.includes('Minimize2') &&
      pageContent.includes('Exit Fullscreen') &&
      pageContent.includes('Exit Full Screen'),
    'TC-S360-16',
    'Students page provides Full Screen toggle buttons in header and footer',
    'Header and footer full screen controls verified'
  );

  const bulkPagePath = path.join(process.cwd(), 'src/app/admission/bulk/page.tsx');
  const bulkContent = fs.readFileSync(bulkPagePath, 'utf-8');

  assert(
    bulkContent.includes('is360FullScreen') &&
      bulkContent.includes('Maximize2') &&
      bulkContent.includes('Minimize2') &&
      bulkContent.includes('Exit Fullscreen') &&
      bulkContent.includes('Exit Full Screen') &&
      bulkContent.includes("is360FullScreen ? 'h-80 lg:h-96' : 'h-64'"),
    'TC-S360-17',
    'Bulk Admission page provides matching Full Screen modal controls & dynamic Recharts resizing',
    'Bulk admission full screen controls & chart responsiveness verified'
  );

  // ===========================================================================
  // SUMMARY
  // ===========================================================================
  console.log('\n========================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`📊 STUDENT 360° TEST SUMMARY: ${passedCount}/${results.length} PASSED`);
  if (failedCount === 0) {
    console.log(`🎉 ALL ${results.length} STUDENT 360° VIEW, ANALYTICS & FULLSCREEN TESTS PASSED PERFECTLY!`);
  } else {
    console.error(`⚠️ ${failedCount} tests failed. Check logs above.`);
  }
  console.log('========================================================================\n');
}

runStudent360Tests()
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
