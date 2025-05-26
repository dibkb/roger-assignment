import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { enrichmentAgent } from "./agents/enrichment";
import { columnName } from "./agents/columnName";
export const mastra = new Mastra({
  agents: { enrichmentAgent, columnName },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
