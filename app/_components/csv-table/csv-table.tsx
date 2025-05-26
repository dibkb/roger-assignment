"use client";
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { missingCount } from "@/lib/csv/missing-count";
import { useRowUpdatesStore } from "@/lib/store/row-updates-store";
import { CsvTableProps } from "./types";
import { CsvTableRow } from "./csv-table-row";
import CostTable from "./cost-table";
import CostTableTool from "./tool-cost-table";

const CsvTable = ({
  tableDataError,
  data,
  tableData,
  onRowUpdate,
  getRowStatus,
  updateAll,
  totalInitial,
  apiCost,
  toolCost,
}: CsvTableProps) => {
  const headers = useMemo(() => Object.keys(data.data[0]), [data.data]);
  const missing = useMemo(() => missingCount(tableData), [tableData]);
  const { canUpdateRow } = useRowUpdatesStore();

  const handleDownloadCSV = () => {
    // Filter rows that have either email or LinkedIn URL
    const filteredData = tableData.filter((row) => {
      const email = row["email"];
      const linkedin = row["linkedin_url"];
      return (
        (email && email.trim() !== "") || (linkedin && linkedin.trim() !== "")
      );
    });

    // Convert headers and data to CSV format
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Handle values that might contain commas or quotes
            if (value === null || value === undefined) return "";
            const stringValue = String(value);
            return stringValue.includes(",") ? `"${stringValue}"` : stringValue;
          })
          .join(",")
      ),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `table-data-${data.id}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate progress
  const progress = useMemo(() => {
    const completed = tableData.reduce((count, _, index) => {
      const status = getRowStatus(data.id, index);
      return status.status === "updated" ? count + 1 : count;
    }, 0);
    return { completed, total: totalInitial };
  }, [tableData, data.id, getRowStatus, totalInitial]);

  const totalRemaining = tableData.reduce((count, row) => {
    const hasEmptyValue = Object.values(row).some(
      (value) => value === null || value?.trim() === ""
    );
    return hasEmptyValue ? count + 1 : count;
  }, 0);

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
        <div className="mr-2 border flex px-4 py-2 items-center rounded-md">
          {missing} missing values
        </div>

        <Button
          onClick={updateAll}
          aria-label="Update all rows"
          disabled={totalRemaining === 0}
        >
          Update All
        </Button>
        <Button
          onClick={handleDownloadCSV}
          aria-label="Download CSV"
          variant="outline"
        >
          Download CSV
        </Button>
      </section>
      <CostTable apiCost={apiCost} />
      <CostTableTool toolCost={toolCost} />
    </>
  );
};

export default CsvTable;
