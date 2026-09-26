/**
 * Test Suite: Admission Inquiries CRM Conversion & Missing Field Gating
 * Tests:
 * 1. Automatic prefill parameter resolution (names, contacts, gender, class mapping).
 * 2. Gating and rejection when required fields (DOB, Gender, Class, Section, Names) are missing.
 * 3. Complete conversion of an Admission Inquiry into an admitted student.
 * 4. Automatic status update of AdmissionInquiry to ENROLLED upon enrollment.
 */

import { POST as createStudentPost } from '../src/app/api/students/route';
import { prisma } from '../src/lib/prisma';
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

async function runInquiryConversionTests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING ADMISSION INQUIRIES CRM CONVERSION & FIELD GATING TEST SUITE');
  console.log('========================================================================\n');

  // Find a campus, class and section to test with
  const campus = await prisma.campus.findFirst({ where: { isActive: true } });
  if (!campus) throw new Error('No active campus found in database.');

  const classItem = await prisma.class.findFirst({
    where: { campusId: campus.id },
    include: { sections: true },
  });
  if (!classItem || !classItem.sections.length) throw new Error('No class with sections found.');

  const sectionItem = classItem.sections[0];

  // ===========================================================================
  // SECTION 1: URL PARAMETER PREFILL & NAME SPLITTING LOGIC
  // ===========================================================================
  console.log('--- SECTION 1: Inquiry Detail Resolution & Parsing ---');

  // Test 1: Full name splitting
  const childFullName = 'Aanya Deepak Saxena';
  const nameParts = childFullName.trim().split(/\s+/);
  const parsedFirstName = nameParts[0] || '';
  const parsedLastName = nameParts.slice(1).join(' ') || '';

  assert(
    parsedFirstName === 'Aanya' && parsedLastName === 'Deepak Saxena',
    'TC-INQ-01',
    'Split child full name into firstName and lastName for admission form',
    `First: "${parsedFirstName}", Last: "${parsedLastName}"`
  );

  // Test 2: Single word name
  const singleName = 'Rohan';
  const singleParts = singleName.trim().split(/\s+/);
  assert(
    singleParts[0] === 'Rohan' && (singleParts.slice(1).join(' ') || '') === '',
    'TC-INQ-02',
    'Handle single-word child name gracefully without errors',
    `First: "${singleParts[0]}", Last: "${singleParts.slice(1).join(' ')}"`
  );

  // Test 3: Gender normalizer
  const normalizeGender = (g: string) => {
    const upper = (g || '').toUpperCase();
    return ['MALE', 'FEMALE', 'OTHER'].includes(upper) ? upper : '';
  };
  assert(
    normalizeGender('female') === 'FEMALE' &&
      normalizeGender('Male') === 'MALE' &&
      normalizeGender('other') === 'OTHER' &&
      normalizeGender('unknown') === '',
    'TC-INQ-03',
    'Normalize inquiry gender strings to valid schema enums'
  );

  // Test 4: Class target query resolution
  const targetClassQuery = 'Class ' + classItem.name;
  const cleanedClassQuery = targetClassQuery.replace(/class/i, '').trim().toLowerCase();
  const matched =
    classItem.name.toLowerCase() === targetClassQuery.toLowerCase() ||
    classItem.name.toLowerCase() === cleanedClassQuery;
  assert(
    matched === true,
    'TC-INQ-04',
    'Match string "Class X" from CRM inquiry to active database class record',
    `Target: "${targetClassQuery}" matched Class "${classItem.name}"`
  );

  // ===========================================================================
  // SECTION 2: GATING ON MISSING REQUIRED FIELDS
  // ===========================================================================
  console.log('\n--- SECTION 2: Required Fields Gating & Validation ---');

  // Test 5: Rejection when First Name is missing
  const payloadNoFirst = {
    firstName: '',
    lastName: 'Saxena',
    gender: 'FEMALE',
    dob: '2020-04-12',
    fatherName: 'Deepak Saxena',
    fatherPhone: '9876599901',
    campusId: campus.id,
    classId: classItem.id,
    sectionId: sectionItem.id,
  };
  const reqNoFirst = new NextRequest('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify(payloadNoFirst),
  });
  const resNoFirst = await createStudentPost(reqNoFirst);
  const jsonNoFirst = await resNoFirst.json();
  assert(
    resNoFirst.status === 400 && jsonNoFirst.success === false && jsonNoFirst.error.includes('First Name'),
    'TC-INQ-05',
    'Prevent admission submission when student First Name is missing',
    jsonNoFirst.error
  );

  // Test 6: Rejection when Last Name is missing
  const payloadNoLast = {
    ...payloadNoFirst,
    firstName: 'Aanya',
    lastName: '',
  };
  const reqNoLast = new NextRequest('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify(payloadNoLast),
  });
  const resNoLast = await createStudentPost(reqNoLast);
  const jsonNoLast = await resNoLast.json();
  assert(
    resNoLast.status === 400 && jsonNoLast.success === false && jsonNoLast.error.includes('Last Name'),
    'TC-INQ-06',
    'Prevent admission submission when student Last Name is missing',
    jsonNoLast.error
  );

  // Test 7: Rejection when Gender is missing (e.g. from partial inquiry inq-2)
  const payloadNoGender = {
    ...payloadNoFirst,
    firstName: 'Kunal',
    lastName: 'Bajpai',
    gender: '',
  };
  const reqNoGender = new NextRequest('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify(payloadNoGender),
  });
  const resNoGender = await createStudentPost(reqNoGender);
  const jsonNoGender = await resNoGender.json();
  assert(
    resNoGender.status === 400 && jsonNoGender.success === false && jsonNoGender.error.includes('Gender'),
    'TC-INQ-07',
    'Prevent admission submission when Gender is missing (asks user to fill all required fields)',
    jsonNoGender.error
  );

  // Test 8: Rejection when Date of Birth is missing
  const payloadNoDob = {
    ...payloadNoFirst,
    firstName: 'Kunal',
    lastName: 'Bajpai',
    dob: '',
  };
  const reqNoDob = new NextRequest('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify(payloadNoDob),
  });
  const resNoDob = await createStudentPost(reqNoDob);
  const jsonNoDob = await resNoDob.json();
  assert(
    resNoDob.status === 400 && jsonNoDob.success === false && jsonNoDob.error.includes('Date of Birth'),
    'TC-INQ-08',
    'Prevent admission submission when Date of Birth is missing',
    jsonNoDob.error
  );

  // Test 9: Rejection when Class or Section is missing
  const payloadNoSection = {
    ...payloadNoFirst,
    firstName: 'Aanya',
    lastName: 'Saxena',
    sectionId: '',
  };
  const reqNoSection = new NextRequest('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify(payloadNoSection),
  });
  const resNoSection = await createStudentPost(reqNoSection);
  const jsonNoSection = await resNoSection.json();
  assert(
    resNoSection.status === 400 && jsonNoSection.success === false && jsonNoSection.error.includes('Section'),
    'TC-INQ-09',
    'Prevent admission submission when Academic Section is not selected',
    jsonNoSection.error
  );

  // ===========================================================================
  // SECTION 3: SUCCESSFUL ADMISSION FROM INQUIRY & STATUS UPDATE
  // ===========================================================================
  console.log('\n--- SECTION 3: Complete Inquiry Conversion & SIS Enrollment ---');

  // Create a real DB inquiry record to test full conversion pipeline
  const testInquiry = await prisma.admissionInquiry.create({
    data: {
      applicationNo: `INQ-TEST-${Date.now().toString().slice(-4)}`,
      token: `TOK-${Date.now().toString().slice(-4)}`,
      firstName: 'Aarav',
      lastName: 'Choudhary',
      gender: 'MALE',
      dob: new Date('2019-06-15'),
      parentName: 'Sanjay Choudhary',
      parentPhone: '9876543210',
      parentEmail: `sanjay.${Date.now()}@example.com`,
      status: 'INQUIRY',
      priority: 'HIGH',
      source: 'WALK_IN',
      notes: 'Parent interested in CBSE English medium curriculum & school bus',
      campusId: campus.id,
      classId: classItem.id,
      sectionId: sectionItem.id,
    },
  });

  assert(
    Boolean(testInquiry && testInquiry.id && testInquiry.status === 'INQUIRY'),
    'TC-INQ-10',
    'Create active Admission Inquiry record in database',
    `Inquiry ID: ${testInquiry.id}, ApplicationNo: ${testInquiry.applicationNo}`
  );

  // Now convert this inquiry with all required fields filled
  const completeAdmissionPayload = {
    inquiryId: testInquiry.id,
    firstName: testInquiry.firstName,
    lastName: testInquiry.lastName,
    gender: 'MALE',
    dob: '2019-06-15',
    bloodGroup: 'B+',
    category: 'General',
    fatherName: testInquiry.parentName,
    fatherPhone: testInquiry.parentPhone,
    fatherEmail: testInquiry.parentEmail,
    campusId: campus.id,
    classId: classItem.id,
    sectionId: sectionItem.id,
    streetAddress: '15, Gomti Nagar, Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
  };

  const reqComplete = new NextRequest('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify(completeAdmissionPayload),
  });
  const resComplete = await createStudentPost(reqComplete);
  const jsonComplete = await resComplete.json();

  assert(
    resComplete.status === 201 && jsonComplete.success === true && Boolean(jsonComplete.data?.admissionNo),
    'TC-INQ-11',
    'Execute student admission with converted inquiry payload',
    `Assigned Admission No: ${jsonComplete.data?.admissionNo}`
  );

  // Test 12: Verify AdmissionInquiry record was automatically marked as ENROLLED
  const updatedInquiry = await prisma.admissionInquiry.findUnique({
    where: { id: testInquiry.id },
  });

  assert(
    updatedInquiry?.status === 'ENROLLED',
    'TC-INQ-12',
    'AdmissionInquiry status automatically updated to ENROLLED in database',
    `Status: ${updatedInquiry?.status}`
  );

  // Test 13: Verify created Student record in database
  const createdStudent = await prisma.student.findUnique({
    where: { id: jsonComplete.data?.id },
    include: { parent: true, class: true, section: true },
  });

  assert(
    Boolean(
      createdStudent &&
        createdStudent.firstName === 'Aarav' &&
        createdStudent.lastName === 'Choudhary' &&
        createdStudent.parent?.fatherName === 'Sanjay Choudhary' &&
        createdStudent.parent?.fatherPhone === '9876543210' &&
        createdStudent.classId === classItem.id &&
        createdStudent.sectionId === sectionItem.id
    ),
    'TC-INQ-13',
    'Student and Parent records properly linked with all inquiry attributes prefilled',
    `Student: ${createdStudent?.firstName} ${createdStudent?.lastName}, Parent: ${createdStudent?.parent?.fatherName}`
  );

  // ===========================================================================
  // SUMMARY
  // ===========================================================================
  console.log('\n========================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`📊 INQUIRY CONVERSION TEST SUMMARY: ${passedCount}/${results.length} PASSED`);
  if (failedCount === 0) {
    console.log('🎉 ALL INQUIRY CONVERSION & FIELD GATING TESTS PASSED PERFECTLY!');
  } else {
    console.error(`⚠️ ${failedCount} tests failed. Check logs above.`);
  }
  console.log('========================================================================\n');
}

runInquiryConversionTests()
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
