"use client";
import CsvTable from "@/app/_components/csv-table";
import Loading from "@/app/_components/loading";
import CsvNotFound from "@/app/_components/not-found";

import { useCSVData } from "@/lib/hooks/use-csv-data";
import { useParams } from "next/navigation";

export default function CSVPage() {
  const params = useParams();
  const csv_id = params.csv_id as string;
  const { csv, isLoading } = useCSVData(csv_id);

  if (isLoading) {
    return <Loading />;
  }

  if (!csv) {
    return <CsvNotFound />;
  }

  return (
    <main className="flex flex-col mx-auto container">
      <CsvTable data={csv} />
    </main>
  );
}
