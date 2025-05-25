import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";
export const searchTool = createTool({
  id: "Search",
  inputSchema: z.object({
    query: z.string(),
  }),
  description: `Search the web for information`,
  execute: async ({ context: { query } }) => {
    console.log("searchTool.execute");
    const results = await fetch(
      `https://serpapi.com/search?q=${query}&api_key=${process.env.SERPAPI_API_KEY}`
    );
    const data = await results.json();
    return { results: data.organic_results };
  },
});

export const searchToolLinkedInProfiles = createTool({
  id: "Search",
  inputSchema: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    companyName: z.string().nullable(),
    email: z.string().nullable(),
  }),
  description: `Search the web for information`,
  execute: async ({ context: { firstName, lastName, companyName, email } }) => {
    console.log("searchToolLinkedInProfiles.execute");
    try {
      const results = await axios.get(
        `https://api.scrapin.io/enrichment?apikey=${process.env.SCRAPIN_API_KEY}`,
        {
          params: Object.fromEntries(
            Object.entries({
              firstName,
              lastName,
              companyName,
              email,
            }).filter(([, value]) => value != null)
          ),
        }
      );
      console.log(results.data);
      return { results: results.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: true,
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          results: null,
        };
      }
      return {
        error: true,
        message: "An unexpected error occurred",
        results: null,
      };
    }
  },
});
