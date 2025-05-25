import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { CustomTableCell } from "./table-cell";

interface TableRowProps {
  row: Record<string, string | null>;
  headers: string[];
  rowIndex: number;
  dataId: string;
  onUpdate: (index: number) => void;
}

export const CustomTableRow = ({
  row,
  headers,
  rowIndex,
  dataId,
  onUpdate,
}: TableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdate(rowIndex)}
          className="p-1"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </TableCell>
      {headers.map((header) => (
        <CustomTableCell
          key={`${dataId}-${rowIndex}-${header}`}
          value={row[header]}
          rowIndex={rowIndex}
          header={header}
          dataId={dataId}
        />
      ))}
    </TableRow>
  );
};
