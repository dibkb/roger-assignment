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
import { EnrichmentResponse } from "@/lib/zod/api/response";
import { reverseToolMap, toolType } from "@/src/mastra/tools/tool-cost";

interface CostTableProps {
  toolCost: EnrichmentResponse["toolUsage"][];
}

const CostTableTool = ({ toolCost }: CostTableProps) => {
  // Combine all tool usage maps into a single map
  const combinedToolUsage = toolCost.reduce((acc, curr) => {
    Object.entries(curr).forEach(([tool, count]) => {
      acc[tool] = (acc[tool] || 0) + count;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Tool Usage Count</h3>
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(combinedToolUsage).map((tool) => (
              <TableHead key={tool} className="text-right">
                {reverseToolMap[tool as toolType]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {Object.values(combinedToolUsage).map((count, index) => (
              <TableCell key={index} className="text-right">
                {count.toLocaleString()}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CostTableTool;
