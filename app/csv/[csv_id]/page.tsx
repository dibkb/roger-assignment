"use client";

import { useRowUpdatesStore } from "@/lib/store/row-updates-store";
import { useCSVData } from "@/lib/hooks/use-csv-data";
import { useState, useEffect, use } from "react";
import CsvTable from "@/app/_components/csv-table";
import Loading from "@/app/_components/loading";
import CsvNotFound from "@/app/_components/not-found";
import { enrichSingle } from "@/lib/enrich-single";

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

  const handleRowUpdate = async (rowIndex: number) => {
    // Only proceed if the row hasn't been updated yet
    if (!canUpdateRow(csv_id, rowIndex)) {
      return;
    }

    setRowStatus(csv_id, rowIndex, "updating");

    // Fire and forget - don't await the update
    enrichSingle(rowIndex, tableData)
      .then((response) => {
        if (response.success && response.data) {
          setTableData((prevData) => {
            const newData = [...prevData];
            // Ensure the data is properly typed
            newData[rowIndex] = response.data as Record<string, string | null>;
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
  };

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
      />
    </main>
  );
}
