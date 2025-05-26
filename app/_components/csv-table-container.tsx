import { CostBreakdown } from "@/lib/zod/api/response";
import CsvTable from "./csv-table/csv-table";

type RowUpdateStatus = "not_updated" | "updating" | "updated" | "error";

interface CSVTableContainerProps {
  csv: { id: string; data: Record<string, string | null>[] };
  tableData: Record<string, string | null>[];
  tableDataError: string[];
  onRowUpdate: (index: number) => Promise<void>;
  getRowStatus: (
    tableId: string,
    rowIndex: number
  ) => { status: RowUpdateStatus };
  apiCost: CostBreakdown[];
  updateAll: () => Promise<void>;
  totalInitial: number;
}

export const CSVTableContainer = ({
  csv,
  tableData,
  tableDataError,
  onRowUpdate,
  getRowStatus,
  apiCost,
  updateAll,
  totalInitial,
}: CSVTableContainerProps) => {
  return (
    <main className="container mx-auto p-4">
      <CsvTable
        totalInitial={totalInitial}
        tableDataError={tableDataError}
        data={csv}
        tableData={tableData}
        onRowUpdate={onRowUpdate}
        getRowStatus={getRowStatus}
        apiCost={apiCost}
        updateAll={updateAll}
      />
    </main>
  );
};
