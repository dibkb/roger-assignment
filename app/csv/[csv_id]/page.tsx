"use client";
import CsvTable from "@/app/_components/csv-table";
import { useCSVStore } from "@/lib/store/csv-store";
import { use } from "react";

type PageParams = {
  csv_id: string;
};

export default function CSVPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const csv = useCSVStore((state) => state.getCSV(resolvedParams.csv_id));
  if (csv)
    return (
      <main className="flex flex-col mx-auto container">
        <CsvTable data={csv} />
      </main>
    );
  else return <div>CSV not found</div>;
}
