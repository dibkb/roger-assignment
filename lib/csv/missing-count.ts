import z from "zod";
import { uploadResponseSchema } from "../zod/api/csv";
type uploadResponse = z.infer<typeof uploadResponseSchema>;
export const missingCount = (data: uploadResponse["data"]) => {
  const missingCount = data.reduce((acc, row) => {
    return (
      acc +
      Object.values(row).filter((value) => value === null || value === "")
        .length
    );
  }, 0);
  return missingCount;
};
