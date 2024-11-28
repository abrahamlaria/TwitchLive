import { supabase } from './supabase';

const TWITCH_API_URL = 'https://api.twitch.tv/helix';

export async function getTwitchAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.provider_token;
}

export async function getStreamerInfo(streamerId: string) {
  const accessToken = await getTwitchAccessToken();
  
  const response = await fetch(`${TWITCH_API_URL}/users?id=${streamerId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
    }
  });

  return response.json();
}

export async function getStreamStatus(streamerId: string) {
  const accessToken = await getTwitchAccessToken();
  
  const response = await fetch(`${TWITCH_API_URL}/streams?user_id=${streamerId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
    }
  });

  return response.json();
}