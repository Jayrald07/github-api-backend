import express from "express";
import logger from "./utilities/logger";
import router from "./routes/route.index";
import environment from "./utilities/environment";
import initializeDatabase from "./utilities/database";
import initializeCache from "./utilities/cache";
import { handleRequestLogging } from "./middlewares/middleware.index";

const server = express();
server.use(express.json())
server.use(handleRequestLogging);
server.use(router);

(async () => {
    try {
        await initializeCache()
        await initializeDatabase();

        server.listen(environment.PORT,() => {
            logger.info(`Server and components has been started. Listening on port ${environment.PORT}`)
        })
    } catch (error: any) {
        logger.error(error.message);
    }
})();
