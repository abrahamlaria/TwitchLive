let appAccessToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function getAppAccessToken() {
  // Return existing token if it's still valid
  if (appAccessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return appAccessToken;
  }

  try {
    const response = await fetch('/api/twitch/auth');
    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    appAccessToken = data.access_token;
    tokenExpiresAt = Date.now() + (3600 * 1000); // 1 hour expiration
    return appAccessToken;
  } catch (error) {
    console.error('Error getting Twitch app access token:', error);
    throw error;
  }
}