export interface StreamerInfo {
  id: string;
  username: string;
  avatarUrl: string;
  isLive: boolean;
  currentGame?: string;
  viewerCount?: number;
}

export interface Stream {
  id: string;
  userId: string;
  title: string;
  thumbnailUrl: string;
  game: string;
  viewerCount: number;
  tags: string[];
}