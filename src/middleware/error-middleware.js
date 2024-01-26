import { logger } from "../application/logging.js";
import { ResponseError } from "../error/ResponseError.js";

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  logger.error(err.message);

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};

export { errorMiddleware };
