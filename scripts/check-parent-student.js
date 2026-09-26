const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const parents = await p.parent.findMany({
    include: {
      user: { select: { email: true, role: true } },
      students: {
        include: {
          class: true,
          section: true,
          attendances: { take: 5 },
          feePayments: { take: 5 },
          examResults: { take: 5 },
          homeworks: { take: 5 },
        }
      }
    }
  });

  console.log(`Found ${parents.length} parents:`);
  parents.forEach(parent => {
    console.log(`- Parent: ${parent.fatherName || parent.motherName} (${parent.user.email}) -> Students: ${parent.students.map(s => `${s.firstName} ${s.lastName} (Class ${s.class.name}-${s.section.name})`).join(', ')}`);
  });

  const students = await p.student.findMany({
    include: {
      user: { select: { email: true, role: true } },
      class: true,
      section: true,
      parent: true
    }
  });
  console.log(`\nFound ${students.length} students:`);
  const teachers = await p.teacher.findMany({ include: { user: true, classTeacher: true } });
  console.log(`\nFound ${teachers.length} teachers:`);
  teachers.forEach(t => console.log(`- Teacher: ${t.firstName} ${t.lastName} (${t.user.email}) ClassTeacher: ${t.classTeacher ? 'Yes' : 'No'}`));
}

main().catch(console.error).finally(() => p.$disconnect());
