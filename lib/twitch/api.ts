import { TWITCH_API_URL } from './config';
import { getAppAccessToken } from './auth';
import { getTwitchClientId } from './config';
import type { Stream, StreamerInfo } from '@/types/streamer';

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
    const params = new URLSearchParams({
      first: limit.toString(),
      ...(cursor ? { after: cursor } : {})
    });

    const response = await fetch(
      `${TWITCH_API_URL}/streams?${params}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const streams: Stream[] = data.data.map((stream: any) => ({
      id: stream.id,
      userId: stream.user_id,
      username: stream.user_login,
      title: stream.title,
      thumbnailUrl: stream.thumbnail_url.replace('{width}', '800').replace('{height}', '450'),
      game: stream.game_name,
      viewerCount: stream.viewer_count,
      tags: stream.tags || []
    }));

    return {
      streams,
      cursor: data.pagination.cursor
    };
  } catch (error) {
    console.error('Error in getTopStreams:', error);
    throw error;
  }
}

export async function searchStreams(query: string): Promise<Stream[]> {
  try {
    const headers = await getTwitchHeaders();
    const params = new URLSearchParams({
      query,
      first: '20',
      type: 'live'
    });

    const response = await fetch(
      `${TWITCH_API_URL}/search/channels?${params}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data.map((channel: any) => ({
      id: channel.id,
      userId: channel.id,
      username: channel.broadcaster_login,
      title: channel.title,
      thumbnailUrl: channel.thumbnail_url.replace('{width}', '800').replace('{height}', '450'),
      game: channel.game_name,
      viewerCount: channel.viewer_count,
      tags: channel.tags || []
    }));
  } catch (error) {
    console.error('Error searching streams:', error);
    throw error;
  }
}

export async function getStreamerInfo(userId: string): Promise<StreamerInfo> {
  const headers = await getTwitchHeaders();
  const response = await fetch(`${TWITCH_API_URL}/users?id=${userId}`, { headers });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const user = data.data[0];
  
  if (!user) {
    throw new Error('Streamer not found');
  }

  return {
    id: user.id,
    username: user.display_name,
    avatarUrl: user.profile_image_url,
    isLive: false, // This will be updated by getStreamStatus
    tags: user.tags || [],
  };
}

export async function getStreamStatus(userId: string) {
  const headers = await getTwitchHeaders();
  const response = await fetch(`${TWITCH_API_URL}/streams?user_id=${userId}`, { headers });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data: data.data,
    isLive: data.data.length > 0,
    viewerCount: data.data[0]?.viewer_count ?? null,
    currentGame: data.data[0]?.game_name ?? null,
    tags: data.data[0]?.tags ?? [],
  };
}