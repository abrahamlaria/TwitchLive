import { Streamer, Stream } from './types';

export const mockStreamers: Streamer[] = [
  {
    id: '1',
    username: 'Ninja',
    avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&crop=faces',
    isLive: true,
    currentGame: 'Fortnite',
    viewerCount: 45231,
  },
  {
    id: '2',
    username: 'Pokimane',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
    isLive: true,
    currentGame: 'Just Chatting',
    viewerCount: 32104,
  },
  {
    id: '3',
    username: 'Shroud',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=faces',
    isLive: false,
  },
  {
    id: '4',
    username: 'xQc',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop&crop=faces',
    isLive: true,
    currentGame: 'Counter-Strike 2',
    viewerCount: 89432,
  },
];

export const mockFeaturedStreams: Stream[] = [
  {
    id: '1',
    title: 'Friday Night Fortnite! | !merch !socials',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
    game: 'Fortnite',
    viewerCount: 45231,
    startedAt: '2024-03-20T18:00:00Z',
    tags: ['English', 'Gaming', 'Esports'],
  },
  {
    id: '2',
    title: 'Chill Stream & Chat | !discord !sub',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
    game: 'Just Chatting',
    viewerCount: 32104,
    startedAt: '2024-03-20T20:30:00Z',
    tags: ['English', 'IRL', 'Chat'],
  },
  {
    id: '3',
    title: 'CS2 Pro Matches | !tournament !schedule',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop',
    game: 'Counter-Strike 2',
    viewerCount: 89432,
    startedAt: '2024-03-20T19:15:00Z',
    tags: ['English', 'Esports', 'Tournament'],
  },
];