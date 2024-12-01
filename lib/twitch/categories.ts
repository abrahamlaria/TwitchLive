import { TWITCH_API_URL } from './config';
import { getAppAccessToken } from './auth';
import { getTwitchClientId } from './config';
import type { Category, CategoryType } from '@/types/category';

const CATEGORY_MAPPINGS: Record<CategoryType, string[]> = {
  games: ['Gaming'],
  irl: ['Just Chatting', 'ASMR', 'Travel & Outdoors', 'Food & Drink', 'Pools, Hot Tubs, and Beaches'],
  music: ['Music', 'Rhythm & Music Games'],
  creative: ['Art', 'Makers & Crafting', 'Software and Game Development'],
  sports: ['Sports', 'Fitness & Health']
};

export async function getTopCategories(type: CategoryType, limit = 20): Promise<Category[]> {
  try {
    const clientId = getTwitchClientId();
    const accessToken = await getAppAccessToken();

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': clientId,
      'Content-Type': 'application/json',
    };

    // First get all top categories
    const response = await fetch(
      `${TWITCH_API_URL}/games/top?first=100`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter categories based on type
    const filteredCategories = data.data
      .filter((category: any) => {
        if (type === 'games') {
          // For games, exclude categories that are in other types
          const otherCategories = new Set([
            ...CATEGORY_MAPPINGS.irl,
            ...CATEGORY_MAPPINGS.music,
            ...CATEGORY_MAPPINGS.creative,
            ...CATEGORY_MAPPINGS.sports
          ]);
          return !otherCategories.has(category.name);
        }
        // For other types, include only categories in their mapping
        return CATEGORY_MAPPINGS[type].includes(category.name);
      })
      .slice(0, limit)
      .map((category: any) => ({
        id: category.id,
        name: category.name,
        boxArtUrl: category.box_art_url
          .replace('{width}', '188')
          .replace('{height}', '250'),
        viewerCount: 0,
      }));

    return filteredCategories;
  } catch (error) {
    console.error('Error fetching top categories:', error);
    throw error;
  }
}

export async function getStreamsByCategory(categoryId: string, limit = 20, cursor?: string | undefined) {
  try {
    const clientId = getTwitchClientId();
    const accessToken = await getAppAccessToken();

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': clientId,
      'Content-Type': 'application/json',
    };

    const params = new URLSearchParams({
      game_id: categoryId,
      first: limit.toString(),
      ...(cursor ? { after: cursor } : {}),
    });

    const response = await fetch(
      `${TWITCH_API_URL}/streams?${params}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      streams: data.data,
      cursor: data.pagination.cursor || undefined
    };
  } catch (error) {
    console.error('Error fetching streams by category:', error);
    throw error;
  }
}