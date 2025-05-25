import { useCSVStore } from "@/lib/store/csv-store";
import { useState, useEffect } from "react";

export const useCSVData = (csv_id: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const csv = useCSVStore((state) => state.getCSV(csv_id));

  useEffect(() => {
    setIsLoading(false);
  }, [csv_id]);

  return {
    csv,
    isLoading,
    csv_id,
  };
};
