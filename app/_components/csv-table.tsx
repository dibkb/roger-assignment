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
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

type RowData = Record<string, string | null>;
type RowStatus = "not_updated" | "updating" | "updated";

interface CsvTableProps {
  data: z.infer<typeof uploadResponseSchema>;
  tableData: z.infer<typeof uploadResponseSchema>["data"];
  onRowUpdate: (rowIndex: number) => Promise<void>;
  getRowStatus: (tableId: string, rowIndex: number) => RowStatus;
  updateAll: () => void;
}

interface StatusButtonProps {
  status: RowStatus;
  onClick: () => void;
  disabled: boolean;
}
const StatusButton: React.FC<StatusButtonProps> = ({
  status,
  onClick,
  disabled,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "updating":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "updated":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "updating":
        return "Updating row...";
      case "updated":
        return "Row updated";
      default:
        return "Update row";
    }
  };
  console.log(disabled);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={status === "updating" || disabled}
      className="p-1"
      aria-label={getStatusLabel()}
    >
      {getStatusIcon()}
    </Button>
  );
};

interface TableRowProps {
  row: RowData;
  headers: string[];
  rowIndex: number;
  tableId: string;
  onUpdate: (index: number) => Promise<void>;
  getStatus: (tableId: string, rowIndex: number) => RowStatus;
}

const CsvTableRow = ({
  row,
  headers,
  rowIndex,
  tableId,
  onUpdate,
  getStatus,
}: TableRowProps) => {
  const status = getStatus(tableId, rowIndex);

  const hasEmptyValue = Object.values(row).some(
    (value) => value === null || value?.trim() === ""
  );
  return (
    <TableRow key={`row-${tableId}-${rowIndex}`}>
      <TableCell>
        <StatusButton
          status={status}
          onClick={() => onUpdate(rowIndex)}
          disabled={!hasEmptyValue}
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
  data,
  tableData,
  onRowUpdate,
  getRowStatus,
  updateAll,
}: CsvTableProps) => {
  const headers = useMemo(() => Object.keys(data.data[0]), [data.data]);
  const missing = useMemo(() => missingCount(tableData), [tableData]);

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
              headers={headers}
              rowIndex={index}
              tableId={data.id}
              onUpdate={onRowUpdate}
              getStatus={getRowStatus}
            />
          ))}
        </TableBody>
      </Table>

      <section className="mt-4 flex justify-end">
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
