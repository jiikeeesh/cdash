// GET    /api/users/[id]  → get single user
// PATCH  /api/users/[id]  → update user
// DELETE /api/users/[id]  → delete user
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, username: true, role: true, fullName: true,
        email: true, phone: true, address: true, department: true, isFirstLogin: true,
        createdAt: true, createdBy: true,
      },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { password, fullName, email, phone, address, department, role, isFirstLogin } = data;

    const updateData: Record<string, unknown> = {};
    if (fullName !== undefined)     updateData.fullName     = fullName;
    if (email !== undefined)        updateData.email        = email;
    if (phone !== undefined)        updateData.phone        = phone;
    if (address !== undefined)      updateData.address      = address;
    if (department !== undefined)   updateData.department   = department;
    if (role !== undefined)         updateData.role         = role;
    if (password !== undefined && password !== '') updateData.password = password;
    if (isFirstLogin !== undefined) updateData.isFirstLogin = isFirstLogin;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true, username: true, role: true, fullName: true,
        email: true, phone: true, address: true, department: true, isFirstLogin: true,
        createdAt: true, createdBy: true,
      },
    });
    return NextResponse.json(user);
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
