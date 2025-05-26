"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CostBreakdown } from "@/lib/calculate-cost";

interface CostTableProps {
  apiCost: CostBreakdown[];
}

const CostTable = ({ apiCost }: CostTableProps) => {
  // Calculate totals
  const totals = apiCost.reduce(
    (acc, cost) => ({
      promptTokens: acc.promptTokens + cost.promptTokens,
      completionTokens: acc.completionTokens + cost.completionTokens,
      promptCost: acc.promptCost + cost.promptCost,
      completionCost: acc.completionCost + cost.completionCost,
      totalCost: acc.totalCost + cost.totalCost,
    }),
    {
      promptTokens: 0,
      completionTokens: 0,
      promptCost: 0,
      completionCost: 0,
      totalCost: 0,
    }
  );

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">API Cost Breakdown</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
            <TableHead className="text-right">Cost ($)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Prompt</TableCell>
            <TableCell className="text-right">
              {totals.promptTokens.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              ${totals.promptCost.toFixed(6)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Completion</TableCell>
            <TableCell className="text-right">
              {totals.completionTokens.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              ${totals.completionCost.toFixed(6)}
            </TableCell>
          </TableRow>
          <TableRow className="font-semibold">
            <TableCell>Total</TableCell>
            <TableCell className="text-right">
              {(totals.promptTokens + totals.completionTokens).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              ${totals.totalCost.toFixed(6)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CostTable;
