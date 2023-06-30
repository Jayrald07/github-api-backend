import express, { ErrorRequestHandler } from "express";
import logger from "./utilities/logger";
import initalizeEnvironment from "./utilities/environment";
import router from "./routes/route.index";

initalizeEnvironment();

const server = express();
server.use(express.json())

server.use(router);

server.listen(process.env.PORT,() => {
    logger.info(`Server has been started. Listening on port ${process.env.PORT}`)
})