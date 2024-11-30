import { TWITCH_API_URL } from './config';
import { getAppAccessToken } from './auth';
import { getTwitchClientId } from './config';
import type { Stream } from '@/types/streamer';

async function getTwitchHeaders() {
  const clientId = getTwitchClientId();
  const accessToken = await getAppAccessToken();

  return {
    'Authorization': `Bearer ${accessToken}`,
    'Client-Id': clientId,
    'Content-Type': 'application/json',
  };
}

export async function getTopStreams(limit = 20, cursor?: string | null) {
  try {
    const headers = await getTwitchHeaders();
    const url = new URL(`${TWITCH_API_URL}/streams`);
    url.searchParams.append('first', limit.toString());
    if (cursor) {
      url.searchParams.append('after', cursor);
    }

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch streams: ${response.statusText}`);
    }

    const { data, pagination } = await response.json();

    return {
      streams: data.map((stream: any): Stream => ({
        id: stream.id,
        userId: stream.user_id,
        username: stream.user_login,
        title: stream.title || 'Untitled Stream',
        game: stream.game_name || 'Unknown Game',
        thumbnailUrl: stream.thumbnail_url
          .replace('{width}', '800')
          .replace('{height}', '450'),
        viewerCount: stream.viewer_count || 0,
        tags: stream.tags || [],
      })),
      cursor: pagination?.cursor || null,
    };
  } catch (error) {
    console.error('Error in getTopStreams:', error);
    throw error;
  }
}

export async function getStreamerInfo(userId: string) {
  const headers = await getTwitchHeaders();
  const response = await fetch(`${TWITCH_API_URL}/users?id=${userId}`, { headers });
  return response.json();
}

export async function getStreamStatus(userId: string) {
  const headers = await getTwitchHeaders();
  const response = await fetch(`${TWITCH_API_URL}/streams?user_id=${userId}`, { headers });
  return response.json();
}

export async function searchStreams(query: string, limit = 20): Promise<Stream[]> {
  if (!query.trim()) return [];

  try {
    const headers = await getTwitchHeaders();
    const url = new URL(`${TWITCH_API_URL}/search/channels`);
    url.searchParams.append('query', query);
    url.searchParams.append('first', limit.toString());
    url.searchParams.append('live_only', 'true');

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      throw new Error(`Failed to search streams: ${response.statusText}`);
    }

    const { data } = await response.json();

    return data.map((channel: any): Stream => ({
      id: channel.id,
      userId: channel.id,
      username: channel.broadcaster_login,
      title: channel.title || channel.display_name,
      game: channel.game_name || 'Unknown Game',
      thumbnailUrl: channel.thumbnail_url
        .replace('{width}', '440')
        .replace('{height}', '248'),
      viewerCount: channel.viewer_count || 0,
      tags: channel.tags || [],
    }));
  } catch (error) {
    console.error('Error searching streams:', error);
    return [];
  }
}