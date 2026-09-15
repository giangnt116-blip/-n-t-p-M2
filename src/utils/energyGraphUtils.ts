export interface EnergyNode {
  id: string;
  label: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
}

export interface EnergyEdge {
  from: string;
  to: string;
  delta: number;
  label?: string;
  type?: "recharge" | "normal";
}

export interface EnergyGraphConfig {
  initialEnergy?: number;
  nodes?: EnergyNode[];
  edges?: EnergyEdge[];
  start?: string;
  target?: string;
  minEnergy?: number;
}

export interface PathStepEvaluation {
  nodeId: string;
  edge?: EnergyEdge;
  energyBefore: number;
  delta: number;
  energyAfter: number;
  valid: boolean;
}

export interface EvaluatedPath {
  path: string[];
  energySteps: number[]; // e.g. [10, 6, 9, 7]
  finalEnergy: number;
  isValid: boolean;
  invalidReason?: string;
}

/**
 * Returns outgoing edges from a given node.
 */
export function getOutgoingEdges(
  edges: EnergyEdge[],
  nodeId: string
): EnergyEdge[] {
  return edges.filter((e) => e.from === nodeId);
}

/**
 * Checks if moving from current node to next node is valid:
 * 1. An edge exists from current to next.
 * 2. Resulting energy >= minEnergy.
 */
export function isMoveValid(
  edges: EnergyEdge[],
  currentNode: string,
  nextNode: string,
  currentEnergy: number,
  minEnergy: number = 0
): { valid: boolean; edge?: EnergyEdge; nextEnergy: number; reason?: string } {
  const edge = edges.find((e) => e.from === currentNode && e.to === nextNode);
  if (!edge) {
    return {
      valid: false,
      nextEnergy: currentEnergy,
      reason: `Không có đường đi từ ${currentNode} đến ${nextNode}.`,
    };
  }

  const nextEnergy = currentEnergy + edge.delta;
  if (nextEnergy < minEnergy) {
    return {
      valid: false,
      edge,
      nextEnergy,
      reason: `Robot không đủ pin để đi đoạn này (${currentEnergy} + (${edge.delta}) = ${nextEnergy} < ${minEnergy}).`,
    };
  }

  return {
    valid: true,
    edge,
    nextEnergy,
  };
}

/**
 * Evaluates a complete path from start to target.
 */
export function evaluatePath(
  path: string[],
  edges: EnergyEdge[],
  initialEnergy: number = 10,
  minEnergy: number = 0
): EvaluatedPath {
  if (path.length === 0) {
    return {
      path: [],
      energySteps: [],
      finalEnergy: initialEnergy,
      isValid: false,
      invalidReason: "Đường đi rỗng.",
    };
  }

  let energy = initialEnergy;
  const energySteps = [energy];

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const edge = edges.find((e) => e.from === from && e.to === to);

    if (!edge) {
      return {
        path,
        energySteps,
        finalEnergy: energy,
        isValid: false,
        invalidReason: `Không tồn tại cạnh từ ${from} đến ${to}.`,
      };
    }

    energy += edge.delta;
    energySteps.push(energy);

    if (energy < minEnergy) {
      return {
        path,
        energySteps,
        finalEnergy: energy,
        isValid: false,
        invalidReason: `Pin rơi xuống dưới ${minEnergy} khi đến ${to} (${energy}).`,
      };
    }
  }

  return {
    path,
    energySteps,
    finalEnergy: energy,
    isValid: true,
  };
}

/**
 * Enumerates all simple paths (no repeated nodes) from start to target.
 */
export function enumerateSimplePaths(
  edges: EnergyEdge[],
  start: string,
  target: string
): string[][] {
  const allPaths: string[][] = [];

  function dfs(current: string, visited: Set<string>, currentPath: string[]) {
    if (current === target) {
      allPaths.push([...currentPath]);
      return;
    }

    const outgoing = edges.filter((e) => e.from === current);
    for (const edge of outgoing) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        currentPath.push(edge.to);
        dfs(edge.to, visited, currentPath);
        currentPath.pop();
        visited.delete(edge.to);
      }
    }
  }

  const visitedSet = new Set<string>([start]);
  dfs(start, visitedSet, [start]);

  return allPaths;
}

/**
 * Finds all evaluated valid paths from start to target.
 */
export function getAllEvaluatedPaths(
  edges: EnergyEdge[],
  start: string,
  target: string,
  initialEnergy: number = 10,
  minEnergy: number = 0
): EvaluatedPath[] {
  const simplePaths = enumerateSimplePaths(edges, start, target);
  return simplePaths.map((p) =>
    evaluatePath(p, edges, initialEnergy, minEnergy)
  );
}
