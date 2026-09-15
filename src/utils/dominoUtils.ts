export interface DominoPiece {
  id: string;
  a: number;
  b: number;
}

export interface PlacedPiece {
  id: string;
  a: number; // left value as oriented
  b: number; // right value as oriented
  originalA: number;
  originalB: number;
  isFlipped: boolean;
}

export interface DominoConfig {
  pieces?: DominoPiece[];
}

export function getDegreeCounts(pieces: DominoPiece[]): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const piece of pieces) {
    counts[piece.a] = (counts[piece.a] || 0) + 1;
    counts[piece.b] = (counts[piece.b] || 0) + 1;
  }
  return counts;
}

export function canConnect(
  lastPlaced: PlacedPiece | undefined,
  nextLeft: number
): boolean {
  if (!lastPlaced) return true; // first piece can always be placed
  return lastPlaced.b === nextLeft;
}

export function findValidDominoChain(pieces: DominoPiece[]): PlacedPiece[] | null {
  if (pieces.length === 0) return [];

  function solve(
    currentChain: PlacedPiece[],
    usedIds: Set<string>
  ): PlacedPiece[] | null {
    if (currentChain.length === pieces.length) {
      return currentChain;
    }

    const lastPiece = currentChain[currentChain.length - 1];

    for (const p of pieces) {
      if (!usedIds.has(p.id)) {
        // Try orientation 1: [p.a | p.b]
        if (!lastPiece || lastPiece.b === p.a) {
          usedIds.add(p.id);
          const result = solve(
            [
              ...currentChain,
              {
                id: p.id,
                a: p.a,
                b: p.b,
                originalA: p.a,
                originalB: p.b,
                isFlipped: false,
              },
            ],
            usedIds
          );
          if (result) return result;
          usedIds.delete(p.id);
        }

        // Try orientation 2: [p.b | p.a]
        if (!lastPiece || lastPiece.b === p.b) {
          usedIds.add(p.id);
          const result = solve(
            [
              ...currentChain,
              {
                id: p.id,
                a: p.b,
                b: p.a,
                originalA: p.a,
                originalB: p.b,
                isFlipped: true,
              },
            ],
            usedIds
          );
          if (result) return result;
          usedIds.delete(p.id);
        }
      }
    }

    return null;
  }

  return solve([], new Set<string>());
}
