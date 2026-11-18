// PATCH  /api/tasks/[id]  → update task
// DELETE /api/tasks/[id]  → delete task
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { cacheInvalidate } from '@/app/lib/cache';
import { setUserStatus, isUserOnline, removePresence, UserPresenceStatus } from '@/app/lib/presence';
import { getActiveTaskBusynessForUser } from '@/app/lib/task-status';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { title, description, assigneeIds, priority, status, busyness, dueDate, notes, userId } = data;

    // Check existing task for permission checks
    const existing = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedBy: { select: { id: true, role: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // If task was 'requested' and status is being updated (approved/declined):
    // Regular users cannot approve their own requests
    if (existing.status === 'requested' && status && status !== 'requested') {
      if (userId) {
        const requestingUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true },
        });
        if (requestingUser && requestingUser.role === 'user') {
          return NextResponse.json({ error: 'Regular users cannot approve task requests' }, { status: 403 });
        }
      }
    }

    // Moderator boundary check: if a moderator is updating assignees, they can only assign themselves or their own users
    if (assigneeIds !== undefined && Array.isArray(assigneeIds) && userId) {
      const modifier = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      });
      if (modifier && modifier.role === 'moderator') {
        const assignedUsers = await prisma.user.findMany({
          where: { id: { in: assigneeIds } },
          select: { id: true, role: true, createdBy: true },
        });
        const invalid = assignedUsers.filter(
          (u) => u.id !== modifier.id && (!u.createdBy || !u.createdBy.includes(modifier.id))
        );
        if (invalid.length > 0) {
          return NextResponse.json(
            { error: 'Moderators can only assign tasks to their own users or themselves' },
            { status: 403 }
          );
        }
      }
    }

    const updateData: any = { updatedAt: new Date().toISOString() };
    if (title !== undefined)        updateData.title        = title;
    if (description !== undefined)  updateData.description  = description;
    if (priority !== undefined)     updateData.priority     = priority;
    if (status !== undefined)       updateData.status       = status;
    if (busyness !== undefined)     updateData.busyness     = busyness;
    if (dueDate !== undefined)      updateData.dueDate      = dueDate;
    if (notes !== undefined)        updateData.notes        = JSON.stringify(notes);
    if (assigneeIds !== undefined && Array.isArray(assigneeIds)) {
      updateData.assignees = { set: assigneeIds.map((aid: string) => ({ id: aid })) };
    }

    const task = await prisma.task.update({ 
      where: { id }, 
      data: updateData,
      include: {
        assignees: { select: { id: true, fullName: true, username: true, role: true } },
        assignedBy: { select: { id: true, fullName: true, username: true, role: true } },
      }
    });

    // Invalidate tasks cache
    cacheInvalidate('tasks');

    // Update status for all users selected in this task to match busyness
    const targetAssignees = task.assignees.map(a => a.id);
    if (busyness && targetAssignees.length > 0) {
      try {
        await prisma.user.updateMany({
          where: { id: { in: targetAssignees } },
          data: { status: busyness },
        });
        for (const aid of targetAssignees) {
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
      assigneeIds: task.assignees.map(a => a.id),
      assignedByName: task.assignedBy?.fullName || '—',
      assignedByRole: task.assignedBy?.role || 'user',
    });
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch task and its assignees before deletion
    const existing = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        assignees: { select: { id: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // 2. Delete the task
    await prisma.task.delete({ where: { id } });

    // 3. For all assignees of this deleted task, recalculate their presence status immediately:
    // If online: revert to 'active' (unless another active task is scheduled right now)
    // If offline: ensure marked 'offline'
    if (existing.assignees && existing.assignees.length > 0) {
      for (const a of existing.assignees) {
        const isOnline = isUserOnline(a.id);
        const otherTaskBusyness = await getActiveTaskBusynessForUser(a.id);

        let newStatus: UserPresenceStatus;
        if (!isOnline) {
          newStatus = 'offline';
        } else if (otherTaskBusyness) {
          newStatus = otherTaskBusyness as UserPresenceStatus;
        } else {
          newStatus = 'active';
        }

        try {
          await prisma.user.update({
            where: { id: a.id },
            data: { status: newStatus },
          });
        } catch {}

        if (isOnline) {
          setUserStatus(a.id, newStatus);
        } else {
          removePresence(a.id);
        }
      }
    }

    // Invalidate tasks, presence, and users caches immediately
    cacheInvalidate('tasks');
    cacheInvalidate('presence');
    cacheInvalidate('users');

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
