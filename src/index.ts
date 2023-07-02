import express from "express";
import logger from "./utilities/logger";
import router from "./routes/route.index";
import sequelize from "./utilities/database";
import client from "./utilities/cache";
import environment from "./utilities/environment";

const server = express();
server.use(express.json())
server.use(router);

(async () => {
    try {
        logger.info(`Connecting to redis server at ${environment.REDIS_URI}`);
        await client.connect();

        logger.info(`Connecting to database at ${environment.DB_URI}`);
        await sequelize.authenticate();
        await sequelize.sync();

        server.listen(environment.PORT,() => {
            logger.info(`Server and components has been started. Listening on port ${environment.PORT}`)
        })
    } catch (error: any) {
        logger.error(error.message);
    }
})();
