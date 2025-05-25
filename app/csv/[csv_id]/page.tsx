"use client";
import CsvTable from "@/app/_components/csv-table";
import Loading from "@/app/_components/loading";
import CsvNotFound from "@/app/_components/not-found";
import { useCSVData } from "@/lib/hooks/use-csv-data";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";
import { uploadResponseSchema } from "@/lib/zod/api/csv";

export default function CSVPage() {
  const params = useParams();
  const csv_id = params.csv_id as string;
  const { csv, isLoading } = useCSVData(csv_id);
  const [tableData, setTableData] = useState<
    z.infer<typeof uploadResponseSchema>["data"]
  >([]);

  useEffect(() => {
    if (csv) {
      setTableData(csv.data);
    }
  }, [csv]);

  if (isLoading) {
    return <Loading />;
  }

  if (!csv) {
    return <CsvNotFound />;
  }

  return (
    <main className="flex flex-col mx-auto container">
      <CsvTable data={csv} tableData={tableData} setTableData={setTableData} />
    </main>
  );
}
