"use client";
import CsvTable from "@/app/_components/csv-table";
import Loading from "@/app/_components/loading";
import CsvNotFound from "@/app/_components/not-found";
import { useCSVData } from "@/lib/hooks/use-csv-data";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { enrichSingle } from "@/lib/enrich-single";
import { useRowUpdatesStore } from "@/lib/store/row-updates-store";

export default function CSVPage() {
  const params = useParams();
  const csv_id = params.csv_id as string;
  const { csv, isLoading } = useCSVData(csv_id);
  const [tableData, setTableData] = useState<
    z.infer<typeof uploadResponseSchema>["data"]
  >([]);
  const { setRowStatus, getRowStatus, initializeTable, canUpdate } =
    useRowUpdatesStore();

  useEffect(() => {
    if (csv) {
      setTableData(csv.data);
      initializeTable(csv_id, csv.data.length);
    }
  }, [csv, csv_id, initializeTable]);

  const handleRowUpdate = async (rowIndex: number) => {
    if (!canUpdate()) {
      return;
    }

    setRowStatus(csv_id, rowIndex, "updating");
    try {
      const response = await enrichSingle(rowIndex, tableData);
      if (response.success && response.data) {
        const newData = [...tableData];
        newData[rowIndex] = response.data;
        setTableData(newData);
        setRowStatus(csv_id, rowIndex, "updated");
      } else {
        setRowStatus(csv_id, rowIndex, "not_updated");
      }
    } catch (error) {
      console.error("Error updating row:", error);
      setRowStatus(csv_id, rowIndex, "not_updated");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!csv) {
    return <CsvNotFound />;
  }

  return (
    <main className="flex flex-col mx-auto container">
      <CsvTable
        data={csv}
        tableData={tableData}
        onRowUpdate={handleRowUpdate}
        getRowStatus={getRowStatus}
      />
    </main>
  );
}
