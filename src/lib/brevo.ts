const BREVO_API_KEY = process.env.BREVO_API_KEY;
const API_URL = 'https://api.brevo.com/v3';

export async function brevoFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'api-key': BREVO_API_KEY || '',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Brevo API Error (${endpoint}):`, errorData);
    throw new Error(errorData.message || 'Call to Brevo API failed');
  }

  return response.json().catch(() => ({}));
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;
  
  return brevoFetch('/smtp/email', {
    method: 'POST',
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME || 'Brevo Manager',
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email }],
      subject: 'Verifica el teu compte',
      htmlContent: `
        <h1>Hola!</h1>
        <p>Gràcies per registrar-te. Per favor, verifica el teu compte fent clic al següent enllaç:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verifica el correu</a>
        <p>Si no has estat tu, pots ignorar aquest correu.</p>
      `,
    }),
  });
}

export async function getContactStatus(email: string) {
  try {
    const contact = await brevoFetch(`/contacts/${encodeURIComponent(email)}`);
    return contact;
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return null;
    }
    throw error;
  }
}

export async function getAllLists() {
  const data = await brevoFetch('/contacts/lists?limit=50&offset=0');
  return data.lists || [];
}

export async function updateContactLists(email: string, listIds: number[], unlinkListIds: number[]) {
  return brevoFetch(`/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify({
      listIds,
      unlinkListIds,
    }),
  });
}

export async function isBlacklisted(email: string) {
  const contact = await getContactStatus(email);
  return contact?.emailBlacklisted || false;
}

export async function removeFromBlacklist(email: string) {
  // Try to remove from transactional blocklist
  try {
    await brevoFetch(`/smtp/blockedContacts/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.warn('Could not remove from transactional blocklist', e);
  }

  // Update contact status to remove from general blacklist
  return brevoFetch(`/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify({
      emailBlacklisted: false,
    }),
  });
}
