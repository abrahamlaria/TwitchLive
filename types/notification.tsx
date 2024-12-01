export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'stream_live' | 'stream_offline' | 'system';
    read: boolean;
    createdAt: string;
    streamerId?: string;
    streamerUsername?: string;
  }