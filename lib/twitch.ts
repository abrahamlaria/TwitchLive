import { supabase } from './supabase';

const TWITCH_API_URL = 'https://api.twitch.tv/helix';
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

let appAccessToken: string | null = null;
let tokenExpiresAt: number | null = null;

async function getAppAccessToken() {
  // Return existing token if it's still valid
  if (appAccessToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return appAccessToken;
  }

  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Twitch API credentials');
  }

  try {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    });

    const response = await fetch(TWITCH_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Twitch token error response:', error);
      throw new Error(`Failed to get Twitch app access token: ${error.message}`);
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

export async function getTopStreams(limit = 9) {
  try {
    const accessToken = await getAppAccessToken();
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    
    if (!clientId) {
      throw new Error('Missing Twitch client ID');
    }
    
    const response = await fetch(`${TWITCH_API_URL}/streams?first=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': clientId,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Twitch API error response:', error);
      throw new Error(`Failed to fetch top streams: ${error.message}`);
    }

    const { data } = await response.json();
    
    return data.map((stream: any) => ({
      id: stream.id,
      userId: stream.user_id,
      title: stream.title,
      game: stream.game_name,
      thumbnailUrl: stream.thumbnail_url
        .replace('{width}', '800')
        .replace('{height}', '450'),
      viewerCount: stream.viewer_count,
      tags: stream.tags || [],
    }));
  } catch (error) {
    console.error('Error in getTopStreams:', error);
    throw error;
  }
}

export async function getStreamerInfo(userId: string) {
  try {
    const accessToken = await getAppAccessToken();
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    
    if (!clientId) {
      throw new Error('Missing Twitch client ID');
    }
    
    const response = await fetch(`${TWITCH_API_URL}/users?id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': clientId,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch streamer info');
    }

    return response.json();
  } catch (error) {
    console.error('Error in getStreamerInfo:', error);
    throw error;
  }
}

export async function getStreamStatus(userId: string) {
  try {
    const accessToken = await getAppAccessToken();
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    
    if (!clientId) {
      throw new Error('Missing Twitch client ID');
    }
    
    const response = await fetch(`${TWITCH_API_URL}/streams?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': clientId,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stream status');
    }

    return response.json();
  } catch (error) {
    console.error('Error in getStreamStatus:', error);
    throw error;
  }
}