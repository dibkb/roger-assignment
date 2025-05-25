"use client";
import CsvTable from "@/app/_components/csv-table";
import Loading from "@/app/_components/loading";
import CsvNotFound from "@/app/_components/not-found";
import { Button } from "@/components/ui/button";
import { useCSVStore } from "@/lib/store/csv-store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CSVPage() {
  const params = useParams();
  const csv_id = params.csv_id as string;
  const [isLoading, setIsLoading] = useState(true);
  const csv = useCSVStore((state) => state.getCSV(csv_id));

  useEffect(() => {
    setIsLoading(false);
  }, [csv_id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!csv) {
    return <CsvNotFound />;
  }

  return (
    <main className="flex flex-col mx-auto container">
      <CsvTable data={csv} />
      <Button className="mt-4">Start Enrichment</Button>
    </main>
  );
}
