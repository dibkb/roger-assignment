import axios, { AxiosError } from "axios";
import { z } from "zod";
import { EnrichmentResponse, PersonSchema } from "./zod/api/response";

export const enrichSingle = async (
  index: number,
  tableData: z.infer<typeof PersonSchema>[]
): Promise<EnrichmentResponse> => {
  try {
    const response = await axios.post<EnrichmentResponse>(
      "/api/enrich-single",
      {
        rowIndex: index.toString(),
        data: tableData[index],
      }
    );
    return response.data;
    // const response = await axios.get("/api/error");
    // return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(`API Error: ${errorMessage}`);
    }

    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};
