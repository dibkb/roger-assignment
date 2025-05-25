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

      setRowStatus(csv_id, rowIndex, "updating");

      enrichSingle(rowIndex, tableData)
        .then((response) => {
          if (response.success && response.data) {
            setTableData((prevData) => {
              const newData = [...prevData];

              newData[rowIndex] = response.data as unknown as z.infer<
                typeof PersonSchema
              >;
              return newData;
            });
            setRowStatus(csv_id, rowIndex, "updated");
          } else {
            setRowStatus(csv_id, rowIndex, "not_updated");
          }
        })
        .catch((error) => {
          console.error("Error updating row:", error);
          setRowStatus(csv_id, rowIndex, "not_updated");
        });
    },
    [csv_id, tableData, canUpdateRow, setRowStatus]
  );

  const handleUpdateAll = useCallback(() => {
    if (!csv) return;

    csv.data.forEach((_, index) => {
      if (canUpdateRow(csv_id, index)) {
        handleRowUpdate(index);
      }
    });
  }, [csv, csv_id, canUpdateRow, handleRowUpdate]);

  if (isLoading) {
    return <Loading />;
  }

  if (!csv) {
    return <CsvNotFound />;
  }

  return (
    <main className="container mx-auto p-4">
      <CsvTable
        data={csv}
        tableData={tableData}
        onRowUpdate={handleRowUpdate}
        getRowStatus={getRowStatus}
        updateAll={handleUpdateAll}
      />
    </main>
  );
}
