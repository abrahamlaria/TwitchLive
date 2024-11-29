import { TWITCH_API_URL } from './config';
import { getAppAccessToken } from './auth';
import { getTwitchCredentials } from './config';
import type { Stream } from '@/types/streamer';

async function getTwitchHeaders() {
  const { clientId, hasCredentials } = getTwitchCredentials();
  
  if (!hasCredentials) {
    throw new Error('Missing Twitch API credentials');
  }

  const accessToken = await getAppAccessToken();

  return {
    'Authorization': `Bearer ${accessToken}`,
    'Client-Id': clientId!,
    'Content-Type': 'application/json',
  };
}

export async function getTopStreams(limit = 9): Promise<Stream[]> {
  try {
    const headers = await getTwitchHeaders();
    const response = await fetch(`${TWITCH_API_URL}/streams?first=${limit}`, {
      headers,
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch streams: ${response.statusText}`);
    }

    const { data } = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from Twitch API');
    }

    return data.map((stream: any): Stream => ({
      id: stream.id,
      userId: stream.user_id,
      title: stream.title || 'Untitled Stream',
      game: stream.game_name || 'Unknown Game',
      thumbnailUrl: stream.thumbnail_url
        ? stream.thumbnail_url
            .replace('{width}', '1280')
            .replace('{height}', '720')
        : '',
      viewerCount: typeof stream.viewer_count === 'number' ? stream.viewer_count : 0,
      tags: Array.isArray(stream.tags) ? stream.tags : [],
    }));
  } catch (error) {
    console.error('Error in getTopStreams:', error);
    return [];
  }
}

export async function getStreamerInfo(userId: string) {
  try {
    const headers = await getTwitchHeaders();
    const response = await fetch(`${TWITCH_API_URL}/users?id=${userId}`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch streamer info: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getStreamerInfo:', error);
    throw error;
  }
}

export async function getStreamStatus(userId: string) {
  try {
    const headers = await getTwitchHeaders();
    const response = await fetch(`${TWITCH_API_URL}/streams?user_id=${userId}`, {
      headers,
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stream status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getStreamStatus:', error);
    throw error;
  }
}