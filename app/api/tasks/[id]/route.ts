// PATCH  /api/tasks/[id]  → update task
// DELETE /api/tasks/[id]  → delete task
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { title, description, assigneeIds, priority, status, dueDate, notes } = data;

    const updateData: any = { updatedAt: new Date().toISOString() };
    if (title !== undefined)        updateData.title        = title;
    if (description !== undefined)  updateData.description  = description;
    if (priority !== undefined)     updateData.priority     = priority;
    if (status !== undefined)       updateData.status       = status;
    if (dueDate !== undefined)      updateData.dueDate      = dueDate;
    if (notes !== undefined)        updateData.notes        = JSON.stringify(notes);
    if (assigneeIds !== undefined && Array.isArray(assigneeIds)) {
      updateData.assignees = { set: assigneeIds.map((aid: string) => ({ id: aid })) };
    }

    const task = await prisma.task.update({ 
      where: { id }, 
      data: updateData,
      include: { assignees: { select: { id: true, fullName: true } } }
    });
    return NextResponse.json({ 
      ...task, 
      notes: JSON.parse(task.notes || '[]'),
      assigneeIds: task.assignees.map(a => a.id)
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
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
