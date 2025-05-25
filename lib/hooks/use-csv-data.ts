import { useCSVStore } from "@/lib/store/csv-store";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export const useCSVData = () => {
  const params = useParams();
  const csv_id = params.csv_id as string;
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
