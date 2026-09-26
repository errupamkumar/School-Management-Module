/**
 * Test Suite: Student Directory Search & New Admission Verification
 * Tests:
 * 1. Search by single token (firstName: 'Manish')
 * 2. Search by multi-token full name ('Manish Kumar')
 * 3. Search by exact & partial admission number ('ADM261308', '261308')
 * 4. Case-insensitive search on MySQL (e.g. 'manish', 'KUMAR')
 * 5. New student admission creation with automatic class enrollment
 * 6. Verification that newly admitted student appears at top of directory roster (createdAt desc)
 * 7. Verification that search immediately locates the newly admitted student
 */

import { prisma } from '../src/lib/prisma';

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

async function runSearchAndAdmissionTests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING STUDENT DIRECTORY SEARCH & NEW ADMISSION TEST SUITE');
  console.log('========================================================================\n');

  // ===========================================================================
  // SECTION 1: SEARCH FUNCTIONALITY ON MYSQL
  // ===========================================================================
  console.log('--- SECTION 1: Multi-field & Case-insensitive Search on MySQL ---');

  // Helper matching the exact logic in src/app/api/students/route.ts
  const buildSearchWhere = (search: string, session?: string) => {
    const where: any = { isActive: true };
    if (session && session !== 'ALL') where.session = session;

    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      const searchTokens = trimmedSearch.split(/\s+/).filter(Boolean);

      const conditions: any[] = [
        { firstName: { contains: trimmedSearch } },
        { lastName: { contains: trimmedSearch } },
        { admissionNo: { contains: trimmedSearch } },
        { rollNo: { contains: trimmedSearch } },
        { parent: { fatherName: { contains: trimmedSearch } } },
        { parent: { fatherPhone: { contains: trimmedSearch } } },
      ];

      if (searchTokens.length >= 2) {
        conditions.push({
          AND: [
            { firstName: { contains: searchTokens[0] } },
            { lastName: { contains: searchTokens.slice(1).join(' ') } },
          ],
        });
      }

      where.OR = conditions;
    }
    return where;
  };

  // Test 1: Search 'Manish' in session '2025-26'
  const manishCurrent = await prisma.student.findMany({
    where: buildSearchWhere('Manish', '2025-26'),
    select: { admissionNo: true, firstName: true, lastName: true, session: true },
  });
  assert(
    manishCurrent.length >= 1 && manishCurrent.some((s) => s.firstName === 'Manish' && s.session === '2025-26'),
    'TC-SEARCH-01',
    'Search by single token "Manish" in Current Session (2025-26)',
    `Found ${manishCurrent.length} record(s): ${manishCurrent.map((s) => s.admissionNo).join(', ')}`
  );

  // Test 2: Search lowercase 'manish'
  const manishLower = await prisma.student.findMany({
    where: buildSearchWhere('manish', '2025-26'),
    select: { admissionNo: true, firstName: true },
  });
  assert(
    manishLower.length === manishCurrent.length,
    'TC-SEARCH-02',
    'Case-insensitive search returns matching records without throwing PrismaClientValidationError',
    `Found ${manishLower.length} record(s)`
  );

  // Test 3: Multi-word search 'Manish Kumar'
  const manishFull = await prisma.student.findMany({
    where: buildSearchWhere('Manish Kumar', 'ALL'),
    select: { admissionNo: true, firstName: true, lastName: true },
  });
  assert(
    manishFull.length >= 1 && manishFull.every((s) => s.firstName === 'Manish' && s.lastName === 'Kumar'),
    'TC-SEARCH-03',
    'Multi-word search "Manish Kumar" matches combined first and last names',
    `Found ${manishFull.length} record(s)`
  );

  // Test 4: Search by Admission Number 'ADM261308' and partial '261308'
  const admExact = await prisma.student.findMany({
    where: buildSearchWhere('ADM261308', 'ALL'),
    select: { admissionNo: true, firstName: true },
  });
  const admPartial = await prisma.student.findMany({
    where: buildSearchWhere('261308', 'ALL'),
    select: { admissionNo: true, firstName: true },
  });
  assert(
    admExact.length >= 1 && admPartial.length >= 1,
    'TC-SEARCH-04',
    'Search by exact ("ADM261308") and partial ("261308") admission number',
    `Exact matches: ${admExact.length}, Partial matches: ${admPartial.length}`
  );

  // ===========================================================================
  // SECTION 2: NEW ADMISSION CREATION & IMMEDIATE ROSTER VISIBILITY
  // ===========================================================================
  console.log('\n--- SECTION 2: New Admission & Directory Roster Linkage ---');

  const testAdmNo = `ADM26-${Math.floor(1000 + Math.random() * 9000)}`;
  const campus = await prisma.campus.findFirst({ where: { isActive: true } });
  const cls = await prisma.class.findFirst({
    where: { campusId: campus?.id },
    include: { sections: true },
  });
  const section = cls?.sections?.[0];

  assert(Boolean(campus && cls && section), 'TC-ADM-01', 'Active campus, class, and section available for admission');

  if (!campus || !cls || !section) return;

  // Create test user and student
  const studentUser = await prisma.user.create({
    data: {
      email: `${testAdmNo.toLowerCase()}@test.vidyalaya.com`,
      password: 'hashedpassword',
      role: 'STUDENT',
      campusId: campus.id,
    },
  });

  const newStudent = await prisma.student.create({
    data: {
      admissionNo: testAdmNo,
      firstName: 'Rohan',
      lastName: 'Verma',
      gender: 'MALE',
      dob: new Date('2018-05-15'),
      bloodGroup: 'B_POSITIVE',
      session: '2025-26',
      userId: studentUser.id,
      campusId: campus.id,
      classId: cls.id,
      sectionId: section.id,
      isActive: true,
    },
  });

  // Create primary class enrollment
  await prisma.studentClassEnrollment.create({
    data: {
      studentId: newStudent.id,
      classId: cls.id,
      isPrimary: true,
    },
  });

  assert(
    Boolean(newStudent && newStudent.admissionNo === testAdmNo),
    'TC-ADM-02',
    'New student record created with unique admission number and session',
    `Created: ${newStudent.admissionNo} - ${newStudent.firstName} ${newStudent.lastName}`
  );

  // Test 5: Verify new student is at the top of the directory roster (ordered by createdAt desc)
  const rosterTop = await prisma.student.findMany({
    where: { session: '2025-26', isActive: true },
    orderBy: [{ createdAt: 'desc' }, { admissionNo: 'desc' }],
    take: 5,
    select: { admissionNo: true, firstName: true, lastName: true },
  });

  assert(
    rosterTop[0]?.admissionNo === testAdmNo,
    'TC-ADM-03',
    'Newly admitted student immediately appears at the very top (Row 1) of the Student Information roster',
    `Top student: ${rosterTop[0]?.admissionNo} (${rosterTop[0]?.firstName} ${rosterTop[0]?.lastName})`
  );

  // Test 6: Verify searching for the new student finds them immediately
  const searchNewStudent = await prisma.student.findMany({
    where: buildSearchWhere('Rohan', '2025-26'),
    select: { admissionNo: true, firstName: true, lastName: true },
  });
  assert(
    searchNewStudent.some((s) => s.admissionNo === testAdmNo),
    'TC-ADM-04',
    'Searching for newly admitted student by name ("Rohan") finds the student immediately',
    `Found ${searchNewStudent.length} match(es)`
  );

  const searchNewAdmNo = await prisma.student.findMany({
    where: buildSearchWhere(testAdmNo, '2025-26'),
    select: { admissionNo: true },
  });
  assert(
    searchNewAdmNo.length === 1 && searchNewAdmNo[0].admissionNo === testAdmNo,
    'TC-ADM-05',
    `Searching by newly generated admission number "${testAdmNo}" isolates the exact student`,
    `Found admission record successfully`
  );

  // Cleanup test record
  await prisma.studentClassEnrollment.deleteMany({ where: { studentId: newStudent.id } });
  await prisma.student.delete({ where: { id: newStudent.id } });
  await prisma.user.delete({ where: { id: studentUser.id } });

  // ===========================================================================
  // SUMMARY
  // ===========================================================================
  console.log('\n========================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`📊 TEST SUMMARY: ${passedCount}/${results.length} PASSED`);
  if (failedCount === 0) {
    console.log('🎉 ALL SEARCH & ADMISSION TESTS PASSED PERFECTLY!');
  } else {
    console.error(`⚠️ ${failedCount} tests failed.`);
  }
  console.log('========================================================================\n');
}

runSearchAndAdmissionTests()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
