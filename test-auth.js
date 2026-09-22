const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function test() {
  console.log('--- Testing DB connection ---');
  
  const userCount = await prisma.user.count();
  console.log('Total users:', userCount);
  
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@vidyalaya.com' },
  });
  
  if (!admin) {
    console.log('ERROR: Admin user NOT FOUND in database!');
  } else {
    console.log('Admin user found:', {
      id: admin.id,
    });
  }
  const parent = await prisma.user.findUnique({ where: { email: 'parent@school.com' } });
  if (parent) {
    console.log('Parent password matches "Parent@123":', await bcrypt.compare('Parent@123', parent.password));
    console.log('Parent password matches "parent123":', await bcrypt.compare('parent123', parent.password));
  }
  const student = await prisma.user.findUnique({ where: { email: 'student@school.com' } });
  if (student) {
    console.log('Student password matches "Student@123":', await bcrypt.compare('Student@123', student.password));
    console.log('Student password matches "student123":', await bcrypt.compare('student123', student.password));
  }

  console.log('\nAll users:');
  allUsers.forEach(u => console.log(`  ${u.email} | ${u.role} | active=${u.isActive}`));
  
  await prisma.$disconnect();
}

test().catch(e => { console.error(e); process.exit(1); });
