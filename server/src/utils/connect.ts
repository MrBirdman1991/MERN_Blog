import mongoose from "mongoose";
import logger from "./logger"

function connect() {
  return mongoose
    .connect(process.env.DB_URI as string)
    .then(() => {
      logger.info(`DB running on: ${process.env.DB_URI}`)
    })
    .catch((err) => {
      logger.error(err.message)
      process.exit(1);
    });
}

export default connect;