import { useState, useCallback } from "react";
import { useRowUpdatesStore } from "@/lib/store/row-updates-store";
import { enrichSingle } from "@/lib/enrich-single";
import { CostBreakdown, PersonSchema } from "@/lib/zod/api/response";
import { z } from "zod";
import pLimit from "p-limit";
import { CONCURRENT_REQUESTS } from "@/lib/const";
import { deduplicateRows } from "../de-duplication";

export const useTableOperations = (
  csv_id: string,
  initialData: Record<string, string | null>[]
) => {
  const [tableData, setTableData] = useState<Record<string, string | null>[]>(
    deduplicateRows(initialData).uniqueRows
  );
  const [apiCost, setApiCost] = useState<CostBreakdown[]>([]);
  const [tableDataError, setTableDataError] = useState<string[]>([]);
  const { setRowStatus, canUpdateRow, getRowStatus, initializeTable } =
    useRowUpdatesStore();

  const handleRowUpdate = useCallback(
    async (rowIndex: number) => {
      if (!canUpdateRow(csv_id, rowIndex)) {
        return;
      }

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
          if (response.cost) {
            setApiCost((prev) => [...prev, response.cost]);
          }
          setRowStatus(csv_id, rowIndex, "updated");
        } else {
          if (response.error)
            setTableDataError((prev) => {
              const newError = [...prev];
              newError[rowIndex] = response.error || "Unknown error";
              return newError;
            });
          setRowStatus(csv_id, rowIndex, "error");
        }
      } catch (error) {
        setTableDataError((prev) => {
          const newError = [...prev];
          newError[rowIndex] = error ? String(error) : "Unknown error";
          return newError;
        });
        setRowStatus(csv_id, rowIndex, "error");
      }
    },
    [csv_id, tableData, canUpdateRow, setRowStatus]
  );

  const handleUpdateAll = useCallback(async () => {
    const limit = pLimit(CONCURRENT_REQUESTS || 6);

    const tasks = tableData.map((_, index) => {
      return limit(() => {
        if (canUpdateRow(csv_id, index)) {
          return handleRowUpdate(index);
        }
        return Promise.resolve();
      });
    });

    await Promise.all(tasks);
  }, [csv_id, tableData, canUpdateRow, handleRowUpdate]);

  return {
    tableData,
    apiCost,
    tableDataError,
    handleRowUpdate,
    handleUpdateAll,
    getRowStatus,
    initializeTable,
  };
};
