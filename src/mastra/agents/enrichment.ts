import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { searchTool, searchToolLinkedInProfiles } from "../tools/search";

export const enrichmentAgent = new Agent({
  name: "Enrichment Agent",
  instructions: `
  Fill in the missing fields using the provided tools. Prefer LinkedIn data when available. 
  Return a JSON object with all fields, using 'N/A' for any data that cannot be found.
  Once you have all the information, output the JSON object as your final answer.
 
  `,
  model: openai("gpt-4o-mini"),
  tools: {
    search: searchTool,
    searchLinkedInProfiles: searchToolLinkedInProfiles,
  },
});
