import { IntentType, PriorityLevel } from '../types';

export function calculatePriorityScore(params: {
  searchVolume?: number;
  cpcInr?: number;
  depthLevel: number;
  isPillar: boolean;
  intent: IntentType;
  confidenceScore: number;
}): { priorityScore: number; priority: PriorityLevel } {
  const { searchVolume = 100, cpcInr = 10, depthLevel, isPillar, intent, confidenceScore } = params;

  // 1. Search Evidence Signal (35 points max)
  const volScore = Math.min(30, (searchVolume / 2000) * 30);
  const cpcScore = Math.min(5, (cpcInr / 100) * 5);
  const searchSignalScore = volScore + cpcScore;

  // 2. Centrality & Hierarchy Signal (35 points max)
  let centralityScore = 0;
  if (isPillar) {
    centralityScore = 35;
  } else if (depthLevel === 1) {
    centralityScore = 28;
  } else if (depthLevel === 2) {
    centralityScore = 20;
  } else {
    centralityScore = 12;
  }

  // 3. Search Intent Signal (20 points max)
  let intentScore = 15;
  if (intent === 'COMMERCIAL' || intent === 'TRANSACTIONAL') {
    intentScore = 20;
  } else if (intent === 'INFORMATIONAL') {
    intentScore = 16;
  }

  // 4. Data Confidence Signal (10 points max)
  const confidenceSignalScore = (confidenceScore / 100) * 10;

  // Total Score (0-100)
  const rawScore = searchSignalScore + centralityScore + intentScore + confidenceSignalScore;
  const priorityScore = Number(Math.min(100, Math.max(0, rawScore)).toFixed(2));

  let priority: PriorityLevel = 'MEDIUM';
  if (priorityScore >= 70.0) {
    priority = 'HIGH';
  } else if (priorityScore < 40.0) {
    priority = 'LOW';
  }

  return { priorityScore, priority };
}
