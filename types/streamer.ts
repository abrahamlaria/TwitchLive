export interface StreamerInfo {
  id: string;
  username: string;
  avatarUrl: string;
  isLive: boolean;
  currentGame?: string | null;
  viewerCount?: number | null;
}

export interface Stream {
  id: string;
  userId: string;
  username: string;
  title: string;
  thumbnailUrl: string;
  game: string;
  viewerCount: number;
  tags: string[];
}

// Remove the old Streamer type and use StreamerInfo consistently
export type Streamer = StreamerInfo;