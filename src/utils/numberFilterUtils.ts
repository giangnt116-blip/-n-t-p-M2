/**
 * Utility functions for Number Filter (D18 - Chung cư chó và mèo)
 */

export function digitSum(n: number): number {
  return Math.abs(n)
    .toString()
    .split("")
    .reduce((sum, d) => sum + parseInt(d, 10), 0);
}

export interface FilterOptions {
  divisibleBy5?: boolean;
  digitSumDivisibleBy5?: boolean;
}

export function applyFilters(
  start: number,
  end: number,
  filters: FilterOptions
): number[] {
  const result: number[] = [];

  for (let i = start; i <= end; i++) {
    if (filters.divisibleBy5 && i % 5 !== 0) {
      continue;
    }
    if (filters.digitSumDivisibleBy5 && digitSum(i) % 5 !== 0) {
      continue;
    }
    result.push(i);
  }

  return result;
}
