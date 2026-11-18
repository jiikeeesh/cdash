import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

// GET /api/users/keys?userId=... → get public key (and backup encryptedPrivateKey if asking for self)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const forSelf = searchParams.get('forSelf') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        publicKey: true,
        encryptedPrivateKey: forSelf,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch keys' }, { status: 500 });
  }
}

// POST /api/users/keys → store public key and encrypted private key
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, publicKey, encryptedPrivateKey } = body;

    if (!userId || !publicKey) {
      return NextResponse.json({ error: 'Missing required key data' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        publicKey,
        encryptedPrivateKey: encryptedPrivateKey || '',
      },
      select: {
        id: true,
        publicKey: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save keys' }, { status: 500 });
  }
}
