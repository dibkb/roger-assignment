import { TableCell, TableRow } from "@/components/ui/table";
import { TableRowProps } from "./types";
import { StatusButton } from "./status-button";

export const CsvTableRow = ({
  row,
  headers,
  rowIndex,
  tableId,
  onUpdate,
  getStatus,
  canUpdate,
  error,
}: TableRowProps) => {
  const status = getStatus(tableId, rowIndex);
  const isDisabled = !canUpdate(tableId, rowIndex);
  const hasEmptyValue = Object.values(row).some(
    (value) => value === null || value?.trim() === ""
  );

  const isDonwloadAble = () => {
    const email = row["email"];
    const linkedin = row["linkedin_url"];
    if (
      (email && email.trim() !== "") ||
      (linkedin && linkedin.trim() !== "")
    ) {
      return true;
    }
    return false;
  };

  return (
    <TableRow key={`row-${tableId}-${rowIndex}`}>
      <TableCell>
        <StatusButton
          status={status}
          onClick={() => onUpdate(rowIndex)}
          disabled={isDisabled || !hasEmptyValue}
          error={error}
        />
      </TableCell>
      {headers.map((header) => (
        <TableCell
          key={`${tableId}-${rowIndex}-${header}`}
          className={!isDonwloadAble() ? "text-red-500 bg-red-100" : ""}
        >
          {row[header] ?? ""}
        </TableCell>
      ))}
    </TableRow>
  );
};
