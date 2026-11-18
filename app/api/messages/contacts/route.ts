import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const exactUsername = searchParams.get('username')?.trim().toLowerCase();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, username: true, createdBy: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. If an exact username search is performed (e.g. Moderator connecting with another moderator,
    // or User connecting with someone outside their moderator's team):
    if (exactUsername) {
      const targetUser = await prisma.user.findUnique({
        where: { username: exactUsername },
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          department: true,
          status: true,
          publicKey: true,
        },
      });

      if (!targetUser || targetUser.id === currentUser.id) {
        return NextResponse.json({ contacts: [], foundByUsername: null });
      }

      return NextResponse.json({
        contacts: [targetUser],
        foundByUsername: targetUser,
      });
    }

    // 2. Fetch existing conversation partners (users who have sent or received messages with current user)
    const existingMessages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      select: {
        senderId: true,
        receiverId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const partnerIdSet = new Set<string>();
    for (const msg of existingMessages) {
      const partnerId: string = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (partnerId !== userId) partnerIdSet.add(partnerId);
    }

    // Fetch all users to filter according to role rules
    const allUsers = await prisma.user.findMany({
      where: { id: { not: userId } },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        department: true,
        createdBy: true,
        status: true,
        publicKey: true,
      },
      orderBy: { fullName: 'asc' },
    });

    let allowedContacts: any[] = [];

    if (currentUser.role === 'admin') {
      // 👑 ADMIN:
      // Can see ALL users across the whole company and freely message anyone
      allowedContacts = allUsers;
    } else if (currentUser.role === 'moderator') {
      // ⚡ MODERATOR:
      // - Freely see all users assigned to them (role === 'user' && createdBy includes moderator.id)
      // - Any user or moderator they ALREADY have an ongoing chat with
      // - (Other moderators require exact username search)
      allowedContacts = allUsers.filter((u) => {
        const isAssignedUser = u.role === 'user' && u.createdBy?.includes(currentUser.id);
        const hasExistingChat = partnerIdSet.has(u.id);
        return isAssignedUser || hasExistingChat;
      });
    } else {
      // 👤 REGULAR USER:
      // - Can freely message their assigned moderator(s) (u.role === 'moderator' && createdBy includes u.id)
      // - Can freely message team peers (users who share the same assigned moderator)
      // - Any user they ALREADY have an ongoing chat with
      // - (Users outside their moderator require exact username search)
      const myModeratorIds = (currentUser.createdBy || '').split(',').filter(Boolean);

      allowedContacts = allUsers.filter((u) => {
        // Is assigned moderator:
        const isMyModerator = u.role === 'moderator' && myModeratorIds.includes(u.id);
        // Is team peer under same moderator:
        const peerModeratorIds = (u.createdBy || '').split(',').filter(Boolean);
        const sharesModerator =
          u.role === 'user' &&
          myModeratorIds.some((mId) => peerModeratorIds.includes(mId));
        // Has ongoing conversation:
        const hasExistingChat = partnerIdSet.has(u.id);

        return isMyModerator || sharesModerator || hasExistingChat;
      });
    }

    // Attach latest message info / unread count for each contact
    const enrichedContacts = await Promise.all(
      allowedContacts.map(async (c) => {
        const lastMsg = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: c.id },
              { senderId: c.id, receiverId: userId },
            ],
          },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            createdAt: true,
            senderId: true,
            read: true,
          },
        });

        const unreadCount = await prisma.message.count({
          where: {
            senderId: c.id,
            receiverId: userId,
            read: false,
          },
        });

        return {
          ...c,
          lastMessageAt: lastMsg?.createdAt || null,
          unreadCount,
        };
      })
    );

    // Sort: contacts with active messages first by recency, then alphabetically
    enrichedContacts.sort((a, b) => {
      if (a.lastMessageAt && b.lastMessageAt) {
        return b.lastMessageAt.localeCompare(a.lastMessageAt);
      }
      if (a.lastMessageAt) return -1;
      if (b.lastMessageAt) return 1;
      return a.fullName.localeCompare(b.fullName);
    });

    return NextResponse.json({ contacts: enrichedContacts });
  } catch (error) {
    console.error('Error in /api/messages/contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
