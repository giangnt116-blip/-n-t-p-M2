export interface GraphNode {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label?: string;
}

export type GraphEdge = [string, string];

export interface GraphConfig {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  start?: string;
  target?: string;
}

export function areConnected(edges: GraphEdge[], u: string, v: string): boolean {
  return edges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));
}

export function getNeighbors(edges: GraphEdge[], node: string): string[] {
  const neighbors: string[] = [];
  for (const [a, b] of edges) {
    if (a === node && !neighbors.includes(b)) neighbors.push(b);
    if (b === node && !neighbors.includes(a)) neighbors.push(a);
  }
  return neighbors;
}

export function findAllPaths(
  edges: GraphEdge[],
  start: string,
  target: string
): string[][] {
  const allPaths: string[][] = [];

  function dfs(current: string, visited: Set<string>, path: string[]) {
    if (current === target) {
      allPaths.push([...path]);
      return;
    }
    for (const nxt of getNeighbors(edges, current)) {
      if (!visited.has(nxt)) {
        visited.add(nxt);
        path.push(nxt);
        dfs(nxt, visited, path);
        path.pop();
        visited.delete(nxt);
      }
    }
  }

  dfs(start, new Set([start]), [start]);
  return allPaths;
}

export function findShortestPaths(
  edges: GraphEdge[],
  start: string,
  target: string
): {
  shortestPaths: string[][];
  shortestLength: number;
  shortestCount: number;
} {
  const allPaths = findAllPaths(edges, start, target);
  if (allPaths.length === 0) {
    return { shortestPaths: [], shortestLength: 0, shortestCount: 0 };
  }

  // Length in terms of number of edges = path.length - 1
  let minLen = Infinity;
  for (const p of allPaths) {
    const edgesCount = p.length - 1;
    if (edgesCount < minLen) {
      minLen = edgesCount;
    }
  }

  const shortestPaths = allPaths.filter((p) => p.length - 1 === minLen);
  return {
    shortestPaths,
    shortestLength: minLen,
    shortestCount: shortestPaths.length,
  };
}
