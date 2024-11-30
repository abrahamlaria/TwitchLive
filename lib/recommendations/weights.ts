import type { RecommendationWeights } from './types';

export const DEFAULT_WEIGHTS: RecommendationWeights = {
  gameMatch: 0.5,    // 50% importance for matching games
  viewerCount: 0.3,  // 30% importance for viewer count
  tagMatch: 0.2,     // 20% importance for matching tags
};