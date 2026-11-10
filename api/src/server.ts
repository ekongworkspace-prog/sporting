import { connectDatabase,  } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./core/logger.js";

await connectDatabase();

const { createApp } = await import("./app.js");
const app = createApp();
const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Football API listening");
});

async function shutdown(): Promise<void> {
  server.close();
  // await disconnectDatabase();
  process.exit(0);
}


process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
