import { useState, useCallback } from "react";

type EnrichmentStatus = "idle" | "loading" | "success" | "error" | "cancelled";

export const useEnrichment = () => {
  const [enrichmentStatus, setEnrichmentStatus] =
    useState<EnrichmentStatus>("idle");

  const startEnrichment = useCallback(() => {
    setEnrichmentStatus("loading");
  }, []);

  return {
    enrichmentStatus,
    startEnrichment,
  };
};
