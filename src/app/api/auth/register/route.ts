import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '../../../../lib/prisma';
import { sendVerificationEmail } from '../../../../lib/brevo';
import { verifyTurnstileToken } from '../../../../lib/turnstile';

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

    if (!email || !password) {
      return NextResponse.json({ error: 'Email i contrasenya obligatoris' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Aquest usuari ja existeix' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ message: 'Usuari creat. Revisa el teu correu per verificar el compte.' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error en el registre' }, { status: 500 });
  }
}
