import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export const VALID_USER_STATUSES = ['active', 'away', 'busy', 'dnd', 'ooo'] as const;
export type UserStatusType = (typeof VALID_USER_STATUSES)[number];

export const USER_STATUS_CONFIG: Record<
  UserStatusType,
  { label: string; description: string; color: string; dotClass: string }
> = {
  active: {
    label: 'Live / Active',
    description: 'Online and working',
    color: '#10b981',
    dotClass: 'status-dot-active',
  },
  away: {
    label: 'Away',
    description: 'Stepped away temporarily',
    color: '#f59e0b',
    dotClass: 'status-dot-away',
  },
  busy: {
    label: 'Busy',
    description: 'In focused work / meeting',
    color: '#ef4444',
    dotClass: 'status-dot-busy',
  },
  dnd: {
    label: 'Do Not Disturb',
    description: 'Mute alerts & notifications',
    color: '#e11d48',
    dotClass: 'status-dot-dnd',
  },
  ooo: {
    label: 'Out of Office',
    description: 'Vacation, sick leave, travel',
    color: '#8b5cf6',
    dotClass: 'status-dot-ooo',
  },
};

// PATCH /api/users/status -> update user status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json({ error: 'Missing userId or status' }, { status: 400 });
    }

    if (!VALID_USER_STATUSES.includes(status as UserStatusType)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, username: true, status: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

// GET /api/users/status?userId=... -> get user status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ status: user.status || 'active' });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
