import { Request } from "express";
import winston from "winston";

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
            return `${info.timestamp} [${info.level}] ${info.message}`
        }),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs.log' })
    ]  
})

export const requestLogger = (req: Request, data?: object) => {
    const { headers, method, originalUrl, ip } = req;
 
    logger.info(`${method} ${originalUrl} ${ip} Data: ${JSON.stringify(data)} Headers: ${JSON.stringify(headers)}`);
}

export default logger;