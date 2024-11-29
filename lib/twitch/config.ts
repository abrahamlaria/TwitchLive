export const TWITCH_API_URL = 'https://api.twitch.tv/helix';
export const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

interface TwitchCredentials {
  clientId: string | undefined;
  clientSecret: string | undefined;
  hasCredentials: boolean;
}

export function getTwitchCredentials(): TwitchCredentials {
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
  const clientSecret = process.env.NEXT_TWITCH_CLIENT_SECRET;
  
  const hasCredentials = Boolean(clientId && clientSecret);
  
  if (!hasCredentials) {
    console.error('Missing Twitch credentials:', {
      hasClientId: Boolean(clientId),
      hasClientSecret: Boolean(clientSecret)
    });
  }

  return {
    clientId,
    clientSecret,
    hasCredentials
  };
}