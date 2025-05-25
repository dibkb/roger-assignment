import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { enrichmentAgent } from "./agents/enrichment";

export const mastra = new Mastra({
  agents: { enrichmentAgent },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
