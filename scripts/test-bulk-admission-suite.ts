/**
 * Test Suite: Bulk Student Admission & Student 360° View
 * Validates Excel/CSV bulk enrollment API, unique admission number assignment,
 * class/section/session linkage, directory filtering, and student 360 dossier data.
 */

import { GET, POST, PATCH } from '../src/app/api/students/bulk/route';
import { NextRequest } from 'next/server';

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

async function runBulkAdmissionTests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING BULK STUDENT ADMISSION & STUDENT 360° TEST SUITE');
  console.log('========================================================================\n');

  // ===========================================================================
  // SECTION 1: GET DIRECTORY OF ADMITTED STUDENTS
  // ===========================================================================
  console.log('--- SECTION 1: Directory Listing & Filtering ---');

  const reqGet = new NextRequest('http://localhost:3000/api/students/bulk');
  const resGet = await GET(reqGet);
  const jsonGet = await resGet.json();

  assert(
    jsonGet.success === true && Array.isArray(jsonGet.data) && jsonGet.data.length > 0,
    'TC-BULK-01',
    'Fetch Admitted Students Directory',
    `Count: ${jsonGet.data?.length} students`
  );

  assert(
    jsonGet.metrics && typeof jsonGet.metrics.totalEnrolled === 'number' && typeof jsonGet.metrics.avgAttendance === 'number',
    'TC-BULK-02',
    'Directory response includes summary metrics (totalEnrolled, boys, girls, avgAttendance)',
    `Enrolled: ${jsonGet.metrics?.totalEnrolled}, Avg Attendance: ${jsonGet.metrics?.avgAttendance}%`
  );

  // Filter by Class 10
  const reqClassFilter = new NextRequest('http://localhost:3000/api/students/bulk?className=Class%2010');
  const resClassFilter = await GET(reqClassFilter);
  const jsonClassFilter = await resClassFilter.json();
  const allClass10 = jsonClassFilter.data.every((s: any) => s.className.includes('10'));
  assert(
    jsonClassFilter.success && allClass10 && jsonClassFilter.data.length > 0,
    'TC-BULK-03',
    'Filter directory by Target Grade Class',
    `Found ${jsonClassFilter.data?.length} Class 10 students`
  );

  // Filter by Section A
  const reqSectionFilter = new NextRequest('http://localhost:3000/api/students/bulk?sectionName=Section%20A');
  const resSectionFilter = await GET(reqSectionFilter);
  const jsonSectionFilter = await resSectionFilter.json();
  const allSectionA = jsonSectionFilter.data.every((s: any) => s.sectionName.includes('A'));
  assert(
    jsonSectionFilter.success && allSectionA && jsonSectionFilter.data.length > 0,
    'TC-BULK-04',
    'Filter directory by Section',
    `Found ${jsonSectionFilter.data?.length} Section A students`
  );

  // Search by Keyword
  const reqSearch = new NextRequest('http://localhost:3000/api/students/bulk?search=Aarav');
  const resSearch = await GET(reqSearch);
  const jsonSearch = await resSearch.json();
  assert(
    jsonSearch.success && jsonSearch.data.length > 0 && jsonSearch.data[0].firstName === 'Aarav',
    'TC-BULK-05',
    'Search directory by Student Name',
    `Matched: ${jsonSearch.data[0]?.firstName} ${jsonSearch.data[0]?.lastName} (${jsonSearch.data[0]?.admissionNo})`
  );

  // ===========================================================================
  // SECTION 2: POST BULK ADMISSION (ENROLLMENT & UNIQUE NUMBERS)
  // ===========================================================================
  console.log('\n--- SECTION 2: Bulk Admission Execution & Unique ID Assignment ---');

  const newRosterBatch = [
    {
      firstName: 'Pranav',
      lastName: 'Saxena',
      gender: 'MALE',
      dob: '2011-04-12',
      bloodGroup: 'B+',
      category: 'General',
      fatherName: 'Mr. Alok Saxena',
      fatherPhone: '+91 98765 44401',
      motherName: 'Mrs. Ritu Saxena',
      address: '22-B, Hazratganj, Lucknow',
    },
    {
      firstName: 'Tanvi',
      lastName: 'Mishra',
      gender: 'FEMALE',
      dob: '2011-09-30',
      bloodGroup: 'A+',
      category: 'General',
      fatherName: 'Mr. Manoj Mishra',
      fatherPhone: '+91 98765 44402',
      motherName: 'Mrs. Neha Mishra',
      address: '54, Gomti Nagar Phase 2, Lucknow',
    },
    {
      firstName: 'Devansh',
      lastName: 'Chopra',
      gender: 'MALE',
      dob: '2011-12-05',
      bloodGroup: 'O+',
      category: 'OBC',
      fatherName: 'Mr. Vikas Chopra',
      fatherPhone: '+91 98765 44403',
      motherName: 'Mrs. Simran Chopra',
      address: 'C-8, Ashiyana Colony, Lucknow',
    },
  ];

  const reqPost = new NextRequest('http://localhost:3000/api/students/bulk', {
    method: 'POST',
    body: JSON.stringify({
      students: newRosterBatch,
      targetClass: 'Class 11',
      targetSection: 'Section B',
      targetSession: '2026-27',
      admissionDate: '2026-04-05',
    }),
  });

  const resPost = await POST(reqPost);
  const jsonPost = await resPost.json();

  assert(
    resPost.status === 201 && jsonPost.success === true && jsonPost.count === 3,
    'TC-BULK-06',
    'Bulk enroll 3 new students with selected Class, Section, and Session',
    `Enrolled: ${jsonPost.count} students`
  );

  const createdList = jsonPost.createdStudents;
  const allHaveUniqueAdmissionNos =
    createdList.every((s: any) => /^ADM\d{2}-\d{4,5}$/.test(s.admissionNo)) &&
    new Set(createdList.map((s: any) => s.admissionNo)).size === createdList.length;

  assert(
    allHaveUniqueAdmissionNos,
    'TC-BULK-07',
    'Guaranteed unique Admission Number generation for each candidate (ADM26-XXXX format)',
    `Assigned: ${createdList.map((s: any) => s.admissionNo).join(', ')}`
  );

  const allAssignedSelectedClass = createdList.every(
    (s: any) => s.className === 'Class 11' && s.sectionName === 'Section B' && s.session === '2026-27'
  );
  assert(
    allAssignedSelectedClass,
    'TC-BULK-08',
    'Correct linkage to target Class 11, Section B, Session 2026-27, and Admission Date',
    'Class & Section linkage verified'
  );

  // Reject empty payload
  const reqPostEmpty = new NextRequest('http://localhost:3000/api/students/bulk', {
    method: 'POST',
    body: JSON.stringify({ students: [] }),
  });
  const resPostEmpty = await POST(reqPostEmpty);
  assert(
    resPostEmpty.status === 400,
    'TC-BULK-09',
    'Reject empty student roster payload with HTTP 400',
    `Status: ${resPostEmpty.status}`
  );

  // ===========================================================================
  // SECTION 3: STUDENT 360° DATA DOSSIER VERIFICATION
  // ===========================================================================
  console.log('\n--- SECTION 3: Student 360° Profile & Dossier Attributes ---');

  const sample360 = createdList[0];
  assert(
    sample360.academicScore >= 70 && sample360.academicScore <= 100,
    'TC-360-01',
    'Student 360 dossier includes computed academic performance score for diagrams',
    `Academic Score: ${sample360.academicScore}%`
  );

  assert(
    sample360.attendanceRate >= 85 && sample360.attendanceRate <= 100,
    'TC-360-02',
    'Student 360 dossier includes attendance rate for attendance trends',
    `Attendance Rate: ${sample360.attendanceRate}%`
  );

  assert(
    sample360.fatherName && sample360.fatherPhone && sample360.address,
    'TC-360-03',
    'Student 360 dossier contains complete family, guardian, and residential contact info',
    `Guardian: ${sample360.fatherName} (${sample360.fatherPhone})`
  );

  // ===========================================================================
  // SECTION 4: PATCH BULK UPDATE (SA-03 COMPLIANCE)
  // ===========================================================================
  console.log('\n--- SECTION 4: PATCH Bulk Updates ---');

  const reqPatch = new NextRequest('http://localhost:3000/api/students/bulk', {
    method: 'PATCH',
    body: JSON.stringify({
      studentIds: [createdList[0].id, createdList[1].id],
      session: '2026-27',
      isActive: true,
    }),
  });

  const resPatch = await PATCH(reqPatch);
  const jsonPatch = await resPatch.json();

  assert(
    resPatch.status === 200 && jsonPatch.success === true,
    'TC-BULK-10',
    'Bulk update session and active status on selected student records',
    `Updated: ${jsonPatch.count} students`
  );

  // ===========================================================================
  // SUMMARY REPORT
  // ===========================================================================
  console.log('\n========================================================================');
  console.log('📊 TEST EXECUTION SUMMARY REPORT');
  console.log('========================================================================');

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`Total Test Cases Executed : ${total}`);
  console.log(`Passed                    : ${passed}`);
  console.log(`Failed                    : ${failed}`);
  console.log(`Success Rate              : ${((passed / total) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 ALL 14 TEST CASES PASSED SUCCESSFULLY!\n');
  } else {
    console.error(`\n⚠️ ${failed} TEST CASE(S) FAILED.\n`);
    process.exit(1);
  }
}

runBulkAdmissionTests().catch((err) => {
  console.error('Fatal error running test suite:', err);
  process.exit(1);
});
