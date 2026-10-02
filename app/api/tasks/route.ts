// GET  /api/tasks          → list tasks (optional ?userId=)
// POST /api/tasks          → create task
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const tasks = await prisma.task.findMany({
      where: userId ? { assignedToId: userId } : undefined,
      orderBy: { updatedAt: 'desc' },
    });
    // Parse notes from JSON string
    return NextResponse.json(
      tasks.map((t) => ({ ...t, notes: JSON.parse(t.notes || '[]') }))
    );
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { title, description, assignedToId, assignedById, priority, status, dueDate } = data;

    if (!title || !assignedToId || !assignedById || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? '',
        assignedToId,
        assignedById,
        priority: priority ?? 'medium',
        status: status ?? 'pending',
        dueDate,
        createdAt: now,
        updatedAt: now,
        notes: '[]',
      },
    });
    return NextResponse.json({ ...task, notes: [] }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
