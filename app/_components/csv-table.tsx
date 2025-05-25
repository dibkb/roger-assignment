"use client";
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { tableUpdates } from "@/lib/tableUpdates";

interface CsvTableProps {
  data: z.infer<typeof uploadResponseSchema>;
}

interface TableUpdate {
  tableId: string;
  rowId: string;
  data: string; // JSON string containing the update data
}

const CsvTable = ({ data }: CsvTableProps) => {
  const [tableData, setTableData] = useState(data.data);
  const headers = Object.keys(data.data[0]);

  useEffect(() => {
    const pollUpdates = async () => {
      try {
        const response = await axios.get(`/api/updates?tableId=${data.id}`);
        const updates = response.data as TableUpdate[];
        const rowIds: string[] = [];
        if (updates && updates.length > 0) {
          updates.forEach((update) => {
            const { tableId, rowId, data: updateData } = update;
            if (tableId === data.id) {
              const rowIndex = tableData.findIndex(
                (_, idx) => idx === parseInt(rowId)
              );
              if (rowIndex !== -1) {
                setTableData((prevData) => {
                  const newData = [...prevData];
                  newData[rowIndex] = {
                    ...newData[rowIndex],
                    ...JSON.parse(updateData),
                  };
                  return newData;
                });
                rowIds.push(rowId);
              }
            }
          });

          tableUpdates.markRead(data.id, rowIds);
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    // Poll every 2 seconds
    const intervalId = setInterval(pollUpdates, 2000);

    // Initial poll
    pollUpdates();

    return () => clearInterval(intervalId);
  }, [data.id]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, id) => (
            <TableRow key={Object.values(row).join(",") + id}>
              {headers.map((header) => (
                <TableCell key={header}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CsvTable;
