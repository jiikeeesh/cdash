// GET  /api/tasks          → list tasks (optional ?userId=)
// POST /api/tasks          → create task
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { cacheGet, cacheSet, cacheInvalidate } from '@/app/lib/cache';
import { setUserStatus, UserPresenceStatus } from '@/app/lib/presence';

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

    let whereClause: any = undefined;

    if (userId) {
      const requestingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, createdBy: true },
      });

      if (requestingUser) {
        if (requestingUser.role === 'admin') {
          // Admin can see ALL tasks across the system
          whereClause = undefined;
        } else if (requestingUser.role === 'moderator') {
          // Moderator can only see:
          // 1. Tasks they created for their users or themselves, or user task requests submitted to them (assignedById === moderator.id)
          // 2. Tasks that an Admin created specifically for this moderator (assignedBy.role === 'admin' and moderator is in assignees)
          whereClause = {
            OR: [
              { assignedById: userId },
              {
                assignees: { some: { id: userId } },
                assignedBy: { role: 'admin' },
              },
            ],
          };
        } else {
          // Regular user can ONLY see their own tasks
          whereClause = {
            assignees: { some: { id: userId } },
          };
        }
      } else {
        return NextResponse.json([]);
      }
    } else {
      // If no userId is supplied, return empty array to prevent data leakage
      return NextResponse.json([]);
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignees: { select: { id: true, fullName: true, username: true, role: true } },
        assignedBy: { select: { id: true, fullName: true, username: true, role: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const result = tasks.map((t) => ({
      ...t,
      notes: JSON.parse(t.notes || '[]'),
      assigneeIds: t.assignees.map(a => a.id),
      assignedByName: t.assignedBy?.fullName || '—',
      assignedByRole: t.assignedBy?.role || 'user',
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
    let { title, description, assigneeIds, assignedById, priority, status, busyness, dueDate, isRequest } = data;

    if (!title || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields: title and dueDate' }, { status: 400 });
    }

    // Default status: if marked as request or requested by user without assign permission, status is 'requested'
    if (isRequest || status === 'requested') {
      status = 'requested';
    } else if (!status) {
      status = 'pending';
    }

    // Ensure assigneeIds is array
    if (!assigneeIds || !Array.isArray(assigneeIds) || assigneeIds.length === 0) {
      if (assignedById) {
        assigneeIds = [assignedById];
      } else {
        return NextResponse.json({ error: 'Missing assignees' }, { status: 400 });
      }
    }

    // If assignedById is missing (e.g. user creating a request without specifying), fallback to admin or first moderator
    if (!assignedById) {
      const fallbackMod = await prisma.user.findFirst({
        where: { role: { in: ['moderator', 'admin'] } },
        select: { id: true },
      });
      assignedById = fallbackMod?.id || assigneeIds[0];
    }

    // Moderator boundary check:
    // When a moderator creates a task (not a user request), they can only assign to themselves or their own users
    if (!isRequest && status !== 'requested' && assignedById) {
      const creator = await prisma.user.findUnique({
        where: { id: assignedById },
        select: { id: true, role: true },
      });
      if (creator && creator.role === 'moderator') {
        const assignedUsers = await prisma.user.findMany({
          where: { id: { in: assigneeIds } },
          select: { id: true, role: true, createdBy: true },
        });
        const invalid = assignedUsers.filter(
          (u) => u.id !== creator.id && (!u.createdBy || !u.createdBy.includes(creator.id))
        );
        if (invalid.length > 0) {
          return NextResponse.json(
            { error: 'Moderators can only assign tasks to their own users or themselves' },
            { status: 403 }
          );
        }
      }
    }

    const now = new Date().toISOString();
    const initialNotes = status === 'requested' 
      ? JSON.stringify([`[Task Requested on ${new Date().toLocaleDateString()}] ${description || 'New task request submitted for moderator review.'}`])
      : '[]';

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? '',
        assignedById,
        priority: priority ?? 'medium',
        status,
        busyness: busyness ?? 'busy',
        dueDate,
        createdAt: now,
        updatedAt: now,
        notes: initialNotes,
        assignees: { connect: assigneeIds.map((id: string) => ({ id })) },
      },
      include: {
        assignees: { select: { id: true, fullName: true, username: true, role: true } },
        assignedBy: { select: { id: true, fullName: true, username: true, role: true } },
      },
    });

    // Invalidate tasks cache immediately across all users
    cacheInvalidate('tasks');

    // Update status for all users selected in this task to match busyness
    if (busyness && Array.isArray(assigneeIds) && assigneeIds.length > 0) {
      try {
        await prisma.user.updateMany({
          where: { id: { in: assigneeIds } },
          data: { status: busyness },
        });
        for (const aid of assigneeIds) {
          try {
            setUserStatus(aid, busyness as UserPresenceStatus);
          } catch {}
        }
        cacheInvalidate('presence');
        cacheInvalidate('users');
      } catch (statusErr) {
        console.error('Failed to update assignee status:', statusErr);
      }
    }

    return NextResponse.json({
      ...task,
      notes: JSON.parse(task.notes || '[]'),
      assigneeIds: task.assignees.map((a) => a.id),
      assignedByName: task.assignedBy?.fullName || '—',
      assignedByRole: task.assignedBy?.role || 'user',
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
