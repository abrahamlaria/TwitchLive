import { TWITCH_AUTH_URL } from './config';
import { getTwitchCredentials } from './config';

let appAccessToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function getAppAccessToken() {
  // Return existing token if it's still valid
  if (appAccessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return appAccessToken;
  }

  const { clientId, clientSecret, hasCredentials } = getTwitchCredentials();

  if (!hasCredentials) {
    throw new Error('Missing Twitch API credentials');
  }

  try {
    const response = await fetch(TWITCH_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    appAccessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in * 1000);
    return appAccessToken;
  } catch (error) {
    console.error('Error getting Twitch app access token:', error);
    throw error;
  }
}