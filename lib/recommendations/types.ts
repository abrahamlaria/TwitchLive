import type { Stream } from '@/types/streamer';

export interface StreamRelevanceScore {
  stream: Stream;
  score: number;
}

export interface RecommendationWeights {
  gameMatch: number;
  viewerCount: number;
  tagMatch: number;
}