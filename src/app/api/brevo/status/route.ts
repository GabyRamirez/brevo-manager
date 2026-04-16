import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getContactStatus, getAllLists } from '@/lib/brevo';

export async function GET() {
  const email = (await cookies()).get('user_email')?.value;

  if (!email) {
    return NextResponse.json({ error: 'No autoritzat' }, { status: 401 });
  }

  try {
    const [contact, availableLists] = await Promise.all([
      getContactStatus(email),
      getAllLists(),
    ]);

    return NextResponse.json({
      email,
      isSubscribed: !!contact,
      blacklisted: contact?.emailBlacklisted || false,
      userLists: contact?.listIds || [],
      availableLists,
    });
  } catch (error) {
    console.error('API Status error:', error);
    return NextResponse.json({ error: 'Error recuperant dades de Brevo' }, { status: 500 });
  }
}
