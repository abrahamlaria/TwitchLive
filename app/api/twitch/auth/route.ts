import { NextResponse } from 'next/server';
import { TWITCH_AUTH_URL } from '@/lib/twitch/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Missing Twitch API credentials');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    });

    const response = await fetch(`${TWITCH_AUTH_URL}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting Twitch app access token:', error);
    return NextResponse.json(
      { error: 'Failed to get Twitch access token' },
      { status: 500 }
    );
  }
}