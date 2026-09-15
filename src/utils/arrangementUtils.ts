export interface ArrangementRule {
  type: "before" | "notAdjacent" | "adjacent" | "after";
  a: string;
  b: string;
  text: string;
}

export interface ArrangementConfig {
  items?: string[];
  rules?: ArrangementRule[];
}

/**
 * Validates a single rule on a current arrangement order.
 * Items can be partial or complete. If any item is not present in arrangement,
 * evaluation depends on whether it can be checked.
 */
export function evaluateRule(
  rule: ArrangementRule,
  arrangement: (string | null)[]
): { satisfied: boolean; active: boolean; message: string } {
  const indexA = arrangement.indexOf(rule.a);
  const indexB = arrangement.indexOf(rule.b);

  // If both items are placed
  if (indexA !== -1 && indexB !== -1) {
    if (rule.type === "before") {
      const satisfied = indexA < indexB;
      return {
        satisfied,
        active: true,
        message: satisfied
          ? `Thỏa mãn: ${rule.a} đứng trước (bên trái) ${rule.b}`
          : `Vi phạm: ${rule.a} phải đứng bên trái ${rule.b}`,
      };
    }

    if (rule.type === "after") {
      const satisfied = indexA > indexB;
      return {
        satisfied,
        active: true,
        message: satisfied
          ? `Thỏa mãn: ${rule.a} đứng sau ${rule.b}`
          : `Vi phạm: ${rule.a} phải đứng sau ${rule.b}`,
      };
    }

    if (rule.type === "notAdjacent") {
      const distance = Math.abs(indexA - indexB);
      const satisfied = distance > 1;
      return {
        satisfied,
        active: true,
        message: satisfied
          ? `Thỏa mãn: ${rule.a} và ${rule.b} không đứng cạnh nhau`
          : `Vi phạm: ${rule.a} và ${rule.b} đang đứng ngay cạnh nhau`,
      };
    }

    if (rule.type === "adjacent") {
      const distance = Math.abs(indexA - indexB);
      const satisfied = distance === 1;
      return {
        satisfied,
        active: true,
        message: satisfied
          ? `Thỏa mãn: ${rule.a} và ${rule.b} đứng cạnh nhau`
          : `Vi phạm: ${rule.a} và ${rule.b} phải đứng cạnh nhau`,
      };
    }
  }

  return {
    satisfied: true,
    active: false,
    message: "Chưa xếp đủ các vị trí liên quan.",
  };
}

/**
 * Checks all rules for a complete arrangement
 */
export function validateAllRules(
  rules: ArrangementRule[],
  arrangement: string[]
): {
  valid: boolean;
  results: Array<{ rule: ArrangementRule; satisfied: boolean; message: string }>;
} {
  const results = rules.map((rule) => {
    const res = evaluateRule(rule, arrangement);
    return {
      rule,
      satisfied: res.satisfied,
      message: res.message,
    };
  });

  const valid = results.every((r) => r.satisfied);
  return { valid, results };
}

/**
 * Generates all permutations of an array
 */
export function generatePermutations(items: string[]): string[][] {
  const results: string[][] = [];

  function permute(arr: string[], m: string[] = []) {
    if (arr.length === 0) {
      results.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  }

  permute(items);
  return results;
}

/**
 * Finds all valid permutations matching the rules
 */
export function findAllValidArrangements(
  items: string[],
  rules: ArrangementRule[]
): string[][] {
  const allPerms = generatePermutations(items);
  return allPerms.filter((perm) => {
    const { valid } = validateAllRules(rules, perm);
    return valid;
  });
}

/**
 * Analyzes case-by-case breakdown based on the position of a pivot item (e.g. 'C')
 */
export function analyzeByPivotPosition(
  items: string[],
  rules: ArrangementRule[],
  pivot: string = "C"
): Array<{
  position: number; // 1-indexed
  forbiddenSlotsForOthers: Record<string, number[]>; // item -> forbidden slot indices
  validCount: number;
  sampleValid: string[];
}> {
  const totalSlots = items.length;
  const validAll = findAllValidArrangements(items, rules);

  const breakdown: Array<{
    position: number;
    forbiddenSlotsForOthers: Record<string, number[]>;
    validCount: number;
    sampleValid: string[];
  }> = [];

  for (let pos = 1; pos <= totalSlots; pos++) {
    const validForPos = validAll.filter((p) => p[pos - 1] === pivot);

    // Identify forbidden slots adjacent to pivot for forbidden partners
    // Look for notAdjacent rules involving pivot
    const forbiddenPartners = rules
      .filter((r) => r.type === "notAdjacent" && (r.a === pivot || r.b === pivot))
      .map((r) => (r.a === pivot ? r.b : r.a));

    const forbiddenSlots: Record<string, number[]> = {};
    const adjacentSlots: number[] = [];
    if (pos > 1) adjacentSlots.push(pos - 1);
    if (pos < totalSlots) adjacentSlots.push(pos + 1);

    for (const partner of forbiddenPartners) {
      forbiddenSlots[partner] = adjacentSlots;
    }

    breakdown.push({
      position: pos,
      forbiddenSlotsForOthers: forbiddenSlots,
      validCount: validForPos.length,
      sampleValid: validForPos.slice(0, 3).map((p) => p.join(" - ")),
    });
  }

  return breakdown;
}
