export interface MatchingItem {
  id: string;
  label: string;
}

export interface MatchingConfig {
  left?: MatchingItem[];
  right?: MatchingItem[];
  allowed?: Record<string, string[]>;
}

export function isValidPair(
  workerId: string,
  taskId: string,
  allowed: Record<string, string[]>
): boolean {
  const allowedTasks = allowed[workerId] || [];
  return allowedTasks.includes(taskId);
}

export function findAllValidMatchings(
  left: MatchingItem[],
  right: MatchingItem[],
  allowed: Record<string, string[]>
): Record<string, string>[] {
  const results: Record<string, string>[] = [];
  const leftIds = left.map((l) => l.id);

  function backtrack(index: number, currentAssignment: Record<string, string>, usedRight: Set<string>) {
    if (index === leftIds.length) {
      results.push({ ...currentAssignment });
      return;
    }

    const currentWorkerId = leftIds[index];
    const allowedForWorker = allowed[currentWorkerId] || [];

    for (const taskId of allowedForWorker) {
      if (!usedRight.has(taskId)) {
        usedRight.add(taskId);
        currentAssignment[currentWorkerId] = taskId;

        backtrack(index + 1, currentAssignment, usedRight);

        delete currentAssignment[currentWorkerId];
        usedRight.delete(taskId);
      }
    }
  }

  backtrack(0, {}, new Set<string>());
  return results;
}
