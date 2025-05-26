"use client";

import { useRowUpdatesStore } from "@/lib/store/row-updates-store";
import { useCSVData } from "@/lib/hooks/use-csv-data";
import { useState, useEffect, use, useCallback } from "react";
import CsvTable from "@/app/_components/csv-table";
import Loading from "@/app/_components/loading";
import CsvNotFound from "@/app/_components/not-found";
import { enrichSingle } from "@/lib/enrich-single";
import { PersonSchema } from "@/lib/zod/api/response";
import { z } from "zod";
import pLimit from "p-limit";
import { CONCURRENT_REQUESTS } from "@/lib/const";
export default function CSVPage({
  params,
}: {
  params: Promise<{ csv_id: string }>;
}) {
  const { csv_id } = use(params);
  const { csv, isLoading } = useCSVData(csv_id);
  const [tableData, setTableData] = useState<Record<string, string | null>[]>(
    []
  );
  const [tableDataError, setTableDataError] = useState<
    Record<string, string | null>[]
  >([]);
  const { setRowStatus, canUpdateRow, getRowStatus, initializeTable } =
    useRowUpdatesStore();

  useEffect(() => {
    if (csv) {
      setTableData(csv.data);
      initializeTable(csv_id, csv.data.length);
    }
  }, [csv, csv_id, initializeTable]);

  const handleRowUpdate = useCallback(
    async (rowIndex: number) => {
      if (!canUpdateRow(csv_id, rowIndex)) {
        return;
      }

      // Check if at least one value is null or empty
      const row = tableData[rowIndex];
      const hasEmptyValue = Object.values(row).some(
        (value) => value === null || value?.trim() === ""
      );

      if (!hasEmptyValue) {
        return;
      }

      setRowStatus(csv_id, rowIndex, "updating");

      try {
        const response = await enrichSingle(rowIndex, tableData);
        if (response?.success && response?.data) {
          setTableData((prevData) => {
            const newData = [...prevData];
            newData[rowIndex] = response.data as z.infer<typeof PersonSchema>;
            return newData;
          });
          setRowStatus(csv_id, rowIndex, "updated");
        } else {
          if (response.error)
            setTableDataError((prev) => {
              const newError = [...prev];
              newError[rowIndex] = { error: response.error || "Unknown error" };
              return newError;
            });
          setRowStatus(csv_id, rowIndex, "not_updated");
        }
      } catch (error) {
        setTableDataError((prev) => {
          const newError = [...prev];
          newError[rowIndex] = { error: error as string };
          return newError;
        });
        setRowStatus(csv_id, rowIndex, "not_updated");
      }
    },
    [csv_id, tableData, canUpdateRow, setRowStatus]
  );

  const handleUpdateAll = useCallback(async () => {
    if (!csv) return;

    const limit = pLimit(CONCURRENT_REQUESTS || 6);

    const tasks = csv.data.map((_, index) => {
      return limit(() => {
        if (canUpdateRow(csv_id, index)) {
          return handleRowUpdate(index);
        }
        return Promise.resolve();
      });
    });

    await Promise.all(tasks);
  }, [csv, csv_id, canUpdateRow, handleRowUpdate]);

  if (isLoading) {
    return <Loading />;
  }

  if (!csv) {
    return <CsvNotFound />;
  }
  const totalInitial = csv.data.reduce((count, row) => {
    const hasEmptyValue = Object.values(row).some(
      (value) => value === null || value?.trim() === ""
    );
    return hasEmptyValue ? count + 1 : count;
  }, 0);
  return (
    <main className="container mx-auto p-4">
      <CsvTable
        totalInitial={totalInitial}
        data={csv}
        tableData={tableData}
        onRowUpdate={handleRowUpdate}
        getRowStatus={(tableId, rowIndex) => {
          const status = getRowStatus(tableId, rowIndex);
          return { status };
        }}
        updateAll={handleUpdateAll}
      />
    </main>
  );
}
