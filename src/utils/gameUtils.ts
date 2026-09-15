export interface TakeAwayConfig {
  initialItems?: number;
  minTake?: number;
  maxTake?: number;
  firstPlayer?: "student" | "ai";
  winCondition?: "takeLast";
}

/**
 * Cycle size for 1..k game is (maxTake + 1).
 * In a normal takeLast game:
 * Target states to leave for the opponent are multiples of (minTake + maxTake) if minTake=1, i.e. (maxTake + 1).
 * e.g., for take 1..4, cycleSize = 5. Losing positions (P-positions) = 0, 5, 10, 15, 20...
 */
export function getCycleSize(minTake: number = 1, maxTake: number = 4): number {
  return minTake + maxTake;
}

/**
 * Calculates winning target state (P-positions) for a given remaining count.
 */
export function getWinningRemainder(
  currentItems: number,
  minTake: number = 1,
  maxTake: number = 4
): number {
  const cycle = getCycleSize(minTake, maxTake);
  return currentItems % cycle;
}

/**
 * Computes the optimal move given the current items.
 * If in a winning position (remainder > 0), take `remainder` items.
 * If remainder === 0 (in losing position), take 1 or random valid to prolong game.
 */
export function calculateOptimalMove(
  currentItems: number,
  minTake: number = 1,
  maxTake: number = 4
): number {
  const cycle = getCycleSize(minTake, maxTake);
  const remainder = currentItems % cycle;

  if (remainder >= minTake && remainder <= maxTake) {
    return remainder;
  }

  // If already at a multiple of cycle, any valid move is mathematically losing against perfect play
  // Default to minimum move
  return minTake;
}

/**
 * Computes AI move based on mode:
 * - "random": pick a random valid number between minTake and min(maxTake, currentItems)
 * - "optimal": pick calculated optimal move
 */
export function getAIMove(
  currentItems: number,
  mode: "random" | "optimal",
  minTake: number = 1,
  maxTake: number = 4
): number {
  const effectiveMax = Math.min(maxTake, currentItems);
  if (effectiveMax <= minTake) {
    return Math.min(minTake, currentItems);
  }

  if (mode === "optimal") {
    return calculateOptimalMove(currentItems, minTake, maxTake);
  }

  // "random" mode for exploratory play
  const choices: number[] = [];
  for (let i = minTake; i <= effectiveMax; i++) {
    choices.push(i);
  }
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}
