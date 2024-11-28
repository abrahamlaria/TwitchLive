export interface Streamer {
  id: string;
  username: string;
  avatarUrl: string;
  isLive: boolean;
  currentGame?: string;
  viewerCount?: number;
}

export interface Stream {
  id: string;
  title: string;
  thumbnailUrl: string;
  game: string;
  viewerCount: number;
  startedAt: string;
  tags: string[];
}