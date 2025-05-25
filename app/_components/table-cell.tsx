import { TableCell as UITableCell } from "@/components/ui/table";

interface TableCellProps {
  value: string | null;
  rowIndex: number;
  header: string;
  dataId: string;
}

export const CustomTableCell = ({
  value,
  rowIndex,
  header,
  dataId,
}: TableCellProps) => {
  return (
    <UITableCell key={`${dataId}-${rowIndex}-${header}`}>
      {value ?? ""}
    </UITableCell>
  );
};
