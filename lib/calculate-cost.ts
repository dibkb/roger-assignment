type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
};

export interface CostBreakdown extends TokenUsage {
  promptCost: number;
  completionCost: number;
  totalCost: number;
}

export function calculateApiCallCost(usage: TokenUsage): CostBreakdown {
  const promptRatePerThousand = 0.00015;
  const completionRatePerThousand = 0.0006;

  const promptCost = (usage.promptTokens / 1000) * promptRatePerThousand;
  const completionCost =
    (usage.completionTokens / 1000) * completionRatePerThousand;
  const totalCost = promptCost + completionCost;

  return {
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    promptCost: parseFloat(promptCost.toFixed(6)),
    completionCost: parseFloat(completionCost.toFixed(6)),
    totalCost: parseFloat(totalCost.toFixed(6)),
  };
}

// Example usage:
// const usage = {
//   promptTokens: 8797,
//   completionTokens: 191,
// };

// const cost = calculateApiCallCost(usage);
