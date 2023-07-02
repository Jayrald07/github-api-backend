import winston from "winston";

const formatJsonData = winston.format((info) => {

    return info;
})

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        formatJsonData(),
        // winston.format.printf((info) => {
        //     return JSON.stringify({
        //         "Timestamp": info.timestamp,
        //         "Method": info.method,
        //         "URL": info.url,
        //         "Headers": info.header,
        //         "Body": info.body,
        //         "IP": info.ip,
        //         "Status Code": info.code,
        //         "Processed In": info.time
        //     })
        // })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs.log' })
    ]  
})

export default logger;