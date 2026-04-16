import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateContactLists } from '@/lib/brevo';

export async function POST(req: Request) {
  const email = (await cookies()).get('user_email')?.value;

  if (!email) {
    return NextResponse.json({ error: 'No autoritzat' }, { status: 401 });
  }

  try {
    const { listIds, unlinkListIds } = await req.json();
    await updateContactLists(email, listIds, unlinkListIds);
    return NextResponse.json({ message: 'Llistes actualitzades correctament' });
  } catch (error) {
    console.error('Update lists error:', error);
    return NextResponse.json({ error: 'Error actualitzant llistes' }, { status: 500 });
  }
}
