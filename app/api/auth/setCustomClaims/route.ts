import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/server';
import { z } from 'zod';

const schema = z.object({
  uid: z.string(),
  rol: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, rol } = schema.parse(body);

    const auth = getAuth(adminApp);
    await auth.setCustomUserClaims(uid, { rol });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al asignar custom claims:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 });
  }
}