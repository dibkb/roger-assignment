import React from "react";
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

interface CsvTableProps {
  data: z.infer<typeof uploadResponseSchema>;
}

const CsvTable = ({ data }: CsvTableProps) => {
  const headers = Object.keys(data.data[0]);
  const rows = data.data;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {headers.map((header) => (
              <TableCell key={header}>{row[header]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CsvTable;
