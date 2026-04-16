import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(req: Request) {
  try {
    const { email, password, turnstileToken } = await req.json();

    if (!turnstileToken) {
      return NextResponse.json({ error: 'Sistema de seguretat no detectat' }, { status: 400 });
    }

    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'Verificació de seguretat fallida' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuari no trobat' }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: 'Compte no verificat. Revisa el teu correu.' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Contrasenya incorrecta' }, { status: 401 });
    }

    // Set a session cookie (simplified for POC)
    const response = NextResponse.json({ message: 'Login correcte' });
    
    // In a real app, use a JWT or a proper session store
    (await cookies()).set('user_email', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error en el login' }, { status: 500 });
  }
}
