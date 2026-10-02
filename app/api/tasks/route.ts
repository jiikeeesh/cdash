// GET  /api/tasks          → list tasks (optional ?userId=)
// POST /api/tasks          → create task
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const tasks = await prisma.task.findMany({
      where: userId ? {
        OR: [
          { assignees: { some: { id: userId } } },
          { assignedById: userId }
        ]
      } : undefined,
      include: { assignees: { select: { id: true, fullName: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(
      tasks.map((t) => ({
        ...t,
        notes: JSON.parse(t.notes || '[]'),
        assigneeIds: t.assignees.map(a => a.id),
      }))
    );
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { title, description, assigneeIds, assignedById, priority, status, dueDate } = data;

    if (!title || !assigneeIds || !Array.isArray(assigneeIds) || !assignedById || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? '',
        assignedById,
        priority: priority ?? 'medium',
        status: status ?? 'pending',
        dueDate,
        createdAt: now,
        updatedAt: now,
        notes: '[]',
        assignees: { connect: assigneeIds.map((id: string) => ({ id })) },
      },
      include: { assignees: { select: { id: true } } },
    });
    return NextResponse.json({
      ...task,
      notes: [],
      assigneeIds: task.assignees.map((a) => a.id)
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
