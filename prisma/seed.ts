// prisma/seed.ts — run once to populate the admin account
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Upsert the default admin — won't duplicate on re-runs
  await prisma.user.upsert({
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
  });

  console.log('✅ Admin account seeded: jiikeeesh');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
