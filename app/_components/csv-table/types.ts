import { z } from "zod";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { CostBreakdown } from "@/lib/calculate-cost";

export type RowData = Record<string, string | null>;
export type RowStatus = "not_updated" | "updating" | "updated" | "error";

export interface RowStatusInfo {
  status: RowStatus;
  error?: string;
}

export interface CsvTableProps {
  apiCost: CostBreakdown[];
  tableDataError: string[];
  totalInitial: number;
  data: z.infer<typeof uploadResponseSchema>;
  tableData: z.infer<typeof uploadResponseSchema>["data"];
  onRowUpdate: (rowIndex: number) => Promise<void>;
  getRowStatus: (tableId: string, rowIndex: number) => RowStatusInfo;
  updateAll: () => void;
}

export interface StatusButtonProps {
  status: RowStatusInfo;
  onClick: () => void;
  disabled?: boolean;
  error?: string;
}

export interface TableRowProps {
  row: RowData;
  headers: string[];
  rowIndex: number;
  tableId: string;
  onUpdate: (index: number) => Promise<void>;
  getStatus: (tableId: string, rowIndex: number) => RowStatusInfo;
  canUpdate: (tableId: string, rowIndex: number) => boolean;
  error?: string;
}
