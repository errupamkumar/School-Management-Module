const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const classes = await prisma.class.findMany({ include: { sections: true } });
  let count = 0;
  for (const c of classes) {
    for (const s of c.sections) {
      const studentCount = await prisma.student.count({
        where: { classId: c.id, sectionId: s.id, isActive: true },
      });
      await prisma.classCapacity.upsert({
        where: {
          classId_sectionId_academicYear: {
            classId: c.id,
            sectionId: s.id,
            academicYear: '2025-26',
          },
        },
        create: {
          classId: c.id,
          sectionId: s.id,
          academicYear: '2025-26',
          maxCapacity: s.capacity || 40,
          enrolledCount: studentCount,
        },
        update: {
          enrolledCount: studentCount,
        },
      });
      count++;
    }
  }
  console.log(`Initialized ClassCapacity records: ${count}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
