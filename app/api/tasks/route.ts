// GET  /api/tasks          → list tasks (optional ?userId=)
// POST /api/tasks          → create task
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { cacheGet, cacheSet, cacheInvalidate } from '@/app/lib/cache';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const cacheKey = `tasks:${userId || 'all'}`;
    const cached = cacheGet<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'private, max-age=5, stale-while-revalidate=10',
        },
      });
    }

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

    const result = tasks.map((t) => ({
      ...t,
      notes: JSON.parse(t.notes || '[]'),
      assigneeIds: t.assignees.map(a => a.id),
    }));

    // Cache for 30 seconds (instantly invalidated on create/update/delete)
    cacheSet(cacheKey, result, 30000);

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'private, max-age=15, stale-while-revalidate=30',
      },
    });
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

    // Invalidate tasks cache immediately
    cacheInvalidate('tasks');

    return NextResponse.json({
      ...task,
      notes: [],
      assigneeIds: task.assignees.map((a) => a.id)
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
