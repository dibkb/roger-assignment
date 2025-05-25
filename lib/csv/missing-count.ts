import z from "zod";
import { uploadResponseSchema } from "../zod/api/csv";

export const missingCount = ({
  data,
}: z.infer<typeof uploadResponseSchema>) => {
  const missingCount = data.reduce((acc, row) => {
    return (
      acc +
      Object.values(row).filter((value) => value === null || value === "")
        .length
    );
  }, 0);
  return missingCount;
};
