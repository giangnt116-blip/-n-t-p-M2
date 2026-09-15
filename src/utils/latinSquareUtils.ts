/**
 * Utility functions for Latin Square 3x3 (D16)
 */

export function isValidRow(row: number[], symbols: number[]): boolean {
  if (row.length !== symbols.length) return false;
  const set = new Set(row);
  return symbols.every((s) => set.has(s));
}

export function isValidColumn(grid: number[][], colIdx: number, symbols: number[]): boolean {
  const col = grid.map((r) => r[colIdx]);
  if (col.length !== symbols.length) return false;
  const set = new Set(col);
  return symbols.every((s) => set.has(s));
}

export function isValidSquare(grid: number[][], symbols: number[]): boolean {
  const n = symbols.length;
  if (grid.length !== n) return false;

  for (let r = 0; r < n; r++) {
    if (!isValidRow(grid[r], symbols)) return false;
  }
  for (let c = 0; c < n; c++) {
    if (!isValidColumn(grid, c, symbols)) return false;
  }
  return true;
}

/**
 * Generate all permutations of an array
 */
function permute(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr];
  const result: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const subPerms = permute(remaining);
    for (const p of subPerms) {
      result.push([current, ...p]);
    }
  }
  return result;
}

/**
 * Enumerate all Latin Squares of size n with given symbols
 * For 3x3 with [1,2,3], there are exactly 12 unique Latin Squares
 */
export function enumerateLatinSquares(size = 3, symbols = [1, 2, 3]): number[][][] {
  const allPerms = permute(symbols);
  const validSquares: number[][][] = [];

  for (const r1 of allPerms) {
    for (const r2 of allPerms) {
      // Check if r1 and r2 have any column collision
      let colConflict12 = false;
      for (let c = 0; c < size; c++) {
        if (r1[c] === r2[c]) {
          colConflict12 = true;
          break;
        }
      }
      if (colConflict12) continue;

      for (const r3 of allPerms) {
        let colConflict = false;
        for (let c = 0; c < size; c++) {
          if (r3[c] === r1[c] || r3[c] === r2[c]) {
            colConflict = true;
            break;
          }
        }
        if (!colConflict) {
          validSquares.push([r1, r2, r3]);
        }
      }
    }
  }

  return validSquares;
}

export function gridToKey(grid: number[][]): string {
  return grid.map((r) => r.join("")).join("-");
}
