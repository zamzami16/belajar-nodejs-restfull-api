import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

const port = 300;

web.listen(port, () => {
  logger.info(`App start at port ${port}.`);
});
