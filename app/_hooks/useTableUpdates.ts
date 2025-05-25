import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { EnrichmentStatus } from "@/lib/types";

interface TableUpdate {
  tableId: string;
  rowId: string;
  data: string;
}

export const useTableUpdates = (
  initialData: z.infer<typeof uploadResponseSchema>,
  enrichmentStatus: EnrichmentStatus,
  setEnrichmentStatus: (status: EnrichmentStatus) => void
) => {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (enrichmentStatus === "success") return;
    if (enrichmentStatus === "error") return;
    if (enrichmentStatus === "cancelled") return;

    if (enrichmentStatus === "loading") {
      let isMounted = true;
      const POLLING_INTERVAL = 2000;

      const pollUpdates = async () => {
        if (!isMounted) return;
        try {
          const response = await axios.get(
            `/api/table-updates/${initialData.id}`
          );
          const updates = response.data.updates as TableUpdate[];

          if (updates.length > 0) {
            setEnrichmentStatus("success");
          }
        } catch (err) {
          console.error("Error polling updates:", err);
          setError("Failed to fetch updates");
          setEnrichmentStatus("error");
        }
      };

      const interval = setInterval(pollUpdates, POLLING_INTERVAL);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [mounted, enrichmentStatus, initialData.id, setEnrichmentStatus]);

  return {
    error,
    mounted,
  };
};
