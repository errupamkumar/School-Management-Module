import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MySQL database (vidyalaya-db)...');

  // Clean existing data in safe dependency order
  await prisma.biometricLog.deleteMany();
  await prisma.biometricDevice.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.idCardTemplate.deleteMany();
  await prisma.homeworkSubmission.deleteMany();
  await prisma.homework.deleteMany();
  await prisma.onlineClass.deleteMany();
  await prisma.examResult.deleteMany();
  await prisma.examSubject.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.timetableSlot.deleteMany();
  await prisma.teacherAttendance.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.transportAssignment.deleteMany();
  await prisma.transportStop.deleteMany();
  await prisma.transportRoute.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.teacherLeaveRequest.deleteMany();
  await prisma.staffSalaryPayment.deleteMany();
  await prisma.salaryPayment.deleteMany();
  await prisma.income.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.event.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.studentDocument.deleteMany();
  await prisma.studentPromotion.deleteMany();
  await prisma.classSubject.deleteMany();
  await prisma.teacherSubject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.section.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.academicSession.deleteMany();
  await prisma.user.deleteMany();
  await prisma.campus.deleteMany();

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // 1. Campus
  const campus = await prisma.campus.create({
    data: {
      name: 'Vidyalaya Senior Secondary Campus',
      code: 'VPS-MAIN-01',
      address: 'Plot 4, Institutional Area, Sector 62',
      city: 'Noida',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      pincode: '201309',
      phone: '0120-4567890',
      email: 'principal@vidyalaya.edu.in',
      principalName: 'Dr. Anand Swaroop Pathak',
      affiliationNo: 'CBSE-2130894',
      boardType: 'CBSE',
      establishedYear: 2005,
    },
  });

  // 2. Academic Session
  await prisma.academicSession.create({
    data: {
      name: '2026-27',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true,
    },
  });

  // 3. Super Admin & Admin Users
  await prisma.user.create({
    data: {
      email: 'admin@school.com',
      phone: '9876543210',
      password: hash('Admin@123'),
      role: 'SUPER_ADMIN',
      campusId: campus.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@vidyalaya.com',
      phone: '9876543211',
      password: hash('admin123'),
      role: 'SUPER_ADMIN',
      campusId: campus.id,
    },
  });

  // 4. Classes & Sections
  const classNames = [
    { name: 'Nursery', order: 1 }, { name: 'LKG', order: 2 }, { name: 'UKG', order: 3 },
    { name: '1', order: 4 }, { name: '2', order: 5 }, { name: '3', order: 6 },
    { name: '4', order: 7 }, { name: '5', order: 8 }, { name: '6', order: 9 },
    { name: '7', order: 10 }, { name: '8', order: 11 }, { name: '9', order: 12 },
    { name: '10', order: 13 }, { name: '11', order: 14 }, { name: '12', order: 15 },
  ];

  const classes: Record<string, string> = {};
  const sections: Record<string, string> = {};

  for (const c of classNames) {
    const cls = await prisma.class.create({
      data: { name: c.name, numericOrder: c.order, campusId: campus.id },
    });
    classes[c.name] = cls.id;

    const secCount = c.order <= 3 ? 2 : c.order <= 8 ? 3 : c.order <= 13 ? 2 : 2;
    for (let i = 0; i < secCount; i++) {
      const secName = String.fromCharCode(65 + i);
      const sec = await prisma.section.create({
        data: { name: secName, classId: cls.id, campusId: campus.id, capacity: 40 },
      });
      sections[`${c.name}-${secName}`] = sec.id;
    }
  }

  // 5. Subjects
  const subjectData = [
    { name: 'Hindi', code: 'HIN', type: 'THEORY' },
    { name: 'English', code: 'ENG', type: 'THEORY' },
    { name: 'Mathematics', code: 'MAT', type: 'THEORY' },
    { name: 'Science', code: 'SCI', type: 'BOTH' },
    { name: 'Social Science', code: 'SST', type: 'THEORY' },
    { name: 'Computer Science', code: 'CS', type: 'BOTH' },
    { name: 'Physical Education', code: 'PE', type: 'PRACTICAL' },
    { name: 'Physics', code: 'PHY', type: 'BOTH' },
    { name: 'Chemistry', code: 'CHE', type: 'BOTH' },
    { name: 'Biology', code: 'BIO', type: 'BOTH' },
  ];

  const subjects: Record<string, string> = {};
  for (const s of subjectData) {
    const sub = await prisma.subject.create({
      data: { name: s.name, code: s.code, subjectType: s.type },
    });
    subjects[s.code] = sub.id;
  }

  // Link subjects to classes 9 and 10
  for (const className of ['9', '10']) {
    for (const code of ['HIN', 'ENG', 'MAT', 'SCI', 'SST', 'CS']) {
      await prisma.classSubject.create({
        data: { classId: classes[className], subjectId: subjects[code] },
      });
    }
  }

  // 6. Teachers
  const teacherData = [
    { first: 'Rajesh', last: 'Khanna', gender: 'MALE', qual: 'Ph.D Physics', subject: 'PHY', email: 'teacher@school.com', empId: 'EMP-T101' },
    { first: 'Sunita', last: 'Sharma', gender: 'FEMALE', qual: 'M.Sc Mathematics', subject: 'MAT', email: 'sunita.sharma@vidyalaya.com', empId: 'EMP-T102' },
    { first: 'Anil', last: 'Deshmukh', gender: 'MALE', qual: 'M.A English Lit', subject: 'ENG', email: 'anil.deshmukh@vidyalaya.com', empId: 'EMP-T103' },
    { first: 'Pooja', last: 'Verma', gender: 'FEMALE', qual: 'M.Sc Chemistry', subject: 'CHE', email: 'pooja.verma@vidyalaya.com', empId: 'EMP-T104' },
    { first: 'Arun', last: 'Tiwari', gender: 'MALE', qual: 'MCA Computer Science', subject: 'CS', email: 'arun.tiwari@vidyalaya.com', empId: 'EMP-T105' },
  ];

  const teacherIds: string[] = [];
  for (const t of teacherData) {
    const user = await prisma.user.create({
      data: {
        email: t.email,
        password: hash('Teacher@123'),
        role: 'TEACHER',
        campusId: campus.id,
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        employeeId: t.empId,
        firstName: t.first,
        lastName: t.last,
        gender: t.gender as any,
        qualification: t.qual,
        experience: 8,
        salary: 48000,
        joiningDate: new Date('2021-04-01'),
        userId: user.id,
        campusId: campus.id,
      },
    });
    teacherIds.push(teacher.id);

    // Assign class teacher to Class 10-A
    if (t.empId === 'EMP-T101') {
      await prisma.section.update({
        where: { id: sections['10-A'] },
        data: { classTeacherId: teacher.id },
      });
    }
  }

  // 7. Non-Teaching Staff
  const accountantUser = await prisma.user.create({
    data: {
      email: 'accountant@school.com',
      password: hash('Accountant@123'),
      role: 'ACCOUNTANT',
      campusId: campus.id,
    },
  });
  await prisma.staff.create({
    data: {
      employeeId: 'EMP-A201',
      firstName: 'Ramesh',
      lastName: 'Gupta',
      designation: 'Senior Accountant',
      department: 'Finance & Accounts',
      salary: 38000,
      gender: 'MALE',
      userId: accountantUser.id,
    },
  });

  // 8. Students & Parents (30 Students)
  const studentNames = [
    { first: 'Aarav', last: 'Sharma', gender: 'MALE' },
    { first: 'Ananya', last: 'Patel', gender: 'FEMALE' },
    { first: 'Rohan', last: 'Gupta', gender: 'MALE' },
    { first: 'Priya', last: 'Verma', gender: 'FEMALE' },
    { first: 'Aditya', last: 'Singh', gender: 'MALE' },
    { first: 'Simran', last: 'Kaur', gender: 'FEMALE' },
    { first: 'Ishaan', last: 'Mishra', gender: 'MALE' },
    { first: 'Diya', last: 'Dubey', gender: 'FEMALE' },
    { first: 'Vivaan', last: 'Pandey', gender: 'MALE' },
    { first: 'Saanvi', last: 'Yadav', gender: 'FEMALE' },
  ];

  const studentIds: string[] = [];
  for (let i = 0; i < studentNames.length; i++) {
    const s = studentNames[i];
    const admNo = `ADM2026${(100 + i).toString()}`;

    // Parent
    const parentEmail = i === 0 ? 'parent@school.com' : `parent.${admNo.toLowerCase()}@vidyalaya.com`;
    const parentUser = await prisma.user.create({
      data: {
        email: parentEmail,
        password: hash('Parent@123'),
        role: 'PARENT',
        campusId: campus.id,
      },
    });

    const parent = await prisma.parent.create({
      data: {
        userId: parentUser.id,
        fatherName: `Rajesh ${s.last}`,
        fatherPhone: `+91 98765 ${(43210 + i).toString().padStart(5, '0')}`,
        motherName: `Sunita ${s.last}`,
      },
    });

    // Student
    const studentEmail = i === 0 ? 'student@school.com' : `student.${admNo.toLowerCase()}@vidyalaya.com`;
    const studentUser = await prisma.user.create({
      data: {
        email: studentEmail,
        password: hash('Student@123'),
        role: 'STUDENT',
        campusId: campus.id,
      },
    });

    const student = await prisma.student.create({
      data: {
        admissionNo: admNo,
        rollNo: (i + 1).toString(),
        firstName: s.first,
        lastName: s.last,
        gender: s.gender as any,
        dob: new Date('2011-05-15'),
        religion: 'HINDU',
        category: 'General',
        city: 'Noida',
        district: 'Gautam Buddha Nagar',
        state: 'Uttar Pradesh',
        userId: studentUser.id,
        campusId: campus.id,
        classId: classes['10'],
        sectionId: sections['10-A'],
        parentId: parent.id,
      },
    });
    studentIds.push(student.id);

    // Attendance for today
    await prisma.attendance.create({
      data: {
        studentId: student.id,
        sectionId: sections['10-A'],
        date: new Date(new Date().toISOString().split('T')[0]),
        status: i === 2 ? 'ABSENT' : i === 4 ? 'LATE' : 'PRESENT',
        markedById: 'system',
      },
    });
  }

  // 9. Fee Structures & Payments
  const fee1 = await prisma.feeStructure.create({
    data: {
      name: 'Quarterly Tuition Fee',
      feeType: 'TUITION',
      amount: 14500,
      frequency: 'QUARTERLY',
      academicYear: '2026-27',
      classId: classes['10'],
      campusId: campus.id,
    },
  });

  const fee2 = await prisma.feeStructure.create({
    data: {
      name: 'Annual Examination Fee',
      feeType: 'EXAM',
      amount: 2500,
      frequency: 'YEARLY',
      academicYear: '2026-27',
      classId: classes['10'],
      campusId: campus.id,
    },
  });

  // Seed sample payments
  await prisma.feePayment.create({
    data: {
      receiptNo: 'REC-2026-001',
      studentId: studentIds[0],
      feeStructureId: fee1.id,
      amount: 14500,
      discount: 0,
      lateFine: 0,
      totalAmount: 14500,
      paidAmount: 14500,
      balanceAmount: 0,
      paymentMode: 'UPI',
      paymentStatus: 'PAID',
      academicYear: '2026-27',
      transactionId: 'UPI-TXN-981249',
      paymentDate: new Date(),
    },
  });

  // 10. Expenses & Incomes
  await prisma.expense.createMany({
    data: [
      {
        title: 'Monthly Electric Sub-Station Bill',
        category: 'Utilities',
        amount: 32450,
        date: new Date('2026-09-20'),
        paidTo: 'State Electricity Board',
        paymentMode: 'BANK_TRANSFER',
        voucherNo: 'VCH-9801',
        campusId: campus.id,
        approvedBy: 'Admin Principal',
        description: 'Main academic block electricity line bill',
      },
      {
        title: 'High-speed Fiber Lease Line (Quarterly)',
        category: 'Utilities',
        amount: 14999,
        date: new Date('2026-09-19'),
        paidTo: 'Airtel Broadband Ltd',
        paymentMode: 'BANK_TRANSFER',
        voucherNo: 'VCH-9802',
        campusId: campus.id,
        approvedBy: 'Admin Principal',
        description: '500Mbps symmetrical broadband',
      },
      {
        title: 'Annual Science Fair Robotics Kits',
        category: 'Laboratory',
        amount: 28500,
        date: new Date('2026-09-18'),
        paidTo: 'RoboTech Labs Delhi',
        paymentMode: 'CHEQUE',
        voucherNo: 'VCH-9803',
        campusId: campus.id,
        approvedBy: 'Admin Principal',
        description: 'Arduino kits, sensors and breadboards',
      },
      {
        title: 'Campus Water Filter RO Maintenance',
        category: 'Maintenance',
        amount: 6800,
        date: new Date('2026-09-17'),
        paidTo: 'Kent Commercial Service',
        paymentMode: 'UPI',
        voucherNo: 'VCH-9804',
        campusId: campus.id,
        description: 'Candle replacement and water testing',
      },
    ],
  });

  await prisma.income.createMany({
    data: [
      {
        title: 'Q2 Tuition Fees Batch Direct Deposit',
        category: 'Tuition Fees',
        amount: 385000,
        date: new Date('2026-09-10'),
        paymentMode: 'BANK_TRANSFER',
        receiptNo: 'INC-2026-041',
        campusId: campus.id,
        description: 'Online fee gateway net settlement from Parents Bank Portal',
      },
      {
        title: 'Campus Cafeteria Monthly Lease Royalty',
        category: 'Cafeteria',
        amount: 25000,
        date: new Date('2026-09-05'),
        paymentMode: 'UPI',
        receiptNo: 'INC-2026-042',
        campusId: campus.id,
        description: 'Monthly royalty deposit from Campus Canteen Vendor',
      },
    ],
  });

  // 11. Exams & Results
  const exam = await prisma.exam.create({
    data: {
      name: 'Half Yearly Examination 2026',
      examType: 'HALF_YEARLY',
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-22'),
      academicYear: '2026-27',
      classId: classes['10'],
    },
  });

  // Exam marks for student 0
  await prisma.examResult.createMany({
    data: [
      {
        examId: exam.id,
        studentId: studentIds[0],
        subjectId: subjects['MAT'],
        theoryMarks: 72,
        practicalMarks: 18,
        marksObtained: 90,
        grade: 'A1',
      },
      {
        examId: exam.id,
        studentId: studentIds[0],
        subjectId: subjects['SCI'],
        theoryMarks: 68,
        practicalMarks: 19,
        marksObtained: 87,
        grade: 'A2',
      },
    ],
  });

  // 12. Transport Routes & Stops
  const route = await prisma.transportRoute.create({
    data: {
      routeNo: 'Route 01',
      routeName: 'Sector 62 Metro -> Indirapuram -> Main Campus',
      vehicleNo: 'UP-16-AT-9021',
      driverName: 'Ram Singh Yadav',
      driverPhone: '+91 98765 11223',
      capacity: 42,
      campusId: campus.id,
    },
  });

  await prisma.transportStop.createMany({
    data: [
      { name: 'Sec 62 Metro Gate 2', pickupTime: '06:50 AM', dropTime: '02:30 PM', fare: 2400, routeId: route.id, stopOrder: 1 },
      { name: 'Shipra Mall Indirapuram', pickupTime: '07:05 AM', dropTime: '02:15 PM', fare: 2200, routeId: route.id, stopOrder: 2 },
      { name: 'Main Campus Gate 1', pickupTime: '07:35 AM', dropTime: '01:45 PM', fare: 2000, routeId: route.id, stopOrder: 3 },
    ],
  });

  // 13. Notices & Circulars
  await prisma.notice.createMany({
    data: [
      {
        title: 'CBSE Half Yearly Examination Schedule 2026-27',
        content: 'Half Yearly Examination datesheets for Classes 9 to 12 have been published. Admit cards will be distributed on October 05.',
        type: 'EXAM',
        targetRoles: ['STUDENT', 'PARENT', 'TEACHER'],
        campusId: campus.id,
        createdById: 'admin',
      },
      {
        title: 'Parent-Teacher Interaction Meet (PTM)',
        content: 'Annual Parent Teacher Meeting scheduled for this Saturday, September 27, from 09:00 AM to 01:00 PM.',
        type: 'EVENT',
        targetRoles: ['STUDENT', 'PARENT'],
        campusId: campus.id,
        createdById: 'admin',
      },
      {
        title: 'Quarter 2 Fee Clearance Notice',
        content: 'Parents are requested to clear all Q2 tuition dues by September 30 to avoid automatic late fee fines.',
        type: 'FEE',
        targetRoles: ['PARENT'],
        campusId: campus.id,
        createdById: 'admin',
      },
    ],
  });

  // 14. Stock & Inventory Items
  await prisma.inventoryItem.createMany({
    data: [
      {
        name: 'NCERT Mathematics Class 10 Textbook',
        category: 'BOOKS',
        quantity: 180,
        unitPrice: 195,
        location: 'Store Room B-1',
        campusId: campus.id,
      },
      {
        name: 'Navy Blue Winter Blazer (Size 32)',
        category: 'UNIFORM',
        quantity: 14,
        unitPrice: 1450,
        location: 'Uniform Depot A',
        campusId: campus.id,
      },
      {
        name: 'Compound Optical Microscope 1000x',
        category: 'LAB',
        quantity: 24,
        unitPrice: 5800,
        location: 'Biology Lab 2',
        campusId: campus.id,
      },
    ],
  });

  // 15. Biometric Devices
  const bioDev = await prisma.biometricDevice.create({
    data: {
      deviceName: 'Main Gate Terminal 1',
      deviceId: 'BIO-GATE-01',
      location: 'Campus Main Entry Turnstile',
      type: 'FACE',
      isActive: true,
    },
  });

  await prisma.biometricLog.createMany({
    data: [
      {
        deviceId: bioDev.id,
        userId: 'EMP-T101',
        punchTime: new Date(),
        punchType: 'IN',
      },
      {
        deviceId: bioDev.id,
        userId: 'EMP-T102',
        punchTime: new Date(),
        punchType: 'IN',
      },
    ],
  });

  console.log('✅ MySQL Database (vidyalaya-db) successfully seeded!');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 SUPER ADMIN LOGINS:');
  console.log('   Email:    admin@school.com   / Password: Admin@123');
  console.log('   Email:    admin@vidyalaya.com / Password: admin123');
  console.log('📋 TEACHER LOGIN:');
  console.log('   Email:    teacher@school.com / Password: Teacher@123');
  console.log('📋 PARENT LOGIN:');
  console.log('   Email:    parent@school.com  / Password: Parent@123');
  console.log('📋 STUDENT LOGIN:');
  console.log('   Email:    student@school.com / Password: Student@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
