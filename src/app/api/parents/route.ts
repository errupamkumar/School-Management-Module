import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all parents with their enrolled children
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const where: any = {};
    if (search) {
      where.OR = [
        { fatherName: { contains: search, mode: 'insensitive' } },
        { fatherPhone: { contains: search, mode: 'insensitive' } },
        { motherName: { contains: search, mode: 'insensitive' } },
        { students: { some: { firstName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const parents = await prisma.parent.findMany({
      where,
      include: {
        user: { select: { email: true, phone: true, isActive: true } },
        students: {
          select: {
            id: true,
            admissionNo: true,
            firstName: true,
            lastName: true,
            class: { select: { name: true } },
            section: { select: { name: true } },
          },
        },
      },
      orderBy: { fatherName: 'asc' },
    });

    return NextResponse.json({ success: true, data: parents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
