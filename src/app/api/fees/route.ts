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

    const totalAmount = (Number(body.amount) || 0) - (Number(body.discount) || 0) + (Number(body.lateFine) || 0);
    const paidAmount = Number(body.paidAmount) || totalAmount;
    const balanceAmount = totalAmount - paidAmount;

    // Resolve valid studentId
    let studentId = body.studentId;
    const studentExists = studentId ? await prisma.student.findUnique({ where: { id: studentId } }) : null;
    if (!studentExists) {
      const defaultStudent = await prisma.student.findFirst();
      if (defaultStudent) studentId = defaultStudent.id;
    }

    // Resolve feeStructureId
    let feeStructureId = body.feeStructureId;
    const feeStructExists = feeStructureId ? await prisma.feeStructure.findUnique({ where: { id: feeStructureId } }) : null;
    if (!feeStructExists) {
      const defaultFee = await prisma.feeStructure.findFirst();
      if (defaultFee) feeStructureId = defaultFee.id;
    }

    // Resolve campusId
    let campusId = body.campusId;
    const campusExists = campusId ? await prisma.campus.findUnique({ where: { id: campusId } }) : null;
    if (!campusExists) {
      const defaultCampus = await prisma.campus.findFirst({ where: { isActive: true } });
      if (defaultCampus) campusId = defaultCampus.id;
    }

    const payment = await prisma.feePayment.create({
      data: {
        receiptNo,
        amount: Number(body.amount) || totalAmount,
        discount: Number(body.discount) || 0,
        lateFine: Number(body.lateFine) || 0,
        totalAmount,
        paidAmount,
        balanceAmount: Math.max(0, balanceAmount),
        paymentMode: body.paymentMode || 'CASH',
        paymentStatus: balanceAmount <= 0 ? 'PAID' : 'PARTIAL',
        paymentDate: new Date(),
        transactionId: body.transactionId || null,
        chequeNo: body.chequeNo || null,
        bankName: body.bankName || null,
        remarks: body.remarks || null,
        month: body.month || null,
        academicYear,
        studentId: studentId!,
        feeStructureId: feeStructureId!,
        collectedById: body.collectedById || null,
      },
    });

    // Also record as income
    if (campusId) {
      await prisma.income.create({
        data: {
          title: `Fee Payment - ${receiptNo}`,
          category: 'Fee Collection',
          amount: paidAmount,
          date: new Date(),
          receiptNo,
          paymentMode: body.paymentMode || 'CASH',
          campusId: campusId,
        },
      });
    }

    return NextResponse.json({ success: true, data: payment, message: `Payment recorded. Receipt: ${receiptNo}` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
