import express from "express";
import logger from "./utilities/logger";
import router from "./routes/route.index";
import sequelize from "./utilities/database";
import environment from "./utilities/environment";

const server = express();
server.use(express.json())
server.use(router);

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(environment.PORT,() => {
            logger.info(`Server has been started. Listening on port ${environment.PORT}`)
        })
    } catch (error: any) {
        logger.error(error.message);
    }
})();
