import type { Stream } from '@/types/streamer';
import type { StreamRelevanceScore, RecommendationWeights } from './types';
import { DEFAULT_WEIGHTS } from './weights';

export function calculateStreamScore(
  stream: Stream,
  followedGames: Set<string>,
  followedTags: Set<string>,
  maxViewers: number,
  weights: RecommendationWeights = DEFAULT_WEIGHTS
): number {
  let score = 0;

  // Game match score (0 or 1)
  const gameMatchScore = followedGames.has(stream.game.toLowerCase()) ? 1 : 0;
  score += gameMatchScore * weights.gameMatch;

  // Normalized viewer count score (0 to 1)
  const viewerScore = maxViewers > 0 ? stream.viewerCount / maxViewers : 0;
  score += viewerScore * weights.viewerCount;

  // Tag match score (0 to 1)
  const tagMatchCount = stream.tags.filter(tag => 
    followedTags.has(tag.toLowerCase())
  ).length;
  const tagScore = stream.tags.length > 0 ? tagMatchCount / stream.tags.length : 0;
  score += tagScore * weights.tagMatch;

  return score;
}

export function sortStreamsByRelevance(
  streams: Stream[],
  followedGames: Set<string>,
  followedTags: Set<string>
): Stream[] {
  if (streams.length === 0) return [];

  // Find maximum viewer count for normalization
  const maxViewers = Math.max(...streams.map(s => s.viewerCount));

  // Calculate scores for all streams
  const scoredStreams: StreamRelevanceScore[] = streams.map(stream => ({
    stream,
    score: calculateStreamScore(stream, followedGames, followedTags, maxViewers)
  }));

  // Sort by score in descending order
  return scoredStreams
    .sort((a, b) => b.score - a.score)
    .map(({ stream }) => stream);
}