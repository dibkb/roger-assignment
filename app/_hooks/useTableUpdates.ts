import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { EnrichmentStatus } from "@/lib/types";

interface TableUpdate {
  tableId: string;
  rowId: string;
  data: string;
}

export const useTableUpdates = (
  initialData: z.infer<typeof uploadResponseSchema>,
  enrichmentStatus: EnrichmentStatus,
  setEnrichmentStatus: (status: EnrichmentStatus) => void
) => {
  const [mounted, setMounted] = useState(false);
  const [tableData, setTableData] = useState<typeof initialData.data>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setTableData(initialData.data);
    setMounted(true);
  }, [initialData.data]);

  useEffect(() => {
    if (!mounted) return;
    if (enrichmentStatus === "success") return;
    if (enrichmentStatus === "error") return;
    if (enrichmentStatus === "cancelled") return;

    if (enrichmentStatus === "loading") {
      let isMounted = true;
      const POLLING_INTERVAL = 2000;

      const pollUpdates = async () => {
        if (!isMounted) return;

        try {
          setError(null);
          const response = await axios.get(
            `/api/updates?tableId=${initialData.id}`
          );
          const updates = response.data as TableUpdate[];
          const rowIds: string[] = [];

          if (updates?.length > 0) {
            updates.forEach((update) => {
              const { tableId, rowId, data: updateData } = update;
              if (tableId === initialData.id) {
                const rowIndex = tableData.findIndex(
                  (_, idx) => idx === parseInt(rowId)
                );
                if (rowIndex !== -1) {
                  setTableData((prevData) => {
                    const newData = [...prevData];
                    try {
                      const parsedData = JSON.parse(updateData);
                      newData[rowIndex] = {
                        ...newData[rowIndex],
                        ...parsedData,
                      };
                    } catch (e) {
                      console.error("Failed to parse update data:", e);
                    }
                    return newData;
                  });
                  rowIds.push(rowId);
                }
              }
            });

            if (rowIds.length > 0) {
              axios.post("/api/mark", {
                tableId: initialData.id,
                rowIds: rowIds,
              });
            }
          } else {
            const response = await axios.get(
              `/api/update-complete?tableId=${initialData.id}`
            );
            const isCompleted = response.data.isCompleted;
            console.log("isCompleted", isCompleted);
            if (isCompleted) {
              setEnrichmentStatus("success");
            }
          }
        } catch (error) {
          if (isMounted) {
            setError(
              error instanceof Error ? error.message : "Failed to fetch updates"
            );
            console.error("Error fetching updates:", error);
          }
        } finally {
          if (isMounted) {
          }
        }
      };

      const intervalId = setInterval(pollUpdates, POLLING_INTERVAL);
      pollUpdates();

      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }
  }, [
    initialData.id,
    tableData,
    mounted,
    enrichmentStatus,
    setEnrichmentStatus,
  ]);

  return {
    tableData,
    error,
    mounted,
  };
};
