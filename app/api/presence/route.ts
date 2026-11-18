import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { touchPresence, removePresence, isUserOnline, getLastActive, setUserStatus, getUserStatus, UserPresenceStatus } from '@/app/lib/presence';
import { cacheGet, cacheSet, cacheInvalidate } from '@/app/lib/cache';
import { getActiveTaskBusynessForUser } from '@/app/lib/task-status';

// POST /api/presence -> Heartbeat ping / status update / logout notification
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, action, status, manual } = data;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (action === 'logout') {
      removePresence(userId);
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { status: 'offline' },
        });
        cacheInvalidate('presence');
        cacheInvalidate('users');
      } catch (err) {
        console.error('Failed to set user offline on logout:', err);
      }
      return NextResponse.json({ success: true, status: 'offline', timestamp: Date.now() });
    }

    // Determine effective presence status:
    // If user explicitly manually changed status, respect their choice
    let effectiveStatus: UserPresenceStatus;
    if (manual && status) {
      effectiveStatus = status as UserPresenceStatus;
    } else {
      // Check if user currently has an assigned task/event scheduled for right now
      const activeTaskBusyness = await getActiveTaskBusynessForUser(userId);
      if (activeTaskBusyness) {
        effectiveStatus = activeTaskBusyness as UserPresenceStatus;
      } else {
        // Task time crossed or task deleted: user is online, so status is active
        effectiveStatus = 'active';
      }
    }

    setUserStatus(userId, effectiveStatus);
    touchPresence(userId);

    // Persist effective status to user record in DB
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { status: effectiveStatus },
      });
    } catch {}

    return NextResponse.json({ success: true, status: effectiveStatus, timestamp: Date.now() });
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
    const statusParam = searchParams.get('status') as UserPresenceStatus | null;

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    // Touch the requesting user so they're marked online as well
    if (statusParam && statusParam !== 'offline') {
      setUserStatus(userId, statusParam);
    } else {
      touchPresence(userId);
    }

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
      const status = online ? getUserStatus(u.id) : 'offline';
      return {
        id: u.id,
        fullName: u.fullName,
        username: u.username,
        role: u.role,
        department: u.department,
        isOnline: online,
        lastActive,
        status,
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
