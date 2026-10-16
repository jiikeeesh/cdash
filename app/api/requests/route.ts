// GET  /api/requests         → list account requests
// POST /api/requests         → create request
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { cacheGet, cacheSet, cacheInvalidate } from '@/app/lib/cache';

export async function GET(req: NextRequest) {
  try {
    const requestedById = req.nextUrl.searchParams.get('requestedById');
    const cacheKey = `requests:${requestedById || 'all'}`;
    const cached = cacheGet<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'private, max-age=5, stale-while-revalidate=10',
        },
      });
    }

    const requests = await prisma.accountRequest.findMany({
      where: requestedById ? { requestedById } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    // Cache for 30 seconds (instantly invalidated on create/resolve/delete)
    cacheSet(cacheKey, requests, 30000);

    return NextResponse.json(requests, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'private, max-age=15, stale-while-revalidate=30',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { requestedById, fullName, email, department, reason, requestedRole } = data;

    if (!requestedById || !fullName || !email || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const request = await prisma.accountRequest.create({
      data: {
        requestedById,
        requestedRole: requestedRole || 'user',
        fullName,
        email,
        department: department ?? '',
        reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });

    // Invalidate requests cache immediately
    cacheInvalidate('requests');

    return NextResponse.json(request, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
