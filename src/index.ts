import express from "express";
import logger from "./utilities/logger";
import dotenv from "dotenv";

const server = express();
server.use(express.json())

dotenv.config();

server.listen(8080,() => {
    logger.info(`Server has been started. Listening on port ${8080}`)
})