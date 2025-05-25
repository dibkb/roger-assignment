"use client";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { z } from "zod";
import { useTableUpdates } from "@/app/_hooks/useTableUpdates";
import { Button } from "@/components/ui/button";
import { useEnrichment } from "@/lib/hooks/use-enrichment";
import { missingCount } from "@/lib/csv/missing-count";
import { Loader2, PlayIcon, RefreshCw } from "lucide-react";
import { EnrichmentStatus } from "@/lib/types";
import { enrichSingle } from "@/lib/enrich-single";

interface CsvTableProps {
  data: z.infer<typeof uploadResponseSchema>;
  tableData: z.infer<typeof uploadResponseSchema>["data"];
  setTableData: React.Dispatch<
    React.SetStateAction<z.infer<typeof uploadResponseSchema>["data"]>
  >;
}

const CsvTable = ({ data, tableData, setTableData }: CsvTableProps) => {
  const [enrichmentStatus, setEnrichmentStatus] =
    useState<EnrichmentStatus>("idle");
  const {
    startEnrichment,
    error: enrichmentError,
    mounted: enrichmentMounted,
  } = useEnrichment(data.id, enrichmentStatus, setEnrichmentStatus);

  const { error: tableError, mounted: tableMounted } = useTableUpdates(
    data,
    enrichmentStatus,
    setEnrichmentStatus
  );

  const headers = Object.keys(data.data[0]);
  const missing = useMemo(() => {
    return missingCount(tableData);
  }, [tableData]);

  if (!tableMounted || !enrichmentMounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (tableError || enrichmentError) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-md">
        Error: {tableError || enrichmentError}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Actions</TableHead>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={`row-${data.id}-${index}`}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    enrichSingle(index, tableData).then((response) => {
                      if (response.success && response.data) {
                        const newData = [...tableData];
                        newData[index] = response.data;
                        setTableData(newData);
                      }
                    });
                  }}
                  className="p-1"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </TableCell>
              {headers.map((header) => (
                <TableCell key={`${data.id}-${index}-${header}`}>
                  {row[header] ?? ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <section className="mt-4 flex justify-end">
        <div className="mr-2 border flex px-4 items-center rounded-md">
          {missing} missing values
        </div>

        <Button
          disabled={enrichmentStatus === "loading"}
          onClick={startEnrichment}
        >
          {enrichmentStatus === "loading" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PlayIcon className="w-4 h-4 mr-2" />
          )}
          {enrichmentStatus === "loading"
            ? "Enriching..."
            : enrichmentStatus === "success"
            ? "Enrichment Complete"
            : "Start Enrichment"}
        </Button>
      </section>
    </>
  );
};

export default CsvTable;
