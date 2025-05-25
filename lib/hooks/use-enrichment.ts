import { useState, useCallback } from "react";
import { useCSVStore } from "../store/csv-store";

type EnrichmentStatus = "idle" | "loading" | "success" | "error" | "cancelled";

export const useEnrichment = (csv_id: string) => {
  const [enrichmentStatus, setEnrichmentStatus] =
    useState<EnrichmentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const csv = useCSVStore((state) => state.getCSV(csv_id));

  const startEnrichment = useCallback(async () => {
    if (!csv) {
      setError("No CSV data available");
      setEnrichmentStatus("error");
      return;
    }

    try {
      setEnrichmentStatus("loading");

      const response = await fetch("/api/enrichment", {
        method: "POST",
        body: JSON.stringify(csv),
      });
      const data = await response.json();
      console.log(data);
      setError(null);

      setEnrichmentStatus("success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during enrichment"
      );
      setEnrichmentStatus("error");
    }
  }, [csv]);

  const reset = useCallback(() => {
    setEnrichmentStatus("idle");
    setError(null);
  }, []);

  return {
    enrichmentStatus,
    startEnrichment,
    error,
    reset,
  };
};
