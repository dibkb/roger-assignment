import { useState, useCallback, useEffect } from "react";
import { useCSVStore } from "../store/csv-store";
import { EnrichmentStatus } from "../types";

export const useEnrichment = (
  csv_id: string,
  enrichmentStatus: EnrichmentStatus,
  setEnrichmentStatus: (status: EnrichmentStatus) => void
) => {
  const [mounted, setMounted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const csv = useCSVStore((state) => state.getCSV(csv_id));

  useEffect(() => {
    setMounted(true);
  }, []);

  const startEnrichment = useCallback(async () => {
    if (!mounted) return;
    if (!csv) {
      setError("No CSV data available");
      setEnrichmentStatus("error");
      return;
    }

    try {
      const response = await fetch("/api/enrichment", {
        method: "POST",
        body: JSON.stringify(csv),
      });
      const data = await response.json();
      console.log(data);
      setError(null);

      setEnrichmentStatus("loading");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during enrichment"
      );
      setEnrichmentStatus("error");
    }
  }, [csv, mounted, setEnrichmentStatus]);

  const reset = useCallback(() => {
    if (!mounted) return;
    setEnrichmentStatus("idle");
    setError(null);
  }, [mounted, setEnrichmentStatus]);

  return {
    enrichmentStatus,
    startEnrichment,
    error,
    reset,
    mounted,
  };
};
