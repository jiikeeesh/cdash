const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

const query = (sql) => new Promise((resolve, reject) => {
  db.all(sql, [], (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

async function main() {
  try {
    console.log('Connecting to SQLite...');
    const users = await query('SELECT * FROM User');
    const tasks = await query('SELECT * FROM Task');
    const reqs = await query('SELECT * FROM AccountRequest');
    const _TaskToUser = await query('SELECT * FROM _TaskAssignees'); // implicit many-to-many table

    console.log(`Found ${users.length} users, ${tasks.length} tasks, ${reqs.length} requests in SQLite.`);

    // Upsert Users
    for (const u of users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {},
        create: {
          id: u.id, username: u.username, password: u.password, role: u.role, fullName: u.fullName,
          email: u.email, phone: u.phone, address: u.address, department: u.department,
          isFirstLogin: u.isFirstLogin === 1, createdAt: u.createdAt, createdBy: u.createdBy
        }
      });
    }

    // Upsert Tasks
    for (const t of tasks) {
      // Find assignees from the join table
      const assignees = _TaskToUser.filter(rel => rel.A === t.id).map(rel => ({ id: rel.B }));
      
      await prisma.task.upsert({
        where: { id: t.id },
        update: {},
        create: {
          id: t.id, title: t.title, description: t.description, assignedById: t.assignedById,
          status: t.status, priority: t.priority, dueDate: t.dueDate, createdAt: t.createdAt,
          updatedAt: t.updatedAt, notes: t.notes,
          assignees: { connect: assignees }
        }
      });
    }

    // Upsert Account Requests
    for (const r of reqs) {
      await prisma.accountRequest.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id, requestedById: r.requestedById, requestedRole: r.requestedRole,
          fullName: r.fullName, email: r.email, department: r.department, reason: r.reason,
          status: r.status, createdAt: r.createdAt, resolvedAt: r.resolvedAt, resolvedById: r.resolvedById
        }
      });
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    db.close();
    await prisma.$disconnect();
  }
}

main();
