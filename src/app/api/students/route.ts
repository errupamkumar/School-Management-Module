import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateAdmissionNo } from '@/utils/helpers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const sectionId = searchParams.get('sectionId');
    const campusId = searchParams.get('campusId');
    const session = searchParams.get('session');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const where: any = { isActive: true };
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (campusId && campusId !== 'ALL') where.campusId = campusId;
    if (session && session !== 'ALL') where.session = session;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { admissionNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          class: true,
          section: true,
          parent: true,
          user: { select: { email: true, phone: true } },
          classEnrollments: {
            include: { class: true },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { admissionNo: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: students,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

const BLOOD_GROUP_MAP: Record<string, any> = {
  'A+': 'A_POSITIVE',
  'A-': 'A_NEGATIVE',
  'B+': 'B_POSITIVE',
  'B-': 'B_NEGATIVE',
  'AB+': 'AB_POSITIVE',
  'AB-': 'AB_NEGATIVE',
  'O+': 'O_POSITIVE',
  'O-': 'O_NEGATIVE',
  'A_POSITIVE': 'A_POSITIVE',
  'A_NEGATIVE': 'A_NEGATIVE',
  'B_POSITIVE': 'B_POSITIVE',
  'B_NEGATIVE': 'B_NEGATIVE',
  'AB_POSITIVE': 'AB_POSITIVE',
  'AB_NEGATIVE': 'AB_NEGATIVE',
  'O_POSITIVE': 'O_POSITIVE',
  'O_NEGATIVE': 'O_NEGATIVE',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const admissionNo = generateAdmissionNo();
    const defaultPassword = await bcrypt.hash('student123', 10);

    // Resolve campusId: if missing or invalid, resolve to first active campus
    let campusId = body.campusId;
    const campusExists = campusId ? await prisma.campus.findUnique({ where: { id: campusId } }) : null;
    if (!campusExists) {
      const defaultCampus = await prisma.campus.findFirst({ where: { isActive: true } });
      if (defaultCampus) campusId = defaultCampus.id;
    }

    // Resolve classId: if passed by name (e.g. "10"), resolve to Class ID
    let classId = body.classId;
    const classExists = classId ? await prisma.class.findUnique({ where: { id: classId } }) : null;
    if (!classExists && campusId) {
      const foundClass = await prisma.class.findFirst({
        where: { OR: [{ id: classId }, { name: classId }], campusId },
      });
      if (foundClass) classId = foundClass.id;
    }

    // Resolve sectionId: if passed by name (e.g. "A"), resolve to Section ID
    let sectionId = body.sectionId;
    const sectionExists = sectionId ? await prisma.section.findUnique({ where: { id: sectionId } }) : null;
    if (!sectionExists && classId) {
      const foundSection = await prisma.section.findFirst({
        where: { OR: [{ id: sectionId }, { name: sectionId }], classId },
      });
      if (foundSection) sectionId = foundSection.id;
    }

    const bloodGroup = body.bloodGroup ? BLOOD_GROUP_MAP[body.bloodGroup] || null : null;

    // Create user first
    const email = body.fatherEmail || `${admissionNo.toLowerCase()}@student.vidyalaya.com`;

    const result = await prisma.$transaction(async (tx) => {
      // Create parent user & parent record
      let parentId: string | undefined;
      if (body.fatherName) {
        const parentUser = await tx.user.create({
          data: {
            email: `parent.${admissionNo.toLowerCase()}@vidyalaya.com`,
            phone: body.fatherPhone || null,
            password: await bcrypt.hash('parent123', 10),
            role: 'PARENT',
            campusId: campusId || null,
          },
        });
        const parent = await tx.parent.create({
          data: {
            userId: parentUser.id,
            fatherName: body.fatherName,
            fatherPhone: body.fatherPhone,
            fatherEmail: body.fatherEmail,
            fatherIdCard: body.fatherIdCard,
            fatherOccupation: body.fatherOccupation,
            motherName: body.motherName,
            motherPhone: body.motherPhone,
            motherOccupation: body.motherOccupation,
            religion: body.religion || null,
            annualIncome: body.annualIncome ? parseFloat(body.annualIncome) : null,
          },
        });
        parentId = parent.id;
      }

      // Create student user
      const studentUser = await tx.user.create({
        data: {
          email,
          password: defaultPassword,
          role: 'STUDENT',
          campusId: campusId || null,
        },
      });

      // Create student
      const student = await tx.student.create({
        data: {
          admissionNo,
          firstName: body.firstName,
          lastName: body.lastName,
          gender: body.gender,
          dob: new Date(body.dob),
          bloodGroup,
          religion: body.religion || null,
          caste: body.caste || null,
          category: body.category || null,
          nationality: body.nationality || 'Indian',
          aadhaarNo: body.aadhaarNo || null,
          streetAddress: body.streetAddress || null,
          village: body.village || null,
          post: body.post || null,
          policeStation: body.policeStation || null,
          city: body.city || null,
          district: body.district || null,
          state: body.state || 'Uttar Pradesh',
          pincode: body.pincode || null,
          previousSchool: body.previousSchool || null,
          tcNumber: body.tcNumber || null,
          admissionDate: body.admissionDate ? new Date(body.admissionDate) : new Date(),
          session: body.session || '2025-26',
          userId: studentUser.id,
          campusId: campusId!,
          classId: classId!,
          sectionId: sectionId!,
          parentId: parentId || null,
        },
      });

      return student;
    });

    return NextResponse.json({ success: true, data: result, message: 'Student admitted successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Admission error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
