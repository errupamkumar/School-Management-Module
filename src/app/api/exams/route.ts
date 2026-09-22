import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const academicYear = searchParams.get('academicYear');

    const where: any = {};
    if (classId) where.classId = classId;
    if (academicYear) where.academicYear = academicYear;

    const exams = await prisma.exam.findMany({
      where,
      include: { class: true, subjects: { include: { subject: true } }, _count: { select: { results: true } } },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json({ success: true, data: exams });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const exam = await prisma.exam.create({
      data: {
        name: body.name,
        examType: body.examType,
        academicYear: body.academicYear,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        classId: body.classId,
        description: body.description || null,
        subjects: {
          create: body.subjects.map((s: any) => ({
            subjectId: s.subjectId,
            examDate: new Date(s.examDate),
            startTime: s.startTime || null,
            endTime: s.endTime || null,
            maxMarks: s.maxMarks,
            passingMarks: s.passingMarks,
            room: s.room || null,
          })),
        },
      },
      include: { subjects: { include: { subject: true } } },
    });

    return NextResponse.json({ success: true, data: exam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
