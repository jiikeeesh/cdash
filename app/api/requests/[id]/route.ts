// PATCH /api/requests/[id]  → approve or reject a request
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { cacheInvalidate } from '@/app/lib/cache';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { status, resolvedById } = data;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status must be approved or rejected' }, { status: 400 });
    }

    const request = await prisma.accountRequest.update({
      where: { id },
      data: {
        status,
        resolvedById: resolvedById ?? null,
        resolvedAt: new Date().toISOString(),
      },
    });

    // Invalidate requests cache
    cacheInvalidate('requests');

    return NextResponse.json(request);
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.accountRequest.delete({
      where: { id },
    });

    // Invalidate requests cache
    cacheInvalidate('requests');

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
