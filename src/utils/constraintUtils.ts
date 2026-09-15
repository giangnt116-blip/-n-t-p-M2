export interface ObjectiveConfig {
  type: "maximizeSum" | "minimizeSum";
}

export interface ConstraintRule {
  type: "anyKSumAtMost";
  k: number;
  limit: number;
}

export interface ConstraintLabConfig {
  count?: number;
  minValue?: number;
  objective?: ObjectiveConfig;
  constraint?: ConstraintRule;
}

export interface ConstraintCheckResult {
  valid: boolean;
  currentSum: number;
  violatingIndices?: number[]; // indices of numbers that form the violating subset
  violatingValues?: number[];
  violatingSum?: number;
  message: string;
}

export interface LargestKInfo {
  indices: number[]; // original indices in the numbers array
  values: number[];
  sum: number;
}

/**
 * Calculates sum of an array of numbers
 */
export function calculateSum(numbers: number[]): number {
  return numbers.reduce((acc, val) => acc + val, 0);
}

/**
 * Finds the k largest numbers and their original indices
 */
export function getLargestK(numbers: number[], k: number = 3): LargestKInfo {
  // Pair each number with its original index
  const indexed = numbers.map((val, idx) => ({ val, idx }));
  // Sort descending
  indexed.sort((a, b) => b.val - a.val);

  const topK = indexed.slice(0, Math.min(k, numbers.length));
  const indices = topK.map((item) => item.idx);
  const values = topK.map((item) => item.val);
  const sum = calculateSum(values);

  return { indices, values, sum };
}

/**
 * Checks if ANY subset of size k has sum > limit.
 * Mathematically, for positive numbers, if the sum of the k LARGEST numbers <= limit,
 * then EVERY subset of size k has sum <= limit.
 * If the sum of the k largest numbers > limit, then that top-k subset is an immediate witness/violation!
 */
export function checkAnyKSumAtMost(
  numbers: number[],
  k: number = 3,
  limit: number = 14
): ConstraintCheckResult {
  const currentSum = calculateSum(numbers);

  if (numbers.length < k) {
    return {
      valid: currentSum <= limit,
      currentSum,
      message: currentSum <= limit ? "Hợp lệ" : `Tổng các số vượt quá ${limit}`,
    };
  }

  const topK = getLargestK(numbers, k);

  if (topK.sum > limit) {
    return {
      valid: false,
      currentSum,
      violatingIndices: topK.indices,
      violatingValues: topK.values,
      violatingSum: topK.sum,
      message: `Bộ ${k} số [${topK.values.join(" + ")}] có tổng ${topK.sum} > ${limit}`,
    };
  }

  return {
    valid: true,
    currentSum,
    message: `Thỏa mãn: Mọi bộ ${k} số đều có tổng ≤ ${limit}`,
  };
}

/**
 * Generalized constraint check function driven by config
 */
export function checkConstraint(
  numbers: number[],
  constraint?: ConstraintRule
): ConstraintCheckResult {
  if (!constraint || constraint.type !== "anyKSumAtMost") {
    return {
      valid: true,
      currentSum: calculateSum(numbers),
      message: "Không có ràng buộc nào.",
    };
  }

  return checkAnyKSumAtMost(numbers, constraint.k, constraint.limit);
}

/**
 * Generates sorted breakdown of numbers with indexed labels (a1, a2, ..., an)
 */
export function getSortedBreakdown(numbers: number[]): Array<{
  originalIndex: number;
  sortedRank: number; // 1-indexed: a1 <= a2 <= ... <= a10
  value: number;
  isTopK: boolean;
}> {
  const indexed = numbers.map((val, idx) => ({ val, idx }));
  // Sort ascending
  indexed.sort((a, b) => a.val - b.val);

  const total = numbers.length;
  return indexed.map((item, rankIdx) => ({
    originalIndex: item.idx,
    sortedRank: rankIdx + 1,
    value: item.val,
    isTopK: rankIdx >= total - 3, // for k=3
  }));
}
