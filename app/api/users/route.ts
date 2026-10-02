// GET  /api/users          → list all users
// POST /api/users          → create user
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true, username: true, role: true, fullName: true,
        email: true, phone: true, address: true, department: true, isFirstLogin: true,
        createdAt: true, createdBy: true,
      },
    });
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { username, password, fullName, email, phone, address, department, role, createdBy } = data;

    if (!username || !password || !fullName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Uniqueness check
    const trimmedUsername = username.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { username: trimmedUsername } });
    if (existing) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        username: trimmedUsername,
        password,
        fullName,
        email,
        phone: phone ?? '',
        address: address ?? '',
        department: department ?? '',
        role: role ?? 'user',
        isFirstLogin: true,
        createdAt: new Date().toISOString(),
        createdBy: createdBy ?? 'system',
      },
      select: {
        id: true, username: true, role: true, fullName: true,
        email: true, phone: true, address: true, department: true, isFirstLogin: true,
        createdAt: true, createdBy: true,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
