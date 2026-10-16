import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { touchPresence, removePresence, isUserOnline, getLastActive } from '@/app/lib/presence';
import { cacheGet, cacheSet } from '@/app/lib/cache';

// POST /api/presence -> Heartbeat ping / logout notification
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, action } = data;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (action === 'logout') {
      removePresence(userId);
    } else {
      touchPresence(userId);
    }

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to record presence' }, { status: 500 });
  }
}

// GET /api/presence?userId=...&role=... -> List online users according to permissions
// Admin: sees ALL users who are online.
// Moderator: sees ONLY the users assigned to/created by them who are online.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    // Touch the requesting user so they're marked online as well
    touchPresence(userId);

    // Fast-path cached directory to eliminate DB roundtrip latency on heartbeats
    const cacheKey = 'presence:users_dir';
    let allUsers = cacheGet<any[]>(cacheKey);

    if (!allUsers) {
      allUsers = await prisma.user.findMany({
        select: {
          id: true,
          fullName: true,
          username: true,
          role: true,
          department: true,
          createdBy: true,
        },
      });
      // Cache for 20 seconds
      cacheSet(cacheKey, allUsers, 20000);
    }

    // Filter users by role permissions:
    // Admin: sees all users
    // Moderator: sees only their assigned users (created by them or self)
    // User: sees only self or relevant peers
    let accessibleUsers = allUsers;
    if (role === 'moderator') {
      accessibleUsers = allUsers.filter(
        (u) => u.id === userId || (u.role === 'user' && u.createdBy?.includes(userId))
      );
    } else if (role === 'user') {
      accessibleUsers = allUsers.filter((u) => u.id === userId);
    }

    const presenceList = accessibleUsers.map((u) => {
      const online = isUserOnline(u.id);
      const lastActive = getLastActive(u.id);
      return {
        id: u.id,
        fullName: u.fullName,
        username: u.username,
        role: u.role,
        department: u.department,
        isOnline: online,
        lastActive,
      };
    });

    // Separate online and offline for easy display
    const onlineUsers = presenceList.filter((u) => u.isOnline);
    const offlineUsers = presenceList.filter((u) => !u.isOnline);

    return NextResponse.json({
      onlineUsers,
      offlineUsers,
      totalAccessible: accessibleUsers.length,
      totalOnline: onlineUsers.length,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch presence' }, { status: 500 });
  }
}
