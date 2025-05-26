"use client";
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { missingCount } from "@/lib/csv/missing-count";
import { Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useRowUpdatesStore } from "@/lib/store/row-updates-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RowData = Record<string, string | null>;
type RowStatus = "not_updated" | "updating" | "updated" | "error";

interface RowStatusInfo {
  status: RowStatus;
  error?: string;
}

interface CsvTableProps {
  tableDataError: string[];
  totalInitial: number;
  data: z.infer<typeof uploadResponseSchema>;
  tableData: z.infer<typeof uploadResponseSchema>["data"];
  onRowUpdate: (rowIndex: number) => Promise<void>;
  getRowStatus: (tableId: string, rowIndex: number) => RowStatusInfo;
  updateAll: () => void;
}

interface StatusButtonProps {
  status: RowStatusInfo;
  onClick: () => void;
  disabled?: boolean;
  error?: string;
}

const StatusButton = ({
  status,
  onClick,
  disabled,
  error,
}: StatusButtonProps) => {
  const getStatusIcon = () => {
    if (disabled) {
      return <RefreshCw className="w-4 h-4 text-gray-400" />;
    }

    switch (status.status) {
      case "updating":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "updated":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getStatusLabel = () => {
    if (disabled) {
      return "No empty values to update";
    }

    switch (status.status) {
      case "updating":
        return "Updating row...";
      case "updated":
        return "Row updated";
      case "error":
        return status.error || "Error updating row";
      default:
        return "Update row";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={status.status === "updating" || disabled}
        className={`p-1 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={getStatusLabel()}
      >
        {getStatusIcon()}
      </Button>
      {status.status === "error" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

interface TableRowProps {
  row: RowData;
  headers: string[];
  rowIndex: number;
  tableId: string;
  onUpdate: (index: number) => Promise<void>;
  getStatus: (tableId: string, rowIndex: number) => RowStatusInfo;
  canUpdate: (tableId: string, rowIndex: number) => boolean;
  error?: string;
}

const CsvTableRow = ({
  row,
  headers,
  rowIndex,
  tableId,
  onUpdate,
  getStatus,
  canUpdate,
  error,
}: TableRowProps) => {
  const status = getStatus(tableId, rowIndex);
  const isDisabled = !canUpdate(tableId, rowIndex);
  const hasEmptyValue = Object.values(row).some(
    (value) => value === null || value?.trim() === ""
  );
  return (
    <TableRow key={`row-${tableId}-${rowIndex}`}>
      <TableCell>
        <StatusButton
          status={status}
          onClick={() => onUpdate(rowIndex)}
          disabled={isDisabled || !hasEmptyValue}
          error={error}
        />
      </TableCell>
      {headers.map((header) => (
        <TableCell key={`${tableId}-${rowIndex}-${header}`}>
          {row[header] ?? ""}
        </TableCell>
      ))}
    </TableRow>
  );
};

const CsvTable = ({
  tableDataError,
  data,
  tableData,
  onRowUpdate,
  getRowStatus,
  updateAll,
  totalInitial,
}: CsvTableProps) => {
  const headers = useMemo(() => Object.keys(data.data[0]), [data.data]);
  const missing = useMemo(() => missingCount(tableData), [tableData]);
  const { canUpdateRow } = useRowUpdatesStore();

  // Calculate progress
  const progress = useMemo(() => {
    const completed = tableData.reduce((count, _, index) => {
      const status = getRowStatus(data.id, index);
      return status.status === "updated" ? count + 1 : count;
    }, 0);
    return { completed, total: totalInitial };
  }, [tableData, data.id, getRowStatus, totalInitial]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Actions</TableHead>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <CsvTableRow
              key={`row-${data.id}-${index}`}
              row={row}
              error={tableDataError[index]}
              headers={headers}
              rowIndex={index}
              tableId={data.id}
              onUpdate={onRowUpdate}
              getStatus={getRowStatus}
              canUpdate={canUpdateRow}
            />
          ))}
        </TableBody>
      </Table>

      <section className="mt-4 flex justify-end items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            Progress: {progress.completed}/{progress.total}
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${(progress.completed / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="mr-2 border flex px-4 items-center rounded-md">
          {missing} missing values
        </div>

        <Button onClick={updateAll} aria-label="Update all rows">
          Update All
        </Button>
      </section>
    </>
  );
};

export default CsvTable;
