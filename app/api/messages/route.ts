import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// GET /api/messages?userId=...&peerId=... → get conversation messages
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const peerId = searchParams.get('peerId');

    if (!userId || !peerId) {
      return NextResponse.json({ error: 'Missing userId or peerId' }, { status: 400 });
    }

    // ── 1. AUTO-DELETE 1-MONTH POLICY (30 Days Retention) ──
    // Automatically purge any messages older than 30 days
    const cutoffDate = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
    try {
      await prisma.message.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
        },
      });
    } catch (e) {
      // Non-blocking cleanup
    }

    // ── 2. Fetch messages between userId and peerId ──
    const messages = await prisma.message.findMany({
      where: {
        AND: [
          {
            OR: [
              { senderId: userId, receiverId: peerId },
              { senderId: peerId, receiverId: userId },
            ],
          },
          // Filter out messages deleted for myself:
          {
            OR: [
              { senderId: userId, deletedForSender: false },
              { receiverId: userId, deletedForReceiver: false },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            notes: true,
            assignedBy: { select: { fullName: true, username: true, role: true } },
            assignees: { select: { id: true, fullName: true, username: true, role: true } },
          },
        },
      },
    });

    // Mark unread messages sent by peer as read
    await prisma.message.updateMany({
      where: {
        senderId: peerId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    // Format task reports notes from JSON string to array
    const formatted = messages.map((m) => ({
      ...m,
      task: m.task
        ? {
            ...m.task,
            notes: JSON.parse(m.task.notes || '[]'),
          }
        : null,
    }));

    return NextResponse.json({ messages: formatted });
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST /api/messages → create new E2E encrypted message (with optional linked task)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderId, receiverId, ciphertext, iv, taskId } = body;

    if (!senderId || !receiverId || !ciphertext || !iv) {
      return NextResponse.json({ error: 'Missing message parameters' }, { status: 400 });
    }

    // Validate sender exists
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, role: true, createdBy: true },
    });

    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    // Validate receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, role: true, createdBy: true },
    });

    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    // Verify linked task if provided
    let validTaskId = null;
    if (taskId) {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { id: true },
      });
      if (task) validTaskId = task.id;
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        ciphertext,
        iv,
        taskId: validTaskId,
        createdAt: new Date().toISOString(),
        read: false,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            notes: true,
            assignedBy: { select: { fullName: true, username: true, role: true } },
            assignees: { select: { id: true, fullName: true, username: true, role: true } },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: {
          ...newMessage,
          task: newMessage.task
            ? { ...newMessage.task, notes: JSON.parse(newMessage.task.notes || '[]') }
            : null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/messages:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
