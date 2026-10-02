const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.user.upsert({
  where: { username: 'jiikeeesh' },
  update: {},
  create: {
    id: 'usr_admin_jiikeeesh',
    username: 'jiikeeesh',
    password: 'J!kesh9803',
    role: 'admin',
    fullName: 'System Administrator',
    email: 'admin@company.com',
    department: 'IT',
    isFirstLogin: false,
    createdAt: new Date('2025-01-01').toISOString(),
    createdBy: 'system',
  },
}).then(() => {
  console.log('✅ Admin account seeded successfully!');
  return p.$disconnect();
}).catch((e) => {
  console.error('Seed failed:', e.message);
  return p.$disconnect();
});
