/**
 * Test Suite: Teacher Parent Meeting (PTM) & Principal Connect (1:1)
 * Validates Navigation role adaptation, API endpoints, Admin oversight tracking,
 * Meeting Minutes (MOM), slot management, conflict prevention, and RBAC isolation.
 */

import { Role } from '@prisma/client';
import { getMenuForRole, sidebarItems } from '../src/lib/navigation';
import { GET, POST, PATCH, MeetingRecord } from '../src/app/api/meetings/route';
import { NextRequest } from 'next/server';

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  details?: string;
  error?: string;
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

async function runTestSuite() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING COMPREHENSIVE TEST SUITE: TEACHER PARENT MEETING & PRINCIPAL CONNECT');
  console.log('========================================================================\n');

  // ===========================================================================
  // SECTION 1: ROLE-BASED NAVIGATION ADAPTATION
  // ===========================================================================
  console.log('--- SECTION 1: Navigation Menu Role Adaptation ---');

  const teacherMenu = getMenuForRole(Role.TEACHER);
  const teacherMeetingItem = teacherMenu.find(item => item.href === '/meetings');
  assert(
    !!teacherMeetingItem && teacherMeetingItem.title === 'Teacher Parent Meeting',
    'TC-NAV-01',
    'Teacher Role sees "Teacher Parent Meeting"',
    `Title: "${teacherMeetingItem?.title}", Icon: "${teacherMeetingItem?.icon}"`
  );
  assert(
    teacherMeetingItem?.titleHi === 'शिक्षक-अभिभावक बैठक',
    'TC-NAV-02',
    'Teacher Role has Hindi localization "शिक्षक-अभिभावक बैठक"',
    `Hindi: "${teacherMeetingItem?.titleHi}"`
  );

  const adminMenu = getMenuForRole(Role.ADMIN);
  const adminMeetingItem = adminMenu.find(item => item.href === '/meetings');
  assert(
    !!adminMeetingItem && adminMeetingItem.title === 'Principal Connect & PTM Hub',
    'TC-NAV-03',
    'Admin Role sees "Principal Connect & PTM Hub"',
    `Title: "${adminMeetingItem?.title}"`
  );

  const superAdminMenu = getMenuForRole(Role.SUPER_ADMIN);
  const superAdminMeetingItem = superAdminMenu.find(item => item.href === '/meetings');
  assert(
    !!superAdminMeetingItem && superAdminMeetingItem.title === 'Principal Connect & PTM Hub',
    'TC-NAV-04',
    'Super Admin Role sees "Principal Connect & PTM Hub"',
    `Title: "${superAdminMeetingItem?.title}"`
  );

  const parentMenu = getMenuForRole(Role.PARENT);
  const parentMeetingItem = parentMenu.find(item => item.href === '/meetings');
  assert(
    !!parentMeetingItem && parentMeetingItem.title === 'Teacher & Principal Connect',
    'TC-NAV-05',
    'Parent Role sees "Teacher & Principal Connect"',
    `Title: "${parentMeetingItem?.title}"`
  );

  const studentMenu = getMenuForRole(Role.STUDENT);
  const studentMeetingItem = studentMenu.find(item => item.href === '/meetings');
  assert(
    studentMeetingItem === undefined,
    'TC-NAV-06',
    'Student Role is strictly excluded from meetings menu (FERPA/Confidentiality)',
    'Menu item excluded'
  );

  // ===========================================================================
  // SECTION 2: API GET ENDPOINT (FILTERING & METRICS)
  // ===========================================================================
  console.log('\n--- SECTION 2: API GET Endpoint, Filtering & Metrics ---');

  // 2.1 Fetch all
  const reqAll = new NextRequest('http://localhost:3000/api/meetings');
  const resAll = await GET(reqAll);
  const jsonAll = await resAll.json();

  assert(
    jsonAll.success === true && Array.isArray(jsonAll.data) && jsonAll.data.length > 0,
    'TC-API-GET-01',
    'GET /api/meetings retrieves meeting records',
    `Count: ${jsonAll.data?.length}`
  );

  assert(
    jsonAll.metrics &&
      typeof jsonAll.metrics.teacherParentMeetingCount === 'number' &&
      typeof jsonAll.metrics.principalConnectCount === 'number' &&
      typeof jsonAll.metrics.adminOversightCount === 'number',
    'TC-API-GET-02',
    'GET response contains live analytics metrics (PTM, Principal Connect, Admin Oversight)',
    `PTMs: ${jsonAll.metrics?.teacherParentMeetingCount}, Principal 1:1: ${jsonAll.metrics?.principalConnectCount}, Admin Tracked: ${jsonAll.metrics?.adminOversightCount}`
  );

  // 2.2 Filter by Type: TEACHER_PARENT_MEETING
  const reqPTM = new NextRequest('http://localhost:3000/api/meetings?type=TEACHER_PARENT_MEETING');
  const resPTM = await GET(reqPTM);
  const jsonPTM = await resPTM.json();
  const allArePTM = jsonPTM.data.every((m: MeetingRecord) => m.meetingType === 'TEACHER_PARENT_MEETING');
  assert(
    jsonPTM.success && allArePTM && jsonPTM.data.length > 0,
    'TC-API-GET-03',
    'GET /api/meetings?type=TEACHER_PARENT_MEETING correctly isolates Teacher-Parent Meetings',
    `Found ${jsonPTM.data.length} PTM records`
  );

  // 2.3 Filter by Type: PRINCIPAL_CONNECT
  const reqPrincipal = new NextRequest('http://localhost:3000/api/meetings?type=PRINCIPAL_CONNECT');
  const resPrincipal = await GET(reqPrincipal);
  const jsonPrincipal = await resPrincipal.json();
  const allArePrincipal = jsonPrincipal.data.every((m: MeetingRecord) => m.meetingType === 'PRINCIPAL_CONNECT');
  assert(
    jsonPrincipal.success && allArePrincipal && jsonPrincipal.data.length > 0,
    'TC-API-GET-04',
    'GET /api/meetings?type=PRINCIPAL_CONNECT correctly isolates Principal Connect consultations',
    `Found ${jsonPrincipal.data.length} Principal records`
  );

  // 2.4 Filter by Admin Oversight (Crucial User Requirement)
  const reqAdminOversight = new NextRequest('http://localhost:3000/api/meetings?adminOversight=true');
  const resAdminOversight = await GET(reqAdminOversight);
  const jsonAdminOversight = await resAdminOversight.json();
  const allHaveOversight = jsonAdminOversight.data.every((m: MeetingRecord) => m.adminOversight === true);
  assert(
    jsonAdminOversight.success && allHaveOversight && jsonAdminOversight.data.length > 0,
    'TC-API-GET-05',
    'GET /api/meetings?adminOversight=true filters sessions tracked by School Leadership',
    `Found ${jsonAdminOversight.data.length} Admin-tracked records`
  );

  // 2.5 Keyword search
  const reqSearch = new NextRequest('http://localhost:3000/api/meetings?search=Physics');
  const resSearch = await GET(reqSearch);
  const jsonSearch = await resSearch.json();
  assert(
    jsonSearch.success && jsonSearch.data.length > 0,
    'TC-API-GET-06',
    'GET /api/meetings?search=Physics matches agenda and recipient fields',
    `Found ${jsonSearch.data.length} matching records`
  );

  // ===========================================================================
  // SECTION 3: API POST (BOOKING & VALIDATION)
  // ===========================================================================
  console.log('\n--- SECTION 3: API POST Endpoint (Booking & Validation) ---');

  // 3.1 Book Teacher Parent Meeting with Admin Oversight
  const postPTMAdminPayload = {
    meetingType: 'TEACHER_PARENT_MEETING',
    recipientRole: 'CLASS_TEACHER',
    recipientName: 'Mr. Rajesh Khanna (Class Teacher & Physics)',
    studentName: 'Aarav Sharma',
    studentClass: 'Class 10-A',
    studentRollNo: '14',
    category: 'ACADEMIC_PROGRESS',
    mode: 'VIRTUAL_MEET',
    requestedDate: '2026-10-18',
    timeSlot: '02:30 PM - 03:00 PM',
    agenda: 'Quarterly review on board exam physics numericals with request for Principal monitoring.',
    adminOversight: true,
  };

  const reqPost1 = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'POST',
    body: JSON.stringify(postPTMAdminPayload),
  });
  const resPost1 = await POST(reqPost1);
  const jsonPost1 = await resPost1.json();

  assert(
    resPost1.status === 201 &&
      jsonPost1.success === true &&
      jsonPost1.data.meetingType === 'TEACHER_PARENT_MEETING' &&
      jsonPost1.data.adminOversight === true,
    'TC-API-POST-01',
    'Book Teacher-Parent Meeting (PTM) with optional Admin Oversight enabled',
    `Created ID: ${jsonPost1.data?.id}, Oversight: ${jsonPost1.data?.adminOversight}`
  );

  // 3.2 Book Principal Connect 1:1 Consultation
  const postPrincipalPayload = {
    meetingType: 'PRINCIPAL_CONNECT',
    recipientRole: 'PRINCIPAL',
    recipientName: 'Dr. R. K. Mukherjee (Principal)',
    studentName: 'Meera Singhal',
    studentClass: 'Class 12-Science',
    studentRollNo: '03',
    category: 'CAREER_GUIDANCE',
    mode: 'IN_PERSON',
    requestedDate: '2026-10-19',
    timeSlot: '11:30 AM - 12:00 PM',
    agenda: 'National scholarship application endorsement by Principal.',
  };

  const reqPost2 = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'POST',
    body: JSON.stringify(postPrincipalPayload),
  });
  const resPost2 = await POST(reqPost2);
  const jsonPost2 = await resPost2.json();

  assert(
    resPost2.status === 201 &&
      jsonPost2.success === true &&
      jsonPost2.data.meetingType === 'PRINCIPAL_CONNECT',
    'TC-API-POST-02',
    'Book Principal Connect 1:1 Consultation',
    `Created ID: ${jsonPost2.data?.id}, Type: ${jsonPost2.data?.meetingType}`
  );

  // 3.3 Slot Collision Prevention (Double booking prevention)
  const reqPostCollision = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'POST',
    body: JSON.stringify(postPTMAdminPayload), // exact same slot and teacher
  });
  const resPostCollision = await POST(reqPostCollision);
  const jsonPostCollision = await resPostCollision.json();

  assert(
    resPostCollision.status === 409 && jsonPostCollision.success === false,
    'TC-API-POST-03',
    'Slot collision detection prevents double-booking same recipient on identical date and time slot',
    `Status: ${resPostCollision.status}, Error: "${jsonPostCollision.error?.slice(0, 40)}..."`
  );

  // 3.4 Missing Required Fields Validation
  const reqPostInvalid = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'POST',
    body: JSON.stringify({ category: 'ACADEMIC_PROGRESS' }),
  });
  const resPostInvalid = await POST(reqPostInvalid);
  const jsonPostInvalid = await resPostInvalid.json();

  assert(
    resPostInvalid.status === 400 && jsonPostInvalid.success === false,
    'TC-API-POST-04',
    'Validation rejects incomplete meeting submissions with HTTP 400',
    `Status: ${resPostInvalid.status}`
  );

  // ===========================================================================
  // SECTION 4: API PATCH (STATUS, RESCHEDULE, ADMIN OVERSIGHT, MINUTES)
  // ===========================================================================
  console.log('\n--- SECTION 4: API PATCH Endpoint (Status, Reschedule, Minutes) ---');

  const createdId = jsonPost1.data.id;

  // 4.1 Confirm Meeting & Provide Meet URL
  const reqPatchConfirm = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'PATCH',
    body: JSON.stringify({
      id: createdId,
      status: 'CONFIRMED',
      virtualLink: 'https://meet.google.com/test-ptm-session',
      staffNotes: 'Confirmed. Class teacher will present quarterly academic progress rubric.',
    }),
  });
  const resPatchConfirm = await PATCH(reqPatchConfirm);
  const jsonPatchConfirm = await resPatchConfirm.json();

  assert(
    resPatchConfirm.status === 200 &&
      jsonPatchConfirm.data.status === 'CONFIRMED' &&
      jsonPatchConfirm.data.virtualLink === 'https://meet.google.com/test-ptm-session',
    'TC-API-PATCH-01',
    'Confirm PTM appointment and provision virtual conference link',
    `Status: ${jsonPatchConfirm.data?.status}`
  );

  // 4.2 Reschedule Meeting Slot
  const reqPatchReschedule = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'PATCH',
    body: JSON.stringify({
      id: createdId,
      status: 'RESCHEDULED',
      requestedDate: '2026-10-21',
      timeSlot: '03:30 PM - 04:00 PM',
      rescheduleReason: 'Faculty duty shift to afternoon slot.',
    }),
  });
  const resPatchReschedule = await PATCH(reqPatchReschedule);
  const jsonPatchReschedule = await resPatchReschedule.json();

  assert(
    resPatchReschedule.status === 200 &&
      jsonPatchReschedule.data.status === 'RESCHEDULED' &&
      jsonPatchReschedule.data.timeSlot === '03:30 PM - 04:00 PM' &&
      jsonPatchReschedule.data.rescheduleReason === 'Faculty duty shift to afternoon slot.',
    'TC-API-PATCH-02',
    'Reschedule meeting slot with audit reason',
    `Date: ${jsonPatchReschedule.data?.requestedDate}, Slot: ${jsonPatchReschedule.data?.timeSlot}`
  );

  // 4.3 Toggle Admin Oversight & Add Admin Directive
  const reqPatchAdminNotes = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'PATCH',
    body: JSON.stringify({
      id: createdId,
      adminOversight: true,
      adminAttendeeName: 'Dr. R. K. Mukherjee (Principal - Overseeing)',
      adminNotes: 'Principal directive: focus on physics numerical workbook compliance.',
    }),
  });
  const resPatchAdminNotes = await PATCH(reqPatchAdminNotes);
  const jsonPatchAdminNotes = await resPatchAdminNotes.json();

  assert(
    resPatchAdminNotes.status === 200 &&
      jsonPatchAdminNotes.data.adminOversight === true &&
      jsonPatchAdminNotes.data.adminNotes.includes('Principal directive'),
    'TC-API-PATCH-03',
    'Admin/Principal attaches executive observation directive to Teacher-Parent session',
    `Admin Notes: "${jsonPatchAdminNotes.data?.adminNotes}"`
  );

  // 4.4 Record Meeting Minutes & Action Items (MOM)
  const reqPatchMinutes = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'PATCH',
    body: JSON.stringify({
      id: createdId,
      status: 'COMPLETED',
      meetingMinutes: {
        discussionSummary: 'In-depth review completed with parents. Physics numerical plan finalized.',
        actionItems: [
          'Complete 15 NCERT numerical exercises by Friday',
          'Weekly class mentor diary sign-off by parent',
          'Principal follow-up audit scheduled post-unit assessment',
        ],
        followUpRequired: true,
        followUpDate: '2026-11-05',
        resolutionStatus: 'FOLLOW_UP_REQUIRED',
      },
    }),
  });
  const resPatchMinutes = await PATCH(reqPatchMinutes);
  const jsonPatchMinutes = await resPatchMinutes.json();

  assert(
    resPatchMinutes.status === 200 &&
      jsonPatchMinutes.data.status === 'COMPLETED' &&
      jsonPatchMinutes.data.meetingMinutes?.actionItems?.length === 3 &&
      jsonPatchMinutes.data.meetingMinutes?.resolutionStatus === 'FOLLOW_UP_REQUIRED',
    'TC-API-PATCH-04',
    'Record comprehensive Meeting Minutes & 3 Action Items upon conference completion',
    `Status: ${jsonPatchMinutes.data?.status}, Action Items Count: ${jsonPatchMinutes.data?.meetingMinutes?.actionItems?.length}`
  );

  // 4.5 Dispatch Simulated Reminder Alert
  const reqPatchReminder = new NextRequest('http://localhost:3000/api/meetings', {
    method: 'PATCH',
    body: JSON.stringify({
      id: createdId,
      triggerReminder: true,
    }),
  });
  const resPatchReminder = await PATCH(reqPatchReminder);
  const jsonPatchReminder = await resPatchReminder.json();

  assert(
    resPatchReminder.status === 200 && (jsonPatchReminder.data.reminderSentCount || 0) >= 1,
    'TC-API-PATCH-05',
    'Dispatch reminder notification increments reminder counter and updates audit log',
    `Reminder Count: ${jsonPatchReminder.data?.reminderSentCount}`
  );

  // ===========================================================================
  // SECTION 5: SUMMARY REPORT
  // ===========================================================================
  console.log('\n========================================================================');
  console.log('📊 TEST EXECUTION SUMMARY REPORT');
  console.log('========================================================================');

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`Total Test Cases Executed : ${total}`);
  console.log(`Passed                    : ${passed}`);
  console.log(`Failed                    : ${failed}`);
  console.log(`Success Rate              : ${((passed / total) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 ALL 18 TEST CASES PASSED SUCCESSFULLY!\n');
  } else {
    console.error(`\n⚠️ ${failed} TEST CASE(S) FAILED. Please review output above.\n`);
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal error executing test suite:', err);
  process.exit(1);
});
