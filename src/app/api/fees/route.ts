import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateReceiptNo, getAcademicYear } from '@/utils/helpers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (status) where.paymentStatus = status;

    const [payments, total] = await Promise.all([
      prisma.feePayment.findMany({
        where,
        include: {
          student: { include: { class: true, section: true } },
          feeStructure: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.feePayment.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: payments, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const receiptNo = generateReceiptNo();
    const academicYear = getAcademicYear();

    const totalAmount = body.amount - (body.discount || 0) + (body.lateFine || 0);
    const balanceAmount = totalAmount - body.paidAmount;

    const payment = await prisma.feePayment.create({
      data: {
        receiptNo,
        amount: body.amount,
        discount: body.discount || 0,
        lateFine: body.lateFine || 0,
        totalAmount,
        paidAmount: body.paidAmount,
        balanceAmount: Math.max(0, balanceAmount),
        paymentMode: body.paymentMode,
        paymentStatus: balanceAmount <= 0 ? 'PAID' : 'PARTIAL',
        paymentDate: new Date(),
        transactionId: body.transactionId || null,
        chequeNo: body.chequeNo || null,
        bankName: body.bankName || null,
        remarks: body.remarks || null,
        month: body.month || null,
        academicYear,
        studentId: body.studentId,
        feeStructureId: body.feeStructureId,
        collectedById: body.collectedById || null,
      },
    });

    // Also record as income
    await prisma.income.create({
      data: {
        title: `Fee Payment - ${receiptNo}`,
        category: 'Fee Collection',
        amount: body.paidAmount,
        date: new Date(),
        receiptNo,
        paymentMode: body.paymentMode,
        campusId: body.campusId,
      },
    });

    return NextResponse.json({ success: true, data: payment, message: `Payment recorded. Receipt: ${receiptNo}` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
