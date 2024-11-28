export interface StreamerInfo {
  id: string;
  username: string;
  avatarUrl: string;
  isLive: boolean;
  currentGame?: string;
  viewerCount?: number;
}