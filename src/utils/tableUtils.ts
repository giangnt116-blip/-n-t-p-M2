export interface TableMergeConfig {
  tableCount?: number;
  seatsPerSide?: number;
  initialLayout?: "separate" | "row";
  targetLayout?: "row";
}

/**
 * Calculates the number of seats for a row of n square tables placed side-by-side.
 * For n tables with 1 seat per available side:
 * Each end table has 3 exposed sides.
 * Each middle table has 2 exposed sides.
 * Total = 2 * 3 + (n - 2) * 2 = 6 + 2n - 4 = 2n + 2.
 * When n = 1, total = 4.
 */
export function calculateSeatsForRow(
  mergedCount: number,
  seatsPerSide: number = 1
): number {
  if (mergedCount <= 0) return 0;
  if (mergedCount === 1) return 4 * seatsPerSide;
  return (2 * mergedCount + 2) * seatsPerSide;
}

export function getMergePatternTable(
  totalTables: number,
  seatsPerSide: number = 1
): Array<{ tables: number; seats: number; delta: number }> {
  const result: Array<{ tables: number; seats: number; delta: number }> = [];
  let prevSeats = 0;
  for (let i = 1; i <= totalTables; i++) {
    const seats = calculateSeatsForRow(i, seatsPerSide);
    result.push({
      tables: i,
      seats,
      delta: i === 1 ? seats : seats - prevSeats,
    });
    prevSeats = seats;
  }
  return result;
}
