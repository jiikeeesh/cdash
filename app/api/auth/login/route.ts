// POST /api/auth/login
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { touchPresence, setUserStatus, UserPresenceStatus } from '@/app/lib/presence';
import { cacheInvalidate } from '@/app/lib/cache';
import { getActiveTaskBusynessForUser } from '@/app/lib/task-status';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Username not found' }, { status: 401 });
    }
    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Check if user currently has an assigned task/event scheduled for right now
    const activeBusyness = await getActiveTaskBusynessForUser(user.id);
    const initialStatus: UserPresenceStatus = (activeBusyness as UserPresenceStatus) || 'active';

    // Update status in database to active (or task busyness) upon login
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { status: initialStatus },
    });

    // Register user in presence memory immediately
    setUserStatus(user.id, initialStatus);
    touchPresence(user.id, initialStatus);

    cacheInvalidate('presence');
    cacheInvalidate('users');

    // Return user (exclude password) with active status
    const { password: _pw, ...safeUser } = updatedUser;
    return NextResponse.json({ user: safeUser });
  } catch (e: any) {
    console.error('Login route error:', e);
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
