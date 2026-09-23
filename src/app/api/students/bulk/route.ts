import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH /api/students/bulk: Bulk update admission date, session, class, section, or active status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentIds, admissionDate, session, classId, sectionId, isActive } = body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'studentIds array is required and must not be empty' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (admissionDate) {
      updateData.admissionDate = new Date(admissionDate);
    }
    if (session) {
      updateData.session = session;
    }
    if (classId) {
      updateData.classId = classId;
    }
    if (sectionId) {
      updateData.sectionId = sectionId;
    }
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one field to update must be provided (admissionDate, session, classId, sectionId, or isActive)' },
        { status: 400 }
      );
    }

    const result = await prisma.student.updateMany({
      where: {
        id: { in: studentIds },
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${result.count} students`,
      count: result.count,
    });
  } catch (error: any) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
