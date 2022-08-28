import "dotenv/config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import { createServer } from "./utils/server";

const PORT = process.env.PORT || 8080;


const app = createServer();



app.listen(PORT, async () => {
    logger.info(`App is running on port ${PORT}`);
    await connect();
})