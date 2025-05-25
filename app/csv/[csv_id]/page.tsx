"use client";
import CsvTable from "@/app/_components/csv-table";
import Loading from "@/app/_components/loading";
import CsvNotFound from "@/app/_components/not-found";
import { Button } from "@/components/ui/button";
import { missingCount } from "@/lib/csv/missing-count";
import { useCSVData } from "@/lib/hooks/use-csv-data";
import { useEnrichment } from "@/lib/hooks/use-enrichment";
import { Loader2, PlayIcon } from "lucide-react";

export default function CSVPage() {
  const { csv, isLoading } = useCSVData();
  const { enrichmentStatus, startEnrichment } = useEnrichment();

  if (isLoading) {
    return <Loading />;
  }

  if (!csv) {
    return <CsvNotFound />;
  }

  const missing = missingCount(csv);

  return (
    <main className="flex flex-col mx-auto container">
      <CsvTable data={csv} />
      <section className="mt-4 flex justify-end">
        <div className="mr-2 border flex px-4 items-center rounded-md">
          {missing} missing values
        </div>

        <Button
          disabled={enrichmentStatus !== "idle"}
          onClick={startEnrichment}
        >
          {enrichmentStatus === "loading" ? (
            <Loader2 className="w-4 h-4 mr-2" />
          ) : (
            <PlayIcon className="w-4 h-4 mr-2" />
          )}
          {enrichmentStatus === "loading" ? "Enriching..." : "Start Enrichment"}
        </Button>
      </section>
    </main>
  );
}
