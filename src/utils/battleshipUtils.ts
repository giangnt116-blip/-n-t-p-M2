export type ShipOrientation = "horizontal" | "vertical";

export interface CellCoord {
  r: number; // 0-indexed row
  c: number; // 0-indexed column
}

export interface ShipPlacement {
  id: string;
  orientation: ShipOrientation;
  cells: CellCoord[];
  label: string;
}

export interface BattleshipConfig {
  rows?: number;
  cols?: number;
  shipLength?: number;
  orientations?: ShipOrientation[];
}

export interface CoverageResult {
  totalPlacements: number;
  coveredCount: number;
  coveredPlacements: ShipPlacement[];
  uncoveredPlacements: ShipPlacement[];
  coversAll: boolean;
}

/**
 * Checks if two coordinates match
 */
export function isSameCoord(a: CellCoord, b: CellCoord): boolean {
  return a.r === b.r && a.c === b.c;
}

/**
 * Checks if a coordinate is in a list of shots
 */
export function isCellShot(cell: CellCoord, shots: CellCoord[]): boolean {
  return shots.some((s) => s.r === cell.r && s.c === cell.c);
}

/**
 * Generates all valid ship placements of given length on a board of rows x cols
 */
export function generateShipPlacements(
  rows: number = 4,
  cols: number = 4,
  shipLength: number = 3,
  orientations: ShipOrientation[] = ["horizontal", "vertical"]
): ShipPlacement[] {
  const placements: ShipPlacement[] = [];

  // Horizontal placements
  if (orientations.includes("horizontal")) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols - shipLength; c++) {
        const cells: CellCoord[] = [];
        for (let i = 0; i < shipLength; i++) {
          cells.push({ r, c: c + i });
        }
        placements.push({
          id: `H_${r}_${c}`,
          orientation: "horizontal",
          cells,
          label: `Hàng ${r + 1} (cột ${c + 1}–${c + shipLength})`,
        });
      }
    }
  }

  // Vertical placements
  if (orientations.includes("vertical")) {
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r <= rows - shipLength; r++) {
        const cells: CellCoord[] = [];
        for (let i = 0; i < shipLength; i++) {
          cells.push({ r: r + i, c });
        }
        placements.push({
          id: `V_${r}_${c}`,
          orientation: "vertical",
          cells,
          label: `Cột ${c + 1} (hàng ${r + 1}–${r + shipLength})`,
        });
      }
    }
  }

  return placements;
}

/**
 * Checks if a specific ship placement is hit by any of the shots
 */
export function isPlacementHit(placement: ShipPlacement, shots: CellCoord[]): boolean {
  return placement.cells.some((cell) => isCellShot(cell, shots));
}

/**
 * Evaluates coverage of all placements given a list of shots
 */
export function evaluateCoverage(
  placements: ShipPlacement[],
  shots: CellCoord[]
): CoverageResult {
  const coveredPlacements: ShipPlacement[] = [];
  const uncoveredPlacements: ShipPlacement[] = [];

  for (const p of placements) {
    if (isPlacementHit(p, shots)) {
      coveredPlacements.push(p);
    } else {
      uncoveredPlacements.push(p);
    }
  }

  return {
    totalPlacements: placements.length,
    coveredCount: coveredPlacements.length,
    coveredPlacements,
    uncoveredPlacements,
    coversAll: uncoveredPlacements.length === 0,
  };
}

/**
 * Returns a single uncovered placement if exists (as a counterexample)
 */
export function getCounterexample(
  placements: ShipPlacement[],
  shots: CellCoord[]
): ShipPlacement | null {
  for (const p of placements) {
    if (!isPlacementHit(p, shots)) {
      return p;
    }
  }
  return null;
}
