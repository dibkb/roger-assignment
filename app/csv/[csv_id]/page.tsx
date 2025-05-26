"use client";

import { useCSVData } from "@/lib/hooks/use-csv-data";
import { use, useEffect } from "react";
import Loading from "@/app/_components/loading";
import CsvNotFound from "@/app/_components/not-found";
import { useTableOperations } from "@/lib/hooks/use-table-operations";
import { CSVTableContainer } from "@/app/_components/csv-table-container";

export default function CSVPage({
  params,
}: {
  params: Promise<{ csv_id: string }>;
}) {
  const { csv_id } = use(params);
  const { csv, isLoading } = useCSVData(csv_id);
  const {
    tableData,
    apiCost,
    tableDataError,
    handleRowUpdate,
    handleUpdateAll,
    getRowStatus,
    initializeTable,
  } = useTableOperations(csv_id, csv?.data || []);

  useEffect(() => {
    if (csv) {
      initializeTable(csv_id, csv.data.length);
    }
  }, [csv, csv_id, initializeTable]);

  if (isLoading) {
    return <Loading />;
  }

  if (!csv) {
    return <CsvNotFound />;
  }
  const initialTotal = csv.data.reduce((count, row) => {
    const hasEmptyValue = Object.values(row).some(
      (value) => value === null || value?.trim() === ""
    );
    return hasEmptyValue ? count + 1 : count;
  }, 0);

  return (
    <CSVTableContainer
      csv={csv}
      tableData={tableData}
      tableDataError={tableDataError}
      onRowUpdate={handleRowUpdate}
      getRowStatus={(tableId, rowIndex) => ({
        status: getRowStatus(tableId, rowIndex),
      })}
      apiCost={apiCost}
      updateAll={handleUpdateAll}
      totalInitial={initialTotal}
    />
  );
}
