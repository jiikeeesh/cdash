import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, userId, ciphertext, iv } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const messageAge = Date.now() - new Date(message.createdAt).getTime();

    // ── 1. EDIT MESSAGE (Within 1 hour, Sender only) ──
    if (action === 'edit') {
      if (message.senderId !== userId) {
        return NextResponse.json({ error: 'Only the sender can edit this message' }, { status: 403 });
      }

      if (messageAge > ONE_HOUR_MS) {
        return NextResponse.json(
          { error: 'Messages can only be edited within 1 hour of sending' },
          { status: 400 }
        );
      }

      if (!ciphertext || !iv) {
        return NextResponse.json({ error: 'Missing encrypted content' }, { status: 400 });
      }

      const updated = await prisma.message.update({
        where: { id },
        data: {
          ciphertext,
          iv,
          isEdited: true,
          updatedAt: new Date().toISOString(),
        },
      });

      return NextResponse.json({ success: true, message: updated });
    }

    // ── 2. DELETE FOR MYSELF (Anytime, Sender or Receiver) ──
    if (action === 'delete-for-me') {
      const isSender = message.senderId === userId;
      const isReceiver = message.receiverId === userId;

      if (!isSender && !isReceiver) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
      }

      const newDeletedForSender = isSender ? true : message.deletedForSender;
      const newDeletedForReceiver = isReceiver ? true : message.deletedForReceiver;

      // If both participants deleted for themselves, delete the record completely
      if (newDeletedForSender && newDeletedForReceiver) {
        await prisma.message.delete({ where: { id } });
        return NextResponse.json({ success: true, deletedCompletely: true });
      }

      const updated = await prisma.message.update({
        where: { id },
        data: {
          deletedForSender: newDeletedForSender,
          deletedForReceiver: newDeletedForReceiver,
        },
      });

      return NextResponse.json({ success: true, message: updated });
    }

    // ── 3. DELETE FOR EVERYONE (Within 1 day / 24 hours, Sender only) ──
    if (action === 'delete-for-everyone') {
      if (message.senderId !== userId) {
        return NextResponse.json(
          { error: 'Only the sender can delete for everyone' },
          { status: 403 }
        );
      }

      if (messageAge > ONE_DAY_MS) {
        return NextResponse.json(
          { error: 'Messages can only be deleted for everyone within 24 hours (1 day)' },
          { status: 400 }
        );
      }

      await prisma.message.delete({ where: { id } });
      return NextResponse.json({ success: true, deletedForEveryone: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in PATCH /api/messages/[id]:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
