export const TWITCH_API_URL = 'https://api.twitch.tv/helix';
export const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

export function getTwitchClientId(): string {
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
  
  if (!clientId) {
    console.error('Missing Twitch Client ID');
  }

  return clientId || '';
}