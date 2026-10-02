// GET  /api/requests         → list account requests
// POST /api/requests         → create request
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const requestedById = req.nextUrl.searchParams.get('requestedById');
    const requests = await prisma.accountRequest.findMany({
      where: requestedById ? { requestedById } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { requestedById, fullName, email, department, reason } = data;

    if (!requestedById || !fullName || !email || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const request = await prisma.accountRequest.create({
      data: {
        requestedById,
        requestedRole: 'user',
        fullName,
        email,
        department: department ?? '',
        reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
    return NextResponse.json(request, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
